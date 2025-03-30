import {
  LockOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ScanOutlined,
  UploadOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Button, Drawer, Layout, Menu } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { createContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ref, onValue } from "firebase/database";
import { Database } from "../../Config/FirebaseConfig";
export const UserContext = createContext();
const ContainerAdminPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [diemNhanHang, setDiemNhanHang] = useState({
    nhanVienId: 1,
    diemNhanHangId: 1,
  });
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const [announces, setAnnounces] = useState([]);

  useEffect(() => {
    const pickupPointRef = ref(Database, "NotifycationAccount/PickUpPoint/1");

    const unsubscribe = onValue(pickupPointRef, (snapshot) => { 
      setAnnounces(Object.entries(snapshot.val()).map(([id, data]) => ({
        id,  // Thêm id vào object
        ...data
    })));
    });

    return () => unsubscribe(); // Hủy lắng nghe khi component bị unmount
  }, []);

  const navigate = useNavigate();
  return (
    <>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider collapsible collapsed={collapsed} trigger={null}>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["1"]}
            onClick={(e) => {
              navigate(e.key);
            }}
            items={[
              {
                key: "/admin/orders",
                icon: <LockOutlined />,
                label: "Danh sách đơn",
              },
              {
                key: "/admin/phancong",
                icon: <UploadOutlined />,
                label: "Phân công giao hàng",
              },
              {
                key: "/admin/phanconglay",
                icon: <UploadOutlined />,
                label: "Phân công lấy hàng",
              },
              {
                key: "/admin/scan",
                icon: <ScanOutlined />,
                label: "Nhập đơn chuyển tiếp.",
              },
              {
                key: "/admin/phieuchuyengiao",
                icon: <WarningOutlined />,
                label: "Phiếu chờ chuyển giao",
              },
              {
                key: "/admin/dangchuyengiao",
                icon: <ScanOutlined />,
                label: "Đơn đang chuyển giao",
              },
              {
                key: "/admin/layhang",
                icon: <ScanOutlined />,
                label: "Lấy hàng",
              },
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
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                background: "#fff",
                padding: "0 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{ fontSize: "18px", marginRight: "16px" }}
              />
              <h2 style={{ margin: 0 }}>Grab Express</h2>
            </div>
            <div>
              <Button type="primary" onClick={showDrawer}>
                {announces.filter((v) => v.isReaded === false).length} thống báo chưa đọc
              </Button>
              <Drawer title="Danh sách thông báo" onClose={onClose} open={open}>
                {announces.map((v) => {
                  return (
                    <>
                      <div className="flex items-start mb-2 p-4    shadow-sm hover:bg-pink-200 transition">
      {/* Icon hoặc hình ảnh */}
      <img src={"https://cf.shopee.vn/file/vn-11134258-7ras8-m4iespqewa2vee"} alt="icon" className="w-12 h-12 rounded-lg mr-3" />
      
      {/* Nội dung thông báo */}
      <div className="flex-1">
        <h3 className="font-semibold text-pink-700">{v.type==="ORDER"?"Đơn hàng":"Thông báo khác"}</h3>
        <p className="text-sm text-gray-700">{v.message}</p>
      </div>
    </div>
                    </>
                  );
                })}
              </Drawer>
            </div>
          </Header>

          {/* Nội dung trang */}
          <Content
            style={{ margin: "20px", padding: "20px", background: "#fff" }}
          >
            <UserContext.Provider value={{ diemNhanHang, setDiemNhanHang }}>
              <Outlet />
            </UserContext.Provider>
          </Content>

          <Footer style={{ textAlign: "center" }}>© 2025 My App</Footer>
        </Layout>
      </Layout>
    </>
  );
};
export default ContainerAdminPage;
