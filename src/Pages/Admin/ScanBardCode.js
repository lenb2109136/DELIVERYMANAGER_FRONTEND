import { useState, useEffect, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { Avatar, Breadcrumb, Button,  Col, Divider, Drawer, List, Row  } from "antd";
import apiAdmin from "../../Config/APICONFIG/AdminConfig";

export default function ZXingScanner() {
  const [data, setData] = useState("Chưa có dữ liệu");
  const [phieuChuyenGiao, setPhieuChuyenGiao] = useState(null);
  const [phieuChuyenGiaos,setPhieuChuyenGiaos]=useState([]) 
  const [open, setOpen] = useState(false);
  const showDrawer = (index) => { 
    setPhieuChuyenGiao(phieuChuyenGiaos[index])
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
 
  const videoRef = useRef(null);
  const codeReader = useRef(null);


  useEffect(() => {
    if (!videoRef.current) return;

    codeReader.current = new BrowserMultiFormatReader();

    codeReader.current
      .decodeFromVideoDevice(null, videoRef.current, (result, error) => {
        if (result) {
          let b=result.getText();
          let a=phieuChuyenGiaos.filter(v=>v.id==b).length>0 
          if(!a){
            getPhieuChuyenGiaoById(b);
          } 
        }
        if (error) {
          console.error(error);
        }
      })
      .catch((err) => console.error("Lỗi khi quét QR:", err));

    return () => {
      if (codeReader.current) {
        codeReader.current.reset();
        codeReader.current = null;
      }
    };
  }, []);

  const submit=()=>{
    if(phieuChuyenGiaos.length>0){
      apiAdmin.post("phieuchuyengiao/xacnhap",phieuChuyenGiaos.map(v=>v.id)).then(v=>{
        alert("Xác nhập phiếu chuyển giao thành công.")
      }).catch(error=>{
        alert(error.response.data.message)
      })
    }else{
      alert("Chưa có phiếu chuyển giao nào để lập")
    }
    
  }

  const getPhieuChuyenGiaoById = (id) => {
    apiAdmin
      .get(`phieuchuyengiao/findbyid?phieuChuyenGiaoId=${id}`)
      .then((v) => { 
        if(v.data.data.orders.length>0){
          v.data.data.diemNhanHang=v.data.data.orders[0].diemNhanHang
        }
        phieuChuyenGiaos.push(v.data.data)
        setPhieuChuyenGiao(v.data.data);
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  };
 

  return (
    <>
      <Breadcrumb className="mb-4"
        items={[
          {
            title: 'Admin',
          },
          {
            title: "Phiếu chuyển giao",
          }, 
          {
            title: 'Nhập phiếu chuyển giao',
          },
        ]}
      />
      <div className="flex">
        <div className="pr-3 flex flex-col items-center">
          <video
            ref={videoRef}
            className="border border-gray-400 rounded-md"
            width="300"
            autoPlay
          />
          <p className="mt-4">Kết quả: {data}</p>
        </div>
        <div className="pl-4">
          {phieuChuyenGiao && (
            <>
              <h1 className="text-xl mb-4">Thông tin phiếu chuyển giao</h1>
              <p className="mt-3">Ngày lập phiếu: {phieuChuyenGiao.ngayLap}</p>
              <p className="mt-3">Ghi chú: {phieuChuyenGiao.ghiChu}</p>
              <p className="mt-3">
                Nhân viên lập phiếu: {phieuChuyenGiao.nhanvien?.ten} -{" "}
                {phieuChuyenGiao.nhanvien?.sdt}
              </p>
              <p className="mt-3">
                Tổng số đơn: {phieuChuyenGiao.orders.length} đơn hàng
              </p>
              {/* <Button onClick={()=>{showDrawer(phieuChuyenGiao.id)}} className="mt-3">Xem đơn</Button> */}
            </>
          )}
        </div>
      </div>
        <Button className="mb-4" onClick={()=>{
          submit()
        }} primary>Lập phiếu</Button>
      <>
      <List
        dataSource={phieuChuyenGiaos.map((v,index)=>{
          return {
            id: index,
            name:"Từ Bưu cục: "+v.diemNhanHang.diachichitiet,
            countOrder:v.orders.length
          }
        }) }
        bordered
        renderItem={(item) => (
          <List.Item
            key={item.id}
            actions={[
              <a onClick={()=>{showDrawer( item.id)}} key={`a-${item.id}`}>
                Xem chi tiết
              </a>,
            ]}
          >
            <List.Item.Meta
              avatar={
                <Avatar src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png" />
              }
              title={<a href="https://ant.design/index-cn">{item.name}</a>}
              description={item.countOrder +" đơn hàng"}
            />
          </List.Item>
        )}
      />
      {phieuChuyenGiao&&<Drawer width={640} placement="right" closable={false} onClose={onClose} open={open}>
        <p
          className="site-description-item-profile-p"
          style={{
            marginBottom: 24,
          }}
        >
          Thông tin Phiếu chuyển giao
        </p>
        <p className="site-description-item-profile-p font-bold">Thông tin cơ bản.</p>
        <Row>
          <Col span={12}>
            <DescriptionItem title="Ngày Lập phiếu" content={phieuChuyenGiao.ngayLap} />
          </Col>
          <Col span={12}>
            <DescriptionItem title="Nhân viên lập phiếu" content={phieuChuyenGiao.nhanvien.ten}/>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <DescriptionItem title="Địa chỉ chi tiết" content={phieuChuyenGiao.diemNhanHang.diachichitiet} />
          </Col>
          <Col span={12}>
            <DescriptionItem title="Số điện thoại" content={phieuChuyenGiao.nhanvien.sdt} />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <DescriptionItem title="Ngày lập" content={phieuChuyenGiao.ngayLap} />
          </Col>
          <Col span={12}>
            <DescriptionItem title="Tổng số đơn" content={phieuChuyenGiao.orders.length+ " Đơn hàng"} />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <DescriptionItem
              title="Ghi chú"
              content={phieuChuyenGiao.ghiChu}
            />
          </Col>
        </Row>
        <Divider />
        <p className="site-description-item-profile-p font-bold">Thông tin đơn hàng</p>
        <Row>
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="px-6 py-3 text-left font-semibold">STT</th>
            <th className="px-6 py-3 text-left font-semibold">Bưu Cục</th>
            <th className="px-6 py-3 text-left font-semibold">Tổng tiền</th>
            <th className="px-6 py-3 text-left font-semibold">Thông tin người nhận</th> 
          </tr>
        </thead>
        <tbody>
          {phieuChuyenGiao.orders?.map((item, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="px-6 py-4 text-blue-600 cursor-pointer hover:underline">{index}</td>
              <td className="px-6 py-4">
                <p>{item.diemNhanHang.diachichitiet}</p>
              </td>
              <td className="px-6 py-4">{item.fee} VND</td>
              <td className="px-6 py-4 flex gap-2">
                {item.diaChiChiTiet}
              </td> 
            </tr>
          ))}
        </tbody>
      </table>
        </Row>
        <Divider />
       
      </Drawer>}
    </>
    </>
  );
} 



const DescriptionItem = ({ title, content }) => (
  <div className="site-description-item-profile-wrapper">
    <p className="site-description-item-profile-p-label">{title}:</p>
    {content}
  </div>
);