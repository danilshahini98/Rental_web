"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ALBANIA_MAP_CENTER, ALBANIA_MAP_ZOOM } from "@/lib/constants";

function pinIcon() {
  return L.divIcon({
    className: "",
    html: `<svg viewBox="0 0 24 24" width="30" height="30" style="filter:drop-shadow(0 3px 4px rgba(0,0,0,.45))"><use href="#pin-ico"/></svg>`,
    iconSize: [30, 30],
    iconAnchor: [15, 28],
  });
}

export function LocationPicker({
  lat,
  lng,
  onChange,
}: {
  lat: number | null;
  lng: number | null;
  onChange: (lat: number, lng: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center: lat && lng ? [lat, lng] : ALBANIA_MAP_CENTER,
      zoom: lat && lng ? 13 : ALBANIA_MAP_ZOOM,
    });
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap',
    }).addTo(map);

    if (lat && lng) {
      markerRef.current = L.marker([lat, lng], { icon: pinIcon() }).addTo(map);
    }

    map.on("click", (e: L.LeafletMouseEvent) => {
      const { lat: clickLat, lng: clickLng } = e.latlng;
      if (markerRef.current) {
        markerRef.current.setLatLng([clickLat, clickLng]);
      } else {
        markerRef.current = L.marker([clickLat, clickLng], { icon: pinIcon() }).addTo(map);
      }
      onChangeRef.current(Number(clickLat.toFixed(6)), Number(clickLng.toFixed(6)));
    });

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="map-panel" style={{ height: 240 }}>
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}
