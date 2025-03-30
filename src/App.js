import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
 import Cod from "./Pages/Customer/Cod";
import Notifycation from "./Pages/Customer/Notification";
import   "./index.css"
import OrderList from "./Pages/Customer/OrderList";
import UpdateOrder from "./Pages/Customer/UpdateOrder";
import OrderListAdmin from "./Pages/Admin/OrderList";
import PhanCong from "./Pages/Admin/PhanCong";
import BarcodeScanner from "./Pages/Admin/ScanBardCode";
import PhieuChuyenGiao from "./Pages/Admin/PhieuChuyenGiao";
import DangChuyenGiao from "./Pages/Admin/DangCuyenGiao";
import PhanCongLayHang from "./Pages/Admin/PhanCongLayHang";
import OrderLayHang from "./Pages/Shipper/DonLayHang";
import OrderGiaoHang from "./Pages/Shipper/DonGiao";
import DonGiaoHang from "./Pages/Shipper/DonGiaoHang"
import ThoiGianThuc from "./Pages/Shipper/ThoiGianThuc"
import ThongKe from "./Pages/Shipper/quanlyquatrinh"
const ContainerCustomerPage = lazy(() => import("./Pages/Customer/ContainerPage"));
const AddOrder = lazy(() => import("./Pages/Customer/AddOrder"));
const ContainerAdminPage = lazy(() => import("./Pages/Admin/ContainerPage"));
const ContainerShipperPage = lazy(() => import("./Pages/Shipper/ContainerPage"));

function App() {
  return (
    <div className="App">
      <BrowserRouter> 
        <Suspense fallback={<div>Loading...</div>}>
          <Routes> 
            <Route path="/customer" element={<ContainerCustomerPage />}>
              <Route path="addOrder" element={<AddOrder />} />
              <Route path="updateOrder/:orderId/:type" element={<UpdateOrder />} />

              <Route path="updateOrder" element={<UpdateOrder />} />
              <Route path="address" element={<OrderList />} />
              <Route path="cod" element={<Cod />} />
              <Route path="notifycation" element={<Notifycation />} />
            </Route> 
            <Route path="/admin" element={<ContainerAdminPage />}> 
              <Route path="orders" element={<OrderListAdmin />} /> 
              <Route path="scan" element={<BarcodeScanner />} />
              <Route path="phancong" element={<PhanCong/>}/>
              <Route path="phanconglay" element={<PhanCongLayHang/>}/> 
              <Route path="phieuchuyengiao" element={<PhieuChuyenGiao/>}/>
              <Route  path="dangchuyengiao" element={<DangChuyenGiao></DangChuyenGiao>}/>
            </Route> 
            <Route path="/shipper" element={<ContainerShipperPage />} >
              <Route path="orderlay" element={<OrderLayHang />} /> 
              <Route path="ordergiao" element={<DonGiaoHang/>} /> 
              <Route path="thoigianthuc"  element={<ThoiGianThuc></ThoiGianThuc>}></Route>
              <Route path="thongke"  element={<ThongKe></ThongKe>}></Route>
              
            </Route>
          </Routes>
          
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
