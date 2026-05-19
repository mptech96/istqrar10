"use client";

import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { Spinner } from "@/components/ui/spinner";
import {
  APIProvider,
  Map,
  Marker,
  useMap,
  MapMouseEvent,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { Button } from "@/components/ui/button";
import { LocateFixed } from "lucide-react";
import { useTranslations } from "next-intl";

interface LocationPickerProps {
  initialLat?: number;
  initialLng?: number;
  onChange: (lat: number, lng: number) => void;
  onAddressSelect?: (address: string, city: string) => void;
  className?: string;
}

const DEFAULT_CENTER = { lat: 24.7136, lng: 46.6753 }; // Riyadh as default

function MapContent({
  position,
  setPosition,
  onChange,
  onAddressSelect,
  isGettingLocation,
  setIsGettingLocation,
  hasInitialPosition,
  initialLat,
  initialLng,
}: {
  position: google.maps.LatLngLiteral;
  setPosition: React.Dispatch<
    React.SetStateAction<google.maps.LatLngLiteral>
  >;
  onChange: (lat: number, lng: number) => void;
  onAddressSelect?: (address: string, city: string) => void;
  isGettingLocation: boolean;
  setIsGettingLocation: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  hasInitialPosition: boolean;
  initialLat?: number | string;
  initialLng?: number | string;
}) {
  const map = useMap();
  const geocodingLib = useMapsLibrary("geocoding");
  const geocoder = useRef<google.maps.Geocoder | null>(
    null,
  );
  const geoRequestedRef = useRef(false);
  const t = useTranslations();

  const geocodePosition = useCallback(
  (lat: number, lng: number) => {
    if (geocoder.current && onAddressSelect) {
      geocoder.current.geocode(
        { location: { lat, lng } },
        (results, status) => {
          if (status === "OK" && results?.[0]) {
            const result = results[0];
            const comps = result.address_components;

            // Helper to extract specific types
            const getComp = (type: string) => 
              comps.find(c => c.types.includes(type))?.long_name || "";

            // 1. Get Country
            const country = getComp("country");

            // 2. Get City (Handling different global naming conventions)
            const city = getComp("locality") || 
                         getComp("administrative_area_level_2") || 
                         getComp("administrative_area_level_1");

            // 3. Get Street / Address Details
            const streetName = getComp("route");
            const streetNumber = getComp("street_number");
            const neighborhood = getComp("neighborhood");

            // Construct a "Street Address" string
            const streetAddress = streetNumber 
              ? `${streetNumber} ${streetName}` 
              : streetName || neighborhood || "Unnamed Street";

            const formattedAddress = result.formatted_address;

            // Pass the data back. 
            // Note: You might want to update your onAddressSelect interface 
            // to accept country/street separately if your parent needs them.
            onAddressSelect(
              formattedAddress, 
              city || "Unknown City"
            );

            // If you want to log or use the extra data:
            console.log({
              street: streetAddress,
              city,
              country,
              full: formattedAddress
            });
          } else {
            onAddressSelect(`Location at ${lat}, ${lng}`, "Unknown City");
          }
        },
      );
    }
  },
  [onAddressSelect],
);

  useEffect(() => {
    if (geocodingLib && !geocoder.current) {
      geocoder.current = new geocodingLib.Geocoder();

      // Auto-assign the initial location values back to form
      geocodePosition(position.lat, position.lng);
      onChange(position.lat, position.lng);
    }
  }, [
    geocodingLib,
    geocodePosition,
    onChange,
    position.lat,
    position.lng,
  ]);

  // Sync state if initial props change after mount (e.g. form reset)
  useEffect(() => {
    if (hasInitialPosition) {
      setPosition({
        lat: Number(initialLat),
        lng: Number(initialLng),
      });
    }
  }, [
    initialLat,
    initialLng,
    hasInitialPosition,
    setPosition,
  ]);

  const handleMapClick = (e: MapMouseEvent) => {
    if (e.detail.latLng) {
      const lat = e.detail.latLng.lat;
      const lng = e.detail.latLng.lng;
      setPosition({ lat, lng });
      onChange(lat, lng);
      geocodePosition(lat, lng);
    }
  };

  const handleMarkerDragEnd = (
    e: google.maps.MapMouseEvent,
  ) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setPosition({ lat, lng });
      onChange(lat, lng);
      geocodePosition(lat, lng);
    }
  };

  return (
    <>
      <Map
        defaultZoom={12}
        defaultCenter={position}
        onClick={handleMapClick}
        disableDefaultUI={false}
        streetViewControl={false}
        mapTypeId="roadmap"
        gestureHandling="greedy"
      >
        <Marker
          position={position}
          draggable={true}
          onDragEnd={handleMarkerDragEnd}
        />
      </Map>
      {/*  <Button
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
      </Button> */}
    </>
  );
}

