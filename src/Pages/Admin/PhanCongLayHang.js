import {
  BorderOuterOutlined,
  BranchesOutlined,
  CustomerServiceOutlined,
  GlobalOutlined,
  InboxOutlined,
  InfoCircleOutlined,
  LineChartOutlined,
  MoneyCollectFilled,
  SyncOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Breadcrumb,
  Button,
  Collapse,
  Dropdown,
  InputNumber,
  List,
  Select,
  Skeleton,
} from "antd";
import { Option } from "antd/es/mentions";
import { useEffect, useState } from "react";
import apiAdmin from "../../Config/APICONFIG/AdminConfig";

const PhanCongLayHang = () => {
  const [expandIconPosition, setExpandIconPosition] = useState("start");
  const onPositionChange = (newExpandIconPosition) => {
    setExpandIconPosition(newExpandIconPosition);
  };


  const [orderClick,setOrderClick]=useState(null)
  const [data, setData] = useState({
    isFetching: false,
    isGetPhanCong: false,
    maxOrder:5,
    data: [],
  });

  const phanCong=()=>{
    apiAdmin.post("order/phanconglayhang",data.data).then(v=>{
      alert("Đã phân công cho các đơn hàng")
    }).catch(error=>{
      alert(error.response.data.message)
    })
  }

  const getPhanCong = () => {
    const selectedShipperIds = dataSet.shipper
      .filter((shipper) => shipper.selected)
      .map((shipper) => shipper.id); 
    if(selectedShipperIds.length>0){
      apiAdmin
      .post(`order/phanconglay/${data.maxOrder}`,selectedShipperIds)
      .then((v) => {
        return v.data;
      })
      .then((v) => { 
        const ordersList = Object.values(v.data).map(item => ({
          nhanVien: item.nhanVien,
          orders: item.orders || []  
        }));
        setData((prevState) => ({
          ...prevState,
          data: ordersList,
        }));
      });
    }else{
      alert("Vui lòng chọn ít nhất 1 shipper")
    }
  };

  useEffect(() => {
    apiAdmin
      .get("phancong/allshiper")
      .then((v) => v.data)
      .then((v) => {
        v.forEach((v) => {
          v.selected = true;
          v.avatar =
            "data:image/jpeg;base64,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";
        });
        setDataSet((prevState) => ({
          ...prevState,
          shipper: v,
        }));
      })
      .catch((error) => {});
  }, []);

  const fetching = () => {
    const fetching = document.getElementById("fetching");
    fetching.classList.remove("hidden");
    apiAdmin
      .post("order/transfom")
      .then((v) => {})
      .catch((error) => {
        alert("CÓ LỖI XẢ RA");
      })
      .finally(() => {
        fetching.classList.add("hidden");
      });
  };

  const [dataSet, setDataSet] = useState({
    shipper: [
      {
        id: 1,
        name: "Nguyễn Văn A",
        avatar: "https://i.pravatar.cc/40?img=1",
        selected: false,
      },
      {
        id: 2,
        name: "Trần Thị B",
        avatar: "https://i.pravatar.cc/40?img=2",
        selected: false,
      },
      {
        id: 3,
        name: "Lê Văn C",
        avatar: "https://i.pravatar.cc/40?img=3",
        selected: false,
      },
    ],
    maximumOrders: 10,
  });

  // Toggle trạng thái selected của shipper
  const toggleSelect = (id) => {
    setDataSet((prev) => ({
      ...prev,
      shipper: prev.shipper.map((s) =>
        s.id === id ? { ...s, selected: !s.selected } : s
      ),
    }));
  };
 
  const genExtra = () => (
    <Avatar
      style={{
        backgroundColor: "#87d068",
      }}
      src="data:image/jpeg;base64,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"
      // icon={<UserOutlined/>}
    />
  ); 
  return (
    <>
      <div className="flex items-center gap-4">
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>Customer</Breadcrumb.Item>
          <Breadcrumb.Item>Order</Breadcrumb.Item>
          <Breadcrumb.Item>Phân công</Breadcrumb.Item>
        </Breadcrumb>
        <Button onClick={fetching} type="primary" size="large">
          Fetching
          <SyncOutlined className="hidden" id="fetching" spin />
        </Button>
      </div>
      <hr className=" mt-3 mb-3" />
      <div className="flex items-center w-full gap-3">
        <div className="w-2/6">
          <p className="mb-2">Số đơn tối đa</p>
          <InputNumber value={data.maxOrder} onChange={(e)=>{
            if(e>0){
              setData(prev => ({
                ...prev,
                maxOrder: e
              })); 
            }
          }} className="w-full p-1" />
        </div>
        <div className="w-2/6">
          <p className="mb-2">Số đơn tối đa</p>
          <Dropdown
            menu={{
              items: dataSet.shipper.map((s) => ({
                key: s.id,
                label: (
                  <div
                    className={`flex items-center gap-2 p-2 cursor-pointer ${
                      s.selected ? "bg-blue-100" : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation(); // Giữ dropdown mở
                      toggleSelect(s.id);
                    }}
                  >
                    <Avatar src={s.avatar} size="small" />
                    {s.ten} {s.selected && "✅"}
                  </div>
                ),
              })),
            }}
            trigger={["click"]}
            className="w-full"
          >
            <button className="p-2 border rounded-md">Chọn shipper</button>
          </Dropdown>
        </div>
        <div className="w-2/6">
          <p className="mb-2">Số cụm dự kiến</p>
          <p className="font-bold text-lg">{data.data.length}</p>
        </div>
        <div className="w-2/6">
          <Button onClick={getPhanCong} type="primary" size="large">
            Fetching
            <SyncOutlined className="hidden" id="fetching" spin />
          </Button>
        </div>
      </div>
      <hr className=" mt-3 mb-3" />
      <div className="mb-3 flex items-center gap-3">
        <p className="font-bold">
          <BranchesOutlined /> {data.data?.length} Nhánh
        </p>
        <p className="font-bold">
          <BorderOuterOutlined /> Đơn hàng
        </p>
        <Button onClick={()=>{
           phanCong()
        }}
  className="ml-3"
  style={{ backgroundColor: "#52c41a", borderColor: "#52c41a", color: "white" }} 
  size="large"
>
  + Phân công
 </Button>

      </div>
      <div className="flex w-full flex-gap gap-2">
        <div className="w-full lg:w-4/6">
        <Collapse
  defaultActiveKey={["1"]}
  expandIconPosition={expandIconPosition}
  expandIcon={({ isActive }) => (
    <span
      onClick={(e) => {
        e.stopPropagation(); // Ngăn sự kiện click lan ra Collapse
        console.log("Icon clicked!", isActive);
      }}
      style={{ cursor: "pointer" }}
    >
      {isActive ? "🔽" : "▶️"}
    </span>
  )}
  items={data.data.map((v, indexs) => ({
    key: indexs,
    label: `Cụm số ${indexs} - ${v.nhanVien.ten} - ${v.nhanVien.sdt}`,
    children: (
      <List
        itemLayout="horizontal"
        dataSource={v.orders.map((order, idx) => ({ ...order, _index: idx }))}
        renderItem={(order,index) => (
          <List.Item onClick={()=>setOrderClick(order)}
            actions={[
              <Select onChange={ (value)=>{
                  data.data[value].orders.push(order)
                   data.data[indexs].orders.splice(order._index, 1);
              }} placeholder="Chuyển đổi cụm">
                {data.data.map((vv,index)=><Option value={index}>Cụm số {index+1} - {vv.orders.length} đơn</Option>)}
              </Select>,
              <a key="more">more </a>
            ]}
          >
            <Skeleton avatar title={false} loading={order.loading} active>
              <List.Item.Meta
                avatar={<Avatar src={'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg'} />}
                title={<strong>{order.name}</strong>}
                description={`${order.diaChiChiTiet} - ${order.khachHang.ten}`}
              />
              <div>{order.khachHang.sdt}</div>
            </Skeleton>
          </List.Item>
        )}
      />
    ),
    extra: genExtra(),
  }))}
/>



            

          <br />
          <span>Expand Icon Position: </span>
          <Select
            value={expandIconPosition}
            style={{ margin: "0 8px" }}
            onChange={onPositionChange}
          >
            <Option value="start">start</Option>
            <Option value="end">end</Option>
          </Select>
        </div>
        <div className="w-full lg:w-2/6">
          <p className="font-bold">
            <InfoCircleOutlined /> About
          </p>
          <p className="italic mt-3"> 
            <GlobalOutlined /> {orderClick?.diaChiChiTiet} 
          </p>
          <p className="mt-3 font-bold">
            <UserSwitchOutlined /> Thông tin khách hàng:
            &nbsp;&nbsp; {orderClick?.khachHang.ten} - {orderClick?.khachHang.sdt}
          </p>
          <p className="mt-3 font-bold">
            <LineChartOutlined /> Khoảng cách dự kiến:
            &nbsp;&nbsp; {orderClick?.khoangCachDuTinh} KM
          </p>
          <p className="mt-3 font-bold">
            <InboxOutlined /> Trọng lượng:
            &nbsp;&nbsp; {orderClick?.trongLuong} KG
          </p>
          <p className="mt-3 font-bold">
            <CustomerServiceOutlined /> Dịch vụ vận chuyển:
            &nbsp;&nbsp; {orderClick?.hinhThucVanChuyen.tenHinhThuc}
          </p>
          <p className="mt-3 font-bold">
            <MoneyCollectFilled /> Tổng Phí:
            &nbsp;&nbsp; {orderClick?.fee} VND
          </p>
        </div>
      </div>
    </>
  );
};

export default PhanCongLayHang;
