import { DeliveredProcedureOutlined } from "@ant-design/icons";
import { Checkbox, Modal, Select } from "antd";
import { useEffect, useState } from "react";
import { Option } from "antd/es/mentions";

const PickBuuCuc = ({ info, setInfo, base }) => {



 

  const [open, setOpen] = useState(false); 
  useEffect(() => {
    if (info.latSend!==-1||info.longSend!==-1) {
      fetch(`http://localhost:8080/getbuucucnear?lat=${info.latSend}&longti=${info.longSend}`)
        .then((v) => v.json())
        .then((v) => {
          setBuuCucs(v);
        });
    }
  }, [open]); 
  const [buuCucs, setBuuCucs] = useState([]);
  return (
    <>
      <div style={{display:"flex",alignItems:"center",flexDirection:"row"}}>
      <Checkbox className="ml-3"
        checked={info.diemNhanHang !== undefined}
        onChange={() => {
          if (info.diemNhanHang === undefined) {
            setOpen(!open);
          } else {
            setInfo((prevState) => ({
              ...prevState,
              diemNhanHang: undefined,
            }));
          }
        }}
      >
        Chọn bưu cục
        {/* <p
          onClick={() => {
            setOpen(!open);
          }}
          className="text-orange-500 mt-5 font-bold ml-2   inline-block cursor-pointer pb-1 border-b border-orange-500 "
        >
          Chọn Bưu Cục
        </p> */}
        
      </Checkbox>
      </div>
      <Modal
        open={open}
        onCancel={() => {
          setOpen(!open);
        }}
        footer={null}
        width="50vw"
        style={{ top: 0, padding: 0 }}
        bodyStyle={{ padding: 0, margin: 0 }}
      >
        <div style={{ height: "100%", width: "100%" }}>
          <p className="font-bold ml-2 mt-2">Danh sách bưu cục gần nhất</p>
          <Select
            onSelect={(value) => {
              base.type = base.type === "buucuc" ? "laynhan" : "buucuc";
              setInfo((prevState) => ({
                ...prevState,
                diemNhanHang: buuCucs[value],
              }));
            }}
            onChange={(value) => {}}
            defaultValue={"Chọn bưu cục"}
            placeholder="Chọn ca lấy"
            className="w-full m-2 focus:border-red-500 focus:border-2 "
          >
            {buuCucs.map((v, index) => (
              <Option value={index}>
                <DeliveredProcedureOutlined /> {v.diachichitiet}
              </Option>
            ))}
          </Select>
        </div>
      </Modal>
    </>
  );
};

export default PickBuuCuc;