"use client";
import { Visit } from "@/types/visit";
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { LocateFixed } from "lucide-react";
import { useTranslations } from "next-intl";
import { useGetBranchByIdQuery } from "@/services/api/branches";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { toast } from "sonner";

const MAPTILER_KEY =
  process.env.NEXT_PUBLIC_MAPTILER_KEY ||
  "W4c0YjTjXjKz1vC5M90J";

const LocatingBranchAuditor = ({
  visit,
  userRole,
}: {
  visit: Visit;
  userRole: string;
}) => {
  const [open, setOpen] = useState(false);
  const t = useTranslations();
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<maplibregl.Map | null>(null);

  const { data: branchData } = useGetBranchByIdQuery(
    visit.branch_id,
    {
      skip: !open || !visit.branch_id,
    },
  );

  const branchLocation = useMemo(() => {
    // Attempt to use fetched branch details first, fallback to visit details
    const lat =
      branchData?.data?.latitude || visit.branch?.latitude;
    const lng =
      branchData?.data?.longitude ||
      visit.branch?.longitude;
    if (lat && lng) return [lng, lat] as [number, number];
    return null;
  }, [branchData, visit]);

  const auditorBackendLocation = useMemo(() => {
    // If we have auditor coords from the API (for super_admin/admin)
    const lat = visit?.start_latitude;
    const lng = visit?.start_longitude;
    if (lat && lng && visit.status === "in_progress") {
      return [Number(lng), Number(lat)] as [number, number];
    }
    return null;
  }, [visit]);

  useEffect(() => {
    if (!open || !mapContainer.current) return;
    if (!branchLocation) return; // Wait until we resolve branch location

    // Initialize map
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`,
      center: branchLocation,
      zoom: 12,
    });
    mapInstance.current = map;

    let isRemoved = false;

    map.on("load", async () => {
      if (isRemoved) return;

      // Add Branch Marker (Red)
      new maplibregl.Marker({ color: "#ef4444" })
        .setLngLat(branchLocation)
        .setPopup(
          new maplibregl.Popup({ offset: 25 }).setText(
            t("Branch"),
          ),
        )
        .addTo(map);

      let auditorLoc = auditorBackendLocation;

      // If auditor, try to get live location
      if (
        userRole === "auditor" &&
        typeof navigator !== "undefined" &&
        navigator.geolocation
      ) {
        try {
          const pos =
            await new Promise<GeolocationPosition>(
              (resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                  resolve,
                  reject,
                );
              },
            );

          if (isRemoved) return;

          auditorLoc = [
            pos.coords.longitude,
            pos.coords.latitude,
          ];
        } catch (e) {
          console.error(e);
          if (isRemoved) return;
          toast.error(t("Failed to get current location"));
        }
      }

      if (
        !isRemoved &&
        auditorLoc &&
        auditorLoc[0] &&
        auditorLoc[1]
      ) {
        // Add Auditor Marker (Blue)
        new maplibregl.Marker({ color: "#3b82f6" })
          .setLngLat(auditorLoc)
          .setPopup(
            new maplibregl.Popup({ offset: 25 }).setText(
              t("Auditor"),
            ),
          )
          .addTo(map);

        // Fit bounds to include both
        const bounds = new maplibregl.LngLatBounds(
          branchLocation,
          branchLocation,
        );
        bounds.extend(auditorLoc);
        map.fitBounds(bounds, { padding: 50 });

        // Try getting path from MapTiler Routing API
        try {
          const res = await fetch(
            `https://api.maptiler.com/routes/?routes=0&key=${MAPTILER_KEY}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                waypoints: [
                  {
                    lon: auditorLoc[0],
                    lat: auditorLoc[1],
                  },
                  {
                    lon: branchLocation[0],
                    lat: branchLocation[1],
                  },
                ],
                configuration: {
                  routing_profile: "driving",
                },
              }),
            },
          );

          if (isRemoved) return;

          const routeData = await res.json();

          if (isRemoved) return;

          if (routeData?.features?.length > 0) {
            const geometry = routeData.features[0].geometry;
            map.addSource("route", {
              type: "geojson",
              data: {
                type: "Feature",
                properties: {},
                geometry: geometry,
              },
            });
            map.addLayer({
              id: "route",
              type: "line",
              source: "route",
              layout: {
                "line-join": "round",
                "line-cap": "round",
              },
              paint: {
                "line-color": "#3b82f6",
                "line-width": 5,
                "line-dasharray": [0.5, 2],
              },
            });
          }
        } catch (error) {
          console.error("Failed to fetch route:", error);
          if (isRemoved) return;

          // Fallback to straight line
          map.addSource("straight-line", {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: [auditorLoc, branchLocation],
              },
            },
          });
          map.addLayer({
            id: "straight-line",
            type: "line",
            source: "straight-line",
            paint: {
              "line-color": "#94a3b8",
              "line-width": 4,
              "line-dasharray": [2, 2],
            },
          });
        }
      }
    });

    return () => {
      isRemoved = true;
      map.remove();
      mapInstance.current = null;
    };

  }, [
    open,
    branchLocation,
    auditorBackendLocation,
    userRole,
    t,
  ]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          title={t("Locate Branch and Auditor")}
        >
          <LocateFixed className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl w-[90vw] h-[80vh] flex flex-col p-4 bg-white dark:bg-slate-900 border-border">
        <DialogHeader className="mb-2 shrink-0">
          <DialogTitle>{t("Visit Location")}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 w-full relative outline outline-1 outline-border rounded-md overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          {(!branchData && !visit.branch) ||
          !branchLocation ? (
            <span className="text-muted-foreground animate-pulse">
              {t("Loading")}...
            </span>
          ) : (
            <div
              ref={mapContainer}
              className="absolute inset-0 w-full h-full"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocatingBranchAuditor;
