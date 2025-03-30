import { Button, Card, Col, Drawer, Tabs } from "antd";
import { useState } from "react";
import apiShipper from "../../Config/APICONFIG/ShipperAPI";
import ico from "../../Images/NoData.png"
import { Database } from "../../Config/FirebaseConfig";
import { ref, remove, set } from "firebase/database";
const DrawerOrder = ({ setUserLocation,orders, title, toado, setToado, dsdanglay, setload, load, tc, setdstoado,userLocation }) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("1");

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Button type="primary" onClick={showDrawer}>
        {title}
      </Button>
      <Drawer title="Quản lý đơn hàng" onClose={onClose} open={open} width={500}>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <Tabs.TabPane tab="Danh sách đơn hàng" key="1">
            {orders?.length == 0 ? <div style={{ display: "flex", justifyContent: "center" }}>
              <img style={{ width: "150px" }} src={ico}></img>
            </div> : orders.map((v) => (
              <Col className="w-full" key={v.id}>
                <Card title={`Đơn hàng số ${v.id}`} variant="borderless">
                  <p>
                    Địa chỉ: <strong>{v.xa.tenXa}, {v.xa.huyen.tenHuyen}</strong>
                  </p>
                  <p>
                    Trọng lượng: <strong>{v.trongLuong} Kg</strong>
                  </p>
                  <p>
                    Phí Thu: <strong>{v.fee} vnđ</strong>
                  </p>
                  <p>
                    Tên người gửi: <strong>{v.khachHang.ten}</strong>
                  </p>
                  <p>
                    Tên người nhận: <strong>{v.tenNguoiNhan}</strong>
                  </p>
                  <p>
                    Số điện thoại người nhận: <strong>{v.SDTnguoiNhan}</strong>
                  </p>
                  
                  <Button
                    onClick={() => {
                      alert("huhu")
                      apiShipper.get(`chuyendanggiaosend?id=${v.id}`).then((response) => {
                        alert("Đã chuyển trạng thái")
                        setToado({ lat: v.xa.viDo, lng: v.xa.kinhDo })
                        setload(!load)
                      }).catch((e) => {
                        alert("Lấy đơn thất bại")
                      })

                    }}
                    className="mt-2"
                    type="primary"
                  >
                    Giao đơn
                  </Button>
                </Card>
              </Col>
            ))}
            <button onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((pos) => {
                  const { latitude, longitude } = pos.coords;
                  const t = { viDo: latitude, kinhDo: longitude };
                  const dto = {
                    toaDoGoc: t,
                    dsdonhang: orders
                  };

                  apiShipper.post("lotrinh", JSON.stringify(dto), {
                    headers: { 'Content-Type': 'application/json' }
                  })
                    .then((v) => {
                      localStorage.setItem("lotrinh", JSON.stringify(v.data.data));
                      const lotrinh = [];
                      lotrinh.push({ lat: v.data.data.loTrinh.toaDoGoc.viDo, lng: v.data.data.loTrinh.toaDoGoc.kinhDo })
                      v.data.data?.loTrinh?.dsdonhang?.forEach(v => {
                        lotrinh.push({ lat: v?.xa?.viDo, lng: v?.xa?.kinhDo });
                      });
                      console.log(lotrinh)
                      setdstoado(lotrinh)
                    })
                    .catch(() => { alert("Không thành công") });
                }, (error) => {
                  alert("Không thể lấy vị trí: " + error.message);
                });
              } else {
                alert("Trình duyệt không hỗ trợ định vị");
              }
            }} className="mt-2"
              type="primary" style={{
                backgroundColor: "#1677ff", color: "white",
                paddingLeft: "10px", paddingRight: "10px", marginLeft: "20px",
                paddingTop: "6px", paddingBottom: "6px", borderRadius: "5px"
              }}  >Hướng dẫn đường đi</button>


          </Tabs.TabPane>
          <Tabs.TabPane tab="Đơn đang lấy" key="2">
            {dsdanglay.map((v) => (
              <Col className="w-full" key={v.id}>
                <Card title={`Đơn hàng số ${v.id}`} variant="borderless">
                  <p>
                    Địa chỉ: <strong>{v.xa.tenXa}, {v.xa.huyen.tenHuyen}</strong>
                  </p>
                  <p>
                    Trọng lượng: <strong>{v.trongLuong} Kg</strong>
                  </p>
                  <p>
                    Phí Thu: <strong>{v.fee} vnđ</strong>
                  </p>
                  <p>
                    Tên người gửi: <strong>{v.khachHang.ten}</strong>
                  </p>
                  <Button
                    onClick={() => {
                      apiShipper.post("setlaythanhcongsend?idd=" + v.id)
                        .then(() => {
                          alert("Lấy hàng thành công")
                          const re = ref(Database, `dialy/${v.id}`)
                          console.log(userLocation)
                          set(re, {
                            lat: userLocation?.lat || 0,
                            lng: userLocation?.lng || 0
                          }).then(() => {
                            console.log(`Dữ liệu đã được lưu thành công với key: ${v.id}`);
                          }).catch((error) => {
                            console.error("Lỗi khi lưu dữ liệu:", error);
                          });
                          setToado({ lat: 0, lng: 0 })
                          setload(!load)
                          const r=ref(Database, `dialy/${v.id}`)
                          remove(r).then(()=>{
                            console("sdsd")
                          }).catch(()=>{
                            console.log("xóa thất bại")
                          })
                        })
                        .catch(() => {
                          alert("Lấy hàng thất bại")
                        })

                    }}
                    className="mt-2"
                    type="primary"
                  >
                    Giao thành công
                  </Button>
                </Card>
              </Col>
            ))}
          </Tabs.TabPane>
          <Tabs.TabPane tab="Đơn thành công hôm nay" key="3">
            {tc?.length == 0 ? <div style={{ display: "flex", justifyContent: "center" }}>
              <img style={{ width: "150px" }} src={ico}></img>
            </div> : tc.map((v) => (
              <Col className="w-full" key={v.id}>
                <Card title={`Đơn hàng số ${v.id}`} variant="borderless">
                  <p>
                    Địa chỉ: <strong>{v.xa.tenXa}, {v.xa.huyen.tenHuyen}</strong>
                  </p>
                  <p>
                    Trọng lượng: <strong>{v.trongLuong} Kg</strong>
                  </p>
                  <p>
                    Phí Thu: <strong>{v.fee} vnđ</strong>
                  </p>
                  <p>
                    Tên người gửi: <strong>{v.khachHang.ten}</strong>
                  </p>
                </Card>
              </Col>
            ))}
          </Tabs.TabPane>
        </Tabs>
      </Drawer>
    </>
  );
};

export default DrawerOrder;
