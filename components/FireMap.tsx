"use client";

import { Circle, MapContainer, TileLayer, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const fireZones = [
  {
    name: "California",
    position: [37.7749, -122.4194] as [number, number],
    intensity: "High",
  },
  {
    name: "Amazon Basin",
    position: [-3.4653, -62.2159] as [number, number],
    intensity: "Extreme",
  },
  {
    name: "Western Australia",
    position: [-25.2744, 133.7751] as [number, number],
    intensity: "High",
  },
  {
    name: "Central India",
    position: [21.1458, 79.0882] as [number, number],
    intensity: "Moderate",
  },
  {
    name: "Southern Europe",
    position: [40.4637, 3.7492] as [number, number],
    intensity: "High",
  },
];

export default function FireMap() {
  return (
    <div className="h-full min-h-[500px] overflow-hidden rounded-3xl border border-white/10">
      <MapContainer
        center={[20, 10]}
        zoom={2}
        scrollWheelZoom={false}
        className="h-full min-h-[500px] w-full"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {fireZones.map((zone) => (
          <Circle
            key={zone.name}
            center={zone.position}
            radius={zone.intensity === "Extreme" ? 180000 : 120000}
            pathOptions={{
              color:
                zone.intensity === "Extreme"
                  ? "#ef4444"
                  : zone.intensity === "High"
                    ? "#f97316"
                    : "#f59e0b",
              fillColor:
                zone.intensity === "Extreme"
                  ? "#ef4444"
                  : zone.intensity === "High"
                    ? "#f97316"
                    : "#f59e0b",
              fillOpacity: 0.35,
              weight: 1,
            }}
          >
            <Tooltip>
              <strong>{zone.name}</strong>
              <br />
              Risk: {zone.intensity}
            </Tooltip>
          </Circle>
        ))}
      </MapContainer>
    </div>
  );
}