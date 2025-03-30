import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import 'tailwindcss/tailwind.css';
 
const OrderAmindTab = ({setTab }) => {
  const [activeTab, setActiveTab] = useState('tab1');
  const [underlineStyle, setUnderlineStyle] = useState({ width: '120px', left: '0px' });
  const navigate=useNavigate()
  const tabRefs = useRef([]);

  const switchTab = (event, tabId, index) => {
    const tabElement = tabRefs.current[index];
    const tabWidth = tabElement.offsetWidth;
    const tabLeft = tabElement.offsetLeft;
    if(tabId==7){
      navigate("/admin/phieuchuyengiao")
    }else if(tabId==8){
      navigate("/admin/dangchuyengiao")
    }else{
      setTab("trangThaiId",tabId)
      setUnderlineStyle({ width: `${tabWidth}px`, left: `${tabLeft}px` });
      setActiveTab(tabId);
    }

  };

  useEffect(() => {
    const firstTab = tabRefs.current[0];
    if (firstTab) {
      setUnderlineStyle({ width: `${firstTab.offsetWidth}px`, left: `${firstTab.offsetLeft}px` });
    }
    

  }, []);

  const tabs = useMemo(() => [  
    { id: 1, tabName: "Chờ lấy hàng" },
    { id: 2, tabName: "Đang lấy hàng."},
    { id: 3, tabName: "Chờ nhận hàng" },
    { id: 4, tabName: "Đã nhận hàng" },
    { id: 5, tabName: "Đã vào kho" },
    { id: 6, tabName: "Đang giao hàng"},
    { id: 7, tabName: "Chờ chuyển tiếp"},
    { id: 8, tabName: "Đang chuyển tiếp"},
    { id: 9, tabName: "Giao thành công"}, 
    { id: 10, tabName: "Hoàn kho"},
    { id: 11, tabName: "Đơn hủy"}
  ], []);

  return (
    <div  className="container mx-auto p-4 relative bg-white rounded-[7px]">
      <div className="border-gray-200 relative overflow-auto " >
        <nav className="flex space-x-8 relative" aria-label="Tabs">
          {tabs.map((tabId, index) => (
            <span 
              key={tabId.id}
              ref={(el) => (tabRefs.current[index] = el)}
              className={`text-base tab-item text-blue-${activeTab === tabId.id ? '1000' : '800'} cursor-pointer py-4 px-4 font-medium relative`}
              onClick={(e) => switchTab(e, tabId.id, index)}
            ><span className={`text-sm ${tabId.id===3?"font-bold text-red-500":""}`}>
                {tabId.tabName} 
              </span>
            </span>
          ))}
        </nav>
        <div  id="underline" className="underline absolute bottom-0 h-[2px] bg-[#f97316] transition-all ease-in-out duration-300" style={underlineStyle} ></div>
      </div>
    </div>
  );
};

export default React.memo(OrderAmindTab);