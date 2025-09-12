import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import L from 'leaflet'

export default function UserPage() {
  const KU_KPS_POSITION: [number, number] = [14.0209, 99.9746]; // มก. กำแพงแสน
   interface COUNT_LOCATION {
  time: number;
  location: [number, number];
}

  const RecentLocation = () => {

    const [count , setCount] = useState<COUNT_LOCATION>({time:0 ,location: [0,0]})
    const map = useMap()
 const [currentPosition, setCurrentPosition] =
      useState<[number, number]>(KU_KPS_POSITION);
    const updateLocation = () => {  

        navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            setCurrentPosition([latitude, longitude]); // ✅ อัปเดต state
            map.flyTo([latitude , longitude ] , map.getZoom())
            console.log(position.coords.latitude, position.coords.longitude);
            setCount(prev=>({time: prev.time+1 , location : [latitude , longitude]}))
        },
        (err) => {
          console.error(err);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
      };
      
    useEffect(() => {
      updateLocation()
      const interval = setInterval(updateLocation, 5000);
      return () => clearInterval(interval);

    }, []);

const customIcon = L.divIcon({
      className: "custom-marker",
      html: `<div style="background:white;border:1px solid black;
              border-radius:8px;padding:2px 5px;white-space:nowrap;">
              📍 ${count.time} รอบ </br>ตำแหน่งปัจจุบัน${count.location}
             </div>`,
      iconAnchor: [15, 30],
    });


    if (!currentPosition) return null;
    return (
      <div> 
        <Marker position={currentPosition} icon={customIcon}></Marker>
      </div>
    );
  };

  return (
    <div>
      <div className="text-center">User Page</div>
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
          <RecentLocation />
        </MapContainer>
      </div>
    </div>
  );
}
