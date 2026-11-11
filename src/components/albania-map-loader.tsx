"use client";

import dynamic from "next/dynamic";

export const AlbaniaMap = dynamic(
  () => import("./albania-map").then((m) => m.AlbaniaMap),
  {
    ssr: false,
    loading: () => <div className="map-panel h-full min-h-[260px] animate-pulse" />,
  }
);
