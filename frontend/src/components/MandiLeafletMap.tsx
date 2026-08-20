"use client";

import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

interface MandiPin {
  id: string | number;
  name: string;
  lat: number;
  lng: number;
  modal: string;
  net_gain: string;
  distance: string;
}

export default function MandiLeafletMap({
  mandis,
  selectedMandi,
  onSelect,
}: {
  mandis: MandiPin[];
  selectedMandi: any;
  onSelect: (m: any) => void;
}) {
  const [MapComponents, setMapComponents] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      import("react-leaflet"),
      import("leaflet"),
    ]).then(([reactLeaflet, L]) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      setMapComponents({
        MapContainer: reactLeaflet.MapContainer,
        TileLayer: reactLeaflet.TileLayer,
        Marker: reactLeaflet.Marker,
        Popup: reactLeaflet.Popup,
        Polyline: reactLeaflet.Polyline,
      });
    });
  }, []);

  if (!MapComponents) {
    return (
      <div className="h-[360px] w-full bg-slate-900 rounded-2xl flex items-center justify-center text-emerald-400 font-bold text-xs animate-pulse">
        🗺️ Loading Geospatial OpenStreetMap Canvas...
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup, Polyline } = MapComponents;
  const originFarm = [30.9010, 75.8573];
  const targetCoords = [selectedMandi?.lat || 30.7072, selectedMandi?.lng || 76.2167];

  return (
    <div className="h-[360px] w-full rounded-2xl overflow-hidden border border-slate-700 relative z-10">
      <MapContainer
        center={[30.4500, 76.2000]}
        zoom={8}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={originFarm}>
          <Popup>
            <div className="text-xs font-bold text-slate-900">
              📍 Origin Dispatch Point<br />
              <span className="text-emerald-600 font-normal">Ludhiana Farming Cluster</span>
            </div>
          </Popup>
        </Marker>

        <Polyline
          positions={[originFarm, targetCoords]}
          color="#059669"
          weight={4}
          dashArray="6, 8"
        />

        {mandis.map((m) => (
          <Marker
            key={m.id}
            position={[m.lat, m.lng]}
            eventHandlers={{
              click: () => onSelect(m),
            }}
          >
            <Popup>
              <div className="text-xs space-y-1">
                <span className="font-bold text-slate-900 block">{m.name}</span>
                <span className="text-emerald-700 font-black">{m.modal}</span>
                <div className="text-slate-500 font-medium">Arbitrage Delta: {m.net_gain}</div>
                <button
                  onClick={() => onSelect(m)}
                  className="mt-1 px-2 py-0.5 bg-emerald-600 text-white rounded font-bold text-[10px] block"
                >
                  Select Mandi
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}