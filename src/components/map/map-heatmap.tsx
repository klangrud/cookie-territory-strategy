"use client";

import { useEffect, useRef } from "react";
import { useMap } from "@vis.gl/react-google-maps";

interface HeatmapPoint {
  lat: number;
  lng: number;
}

interface MapHeatmapProps {
  points: HeatmapPoint[];
}

export function MapHeatmap({ points }: MapHeatmapProps) {
  const map = useMap();
  const heatmapRef = useRef<google.maps.visualization.HeatmapLayer | null>(
    null
  );

  useEffect(() => {
    if (!map || points.length === 0) return;

    const data = points.map(
      (p) => new google.maps.LatLng(p.lat, p.lng)
    );

    const heatmap = new google.maps.visualization.HeatmapLayer({
      data,
      map,
      radius: 40,
      opacity: 0.6,
    });

    heatmapRef.current = heatmap;

    return () => {
      heatmap.setMap(null);
    };
  }, [map, points]);

  return null;
}
