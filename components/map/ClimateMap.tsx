'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { LatLngBoundsExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { TileLayerConfig } from '@/lib/data/mapLayers';
import { baseLayers } from '@/lib/data/mapLayers';

type LeafletPaneElement = HTMLElement & { _leaflet_pos?: L.Point };

interface ClimateMapProps {
  center?: [number, number];
  zoom?: number;
  onLocationSelect?: (lat: number, lng: number) => void;
  markers?: Array<{
    position: [number, number];
    popup: string;
    color?: string;
    radius?: number;
    opacity?: number;
  }>;
  baseLayer?: TileLayerConfig;
  overlayTiles?: TileLayerConfig[];
}

const WORLD_BOUNDS: LatLngBoundsExpression = [
  [-85, -180],
  [85, 180],
];

const clampLatitude = (value: number) => {
  if (!Number.isFinite(value)) return 0;
  return Math.max(-85, Math.min(85, value));
};

const normalizeLongitude = (value: number) => {
  if (!Number.isFinite(value)) return 0;
  const wrapped = ((((value + 180) % 360) + 360) % 360) - 180;
  return Math.max(-180, Math.min(180, wrapped));
};

const clampCenter = (coords: [number, number]): [number, number] => [
  clampLatitude(coords[0]),
  normalizeLongitude(coords[1]),
];

