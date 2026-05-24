"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

type Coordinates = {
  lat: number;
  lng: number;
};

type ServiceMapProps = {
  coordinates: Coordinates | null;
  setCoordinates: (coordinates: Coordinates) => void;
};

const defaultIconPrototype = L.Icon.Default.prototype as L.Icon.Default & {
  _getIconUrl?: unknown;
};

delete defaultIconPrototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function LocationPicker({ setCoordinates }: Pick<ServiceMapProps, "setCoordinates">) {
  useMapEvents({
    click(e) {
      setCoordinates({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
    },
  });
  return null;
}

export default function ServiceMap({ coordinates, setCoordinates }: ServiceMapProps) {
  return (
    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={5}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationPicker setCoordinates={setCoordinates} />
      {coordinates && (
        <Marker position={[coordinates.lat, coordinates.lng]} />
      )}
    </MapContainer>
  );
}
