import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type IpMapProps = {
  latitude: number;
  longitude: number;
  country: string;
};

export default function IpMap({ latitude, longitude, country }: IpMapProps) {
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={10}
      style={{
        height: "350px",
        width: "100%",
        borderRadius: "12px",
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={[latitude, longitude]}>
        <Popup>
          Страна: {country}
          <br />
          Широта: {latitude}
          <br />
          Долгота: {longitude}
        </Popup>
      </Marker>
    </MapContainer>
  );
}

export { IpMap };
