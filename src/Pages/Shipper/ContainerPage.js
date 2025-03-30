import { LockOutlined, MenuFoldOutlined, MenuUnfoldOutlined, NotificationOutlined, OrderedListOutlined, UploadOutlined    } from "@ant-design/icons";
import { Button, Layout, Menu } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { useEffect, useState } from "react";
import {  Outlet, useNavigate } from "react-router-dom";

const ContainerShipper = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate=useNavigate();
  const [position, setPosition] = useState({ latitude: null, longitude: null });

  // useEffect(()=>{
  //   if (!navigator.geolocation) {
  //     alert("Trình duyệt của bạn không hỗ trợ Geolocation!");
  //     return;
  //   }else{
  //     const watchId = navigator.geolocation.watchPosition(
  //       (pos) => {
  //         alert("dckdcdcbdjcbdc")
  //         setPosition({
  //           latitude: pos.coords.latitude,
  //           longitude: pos.coords.longitude,
  //         });
  //       },
  //       (err) => {
  //         console.error("Lỗi khi lấy vị trí:", err);
  //       },
  //       {
  //         enableHighAccuracy: true, // Bật GPS chính xác cao
  //         maximumAge: 0, // Luôn lấy vị trí mới nhất
  //         timeout: 5000, // Giới hạn thời gian chờ
  //       }
  //     );
  
  //     // Dọn dẹp khi component bị hủy
  //     return () => navigator.geolocation.clearWatch(watchId);
  //   }
  // },[])
  return (
    <>
      <Layout style={{ minHeight: "100vh" }}> 
        <Sider collapsible collapsed={collapsed} trigger={null}>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          onClick={(e) => { 
            navigate(e.key); 
            
          }}
          items={[
            {
              key: 'orderlay',
              icon: <OrderedListOutlined/>,
              label: 'Đơn hàng chờ lấy',
            },
            {
              key: 'ordergiao',
              icon: <LockOutlined />,
              label: 'Đơn hàng chờ giao',
            },
            {
              key: 'thongke',
              icon: <LockOutlined />,
              label: 'Quản lý quá trình',
            } 
          ]}
        />
        </Sider>
        <Layout>
          <Header
            style={{
              background: "#fff",
              padding: "0 20px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: "18px", marginRight: "16px" }}
            />
            <h2 style={{ margin: 0 }}>Grab Express</h2>
          </Header>

          {/* Nội dung trang */}
          <Content
            style={{ margin: "20px", padding: "20px", background: "#fff" }}
          >
            <Outlet />
          </Content>

          {/* Footer */}
          <Footer style={{ textAlign: "center" }}>© 2025 My App</Footer>
        </Layout>
      </Layout>
    </>
  );
};
export default ContainerShipper;
