import { LockOutlined, MenuFoldOutlined, MenuUnfoldOutlined, NotificationOutlined, OrderedListOutlined, UploadOutlined    } from "@ant-design/icons";
import { Button, Layout, Menu } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { useState } from "react";
import {  Outlet, useNavigate } from "react-router-dom";

const ContainerCustomerPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate=useNavigate();
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
              key: '/customer/addOrder',
              icon: <OrderedListOutlined/>,
              label: 'Đơn hàng',
            },
            {
              key: '/customer/address',
              icon: <LockOutlined />,
              label: 'Danh sách đơn',
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
export default ContainerCustomerPage;
