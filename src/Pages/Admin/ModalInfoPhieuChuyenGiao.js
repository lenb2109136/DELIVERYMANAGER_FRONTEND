import React, { useEffect, useState } from "react";
import { Button, Modal, Collapse, Checkbox } from "antd";
import apiAdmin from "../../Config/APICONFIG/AdminConfig";
import { useNavigate } from "react-router-dom";

const { Panel } = Collapse;

const ModalInfoPhieuChuyenGiao = ({ phieuChuyenGiaos,getOrders,setPhieuChuyenGiaos,reloads}) => {
  const [visible, setVisible] = useState(false);
  const [reload,setReload]=useState(true)
   
  const navigate =useNavigate();

  const handleCheck=(index1,index2)=>{
 
    phieuChuyenGiaos[index1].orders[index2].checked=!phieuChuyenGiaos[index1].orders[index2].checked
    setReload(!reload);
  }

  const handleSubmit=()=>{
    let isCreate=false;
    let phieuChuyenGiao=[]
    phieuChuyenGiaos.forEach(v=>{
      v.orders=v.orders.filter(v=>v.checked)
      if(v.orders.length>0){  
        isCreate=true;
        phieuChuyenGiao.push(v)
      }
    }) 
    if(isCreate){
      apiAdmin.post("order/transfom/groupby/submit",phieuChuyenGiaos).then(v=>{
        alert("Tạo phiếu chuyển giao thành công.")
      }).catch(error=>{

      })
    }else{
      alert("Các đơn trong phiếu chuyển giao hiện đang trống")
    }
    navigate("/admin/phieuchuyengiao")
  }

  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)}>
        Xem Phiếu Chuyển Giao
      </Button>

      <Modal
        title="Danh Sách Phiếu Chuyển Giao"
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        width={800}
      > 
      <Button onClick={handleSubmit}>Lập phiếu</Button>
        <Collapse accordion>
          {phieuChuyenGiaos.map((phieu, index) => (
            <Panel
              header={`Điểm nhận: ${phieu.diemNhanHang.diachichitiet || "Không xác định"} - ${phieu.diemNhanHang.sdt}`}
              key={index}
            >
              {phieu.orders.map((v,indexcon)=>{
                return <>
                  <div className="flex items-center justify-between">
                     <div className="flex  gap-2"> 
                      <Checkbox onClick={handleCheck.bind(null,index,indexcon)} checked={v.checked}/>
                      <p>{v.diaChiChiTiet}</p>
                     </div>
                    <p>{v.tenNguoiNhan}</p>
                  </div>
                </>
              })}
            </Panel>
          ))}
        </Collapse>
      </Modal>
    </>
  );
};

export default ModalInfoPhieuChuyenGiao;
