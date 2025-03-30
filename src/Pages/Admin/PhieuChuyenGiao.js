import { Avatar, Breadcrumb, Button, Modal, Select } from "antd";
import { useEffect, useState } from "react";
import apiAdmin from "../../Config/APICONFIG/AdminConfig";
import { PrinterFilled, TranslationOutlined } from "@ant-design/icons";
import OrderListModal from "./ModalOrderInfoList";

const PhieuChuyenGiao = () => {
    const [diemNhanHang, setDiemNhanHang] = useState([
        { id: 1, ten: "Bưu cục 1", avatar: "", selected: false },
        { id: 2, ten: "Bưu cục 2", avatar: "", selected: false },
        { id: 3, ten: "Bưu cục 3", avatar: "", selected: false },
    ]);


    const generatePDF = (id) => {
         let a = [id]; 
        apiAdmin.post("phieuchuyengiao/exportpdf", a, { responseType: "blob" }) 
            .then((response) => {
                if (response.data.type === "application/json") {
                    // Nếu response trả về JSON (báo lỗi), chuyển sang đọc lỗi từ JSON
                    response.data.text().then((text) => {
                        const error = JSON.parse(text);
                        alert(error.message || "Lỗi không xác định");
                    });
                    return;
                }
    
                // Tạo URL từ blob
                const blob = new Blob([response.data], { type: "application/pdf" });
                const url = window.URL.createObjectURL(blob);
    
                // Tạo thẻ <a> để tải file
                const link = document.createElement("a");
                link.href = url;
                link.download = "shipping_label.pdf"; // Tên file tải về
                document.body.appendChild(link);
                link.click();
     
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            })
            .catch((error) => {
                alert(error.response?.data?.message || "Lỗi khi xuất PDF");
            });
    };
    

    const [data, setData] = useState([]);

    const getAllPhieuChuyenGiao = () => {
        apiAdmin.post("phieuchuyengiao/getall", diemNhanHang.filter(v => v.selected).map(v => v.id))
            .then(v => {
                setData(v.data.data)
            })
            .catch(error => {
                alert("Có lỗi lấy dữ liệu");
            });
    };

    useEffect(() => {
        getAllPhieuChuyenGiao();
    }, []);
 
    
    const toggleSelect = (id) => {
        setDiemNhanHang(prev =>
            prev.map(s => (s.id === id ? { ...s, selected: !s.selected } : s))
        );
    };
 
    const selectedCount = diemNhanHang.filter(s => s.selected).length;

    return (
        <>
            <Breadcrumb style={{ margin: "16px 0" }}>
                <Breadcrumb.Item>Customer</Breadcrumb.Item>
                <Breadcrumb.Item>Order</Breadcrumb.Item>
                <Breadcrumb.Item>Phiếu chuyển giao</Breadcrumb.Item>
            </Breadcrumb>
            <div className="flex gap-2 w-full mb-4">
                <Select
                    showSearch
                    placeholder={`Đã chọn ${selectedCount}/${diemNhanHang.length} bưu cục`}
                    style={{ width: "80%" }}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        option?.value?.toString().includes(input)
                    }
                    onSelect={toggleSelect}
                >
                    {diemNhanHang.map(s => (
                        <Select.Option key={s.id} value={s.id}>
                            <div className="flex items-center gap-2">
                                <Avatar src={s.avatar} size="small" />
                                {s.ten} {s.selected && "✅"}
                            </div>
                        </Select.Option>
                    ))}
                </Select>
                <Button onClick={getAllPhieuChuyenGiao}>Tìm kiếm</Button>
            </div>

            {/* Bảng HTML thay thế cho Ant Design Table */}
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 p-2">STT</th>
                        <th className="border border-gray-300 p-2">Bưu cục chuyển tiếp</th>
                        <th className="border border-gray-300 p-2">Số đơn chuyển tiếp</th>
                        <th className="border border-gray-300 p-2">Xem danh sách đơn</th>
                        <th className="border border-gray-300 p-2">Xuất phiếu chuyển tiếp</th>
                        <th className="border border-gray-300 p-2">Hoàn tất chuyển tiếp</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={item.id} className="text-center">
                            <td className="border border-gray-300 p-2">
                                {index} - {item.phieuChuyenGiao.id}
                            </td>
                            <td className="border border-gray-300 p-2">{item.phieuChuyenGiao.diemNhanHang.diachichitiet}</td>
                            <td className="border border-gray-300 p-2">
                                {item.orderList.length} đơn
                            </td>
                            <td className="border border-gray-300 p-2">
                                {/* <Button size="small">Xem danh sách đơn hàng</Button> */}
                                <OrderListModal orders={item.orderList}/>
                            </td>
                            <td onClick={()=>{ 
                                    generatePDF(item.phieuChuyenGiao.id)
                                }} className="border border-gray-300 p-2">
                                <Button size="small" type="primary" >Xuất phiếu <PrinterFilled/> </Button>
                            </td>
                            <td className="border border-gray-300 p-2">
                                <ModalComfirm item={item} reload={getAllPhieuChuyenGiao}/>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default PhieuChuyenGiao;

 
const ModalComfirm = ({item,reload}) => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState('Content of the modal');
  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    setModalText(`Khi xác nhận các đơn hàng thuộc phiếu chuyển tiếp ${item.phieuChuyenGiao.id}  với ${item.orderList.length} đơn hàng sẽ được giao cho đơn vị chuyển tiếp`);
    setConfirmLoading(true); 
    alert(item.phieuChuyenGiao.id)
    apiAdmin.post("phieuchuyengiao/chuyentiepdi?phieuChuyenGiaoId="+item.phieuChuyenGiao.id).then(v=>{
        alert("Chuyển tiếp thành công")
        reload()

    }).catch(error=>{
        alert(error.response.data.message)
    }).finally(()=>{
        setOpen(false);
        setConfirmLoading(false);
    })
  };
  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };
  return (
    <>
      <Button onClick={showModal} size="small" type="primary">Chuyển tiếp đơn <TranslationOutlined/> </Button>
      <Modal
        title="Xác nhận chuyển tiếp"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>{modalText}</p>
      </Modal>
    </>
  );
};
 

 