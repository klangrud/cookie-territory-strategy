"use client";

import { useEffect, useRef } from "react";
import { useMap } from "@vis.gl/react-google-maps";

interface MapCircleProps {
  center: { lat: number; lng: number };
  radiusMiles: number;
  color: string;
}

export function MapCircle({ center, radiusMiles, color }: MapCircleProps) {
  const map = useMap();
  const circleRef = useRef<google.maps.Circle | null>(null);

  useEffect(() => {
    if (!map) return;

    const circle = new google.maps.Circle({
      map,
      center,
      radius: radiusMiles * 1609.34, // miles to meters
      fillColor: color,
      fillOpacity: 0.15,
      strokeColor: color,
      strokeOpacity: 0.3,
      strokeWeight: 1,
    });

    circleRef.current = circle;

    return () => {
      circle.setMap(null);
    };
  }, [map, center, radiusMiles, color]);

  return null;
}