export default function ClimateMap({
  center = [20, 0],
  zoom = 2,
  onLocationSelect,
  markers = [],
  baseLayer = baseLayers[0],
  overlayTiles = [],
}: ClimateMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markerLayerRef = useRef<L.LayerGroup | null>(null);
  const baseLayerRef = useRef<L.TileLayer | null>(null);
  const overlayTileRefs = useRef<Record<string, L.TileLayer>>({});
  const initialViewSetRef = useRef(false);
  const prevZoomRef = useRef<number | null>(null);
  const prevCenterRef = useRef<[number, number] | null>(null);
  const initialCenterRef = useRef<[number, number]>(clampCenter(center));
  const initialZoomRef = useRef(zoom);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: false,
      center: initialCenterRef.current,
      zoom: initialZoomRef.current,
      minZoom: 2,
      maxBounds: WORLD_BOUNDS,
      maxBoundsViscosity: 1,
      worldCopyJump: false,
    });

    map.setMaxBounds(WORLD_BOUNDS);
    map.panInsideBounds(WORLD_BOUNDS, { animate: false });

    L.control
      .zoom({
        position: 'bottomright',
      })
      .addTo(map);

    mapRef.current = map;
    initialViewSetRef.current = true;
    prevZoomRef.current = map.getZoom();
    const startingCenter = map.getCenter();
    prevCenterRef.current = [startingCenter.lat, startingCenter.lng];

    requestAnimationFrame(() => {
      map.invalidateSize();
    });

    return () => {
      markerLayerRef.current?.clearLayers();
      markerLayerRef.current = null;

      if (baseLayerRef.current) {
        mapRef.current?.removeLayer(baseLayerRef.current);
        baseLayerRef.current = null;
      }

      Object.values(overlayTileRefs.current).forEach((layer) => {
        mapRef.current?.removeLayer(layer);
      });

      overlayTileRefs.current = {};
      mapRef.current?.off();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const handler = (e: L.LeafletMouseEvent) => {
      onLocationSelect?.(e.latlng.lat, e.latlng.lng);
    };

    map.on('click', handler);

    return () => {
      map.off('click', handler);
    };
  }, [onLocationSelect]);

  useEffect(() => {
    if (!mapRef.current || !baseLayer) return;

    if (baseLayerRef.current) {
      mapRef.current.removeLayer(baseLayerRef.current);
      baseLayerRef.current = null;
    }

    const { urlTemplate, attribution, opacity, options } = baseLayer;
    const layerOptions: L.TileLayerOptions = {
      attribution,
      maxZoom: options?.maxZoom,
      minZoom: options?.minZoom,
      maxNativeZoom: options?.maxZoom,
      noWrap: true,
      bounds: WORLD_BOUNDS,
    };

    if (options?.subdomains) {
      layerOptions.subdomains = options.subdomains;
    }

    const layer = L.tileLayer(urlTemplate, layerOptions);

    if (typeof opacity === 'number') {
      layer.setOpacity(opacity);
    }

    layer.addTo(mapRef.current);
    baseLayerRef.current = layer;
  }, [baseLayer]);

  useEffect(() => {
    if (!mapRef.current) return;

    const activeIds = new Set(overlayTiles.map((tile) => tile.id));

    Object.entries(overlayTileRefs.current).forEach(([id, layer]) => {
      if (!activeIds.has(id)) {
        mapRef.current?.removeLayer(layer);
        delete overlayTileRefs.current[id];
      }
    });

    overlayTiles.forEach((tile) => {
      if (overlayTileRefs.current[tile.id]) {
        const existingLayer = overlayTileRefs.current[tile.id];
        if (typeof tile.opacity === 'number') {
          existingLayer.setOpacity(tile.opacity);
        }
        return;
      }

      const layerOptions: L.TileLayerOptions = {
        attribution: tile.attribution,
        maxZoom: tile.options?.maxZoom,
        minZoom: tile.options?.minZoom,
        maxNativeZoom: tile.options?.maxZoom,
        noWrap: true,
        bounds: WORLD_BOUNDS,
      };

      if (tile.options?.subdomains) {
        layerOptions.subdomains = tile.options.subdomains;
      }

      const layer = L.tileLayer(tile.urlTemplate, layerOptions);

      if (typeof tile.opacity === 'number') {
        layer.setOpacity(tile.opacity);
      }

      layer.addTo(mapRef.current);
      overlayTileRefs.current[tile.id] = layer;
    });
  }, [overlayTiles]);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    const mapPane = map.getPane('mapPane');

    if (mapPane) {
      const paneElement = mapPane as LeafletPaneElement;
      if (paneElement._leaflet_pos === undefined) {
        L.DomUtil.setPosition(paneElement, L.point(0, 0));
      }
    }

    const targetCenter = clampCenter(center);
    const minZoom = map.getMinZoom();
    const maxZoom = map.getMaxZoom();
    const boundedZoom = Math.max(minZoom, Math.min(maxZoom, zoom));

    if (!initialViewSetRef.current || prevZoomRef.current === null) {
      map.setView(targetCenter, boundedZoom, { animate: false });
      initialViewSetRef.current = true;
      prevZoomRef.current = boundedZoom;
      prevCenterRef.current = targetCenter;
      requestAnimationFrame(() => {
        map.invalidateSize();
      });
      return;
    }

    const previousZoom = prevZoomRef.current;
    const previousCenter = prevCenterRef.current;
    const centerChanged =
      !previousCenter ||
      Math.abs(previousCenter[0] - targetCenter[0]) > 1e-6 ||
      Math.abs(previousCenter[1] - targetCenter[1]) > 1e-6;

    if (centerChanged || boundedZoom !== previousZoom) {
      map.flyTo(targetCenter, boundedZoom, {
        animate: true,
        duration: 0.75,
        easeLinearity: 0.25,
      });
      prevZoomRef.current = boundedZoom;
      prevCenterRef.current = targetCenter;
    }

    requestAnimationFrame(() => {
      try {
        map.panInsideBounds(WORLD_BOUNDS, { animate: false });
      } catch (e) {
        // Map pane might not be initialized yet, ignore error
      }
      map.invalidateSize();
    });
  }, [center, zoom]);

  useEffect(() => {
    if (!mapRef.current) return;

    if (!markerLayerRef.current) {
      markerLayerRef.current = L.layerGroup().addTo(mapRef.current);
    }

    markerLayerRef.current.clearLayers();

    markers.forEach((marker) => {
      if (marker.radius) {
        L.circleMarker(marker.position, {
          radius: marker.radius,
          color: marker.color || '#38bdf8',
          weight: 1.5,
          fillColor: marker.color || '#38bdf8',
          fillOpacity: marker.opacity ?? 0.35,
          opacity: marker.opacity ?? 0.8,
        })
          .addTo(markerLayerRef.current!)
          .bindPopup(marker.popup, { closeButton: false, offset: L.point(0, -marker.radius) });
      } else {
        // Create a distinctive pin marker for the current location
        const icon = L.divIcon({
          className: 'custom-pin-marker',
          html: `
            <div style="position: relative; width: 32px; height: 40px;">
              <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <filter id="pin-shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
                    <feOffset dx="0" dy="2" result="offsetblur"/>
                    <feComponentTransfer>
                      <feFuncA type="linear" slope="0.5"/>
                    </feComponentTransfer>
                    <feMerge>
                      <feMergeNode/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <!-- Pin shape -->
                <path d="M16 0C9.373 0 4 5.373 4 12c0 8.4 12 28 12 28s12-19.6 12-28c0-6.627-5.373-12-12-12z" 
                  fill="${marker.color || '#fbbf24'}" 
                  filter="url(#pin-shadow)"/>
                <!-- Inner circle -->
                <circle cx="16" cy="12" r="5" fill="white" opacity="0.9"/>
                <!-- Center dot -->
                <circle cx="16" cy="12" r="3" fill="${marker.color || '#fbbf24'}"/>
              </svg>
              <!-- Pulsing animation ring -->
              <div style="
                position: absolute;
                top: 6px;
                left: 50%;
                transform: translateX(-50%);
                width: 24px;
                height: 24px;
                border: 2px solid ${marker.color || '#fbbf24'};
                border-radius: 50%;
                animation: pin-pulse 2s ease-in-out infinite;
              "></div>
            </div>
            <style>
              @keyframes pin-pulse {
                0%, 100% {
                  opacity: 0.8;
                  transform: translateX(-50%) scale(1);
                }
                50% {
                  opacity: 0;
                  transform: translateX(-50%) scale(1.8);
                }
              }
            </style>
          `,
          iconSize: [32, 40],
          iconAnchor: [16, 40],
          popupAnchor: [0, -40],
        });

        L.marker(marker.position, { icon })
          .addTo(markerLayerRef.current!)
          .bindPopup(marker.popup);
      }
    });
  }, [markers]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 h-full w-full"
      role="application"
      aria-label="Interactive climate data map"
    />
  );
}
