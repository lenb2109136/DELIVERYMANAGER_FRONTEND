import { Button, Modal, Row, Col, Card } from "antd";
import { useState, useEffect, useRef } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";
import QRScan from "../../Images/QRCODE.png";
import apiShipper from "../../Config/APICONFIG/ShipperAPI";

const ScanQRCode = ({ order, setOrder }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qrResult, setQrResult] = useState(""); 
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [offsetX, setOffsetX] = useState(0);
  const videoRef = useRef(null);
  const codeReader = useRef(new BrowserQRCodeReader());
  const streamRef = useRef(null);
  const buttonRef = useRef(null);

  const submit=()=>{
    if(order!=null){
        apiShipper.post("order/nhanhang/byid?id="+order.id).then(v=>{
            alert("Đã nhận đơn thành công")
        }).catch(error=>{
            alert(error.response.data.message)
        })
    }else{
        alert("Chưa có đơn hàng nào được quét")
    }
  }

  const getOrderById = (id) => {
    apiShipper.get("order/layhang/byid?id=" + id).then(v => {
      if (v.data.data != null) {
        setOrder(v.data.data);
      } else {
        alert("Không tìm thấy order này.");
      }
    }).catch(error => {
      alert("Có lỗi lấy dữ liệu");
    });
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    stopScanning();
  };

  const stopScanning = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
          return codeReader.current.decodeFromStream(stream, videoRef.current, (result) => {
            if (result) {  
              setQrResult(result.getText());
              getOrderById(result.getText());
            }
          });
        })
        .catch((err) => console.error("Error accessing camera: ", err));
    }
    return () => stopScanning();
  }, [isModalOpen]);
 
  const handleMouseDown = (e) => {
    if (isUnlocked) return;
    const button = buttonRef.current;
    const startX = e.clientX;
    const maxOffset = button.parentElement.clientWidth - button.clientWidth;

    const handleMouseMove = (moveEvent) => {
      const newX = moveEvent.clientX - startX;
      if (newX >= maxOffset) {
        setOffsetX(maxOffset);
        setIsUnlocked(true);
        submit();
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      } else if (newX > 0) {
        setOffsetX(newX);
      }
    };

    const handleMouseUp = () => {
      if (!isUnlocked) {
        setOffsetX(0);
      }
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <>
      <div style={{ position: "absolute", top: "0px", right: "0%" ,zIndex:"999"}}>
        <Button type="primary" onClick={showModal}>
          Quét mã <img src={QRScan} style={{ width: "15px" }} alt="QR Scan" />
        </Button>
      </div>
      <Modal title="Quét đơn" open={isModalOpen} onCancel={handleCancel} footer={null}>
        <Row gutter={16}>
          <Col span={12}>
            <Card title="Quét QR">
              <video ref={videoRef} style={{ width: "100%" }} autoPlay playsInline />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Thông tin mã QR">
              {order != null ? (
                <>
                    <p className="mt-2">ID: <strong>{order.id}</strong></p>
                    <p className="mt-2">Tên người lấy: <strong>{order.khachHang.ten}</strong></p>
                    <p className="mt-2">Số điện thoại: <strong>{order.khachHang.sdt}</strong></p>
                    <p className="mt-2 mb-2">Tổng phí: <strong>{order.fee}</strong> vnđ</p>
                  <div className="relative  h-12 bg-gray-300 rounded-full w-full flex items-center p-1 select-none">
                    <div
                      ref={buttonRef}
                      className="absolute h-10 w-10 bg-blue-500 rounded-full cursor-pointer flex items-center justify-center text-white font-bold transition-transform"
                      style={{ transform: `translateX(${offsetX}px)` }}
                      onMouseDown={handleMouseDown}
                    >
                      →
                    </div>
                    <span className="ml-16 text-gray-600">
                      {isUnlocked ? "✔ Đã xác nhận" : "Trượt qua để xác nhận"}
                    </span>
                  </div>
                </>
              ) : (
                <p>Chưa có thông tin</p>
              )}
            </Card>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default ScanQRCode;
