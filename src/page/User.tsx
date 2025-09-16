import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState , useRef } from "react";

interface UserLocation {
  latitude: number;
  longitude: number;
}

export default function UserPage() {
  const KU_KPS_POSITION: [number, number] = [14.0209, 99.9746];
  const [uid] = useState<string>(() => {
    return Math.random().toString(36).substring(2, 8); // สุ่มครั้งเดียว
  });
  const RealtimeMarkers = () => {
  const [locations, setLocations] = useState<UserLocation[]>([]);
  const map = useMap();
  const wsRef = useRef<WebSocket | null>(null);

  const sendMessage = (data: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log("send data" , data)
      wsRef.current.send(JSON.stringify(data));
    }
  };

  useEffect(() => {
    const ws = new WebSocket(`wss://talai-eta-back.onrender.com/ws?uid=${uid}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket connected");
      navigator.geolocation.getCurrentPosition((pos) => {
        sendMessage({uid,lat: pos.coords.latitude, lng: pos.coords.longitude });
        map.flyTo([pos.coords.latitude,  pos.coords.longitude])
      });
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "all_locations") {
        setLocations(message.data);
      }
    };

    ws.onclose = () => {
      console.log("❌ WebSocket closed");
    };

    const timer = setInterval(() => {
      navigator.geolocation.getCurrentPosition((pos) => {
        sendMessage({ uid, lat: pos.coords.latitude, lng: pos.coords.longitude });
        map.panTo([pos.coords.latitude, pos.coords.longitude]);
      });
    }, 5000);

    return () => {
      ws.close();
      clearInterval(timer);
    };
  }, [map]);

  return (
    <>
      {locations?.map((loc, idx) => (
        <Marker key={idx} position={[loc.latitude, loc.longitude]} />
      ))}
    </>
  );
};

  return (
    <div>
      <div className="text-center">User Page</div>
      <div>Temp id : {uid}</div>
      <div className="m-5 border">
        <MapContainer
          center={KU_KPS_POSITION}
          zoom={15}
          style={{ height: "50vh", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <RealtimeMarkers />
        </MapContainer>
      </div>
    </div>
  );
}
