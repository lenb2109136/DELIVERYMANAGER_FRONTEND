import { Button, Card, Col, Drawer, Tabs } from "antd";
import { useState } from "react";
import apiShipper from "../../Config/APICONFIG/ShipperAPI";
import ico from "../../Images/NoData.png"
const DrawerOrder = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("1");

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button type="primary" onClick={showDrawer}>
        {"title"}
      </Button>
      <Drawer title="Quản lý đơn hàng" onClose={onClose} open={open} width={500}>
        
      </Drawer>
    </>
  );
};

export default DrawerOrder;
