import {
  DeliveredProcedureOutlined,
  InboxOutlined,
  InfoCircleOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Button, Popover, Select } from "antd";
import { Option } from "antd/es/mentions";
import PickAddress from "../../Components/Customer/PickAdrress";
import PickBuuCuc from "../../Components/Customer/PickBuuCuc";
import { lazy, useEffect, useState } from "react";
import api from "../../Config/APICONFIG/CustomerApi";
import { useParams } from "react-router-dom";
const PickAddressSender = lazy(() =>
  import("../../Components/Customer/ModalChooseAddress")
);

const UpdateOrder = () => {
  let { orderId,type } = useParams();

  useEffect(() => { 
    fetchBaseDate();
    try {
      api
        .get("http://localhost:8080/customer/order/getbyid?orderId=" + orderId)
        .then((v) => {
          return v.data;
        })
        .then((v) => {
          setOrderInsert(v.data);
        });
    } catch (error) {
      alert("Đơn hàng yêu cầu có vẻ không hợp lệ");
    }
  }, []);
  const [baseData, setBaseData] = useState({
    hinhThucVanChuyen: [],
    loaiHang: [],
    type: "laynhan",
  });

  const [orderInsert, setOrderInsert] = useState({
    diemNhanHang: undefined,
    loaiHang: undefined,
    xa: undefined,
    hinhThucVanChuyen: undefined,
    tenNguoiNhan: "",
    diaChiChiTiet: undefined,
    trongLuong: 0,
    kinhDo: -1,
    viDo: -1,
    layTienTaiCho: false,
    sdtnguoiNhan: " ",
  });
  const submit = async () => {
    try {
      const response = await api.put(
        `http://localhost:8080/customer/order/update/${type==1?"laynhan":"buucuc"}`,
        orderInsert,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      ); 
      alert("Cập nhật đơn hàng thành công");
    } catch (error) {
      const a = error.response.data;
      alert(a.message);
    }
  };
  const fetchBaseDate = () => {
    Promise.all([
      fetch("http://localhost:8080/hinhthuc/getall").then((res) => res.json()),
      fetch("http://localhost:8080/loaihang/getall").then((res) => res.json()),
      ,
    ])
      .then(([hinhThucVanChuyen, loaiHang]) => {
        orderInsert.hinhThucVanChuyen = hinhThucVanChuyen.data[0];
        orderInsert.loaiHang = loaiHang.data[0];
        setBaseData((prevState) => ({
          ...prevState,
          hinhThucVanChuyen: hinhThucVanChuyen.data,
          loaiHang: loaiHang.data,
        }));
      })
      .catch((error) => {
        console.error("Có lỗi xảy ra:", error);
      });
  };
  return (
    <>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Customer</Breadcrumb.Item>
        <Breadcrumb.Item>Order</Breadcrumb.Item>
        <Breadcrumb.Item>Add Order</Breadcrumb.Item>
      </Breadcrumb>
      <div
        className="flex flex-wrap bg-gray-100  "
        style={{ height: "485px", overflow: "auto", overflowX: "hidden" }}
      >
        <div className="lg:w-4/5 w-full ">
          <div
            className="bg-white m-2 p-5  scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200"
            style={{
              height: "460px",
              overflow: "auto",
              scrollbarWidth: "thin",
              scrollbarColor: "#888 #f1f1f1",
            }}
          >
            <h2 className="font-bold text-lg mb-3"> Bên gửi</h2>
            <div>
              <div className="flex flex-wrap">
                <div className="w-full lg:w-2/4">
                  <PickAddressSender 
                    orderInsert={orderInsert}
                    setOrderInsert={setOrderInsert}
                  />
                </div>
                <div className="w-full lg:w-2/4">
                  <Select
                    placeholder="Chọn ca lấy"
                    className="w-4/5 m-2 focus:border-red-500 focus:border-2 "
                  >
                    <Option value="apple">Ca sáng - 7h00</Option>
                    <Option value="banana">Ca trưa - 11h30'</Option>
                  </Select>

                  <PickBuuCuc
                    base={baseData}
                    info={orderInsert}
                    setInfo={setOrderInsert}
                  />
                  <Popover
                    className="inline-block mb-3 pl-2"
                    content={"Người giao hàng phải đến bưu cục để giao hàng"}
                    title="Lưu ý"
                  >
                    <InfoCircleOutlined></InfoCircleOutlined>
                  </Popover>
                </div>
              </div>
            </div>
            <hr className="mt-2 mb-2" />

            <h2 className="font-bold text-lg mb-3"> Bên Nhận</h2>
            <div>
              <div className="flex flex-wrap">
                <div className="w-full lg:w-2/4">
                  <p className="font-semibold text-md mb-2 ml-2">
                    Số điện thoại
                  </p>
                  <input
                    value={orderInsert.sdtnguoiNhan}
                    onChange={(e) => { 
                      setOrderInsert((prevState) => ({
                        ...prevState,
                        sdtnguoiNhan: e.target.value
                      })); 
                    }}
                    className={`w-4/5 m-2 border rounded-md p-2 border border-gray-300`}
                  ></input>
                </div>
                <div className="w-full lg:w-2/4">
                  <p className="font-semibold text-md mb-2 ml-2">
                    Địa chỉ <PickAddress setDiaChi={setOrderInsert} />
                  </p>
                  <input
                    value={orderInsert.diaChiChiTiet}
                    className="w-4/5 m-2 border rounded-md p-2 border border-gray-300"
                  ></input>
                </div>
                <div className="w-full lg:w-2/4">
                  <p className="font-semibold text-md mb-2 ml-2">Họ tên</p>
                  <input
                    value={orderInsert.tenNguoiNhan}
                    onChange={(e) => {
                      setOrderInsert((prevState) => ({
                        ...prevState,
                        tenNguoiNhan: e.target.value
                      })); 
                    }}
                    className="w-4/5 m-2 border rounded-md p-2 border border-gray-300"
                  ></input>
                </div>
              </div>
            </div>
            <hr className="mt-2 mb-2" />

            <h2 className="font-bold text-lg mb-3">
              Dịch vụ{" "}
              <InboxOutlined style={{ fontSize: "24px", color: "#F56C0D" }} />{" "}
            </h2>
            <div>
              <div className="flex flex-wrap">
                <div className="w-full lg:w-2/4">
                  <p className="font-semibold text-md mb-2 ml-2">
                    Hình thức vận chuyển
                  </p>
                  <Select
                    value={orderInsert?.hinhThucVanChuyen?.id || undefined} // Hiển thị đúng giá trị đã chọn
                    onChange={(value) => {
                      setOrderInsert((prev) => ({
                        ...prev,
                        hinhThucVanChuyen: baseData.hinhThucVanChuyen[value],
                      }));
                    }}
                    placeholder="Chọn hình thức vận chuyển"
                    className="w-4/5 m-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500 transition-all duration-300"
                  >
                    {baseData.hinhThucVanChuyen.map((v, index) => (
                      <Option key={index} value={index}>
                        <DeliveredProcedureOutlined className="mr-2 text-blue-500" />
                        {v.tenHinhThuc}
                      </Option>
                    ))}
                  </Select>

                </div>
                <div className="w-full lg:w-2/4">
                  <p className="font-semibold text-md mb-2 ml-2">Loại hàng</p>
                  <Select
                    value={orderInsert?.loaiHang?.id || undefined} // Giá trị ban đầu
                    onChange={(value) => {
                      setOrderInsert((prev) => ({
                        ...prev,
                        loaiHang: baseData.loaiHang[value], // Cập nhật state đúng cách
                      }));
                    }}
                    placeholder="Chọn ca lấy"
                    className="w-4/5 m-2 focus:border-red-500 focus:border-2"
                  >
                    {baseData.loaiHang.map((v, index) => (
                      <Option key={index} value={index}>
                        <ShoppingCartOutlined /> {v.ten}
                      </Option>
                    ))}
                  </Select>
                </div>
                <div className="w-full lg:w-2/4">
                  <p className="font-semibold text-md mb-2 ml-2">Trọng lượng</p>
                  <input
                    value={orderInsert.trongLuong}
                    onChange={(e) => {
                      setOrderInsert((prevState) => ({
                        ...prevState,
                        trongLuong: e.target.value
                      })); 
                    }}
                    className="w-4/5 m-2 border rounded-md p-2 border border-gray-300"
                    type="number"
                  ></input>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="lg:w-1/5 w-5/6 bg-white flex flex-col justify-between border-l border-t border-gray-300"
          style={{ height: "485px" }}
        >
          <div>
            <div className="flex m-2 justify-between border-b pb-2 border-gray-300">
              <p>Phí dịch vụ:</p>
              <p>{orderInsert.fee}đ</p>
            </div>
            <div className="flex m-2 pt-3 pb-3 mt-5 justify-between border-b pb-2 border-gray-300">
              <p>Tổng phí:</p>
              <p className="font-bold text-lg ">{orderInsert.fee}đ</p>
            </div>
          </div>
          <div>
            <Select
              placeholder="Chọn một tùy chọn"
              className="w-[95%] m-2 focus:border-red-500 focus:border-2 "
            >
              <Option value="apple">Người gửi trả hàng</Option>
              <Option value="banana">Người nhận trả tiền</Option>
            </Select>
            <Button
              className="w-[95%] m-2 border-2 "
              color="danger"
              variant="outlined"
              onClick={submit}
            >
              Tạo đơn hàng
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
export default UpdateOrder;
