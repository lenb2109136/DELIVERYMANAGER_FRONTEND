import { useEffect, useState, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import mapBoxConfig from "../../Config/MapboxConfig";
import { getDatabase, ref, onValue, off, onChildRemoved } from "firebase/database";
import { initializeApp } from "firebase/app";
import {Database } from "../../Config/FirebaseConfig";
import { useNavigate } from "react-router-dom";


const accessTokenMap = mapBoxConfig.accessToken;
mapboxgl.accessToken = accessTokenMap;
const ThoiGianThuc = () => {
    const navigate= useNavigate()
const id=96
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markerRef = useRef(null);
  const [coordinates, setCoordinates] = useState(null);
  useEffect(() => {
    const dataRef = ref(Database, `dialy/${id}`);

    const handleDataChange = (snapshot) => {
      if (snapshot.exists()) {
        setCoordinates(snapshot.val());
      } else {
        console.log("Key ")
        navigate(-1)
      }
    };

    onValue(dataRef, handleDataChange);

    return () => {
      off(dataRef, "value", handleDataChange);
    };
  }, [id]);

  useEffect(() => {
    const dataRef = ref(Database, `dialy`);
    const unsubscribe = onChildRemoved(dataRef, (snapshot) => {
        if (snapshot.val() === 95) {
            alert("Không thành công")
            navigate(-1);
        }
    });

    return () => {
        unsubscribe();
    };
}, []);


  useEffect(() => {
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [105.7456128, 10.043392],
        zoom: 12,
      });
    }

    if (coordinates) {
      if (!markerRef.current) {
        markerRef.current = new mapboxgl.Marker()
          .setLngLat([coordinates.lng, coordinates.lat])
          .addTo(map.current);
      } else {
        markerRef.current.setLngLat([coordinates.lng, coordinates.lat]);
        map.current.flyTo({ center: [coordinates.lng, coordinates.lat], essential: true });
      }
    }

    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    };
  }, [coordinates]);

  return <div ref={mapContainer} style={{ width: "100%", height: "100vh" }} />;
};

export default ThoiGianThuc;
