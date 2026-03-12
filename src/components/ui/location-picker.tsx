"use client";

import React, { useEffect, useRef, useState } from "react";
import maplibregl, { Map, Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Button } from "@/components/ui/button";
import { LocateFixed } from "lucide-react";
import { useTranslations } from "next-intl";

interface LocationPickerProps {
  initialLat?: number;
  initialLng?: number;
  onChange: (lat: number, lng: number) => void;
  className?: string;
}

export function LocationPicker({
  initialLat = 24.7136, // Riyadh as default
  initialLng = 46.6753, // Riyadh as default
  onChange,
  className,
}: LocationPickerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);
  const marker = useRef<Marker | null>(null);
  const [isGettingLocation, setIsGettingLocation] =
    useState(false);
  const t = useTranslations();

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    // Initialize MapLibre
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`,
      center: [initialLng, initialLat],
      zoom: 12,
    });

    // Add zoom and rotation controls to the map.
    map.current.addControl(
      new maplibregl.NavigationControl(),
      "top-right",
    );

    // Initialize Marker
    marker.current = new maplibregl.Marker({
      draggable: true,
      color: "#ef4444", // Red to match brand
    })
      .setLngLat([initialLng, initialLat])
      .addTo(map.current);

    // Initial emit if provided
    if (
      initialLat &&
      initialLng &&
      initialLat !== 24.7136
    ) {
      onChange(initialLat, initialLng);
    }

    // Handle marker drag
    marker.current.on("dragend", () => {
      const lngLat = marker.current?.getLngLat();
      if (lngLat) {
        onChange(lngLat.lat, lngLat.lng);
      }
    });

    // Handle map click
    map.current.on("click", (e) => {
      const { lng, lat } = e.lngLat;
      marker.current?.setLngLat([lng, lat]);
      onChange(lat, lng);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [initialLat, initialLng]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Update map
        map.current?.flyTo({
          center: [longitude, latitude],
          zoom: 14,
        });

        // Update marker
        marker.current?.setLngLat([longitude, latitude]);

        // Propagate changes
        onChange(latitude, longitude);
        setIsGettingLocation(false);
      },
      () => {
        alert("Unable to retrieve your location");
        setIsGettingLocation(false);
      },
    );
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div
        className="relative w-full rounded-md overflow-hidden border border-input"
        style={{ minHeight: "300px" }}
      >
        <div
          ref={mapContainer}
          className="absolute inset-0 min-h-[300px] h-full"
        />
        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="absolute top-2 left-2 z-10 shadow-md bg-white/90 hover:bg-white text-slate-700 dark:bg-slate-900/90 dark:text-slate-100 dark:hover:bg-slate-900"
          onClick={handleGetCurrentLocation}
          disabled={isGettingLocation}
        >
          <LocateFixed className="w-4 h-4 mr-2" />
          {isGettingLocation
            ? t("Locating")
            : t("Get Current Location")}
        </Button>
      </div>
    </div>
  );
}
