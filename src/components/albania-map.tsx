"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ALBANIA_MAP_CENTER, ALBANIA_MAP_ZOOM } from "@/lib/constants";

export type MapPin = {
  id: number;
  name: string;
  city: string;
  lat: number;
  lng: number;
  href: string;
};

function pinIcon() {
  return L.divIcon({
    className: "",
    html: `<svg viewBox="0 0 24 24" width="30" height="30" style="filter:drop-shadow(0 3px 4px rgba(0,0,0,.45))"><use href="#pin-ico"/></svg>`,
    iconSize: [30, 30],
    iconAnchor: [15, 28],
    popupAnchor: [0, -26],
  });
}

export function AlbaniaMap({ pins, height = 460 }: { pins: MapPin[]; height?: number }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: ALBANIA_MAP_CENTER,
      zoom: ALBANIA_MAP_ZOOM,
      scrollWheelZoom: false,
    });
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      className: "map-tiles-dark",
    }).addTo(map);

    const icon = pinIcon();
    const markers: L.Marker[] = [];
    for (const pin of pins) {
      const marker = L.marker([pin.lat, pin.lng], { icon }).addTo(map);
      marker.bindTooltip(pin.name, { permanent: false, direction: "top", offset: [0, -26] });
      marker.on("click", () => router.push(pin.href));
      markers.push(marker);
    }

    if (markers.length > 0) {
      const bounds = L.latLngBounds(pins.map((p) => [p.lat, p.lng] as [number, number]));
      map.fitBounds(bounds.pad(0.35));
    }

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pins]);

  return (
    <div className="map-panel" style={{ height }}>
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}
