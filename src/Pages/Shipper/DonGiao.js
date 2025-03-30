import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import mapBoxConfig from "../../Config/MapboxConfig";

mapboxgl.accessToken = mapBoxConfig.accessToken;

const OrderGiaoHang = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [destination, setDestination] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Trình duyệt không hỗ trợ lấy vị trí.");
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setUserLocation([longitude, latitude]);
    });
  }, []);

  useEffect(() => {
    if (userLocation && mapContainerRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: userLocation,
        zoom: 14,
      });

      // Marker vị trí hiện tại
      new mapboxgl.Marker({ color: "red" })
        .setLngLat(userLocation)
        .addTo(mapRef.current);
    }
  }, [userLocation]);

  const handleSetDestination = () => {
    const lng = parseFloat(prompt("Nhập kinh độ điểm đến:"));
    const lat = parseFloat(prompt("Nhập vĩ độ điểm đến:"));
    if (!isNaN(lng) && !isNaN(lat)) {
      setDestination([lng, lat]);
    } else {
      alert("Tọa độ không hợp lệ!");
    }
  };

  useEffect(() => {
    if (userLocation && destination && mapRef.current) {
      // Marker điểm đến
      new mapboxgl.Marker({ color: "blue" })
        .setLngLat(destination)
        .addTo(mapRef.current);

      // Gọi API Mapbox để lấy đường đi
      fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${userLocation[0]},${userLocation[1]};${destination[0]},${destination[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.routes.length > 0) {
            const route = data.routes[0].geometry;

            // Vẽ đường đi màu xanh nước biển
            mapRef.current.addLayer({
              id: "route",
              type: "line",
              source: {
                type: "geojson",
                data: {
                  type: "Feature",
                  properties: {},
                  geometry: route,
                },
              },
              layout: { "line-join": "round", "line-cap": "round" },
              paint: { "line-color": "#007bff", "line-width": 5 },
            });
          }
        });
    }
  }, [destination]);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <button onClick={handleSetDestination} style={{ position: "absolute", top: 10, left: 10, zIndex: 1 }}>
        Nhập điểm đến
      </button>
      <div ref={mapContainerRef} style={{ width: "100%", height: "100vh" }} />
    </div>
  );
};

export default OrderGiaoHang;
