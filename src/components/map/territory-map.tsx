"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
} from "@vis.gl/react-google-maps";
import { MapControls } from "./map-controls";
import { MapLegend } from "./map-legend";
import { MapCircle } from "./map-circle";
import { MapHeatmap } from "./map-heatmap";
import { MapSearch } from "./map-search";
import { getBoothRadius, getBoothPinLabel, BOOTH_TYPES, type BoothType } from "@/lib/booth-types";
import { getDateColor } from "@/lib/date-colors";

interface ScoutPin {
  id: string;
  latitude: number;
  longitude: number;
  troop: { troopNumber: string };
}

interface BoothPin {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  date: string;
  startTime: string;
  endTime: string;
  boothType: string;
  troop: { troopNumber: string };
}

interface TerritoryMapProps {
  scouts: ScoutPin[];
  booths: BoothPin[];
  troopColors: { troopNumber: string; color: string }[];
  mapId: string;
}

export type ColorMode = "troop" | "date";

function MapBoundsTracker({
  onBoundsChange,
}: {
  onBoundsChange: (bounds: google.maps.LatLngBounds) => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    const listener = map.addListener("idle", () => {
      const bounds = map.getBounds();
      if (bounds) onBoundsChange(bounds);
    });
    return () => listener.remove();
  }, [map, onBoundsChange]);

  return null;
}