export function LocationPicker({
  initialLat,
  initialLng,
  onChange,
  onAddressSelect,
  className,
}: LocationPickerProps) {
  const isValidLat =
    initialLat !== undefined &&
    initialLat !== null &&
    initialLat !== "";
  const isValidLng =
    initialLng !== undefined &&
    initialLng !== null &&
    initialLng !== "";
  const hasInitialPosition = isValidLat && isValidLng;

  const [position, setPosition] =
    useState<google.maps.LatLngLiteral>(() => {
      if (hasInitialPosition) {
        return {
          lat: Number(initialLat),
          lng: Number(initialLng),
        };
      }
      return DEFAULT_CENTER;
    });
  const t = useTranslations();
  const [isGettingLocation, setIsGettingLocation] =
    useState(false);

  // We consider it "settled" if we have data OR if geolocation finished (even if it fell back)
  const [isReady, setIsReady] = useState(
    hasInitialPosition,
  );
  const geoRequestedRef = useRef(false);

  useEffect(() => {
    if (
      !hasInitialPosition &&
      navigator.geolocation &&
      !geoRequestedRef.current
    ) {
      geoRequestedRef.current = true;
      setIsGettingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const newPos = { lat: latitude, lng: longitude };
          setPosition(newPos);
          onChange(latitude, longitude);
          setIsGettingLocation(false);
          setIsReady(true);
        },
        () => {
          // Failure or Denial: Fallback to Riyadh
          setIsGettingLocation(false);
          setIsReady(true);
        },
      );
    }
  }, [hasInitialPosition, onChange]);

  // Sync isReady if initial data arrives late
  useEffect(() => {
    if (hasInitialPosition && !isReady) {
      setIsReady(true);
      setPosition({
        lat: Number(initialLat),
        lng: Number(initialLng),
      });
    }
  }, [hasInitialPosition, isReady, initialLat, initialLng]);

  const apiKey =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  const showLoader = !isReady;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div
        className="relative w-full rounded-md overflow-hidden border border-input"
        style={{ minHeight: "300px" }}
      >
        {!apiKey ? (
          <div className="flex items-center justify-center min-h-[300px] bg-slate-100 text-slate-500">
            Google Maps API Key is missing.
          </div>
        ) : showLoader ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] bg-slate-50 dark:bg-slate-900/50">
            <Spinner className="w-8 h-8 text-primary mb-2" />
            <p className="text-sm text-muted-foreground animate-pulse">
              {t("Locating")}
            </p>
          </div>
        ) : (
          <APIProvider apiKey={apiKey}>
            <MapContent
              position={position}
              setPosition={setPosition}
              onChange={onChange}
              onAddressSelect={onAddressSelect}
              isGettingLocation={isGettingLocation}
              setIsGettingLocation={setIsGettingLocation}
              hasInitialPosition={hasInitialPosition}
              initialLat={initialLat}
              initialLng={initialLng}
            />
          </APIProvider>
        )}
      </div>
    </div>
  );
}
