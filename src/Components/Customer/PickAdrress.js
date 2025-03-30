import { EnvironmentFilled } from "@ant-design/icons";
import { Modal, Input, List } from "antd";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import mapBoxConfig from "../../Config/MapboxConfig";

mapboxgl.accessToken = mapBoxConfig.accessToken;

const PickAddress = ({setDiaChi,type}) => {
  const [open, setOpen] = useState(false);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]); 
  const showModal = () => {
    setOpen(true);
  }; 
  const handleCancel = () => {
    setOpen(false);
  }; 
  useEffect(() => {
    if (open && !mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [106.660172, 10.762622],
        zoom: 12,
      });
    }
  }, [open]); 
  const fetchSuggestions = async (query) => {
    if (!query) return setSuggestions([]); 
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${mapboxgl.accessToken}&limit=5`;
    const res = await fetch(url);
    const data = await res.json(); 
    setSuggestions(data.features || []);
  };
 
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    fetchSuggestions(value);
  };
 
  const handleSelectLocation = (place) => {
    const [lng, lat] = place.center;  
    if(type===1){
      setDiaChi(prevState => ({
          ...prevState,
          diaChiNguoiGui: place.place_name,
          latSend: lat,
          longSend: lng,
      }));
    } else{
      setDiaChi(prevState => ({
          ...prevState,
          diaChiChiTiet: place.place_name,
          viDo: lat,
          kinhDo: lng,
      }));
    }
    if (mapRef.current) {
      mapRef.current.flyTo({ center: [lng, lat], zoom: 15 });
    } 
    setSuggestions([]); 
  };

  return (
    <>
      <EnvironmentFilled className="text-orange-500 ml-2 text-2xl" onClick={showModal} />
      <Modal
        open={open}
        onCancel={handleCancel}
        footer={null}
        width="90vw"
        style={{ top: 0, padding: 0 }}
        bodyStyle={{ padding: 0, margin: 0, height: "90vh" }}
      >
        <div style={{ height: "100%", width: "100%" }}>
          {/* Input tìm kiếm */}
          <Input
            placeholder="Nhập địa điểm..."
            value={searchText}
            onChange={handleInputChange}
            style={{
              position: "absolute",
              top: 10,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 1000,
              width: "50%",
              padding: "8px",
            }}
          />
          
          {/* Danh sách gợi ý */}
          {suggestions.length > 0 && (
            <List
              style={{
                position: "absolute",
                top: 50,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 1000,
                width: "50%",
                background: "#fff",
                borderRadius: "4px",
                boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                maxHeight: "200px",
                overflowY: "auto",
              }}
              dataSource={suggestions}
              renderItem={(item) => (
                <List.Item
                  onClick={() => handleSelectLocation(item)}
                  style={{ cursor: "pointer", padding: "10px" }}
                >
                  {item.place_name}
                </List.Item>
              )}
            />
          )}
 
        <div ref={mapContainerRef} style={{ height: "100%", width: "100%" }} />
        </div>
      </Modal>
    </>
  );
};

export default PickAddress;
