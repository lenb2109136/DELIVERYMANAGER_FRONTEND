import React, { useState } from "react";
import { Button, Modal, Table } from "antd";

const OrderListModal = ({ orders }) => {
  const [visible, setVisible] = useState(false);

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 80 },
    { title: "Người nhận", dataIndex: "tenNguoiNhan", key: "tenNguoiNhan", width: 150 },
    { title: "SĐT", dataIndex: "sdtnguoiNhan", key: "sdtnguoiNhan", width: 130 },
    { title: "Địa chỉ", dataIndex: "diaChiChiTiet", key: "diaChiChiTiet", width: 200 },
    { title: "Trạng thái", dataIndex: ["trangThai", "ten"], key: "trangThai", width: 130 },
    { title: "Điểm nhận", dataIndex: ["diemNhanHang", "diachichitiet"], key: "diemNhanHang", width: 200 },
    { title: "Loại hàng", dataIndex: ["loaiHang", "ten"], key: "loaiHang", width: 120 },
    { title: "Hình thức VC", dataIndex: ["hinhThucVanChuyen", "tenHinhThuc"], key: "hinhThucVanChuyen", width: 130 },
  ];

  return (
    <>
      <Button size="small" onClick={() => setVisible(true)}>
        Xem danh sách đơn hàng
      </Button>
      <Modal
        title="Danh sách đơn hàng"
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        width={1000}
        style={{ top: 20 }}
      >
        <div style={{ maxHeight: "500px", overflowY: "auto", overflowX: "auto" }}>
          <Table
            dataSource={orders}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            scroll={{ x: 1200, y: 400 }}
          />
        </div>
      </Modal>
    </>
  );
};

export default OrderListModal;
