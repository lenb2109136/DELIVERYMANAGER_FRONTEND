import apiShipper from "../../Config/APICONFIG/ShipperAPI";
import DrawerOrder from "../Shipper/DrawerOrderGiaoHang";
import { useEffect, useState, useRef } from "react";
import ScanQRCode from "./ModalScanQR";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import mapBoxConfig from "../../Config/MapboxConfig";
import QLKD from "./Quanlykhungduong"
const accessTokenMap = mapBoxConfig.accessToken;
mapboxgl.accessToken = accessTokenMap;





const OrderLayHang = () => {
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState(null);
  const [dsdanggiao, setdsdanggiao] = useState([])
  const [dsthanhcong, setdanhsachthanhcon] = useState([])
  const [userLocation, setUserLocation] = useState(null);
  const [destination, setDestination] = useState({ lat: 0, lng: 0 });
  const mapContainer = useRef(null);
  const [dstoado, setdstoado] = useState([])
  const map = useRef(null);
  ////
  const markers = useRef([]);
  const markerRef = useRef(null);
  const startMarkerRef = useRef(null);
  ////
  // giải quyết vấn đề thời gian thực
  const [isMoving, setIsMoving] = useState(false);
  const routeCoordinatesRef = useRef([]);
  const animationRef = useRef(null);
  const currentIndex = useRef(0);
  //
  const statusId = 6;
  const statusIdDangLay = 12;
  const [marker, setmarker] = useState([])
  const [load, setload] = useState(false)
  const moveMarker = () => {
    if (!isMoving || currentIndex.current >= routeCoordinatesRef.current.length) return;

    const [lng, lat] = routeCoordinatesRef.current[currentIndex.current];
    startMarkerRef.current.setLngLat([lng, lat]);

    currentIndex.current += 1;

    animationRef.current = setTimeout(moveMarker, 500);
  };
  const startMoving = () => {
    if (!routeCoordinatesRef.current.length) {
      alert("Chưa có tuyến đường!");
      return;
    }

    setIsMoving(true);
    moveMarker();
  };
  const stopMoving = () => {
    setIsMoving(false);
    clearTimeout(animationRef.current);
  };
  const resetMovement = () => {
    setIsMoving(false);
    clearTimeout(animationRef.current);
    currentIndex.current = 0;

    if (routeCoordinatesRef.current.length > 0) {
      const [lng, lat] = routeCoordinatesRef.current[0];
      startMarkerRef.current.setLngLat([lng, lat]);
    }
  };
  useEffect(() => {
    apiShipper.get("ordersend/status?status=" + statusId)
      .then(v => {
        setOrders(v.data.data);
      })
      .catch(error => {
        alert("Có lỗi lấy dữ liệu");
      });
    apiShipper.get("giaoThanhCongTrongNgaysend")
      .then(v => {
        setdanhsachthanhcon(v.data.data);
      })
      .catch(error => {
        alert("Có lỗi lấy dữ liệu");
      });

    apiShipper.get("ordersend/status?status=" + statusIdDangLay)
      .then(v => {
        setdsdanggiao(v.data.data);
        if (destination.lat == 0 && destination.lng == 0 && v?.data?.data?.length != 0) {
          setDestination({ lat: v?.data?.data?.[0].xa.viDo, lng: v?.data?.data?.[0].xa.kinhDo })
        }
      })
      .catch(error => {
        alert("Có lỗi lấy dữ liệu");
      });
  }, []);



  useEffect(() => {
    apiShipper.get("giaoThanhCongTrongNgaysend")
      .then(v => {
        setdanhsachthanhcon(v.data.data);
      })
      .catch(error => {
        alert("Có lỗi lấy dữ liệu");
      });

    apiShipper.get("ordersend/status?status=" + statusId)
      .then(v => {
        setOrders(v.data.data);
      })
      .catch(error => {
        alert("Có lỗi lấy dữ liệu");
      });
    apiShipper.get("ordersend/status?status=" + statusIdDangLay)
      .then(v => {
        setdsdanggiao(v.data.data);
        if (destination.lat == 0 && destination.lng == 0 && v?.data?.data?.length != 0) {
          setDestination({ lat: v?.data?.data?.[0].xa.viDo, lng: v?.data?.data?.[0].xa.kinhDo })
        }
      })
      .catch(error => {
        alert("Có lỗi lấy dữ liệu");
      });
  }, [load]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => console.error("Lỗi khi lấy vị trí:", error),
        { enableHighAccuracy: true }
      );
    }
  }, []);


  useEffect(() => {
    if (userLocation && mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        center: [userLocation.lng, userLocation.lat],
        zoom: 12,
      });
    }
  }, [userLocation]);
  useEffect(() => {
    const colors = ["#FF0000", "#8B4513", "#0000FF", "#FFA500", "#800080"];

    if (!map.current || !map.current.isStyleLoaded()) return;

    const layers = map.current.getStyle().layers;
    layers.forEach((layer) => {
      if (layer.id.startsWith("route-")) {
        map.current.removeLayer(layer.id);
        map.current.removeSource(layer.id);
      }
    });

    if (markers.current) {
      markers.current.forEach(marker => marker.remove());
    }
    markers.current = [];

    if (dstoado.length < 2) return;

    const drawRoute = async (start, end, index) => {
      const directionsQuery = `https://api.mapbox.com/directions/v5/mapbox/driving/${start.lng},${start.lat};${end.lng},${end.lat}?geometries=geojson&access_token=${accessTokenMap}`;
      const directionsResponse = await fetch(directionsQuery);
      const directionsData = await directionsResponse.json();

      if (!directionsData.routes.length) return;

      const routeId = `route-${index}`;

      map.current.addSource(routeId, {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: directionsData.routes[0].geometry,
        },
      });

      map.current.addLayer({
        id: routeId,
        type: "line",
        source: routeId,
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": colors[index % colors.length],
          "line-width": 4,
        },
      });
    };

    dstoado.forEach((point, index) => {

      const el = document.createElement("div");
      el.className = "marker-label";
      el.innerText = index === 0 ? "Bắt đầu" : `Điểm ${index + 1}`;
      el.style.background = colors[index % colors.length];
      el.style.color = "white";
      el.style.padding = "4px 8px";
      el.style.borderRadius = "5px";
      el.style.fontSize = "12px";
      el.style.fontWeight = "bold";
      el.style.textAlign = "center";

      const marker = new mapboxgl.Marker({ color: colors[index % colors.length] })
        .setLngLat([point.lng, point.lat])
        .addTo(map.current);

      new mapboxgl.Marker(el)
        .setLngLat([point.lng, point.lat])
        .addTo(map.current);

      markers.current.push(marker);
    });

    for (let i = 0; i < dstoado.length - 1; i++) {
      drawRoute(dstoado[i], dstoado[i + 1], i);
    }
    drawRoute(dstoado[dstoado.length - 1], dstoado[0], dstoado.length - 1);
  }, [dstoado]);






  const getRoute = async () => {
    if (!map.current || !map.current.isStyleLoaded()) {
     console.log("")
      return;
    }

    if (destination.lat === 0 && destination.lng === 0) {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
      if (startMarkerRef.current) {
        startMarkerRef.current.remove();
        startMarkerRef.current = null;
      }
      if (map.current?.getLayer("route")) {
        map.current.removeLayer("route");
        map.current.removeSource("route");
      }
      return
    }

    if (!userLocation.lat || !userLocation.lng) {
      alert("Không có vị trí người dùng!");
      return;
    }

    // Cập nhật hoặc tạo marker cho điểm đến
    if (markerRef.current) {
      markerRef.current.setLngLat([destination.lng, destination.lat]);
    } else {
      markerRef.current = new mapboxgl.Marker({ color: "red" }) // Marker màu đỏ cho điểm đến
        .setLngLat([destination.lng, destination.lat])
        .addTo(map.current);
    }

    // Cập nhật hoặc tạo marker cho điểm bắt đầu (userLocation)
    if (startMarkerRef.current) {
      startMarkerRef.current.setLngLat([userLocation.lng, userLocation.lat]);
    } else {
      startMarkerRef.current = new mapboxgl.Marker({ color: "blue" }) // Marker màu xanh cho điểm bắt đầu
        .setLngLat([userLocation.lng, userLocation.lat])
        .addTo(map.current);
    }

    const directionsQuery = `https://api.mapbox.com/directions/v5/mapbox/driving/${userLocation.lng},${userLocation.lat};${destination.lng},${destination.lat}?geometries=geojson&access_token=${accessTokenMap}`;

    try {
      const directionsResponse = await fetch(directionsQuery);
      const directionsData = await directionsResponse.json();

      if (!directionsData.routes.length) {
        alert("Không tìm thấy tuyến đường!");
        return;
      }

      const route = directionsData.routes[0].geometry;
      routeCoordinatesRef.current = route.coordinates;
      if (map.current.getLayer("route")) {
        map.current.removeLayer("route");
        map.current.removeSource("route");
      }

      map.current.addSource("route", {
        type: "geojson",
        data: { type: "Feature", geometry: route },
      });

      map.current.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#007aff", "line-width": 4 },
      });
    } catch (error) {
      console.error("Lỗi khi lấy tuyến đường:", error);
    }
  };
  useEffect(() => {
    if (!map.current) {
      return;
    }

    map.current.on("load", () => {
      getRoute();
      return;
    });
    if (destination.lat === 0 && destination.lng === 0) {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
      if (startMarkerRef.current) {
        startMarkerRef.current.remove();
        startMarkerRef.current = null;
      }
      if (map.current?.getLayer("route")) {
        map.current.removeLayer("route");
        map.current.removeSource("route");
      }
      return
    }
    else{
      getRoute();
    }
    
  }, [destination, userLocation]);



  return (
    <div style={{ position: "relative" }}>
      <div style={{ position: "absolute", top: "0px", left: "0px", zIndex: '999' }}>
        <button style={{
          backgroundColor: "#1677ff", color: "white",
          paddingLeft: "10px", paddingRight: "10px", marginLeft: "20px",
          paddingTop: "6px", paddingBottom: "6px", borderRadius: "5px"
        }} onClick={startMoving}>{isMoving ? "Tiếp tục" : "Bắt đầu"}</button>
        <button style={{
          backgroundColor: "#1677ff", color: "white",
          paddingLeft: "10px", paddingRight: "10px", marginLeft: "20px",
          paddingTop: "6px", paddingBottom: "6px", borderRadius: "5px"
        }} onClick={stopMoving}>Dừng</button>
        <button style={{
          backgroundColor: "#1677ff", color: "white",
          paddingLeft: "10px", paddingRight: "10px", marginLeft: "20px",
          paddingTop: "6px", paddingBottom: "6px", borderRadius: "5px", marginRight:"20px"
        }} onClick={resetMovement}>Quay lại</button>

        <DrawerOrder setUserLocation={setUserLocation}  userLocation={userLocation} setOrders={setOrders} setdstoado={setdstoado} tc={dsthanhcong} load={load} setload={setload} dsdanglay={dsdanggiao} toado={destination} setToado={setDestination} title={"Xem lấy hàng"} orders={orders} />
      </div>

      <ScanQRCode setOrder={setOrder} order={order} />

      <div style={{ position: "absolute", top: "50px", left: "10px", zIndex: 1000 }}>
        <input
          style={{ paddingLeft: "7px", border: "2px solid black", marginRight: "10px", borderRadius: "5px" }}
          type="text"
          placeholder="Nhập vĩ độ"
          value={destination.lat}
          onChange={(e) => setDestination({ ...destination, lat: e.target.value })}
        />
        <input
          style={{ paddingLeft: "7px", border: "2px solid black", marginRight: "10px", borderRadius: "5px" }}
          type="text"
          placeholder="Nhập kinh độ"
          value={destination.lng}
          onChange={(e) => setDestination({ ...destination, lng: e.target.value })}
        />
        <button
          style={{
            backgroundColor: "#1677ff", color: "white",
            paddingLeft: "10px", paddingRight: "10px", marginLeft: "20px",
            paddingTop: "6px", paddingBottom: "6px", borderRadius: "5px"
          }}
          onClick={getRoute}
        >
          Dẫn đường
        </button>
      </div>

      <div ref={mapContainer} style={{ width: "100%", height: "100vh" }} />
    </div>
  );
};

export default OrderLayHang;
