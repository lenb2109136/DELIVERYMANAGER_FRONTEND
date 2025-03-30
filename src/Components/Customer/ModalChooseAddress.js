 import { Modal, Select } from "antd";
import { useEffect, useState } from "react";
import { Option } from "antd/es/mentions";

const PickAddress = (props) => {
  const { setOrderInsert, orderInsert } = props;
  const [open, setOpen] = useState(false);
  const [addressChose, setAddressChoose] = useState({
    address: {},
    hoVaTen: "Nguyễn Văn A",
    soDienThoai: "99393939393",
  });
  useEffect(() => {
    fetch("http://localhost:8080/tinh/getall")
      .then((res) => res.json())
      .then((v) => {
        setAddress((prevState) => ({
          ...prevState,
          thanhPho: v.data,
        }));
      });
  }, []);

  useEffect(() => {
    if (orderInsert.xa != null) {
      getHuyenByTinh(orderInsert.xa.huyen.tinh.id);
      getXaByHuyen(orderInsert.xa.huyen.id);
    }
  }, [orderInsert]);

  const getHuyenByTinh = (id) => {
    fetch("http://localhost:8080/huyen/getbytinh?id=" + id)
      .then((res) => res.json())
      .then((v) => {
        setAddress((prevState) => ({
          ...prevState,
          huyen: v.data,
        }));
      });
  };

  const getXaByHuyen = (id) => {
    fetch("http://localhost:8080/xa/getxabyhuyen?id=" + id)
      .then((res) => res.json())
      .then((v) => {
        setAddress((prevState) => ({
          ...prevState,
          xa: v.data,
        }));
      });
  };

  const [address, setAddress] = useState({
    thanhPho: [],
    huyen: [],
    xa: [],
  });

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

 
  return (
    <>
      {/* <p className="text-orange-500 font-semibold">
        {addressChose != null ? addressChose.soDienThoai : " "}
        <PhoneOutlined className="text-md text-orange-500" />{" "}
        {addressChose != null ? addressChose.hoVaTen : " "}
      </p> */}
      {orderInsert.xa !== undefined && orderInsert.xa != null ? (
        <p className="mt-2 ">
          {orderInsert.xa.huyen.tinh.tenTinh} {" - "}
          {orderInsert.xa.huyen.tenHuyen} {" - "}
          {orderInsert.xa.tenXa}
        </p>
      ) : (
        <p>Chưa chọn địa chỉ nào</p>
      )}
      <p
        onClick={showModal}
        className="text-orange-500 mt-2  inline-block cursor-pointer pb-1 border-b border-orange-500 "
      >
        Sửa địa chỉ gửi hàng
      </p>
      <Modal
        open={open}
        onCancel={handleCancel}
        footer={null}
        width="50vw"
        style={{ top: 0, padding: 0 }}
        bodyStyle={{ padding: 0, margin: 0, height: "90vh" }}
      >
        <div style={{ height: "100%", width: "100%" }}>
          <p className="ml-2 font-semibold">Tên người gửi</p>
          <input
            className="w-full m-2 border rounded-md p-2 border border-gray-300"
            value={addressChose.hoVaTen}
            onChange={(e) => {
              setAddressChoose((prevState) => ({
                ...prevState,
                hoVaTen: e.target.value,
              }));
            }}
          />
          <p className="ml-2 font-semibold">Số điện thoại</p>
          <input
            className="w-full m-2 border rounded-md p-2 border border-gray-300"
            value={addressChose.soDienThoai}
            onChange={(e) => {
              setAddressChoose((prevState) => ({
                ...prevState,
                soDienThoai: e.target.value,
              }));
            }}
          />
          <p className="ml-2 font-semibold">Thành phố</p>
          <Select
            defaultValue={
              orderInsert.xa != null ? orderInsert.xa.huyen.tinh.id : null
            }
            onChange={(value) => {
              getHuyenByTinh(value);
              address.huyen=[];
              orderInsert.xa=null
            }}
            placeholder="Chọn ca lấy"
            className="w-full m-2 focus:border-red-500 focus:border-2 "
          >
            {address.thanhPho.map((v, index) => {
              return <Option value={v.id}>{v.tenTinh}</Option>;
            })}
          </Select>
          <p className="ml-2 font-semibold">Huyện</p>
          <Select
            defaultValue={
              orderInsert.xa !=null ? orderInsert.xa.huyen.id : null
            }
            onChange={(value) => {
              getXaByHuyen(value);
              orderInsert.xa=null
            }}
            placeholder="Chọn ca lấy"
            className="w-full m-2 focus:border-red-500 focus:border-2 "
          >
            {address.huyen.map((v, index) => {
              return <Option value={v.id}>{v.tenHuyen}</Option>;
            })}
          </Select>
          <p className="ml-2 font-semibold">Xã</p>
          <Select
            defaultValue={orderInsert.xa != null ? orderInsert.xa.id : null}
            onSelect={(value) =>
              setOrderInsert((prevState) => ({
                ...prevState,
                xa: address.xa[value],
              }))
            }
            placeholder="Chọn ca lấy"
            className="w-full m-2 focus:border-red-500 focus:border-2 "
          >
            {address.xa.map((v, index) => {
              return <Option value={index}>{v.tenXa}</Option>;
            })}
          </Select> 
        </div>
      </Modal>
    </>
  );
};

export default PickAddress;
