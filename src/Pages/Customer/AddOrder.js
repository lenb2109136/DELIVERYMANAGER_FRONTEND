import {
  DeliveredProcedureOutlined, 
  InboxOutlined,
  InfoCircleOutlined, 
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Button,Popover, Select } from "antd";
import { Option } from "antd/es/mentions";
import { lazy, useEffect, useState } from "react";
import PickBuuCuc from "../../Components/Customer/PickBuuCuc";
import api from "../../Config/APICONFIG/CustomerApi";
const PickAddress = lazy(() => import("../../Components/Customer/PickAdrress"));
const PickAddressSender = lazy(() => import("../../Components/Customer/ModalChooseAddress"));

const AddOrder = () => {
  const [baseData, setBaseData] = useState({
    hinhThucVanChuyen: [],
    loaiHang: [],
    type:"laynhan"
  }); 

    const [orderInsert,setOrderInsert]=useState({ 
      "diemNhanHang": undefined,
      "loaiHang":undefined, 
      "xa": undefined, 
      "hinhThucVanChuyen":undefined,
      "tenNguoiNhan": "",
      "diaChiChiTiet":undefined,
      "trongLuong": 0,
      "kinhDo": -1,
      "viDo": -1,
      "layTienTaiCho": false,
      "sdtnguoiNhan": " ", 
      "longSend":-1,
      "latSend":-1,
      "diaChiNguoiGui":""
  })
  
  const submit = async () => {
    try {
      const response = await api.post(
        `http://localhost:8080/customer/order/add/${baseData.type}`,
        orderInsert,
        {
          headers: {
            "Content-Type": "application/json",
          },
          responseType: "blob", // 👈 Quan trọng: nhận response dưới dạng file
        }
      );
  
      // Tạo một URL object từ Blob
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
  
      // Tạo thẻ <a> để tải file
      const a = document.createElement("a");
      a.href = url;
      a.download = "order.pdf"; // 👈 Đặt tên file tải về
      document.body.appendChild(a);
      a.click();
  
      // Xóa URL object sau khi tải xong
      window.URL.revokeObjectURL(url);
  
      alert("Tải file thành công!");
  
    } catch (error) {
      console.error("Lỗi khi tải file:", error);
      alert(error.response?.data?.message || "Có lỗi xảy ra");
    }
  };
  
  

  const fetchBaseDate = () => {
    Promise.all([
      fetch("http://localhost:8080/hinhthuc/getall").then((res) =>
        res.json()
      ),
      fetch("http://localhost:8080/loaihang/getall").then((res) =>
        res.json()
      ),
      ,
    ]).then(([hinhThucVanChuyen,loaiHang ]) => {
      orderInsert.hinhThucVanChuyen=hinhThucVanChuyen.data[0];
      orderInsert.loaiHang=loaiHang.data[0];
       setBaseData(prevState => ({
        ...prevState,
        hinhThucVanChuyen: hinhThucVanChuyen.data,
        loaiHang: loaiHang.data
    })); 
    })
    .catch((error) => {
        console.error("Có lỗi xảy ra:", error);
    });
  };

  useEffect(() => {
    fetchBaseDate();
  }, []);

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
                Địa chỉ <PickAddress  type={1} setDiaChi={setOrderInsert} />
                </div>
                <div className="w-full lg:w-2/4">
                  {/* <Select
                    placeholder="Chọn ca lấy"
                    className="w-4/5 m-2 focus:border-red-500 focus:border-2 "
                  >
                    <Option value="apple">Ca sáng - 7h00</Option>
                    <Option value="banana">Ca trưa - 11h30'</Option>
                  </Select> */}
                 
                   <PickBuuCuc base={baseData} info={orderInsert} setInfo={setOrderInsert} />
                  {/* <Popover
                    className="inline-block mb-3 pl-2"
                    content={"Người giao hàng phải đến bưu cục để giao hàng"}
                    title="Lưu ý"
                  ><InfoCircleOutlined></InfoCircleOutlined>
                  </Popover>  */}
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
                  <input  onChange={(e)=>{
                    orderInsert.sdtnguoiNhan=e.target.value
                  }} className={`w-4/5 m-2 border rounded-md p-2 border border-gray-300`}></input>
                </div>
                <div className="w-full lg:w-2/4">
                  <p  className="font-semibold text-md mb-2 ml-2">
                    Địa chỉ <PickAddress type={2} setDiaChi={setOrderInsert} />
                  </p>
                  <input className="w-4/5 m-2 border rounded-md p-2 border border-gray-300" value={orderInsert.diaChiChiTiet}></input>
                </div>
                <div className="w-full lg:w-2/4">
                  <p className="font-semibold text-md mb-2 ml-2">Họ tên</p>
                  <input onChange={(e)=>{
                    orderInsert.tenNguoiNhan=e.target.value 
                  }} className="w-4/5 m-2 border rounded-md p-2 border border-gray-300"></input>
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
                  onChange={(value)=>{
                    orderInsert.hinhThucVanChuyen=baseData.hinhThucVanChuyen[value]
                  }}
                    defaultValue={"Chọn hình thức"}
                    placeholder="Chọn ca lấy"
                    className="w-4/5 m-2 focus:border-red-500 focus:border-2 "
                  >
                    {baseData.hinhThucVanChuyen.map((v,index)=><Option value={index}>
                      <DeliveredProcedureOutlined />{v.tenHinhThuc}
                    </Option>)} 
                  </Select>
                </div>
                <div className="w-full lg:w-2/4">
                  <p className="font-semibold text-md mb-2 ml-2">Loại hàng</p>
                  <Select
                    onChange={(value)=>{
                      orderInsert.loaiHang=baseData.loaiHang[value]
                    }}
                    defaultValue={"Chọn loại hàng"}
                    placeholder="Chọn ca lấy"
                    className="w-4/5 m-2 focus:border-red-500 focus:border-2 "
                  >
                    {baseData.loaiHang.map((v,index)=><Option value={index}>
                      <ShoppingCartOutlined /> {v.ten} {" "}
                    </Option> )}
                  </Select>
                </div>
                <div className="w-full lg:w-2/4">
                  <p className="font-semibold text-md mb-2 ml-2">Trọng lượng</p>
                  <input onChange={(e)=>{
                    orderInsert.trongLuong=e.target.value 
                  }}   className="w-4/5 m-2 border rounded-md p-2 border border-gray-300" type="number"></input>
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
              <p>30.000đ</p>
            </div>
            <div className="flex m-2 pt-3 pb-3 mt-5 justify-between border-b pb-2 border-gray-300">
              <p>Tổng phí:</p>
              <p className="font-bold text-lg ">30.000đ</p>
            </div>
          </div>
          <div>
            <Select
              placeholder="Chọn một tùy chọn"
              className="w-[95%] m-2 focus:border-red-500 focus:border-2 "
              //   onChange={handleChange}
            >
              <Option value="apple">🍎 Người gửi trả hàng</Option>
              <Option value="banana">🍌 Người nhận trả tiền</Option>
            </Select>
            <Button
              className="w-[95%] m-2 border-2 "
              color="danger"
              variant="outlined"
              onClick={submit}
            >Tạo đơn hàng</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddOrder;
