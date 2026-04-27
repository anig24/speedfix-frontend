"use client";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { type Coordinates } from "@/lib/liveTracking";

delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const customerIcon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const workerIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

type WorkerTrackingMapProps = {
  customerCoordinates?: Coordinates | null;
  workerCoordinates?: Coordinates | null;
  workerLabel?: string | null;
};

export default function WorkerTrackingMap({
  customerCoordinates,
  workerCoordinates,
  workerLabel,
}: WorkerTrackingMapProps) {
  const center = workerCoordinates || customerCoordinates || {
    latitude: 20.5937,
    longitude: 78.9629,
  };

  return (
    <div className="h-[360px] overflow-hidden rounded-[1.75rem] border border-slate-200">
      <MapContainer
        center={[center.latitude, center.longitude]}
        zoom={workerCoordinates ? 13 : 11}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {customerCoordinates && (
          <Marker
            position={[customerCoordinates.latitude, customerCoordinates.longitude]}
            icon={customerIcon}
          >
            <Popup>Customer location</Popup>
          </Marker>
        )}

        {workerCoordinates && (
          <Marker
            position={[workerCoordinates.latitude, workerCoordinates.longitude]}
            icon={workerIcon}
          >
            <Popup>{workerLabel || "Assigned worker"}</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
