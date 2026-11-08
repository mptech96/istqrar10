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
import {
  APIProvider,
  Map,
  useMap,
  useMapsLibrary,
  Marker,
} from "@vis.gl/react-google-maps";
import { toast } from "sonner";
import { useGetBranchByIdQuery } from "@/services/api/branches";
import { Badge } from "../ui/badge";
import { Clock, Navigation } from "lucide-react";

const AuditorMapContent = ({
  branchPos,
  auditorPos,
  userRole,
  t,
}: {
  branchPos: google.maps.LatLngLiteral;
  auditorPos: google.maps.LatLngLiteral | null;
  userRole: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
}) => {
  const map = useMap();
  const routesLib = useMapsLibrary("routes");
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer | null>(null);
  const [routeInfo, setRouteInfo] = useState<{
    distance: string;
    duration: string;
  } | null>(null);

  // Fit bounds when markers appear
  useEffect(() => {
    if (!map || !branchPos) return;

    const bounds = new google.maps.LatLngBounds(branchPos);
    if (auditorPos) {
      bounds.extend(auditorPos);
    }
    map.fitBounds(bounds, /* { padding: 50 } */);
  }, [map, branchPos, auditorPos]);

  // Handle Routing for Admin/SuperAdmin
  useEffect(() => {
    if (!map || !routesLib || !auditorPos || !branchPos)
      return;
    if (userRole !== "super_admin" && userRole !== "admin")
      return;

    const directionsService =
      new routesLib.DirectionsService();
    const renderer = new google.maps.DirectionsRenderer({
      map,
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: "#3b82f6",
        strokeWeight: 5,
        strokeOpacity: 0.8,
      },
    });
    setDirectionsRenderer(renderer);

    directionsService.route(
      {
        origin: auditorPos,
        destination: branchPos,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (
          status === google.maps.DirectionsStatus.OK &&
          result
        ) {
          renderer.setDirections(result);
          const leg = result.routes[0].legs[0];
          setRouteInfo({
            distance: leg.distance?.text || "",
            duration: leg.duration?.text || "",
          });
        }
      },
    );

    return () => {
      renderer.setMap(null);
    };
  }, [map, routesLib, auditorPos, branchPos, userRole]);

  return (
    <>
      {/* Branch Marker */}
      <Marker
        position={branchPos}
        label={{
          text: t("Branch"),
          className:
            "bg-white px-2 py-1 rounded shadow-sm border text-xs font-bold -mt-10 translate-y-[-20px]",
        }}
      />

      {/* Auditor Marker */}
      {auditorPos && (
        <Marker
          position={auditorPos}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: "#3b82f6",
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "#ffffff",
            scale: 8,
          }}
          label={{
            text: t("Auditor"),
            className:
              "bg-white px-2 py-1 rounded shadow-sm border text-xs font-bold -mt-10 translate-y-[-20px]",
          }}
        />
      )}

      {/* Stats Overlay for Admins */}
      {routeInfo && (
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
          <Badge className="bg-white/90 text-slate-900 border shadow-md flex items-center gap-2 px-3 py-1.5 hover:bg-white">
            <Navigation className="w-3.5 h-3.5 text-blue-500" />
            <span>{routeInfo.distance}</span>
          </Badge>
          <Badge className="bg-white/90 text-slate-900 border shadow-md flex items-center gap-2 px-3 py-1.5 hover:bg-white">
            <Clock className="w-3.5 h-3.5 text-blue-500" />
            <span>{routeInfo.duration}</span>
          </Badge>
        </div>
      )}
    </>
  );
};

const LocatingBranchAuditor = ({
  visit,
  userRole,
}: {
  visit: Visit;
  userRole: string;
}) => {
  const [open, setOpen] = useState(false);
  const t = useTranslations();

  const { data: branchData } = useGetBranchByIdQuery(
    visit.branch_id,
    {
      skip: !open || !visit.branch_id,
    },
  );

  const [liveLocation, setLiveLocation] =
    useState<google.maps.LatLngLiteral | null>(null);

  const branchLocation =
    useMemo<google.maps.LatLngLiteral | null>(() => {
      const lat =
        branchData?.data?.latitude ||
        visit.branch?.latitude;
      const lng =
        branchData?.data?.longitude ||
        visit.branch?.longitude;
      if (lat && lng)
        return { lat: Number(lat), lng: Number(lng) };
      return null;
    }, [branchData, visit]);

  const auditorLocation =
    useMemo<google.maps.LatLngLiteral | null>(() => {
      // Priority 1: Live browser location (if current user is auditor)
      if (userRole === "auditor" && liveLocation)
        return liveLocation;

      // Priority 2: Stored backend location (for admins)
      const lat = visit?.start_latitude;
      const lng = visit?.start_longitude;
      if (lat && lng && visit.status === "in_progress") {
        return { lat: Number(lat), lng: Number(lng) };
      }
      return null;
    }, [visit, liveLocation, userRole]);

  // Fetch live location if auditor
  useEffect(() => {
    if (!open || userRole !== "auditor") return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLiveLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          console.error("Locating error:", err);
          toast.error(t("Failed to get current location"));
        },
        { enableHighAccuracy: true },
      );
    }
  }, [open, userRole, t]);

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
      <DialogContent className="sm:max-w-4xl w-[90vw] h-[80vh] flex flex-col p-4 bg-white dark:bg-slate-900 border-border overflow-hidden">
        <DialogHeader className="mb-2 shrink-0">
          <DialogTitle>{t("Visit Location")}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 w-full relative outline outline-1 outline-border rounded-md overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          {!branchLocation ? (
            <span className="text-muted-foreground animate-pulse">
              {t("Loading")}...
            </span>
          ) : (
            <APIProvider
              apiKey={
                process.env
                  .NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
              }
            >
              <Map
                defaultCenter={branchLocation}
                defaultZoom={12}
                mapTypeId={"roadmap"}
                disableDefaultUI={true}
                className="w-full h-full"
              >
                <AuditorMapContent
                  branchPos={branchLocation}
                  auditorPos={auditorLocation}
                  userRole={userRole}
                  t={t}
                />
              </Map>
            </APIProvider>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocatingBranchAuditor;
