"use client";

import { useEffect, useState, useCallback } from "react";
import { useMap } from "@vis.gl/react-google-maps";

export function MapSearch() {
  const map = useMap();
  const [query, setQuery] = useState("");

  // Geolocate on mount
  useEffect(() => {
    if (!map || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        map.panTo({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        map.setZoom(12);
      },
      () => {
        // Denied or unavailable — keep default center
      }
    );
  }, [map]);

  const handleSearch = useCallback(() => {
    if (!map || !query.trim()) return;
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: query }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        map.panTo(results[0].geometry.location);
        map.setZoom(14);
      }
    });
  }, [map, query]);

  return (
    <div className="absolute left-1/2 top-3 z-10 flex -translate-x-1/2 gap-1">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        placeholder="Search address..."
        className="w-64 rounded-l border border-gray-300 bg-white px-3 py-1.5 text-sm shadow focus:outline-none focus:ring-2 focus:ring-green-600"
      />
      <button
        onClick={handleSearch}
        className="rounded-r bg-green-700 px-3 py-1.5 text-sm font-medium text-white shadow hover:bg-green-800"
      >
        Go
      </button>
    </div>
  );
}