export function TerritoryMap({
  scouts,
  booths,
  troopColors,
  mapId,
}: TerritoryMapProps) {
  const [showScouts, setShowScouts] = useState(true);
  const [showBooths, setShowBooths] = useState(true);
  const [showRadius, setShowRadius] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [radiusMiles, setRadiusMiles] = useState(0.5);
  const [selectedBooth, setSelectedBooth] = useState<BoothPin | null>(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [colorMode, setColorMode] = useState<ColorMode>("troop");
  const [reportMode, setReportMode] = useState(false);

  const troopNumbers = useMemo(
    () => troopColors.map((tc) => tc.troopNumber),
    [troopColors]
  );

  const [visibleTroops, setVisibleTroops] = useState(
    () => new Set(troopNumbers)
  );

  const colorMap = useMemo(() => {
    const m: Record<string, string> = {};
    troopColors.forEach(({ troopNumber, color }) => {
      m[troopNumber] = color;
    });
    return m;
  }, [troopColors]);

  const [mapBounds, setMapBounds] = useState<google.maps.LatLngBounds | null>(
    null
  );

  const handleBoundsChange = useCallback(
    (bounds: google.maps.LatLngBounds) => setMapBounds(bounds),
    []
  );

  const inViewTroopNumbers = useMemo(() => {
    if (!mapBounds) return new Set(troopNumbers);
    const inView = new Set<string>();
    for (const s of scouts) {
      if (mapBounds.contains({ lat: s.latitude, lng: s.longitude })) {
        inView.add(s.troop.troopNumber);
      }
    }
    for (const b of booths) {
      if (mapBounds.contains({ lat: b.latitude, lng: b.longitude })) {
        inView.add(b.troop.troopNumber);
      }
    }
    return inView;
  }, [mapBounds, scouts, booths, troopNumbers]);

  const inViewTroopNumbersSorted = useMemo(
    () => [...inViewTroopNumbers].sort(),
    [inViewTroopNumbers]
  );

  const inViewTroopColors = useMemo(
    () => troopColors.filter((tc) => inViewTroopNumbers.has(tc.troopNumber)),
    [troopColors, inViewTroopNumbers]
  );

  const toggleTroop = useCallback((tn: string) => {
    setVisibleTroops((prev) => {
      const next = new Set(prev);
      if (next.has(tn)) next.delete(tn);
      else next.add(tn);
      return next;
    });
  }, []);

  const selectAllTroops = useCallback(() => {
    setVisibleTroops((prev) => {
      const next = new Set(prev);
      for (const tn of inViewTroopNumbers) next.add(tn);
      return next;
    });
  }, [inViewTroopNumbers]);

  const deselectAllTroops = useCallback(() => {
    setVisibleTroops((prev) => {
      const next = new Set(prev);
      for (const tn of inViewTroopNumbers) next.delete(tn);
      return next;
    });
  }, [inViewTroopNumbers]);

  const filteredScouts = useMemo(
    () => scouts.filter((s) => visibleTroops.has(s.troop.troopNumber)),
    [scouts, visibleTroops]
  );

  const filteredBooths = useMemo(() => {
    let filtered = booths.filter((b) =>
      visibleTroops.has(b.troop.troopNumber)
    );
    if (dateFrom) {
      const from = new Date(dateFrom);
      filtered = filtered.filter((b) => new Date(b.date) >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo);
      filtered = filtered.filter((b) => new Date(b.date) <= to);
    }
    return filtered;
  }, [booths, visibleTroops, dateFrom, dateTo]);

  const center = useMemo(() => {
    const allPoints = [
      ...scouts.map((s) => ({ lat: s.latitude, lng: s.longitude })),
      ...booths.map((b) => ({ lat: b.latitude, lng: b.longitude })),
    ];
    if (allPoints.length === 0) return { lat: 39.7817, lng: -89.6501 };
    const avgLat =
      allPoints.reduce((sum, p) => sum + p.lat, 0) / allPoints.length;
    const avgLng =
      allPoints.reduce((sum, p) => sum + p.lng, 0) / allPoints.length;
    return { lat: avgLat, lng: avgLng };
  }, [scouts, booths]);

  const heatmapPoints = useMemo(() => {
    const points = [];
    if (showScouts) {
      points.push(
        ...filteredScouts.map((s) => ({ lat: s.latitude, lng: s.longitude }))
      );
    }
    if (showBooths) {
      points.push(
        ...filteredBooths.map((b) => ({ lat: b.latitude, lng: b.longitude }))
      );
    }
    return points;
  }, [showScouts, showBooths, filteredScouts, filteredBooths]);

  // Scout radius circles — use global radiusMiles slider
  const scoutRadiusPins = useMemo(() => {
    if (!showScouts) return [];
    return filteredScouts.map((s) => ({
      lat: s.latitude,
      lng: s.longitude,
      color: colorMap[s.troop.troopNumber] || "#999",
      radiusMiles,
    }));
  }, [showScouts, filteredScouts, colorMap, radiusMiles]);

  // Booth radius circles — use per-booth radius from booth type
  const getBoothColor = useCallback(
    (booth: BoothPin) => {
      if (colorMode === "date") return getDateColor(booth.date);
      return colorMap[booth.troop.troopNumber] || "#999";
    },
    [colorMode, colorMap]
  );

  const boothRadiusPins = useMemo(() => {
    if (!showBooths) return [];
    return filteredBooths.map((b) => ({
      lat: b.latitude,
      lng: b.longitude,
      color: getBoothColor(b),
      radiusMiles: getBoothRadius(b.boothType),
    }));
  }, [showBooths, filteredBooths, getBoothColor]);

  // Report mode: toggle body class to hide nav
  useEffect(() => {
    if (reportMode) {
      document.body.classList.add("report-mode");
    } else {
      document.body.classList.remove("report-mode");
    }
    return () => {
      document.body.classList.remove("report-mode");
    };
  }, [reportMode]);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center bg-gray-100">
        <p className="text-gray-500">
          Google Maps API key not configured. Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
          to .env
        </p>
      </div>
    );
  }

  return (
    <APIProvider
      apiKey={apiKey}
      libraries={["visualization"]}
    >
      <div className={`flex ${reportMode ? "h-screen" : "h-[calc(100vh-3.5rem)]"}`}>
        {/* Sidebar */}
        {!reportMode && (
          <div className="w-64 flex-shrink-0 overflow-y-auto border-r bg-gray-50 p-3 space-y-3">
            <MapControls
              showScouts={showScouts}
              showBooths={showBooths}
              showRadius={showRadius}
              showHeatmap={showHeatmap}
              radiusMiles={radiusMiles}
              troopNumbers={inViewTroopNumbersSorted}
              visibleTroops={visibleTroops}
              onToggleScouts={() => setShowScouts((v) => !v)}
              onToggleBooths={() => setShowBooths((v) => !v)}
              onToggleRadius={() => setShowRadius((v) => !v)}
              onToggleHeatmap={() => setShowHeatmap((v) => !v)}
              onRadiusChange={setRadiusMiles}
              onToggleTroop={toggleTroop}
              onSelectAllTroops={selectAllTroops}
              onDeselectAllTroops={deselectAllTroops}
              dateFrom={dateFrom}
              dateTo={dateTo}
              onDateFromChange={setDateFrom}
              onDateToChange={setDateTo}
              colorMode={colorMode}
              onColorModeChange={setColorMode}
            />
            <MapLegend troopColors={inViewTroopColors} colorMode={colorMode} />
            <button
              onClick={() => setReportMode(true)}
              className="w-full rounded bg-gray-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-800"
            >
              Report View
            </button>
          </div>
        )}

        {/* Map */}
        <div className="relative flex-1">
          <Map
            defaultCenter={center}
            defaultZoom={12}
            mapId={mapId}
            className="h-full w-full"
          >
            <MapBoundsTracker onBoundsChange={handleBoundsChange} />
            {!reportMode && <MapSearch />}
            {/* Scout pins */}
            {showScouts &&
              filteredScouts.map((scout) => {
                const color =
                  colorMap[scout.troop.troopNumber] || "#999";
                return (
                  <AdvancedMarker
                    key={`scout-${scout.id}`}
                    position={{
                      lat: scout.latitude,
                      lng: scout.longitude,
                    }}
                  >
                    <div
                      className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-[8px] font-bold text-white shadow"
                      style={{ backgroundColor: color }}
                      title={`Troop ${scout.troop.troopNumber}`}
                    >
                      {scout.troop.troopNumber}
                    </div>
                  </AdvancedMarker>
                );
              })}

            {/* Booth pins */}
            {showBooths &&
              filteredBooths.map((booth) => {
                const color = getBoothColor(booth);
                return (
                  <AdvancedMarker
                    key={`booth-${booth.id}`}
                    position={{
                      lat: booth.latitude,
                      lng: booth.longitude,
                    }}
                    onClick={() => setSelectedBooth(booth)}
                  >
                    <div
                      className="flex h-7 w-7 items-center justify-center rounded border-2 border-white text-xs font-bold text-white shadow"
                      style={{ backgroundColor: color }}
                      title={booth.name}
                    >
                      {getBoothPinLabel(booth.boothType)}
                    </div>
                  </AdvancedMarker>
                );
              })}

            {/* Booth info window */}
            {selectedBooth && (
              <InfoWindow
                position={{
                  lat: selectedBooth.latitude,
                  lng: selectedBooth.longitude,
                }}
                onCloseClick={() => setSelectedBooth(null)}
              >
                <div className="text-sm">
                  <p className="font-semibold">{selectedBooth.name}</p>
                  <p className="text-gray-600">
                    Troop {selectedBooth.troop.troopNumber}
                  </p>
                  <p className="text-gray-700 capitalize">
                    {selectedBooth.boothType} ({getBoothRadius(selectedBooth.boothType)} mi radius)
                  </p>
                  <p className="text-gray-700">
                    {new Date(selectedBooth.date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700">
                    {selectedBooth.startTime}–{selectedBooth.endTime}
                  </p>
                </div>
              </InfoWindow>
            )}

            {/* Scout radius circles */}
            {showRadius &&
              scoutRadiusPins.map((pin, i) => (
                <MapCircle
                  key={`scout-circle-${i}`}
                  center={{ lat: pin.lat, lng: pin.lng }}
                  radiusMiles={pin.radiusMiles}
                  color={pin.color}
                />
              ))}

            {/* Booth radius circles */}
            {showRadius &&
              boothRadiusPins.map((pin, i) => (
                <MapCircle
                  key={`booth-circle-${i}`}
                  center={{ lat: pin.lat, lng: pin.lng }}
                  radiusMiles={pin.radiusMiles}
                  color={pin.color}
                />
              ))}

            {/* Heatmap */}
            {showHeatmap && <MapHeatmap points={heatmapPoints} />}
          </Map>

          {/* Report mode overlays */}
          {reportMode && (
            <>
              <div className="absolute bottom-4 left-4 z-10">
                <MapLegend troopColors={inViewTroopColors} colorMode={colorMode} />
              </div>
              <button
                onClick={() => setReportMode(false)}
                className="print:hidden absolute top-4 right-4 z-10 rounded bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow hover:bg-gray-100"
              >
                Exit Report View
              </button>
            </>
          )}
        </div>
      </div>
    </APIProvider>
  );
}
