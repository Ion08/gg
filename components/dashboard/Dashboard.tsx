'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import LineChart from '@/components/charts/LineChart';

const ClimateMap = dynamic(() => import('@/components/map/ClimateMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#050b1e] text-slate-300">
      Initializing orbital imagery…
    </div>
  ),
});

import ExportButton from '@/components/ui/ExportButton';
import ShareButton from '@/components/ui/ShareButton';
import { getCurrentWeather } from '@/lib/api/openMeteo';
import { getAirQuality } from '@/lib/api/openaq';
import { getGlobalCO2Data, getGlobalTemperatureData, getArcticIceData } from '@/lib/api/co2';
import { processTimeSeriesForChart, getAQICategory, formatNumber } from '@/lib/utils/dataProcessing';
import { exportToCSV, exportToJSON, exportToPDF, generateReport } from '@/lib/utils/export';
import { TimeSeriesData } from '@/types/climate';
import {
  baseLayers,
  environmentalLayers,
  weatherLayers,
  disasterLayers,
  defaultBaseLayerId,
  defaultEnvironmentalLayerId,
} from '@/lib/data/mapLayers';
import type { MapLayer, TileLayerConfig } from '@/lib/data/mapLayers';

export default function Dashboard() {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number }>({ lat: 51.5074, lng: -0.1278 });
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState<{ temperature: number; humidity: number; windSpeed: number; timestamp: string } | null>(null);
  const [airQuality, setAirQuality] = useState<{ aqi: number; pm25: number; pm10: number; co: number; no2: number; o3: number; so2: number } | null>(null);
  const [co2Data, setCO2Data] = useState<TimeSeriesData[]>([]);
  const [temperatureData, setTemperatureData] = useState<TimeSeriesData[]>([]);
  const [activeBaseLayerId, setActiveBaseLayerId] = useState(defaultBaseLayerId);
  const [activeEnvLayerIds, setActiveEnvLayerIds] = useState<string[]>([defaultEnvironmentalLayerId]);
  const [activeWeatherLayers, setActiveWeatherLayers] = useState<string[]>(['storms', 'precipitation']);
  const [activeDisasterLayers, setActiveDisasterLayers] = useState<string[]>(['wildfires']);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [weather, aqi] = await Promise.all([
          getCurrentWeather(selectedLocation.lat, selectedLocation.lng),
          getAirQuality(selectedLocation.lat, selectedLocation.lng),
        ]);
        setWeatherData(weather);
        setAirQuality(aqi);
      } catch (error) {
        console.error('Error loading location data:', error);
      }
    };
    loadData();
  }, [selectedLocation]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [co2, temp] = await Promise.all([
        getGlobalCO2Data(),
        getGlobalTemperatureData(),
      ]);
      setCO2Data(co2);
      setTemperatureData(temp);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };



  const normalizeLongitude = useCallback((lng: number) => {
    if (!Number.isFinite(lng)) return 0;
    return ((((lng + 180) % 360) + 360) % 360) - 180;
  }, []);

  const clampLatitude = useCallback((lat: number) => {
    if (!Number.isFinite(lat)) return 0;
    return Math.max(-90, Math.min(90, lat));
  }, []);

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation({ lat: clampLatitude(lat), lng: normalizeLongitude(lng) });
  };

  const aqiCategory = airQuality ? getAQICategory(airQuality.aqi) : null;

  const activeBaseLayer = useMemo(
    () => baseLayers.find((layer) => layer.id === activeBaseLayerId) ?? baseLayers[0],
    [activeBaseLayerId]
  );
  const selectedEnvLayers = useMemo(() => {
    const layers = environmentalLayers.filter((layer) => activeEnvLayerIds.includes(layer.id));
    if (layers.length > 0) {
      return layers;
    }
    const fallback = environmentalLayers.find((layer) => layer.id === defaultEnvironmentalLayerId) ?? environmentalLayers[0];
    return fallback ? [fallback] : [];
  }, [activeEnvLayerIds]);

  const primaryEnvLayer = useMemo(
    () => selectedEnvLayers[0] ?? environmentalLayers.find((layer) => layer.id === defaultEnvironmentalLayerId) ?? environmentalLayers[0],
    [selectedEnvLayers]
  );

  const selectedWeatherLayers = useMemo(
    () => weatherLayers.filter((layer) => activeWeatherLayers.includes(layer.id)),
    [activeWeatherLayers]
  );

  const selectedDisasterLayers = useMemo(
    () => disasterLayers.filter((layer) => activeDisasterLayers.includes(layer.id)),
    [activeDisasterLayers]
  );

  const mapCenter = useMemo(
    () => [selectedLocation.lat, selectedLocation.lng] as [number, number],
    [selectedLocation]
  );

  const severityColors: Record<string, string> = useMemo(
    () => ({
      low: '#38bdf8',
      moderate: '#22d3ee',
      high: '#fb7185',
      extreme: '#f97316',
    }),
    []
  );

  const buildMarkersForLayer = useCallback(
    (layer: MapLayer | undefined, emphasize = false) => {
      if (!layer || layer.points.length === 0) return [];

      const values = layer.points.map((point) => point.value);
      const min = Math.min(...values);
      const max = Math.max(...values);
      const spread = max - min || 1;

      return layer.points.map((point) => {
        const normalized = (point.value - min) / spread;
        const baseRadius = emphasize ? 20 : 12;
        const radius = baseRadius + normalized * (emphasize ? 28 : 18);
        const markerColor = point.severity ? severityColors[point.severity] ?? layer.color : layer.color;

        return {
          position: point.coordinates,
          color: markerColor,
          radius,
          opacity: emphasize ? 0.5 : 0.65,
          popup: `
            <div style="font-family: 'Geist', sans-serif; min-width: 240px; color: #e2e8f0;">
              <p style="margin: 0 0 4px; font-size: 12px; letter-spacing: 0.35em; text-transform: uppercase; color: rgba(148, 163, 184, 0.8);">${layer.name}</p>
              <h3 style="margin: 0 0 6px; font-size: 18px; font-weight: 600; color: ${markerColor};">${point.name}</h3>
              <p style="margin: 0; font-size: 14px; color: #94a3b8;">${layer.metric}</p>
              <p style="margin: 10px 0 0; font-size: 22px; font-weight: 600; color: #f8fafc;">${point.value.toLocaleString()} ${point.unit}</p>
              ${
                typeof point.change === 'number'
                  ? `<p style="margin: 6px 0 0; font-size: 13px; color: ${point.change >= 0 ? '#f97316' : '#22c55e'};">${point.change >= 0 ? '+' : ''}${point.change}% trend</p>`
                  : ''
              }
              ${
                point.severity
                  ? `<p style="margin: 6px 0 0; font-size: 12px; font-weight: 600; color: ${markerColor}; letter-spacing: 0.2em; text-transform: uppercase;">${point.severity} alert</p>`
                  : ''
              }
              ${
                point.narrative
                  ? `<p style="margin: 8px 0 0; font-size: 13px; line-height: 1.4; color: #cbd5f5;">${point.narrative}</p>`
                  : ''
              }
            </div>
          `,
        };
      });
    },
    [severityColors]
  );

  const environmentalMarkers = useMemo(
    () =>
      selectedEnvLayers.flatMap((layer) =>
        buildMarkersForLayer(layer, layer.id === primaryEnvLayer?.id)
      ),
    [selectedEnvLayers, primaryEnvLayer, buildMarkersForLayer]
  );

  const weatherMarkers = useMemo(
    () => selectedWeatherLayers.flatMap((layer) => buildMarkersForLayer(layer)),
    [selectedWeatherLayers, buildMarkersForLayer]
  );

  const disasterMarkers = useMemo(
    () => selectedDisasterLayers.flatMap((layer) => buildMarkersForLayer(layer)),
    [selectedDisasterLayers, buildMarkersForLayer]
  );

  const selectedLocationMarker = useMemo(() => {
    // Build weather details section
    const weatherDetails = weatherData
      ? `
          <div style="flex:1;">
            <p style="margin:0; font-size:11px; letter-spacing:0.22em; text-transform:uppercase; color:rgba(148,163,184,0.7);">Atmospheric</p>
            <p style="margin:6px 0 0; font-size:15px; color:#f8fafc;">${formatNumber(weatherData.temperature, 1)}°C</p>
            <p style="margin:2px 0 0; font-size:12px; color:#cbd5f5;">Humidity: ${Math.round(weatherData.humidity)}%</p>
            <p style="margin:2px 0 0; font-size:12px; color:#cbd5f5;">Wind: ${formatNumber(weatherData.windSpeed, 1)} m/s</p>
          </div>
        `
      : `
          <div style="flex:1;">
            <p style="margin:0; font-size:11px; letter-spacing:0.22em; text-transform:uppercase; color:rgba(148,163,184,0.7);">Atmospheric</p>
            <p style="margin:6px 0 0; font-size:12px; color:#cbd5f5;">Weather telemetry syncing…</p>
          </div>
        `;

    const airQualityDetails = airQuality
      ? `
          <div style="flex:1;">
            <p style="margin:0; font-size:11px; letter-spacing:0.22em; text-transform:uppercase; color:rgba(148,163,184,0.7);">Air Quality</p>
            <p style="margin:6px 0 0; font-size:15px; color:#f8fafc;">AQI ${airQuality.aqi}</p>
            <p style="margin:2px 0 0; font-size:12px; color:#cbd5f5;">PM₂.₅: ${formatNumber(airQuality.pm25, 1)} µg/m³</p>
            <p style="margin:2px 0 0; font-size:12px; color:#cbd5f5;">PM₁₀: ${formatNumber(airQuality.pm10, 1)} µg/m³</p>
          </div>
        `
      : `
          <div style="flex:1;">
            <p style="margin:0; font-size:11px; letter-spacing:0.22em; text-transform:uppercase; color:rgba(148,163,184,0.7);">Air Quality</p>
            <p style="margin:6px 0 0; font-size:12px; color:#cbd5f5;">Awaiting particulate readings…</p>
          </div>
        `;

    const activeLayerSummary = (() => {
      if (!primaryEnvLayer) {
        return '';
      }
      const prominentPoint = primaryEnvLayer.points.reduce((prev, current) => (current.value > prev.value ? current : prev));
      return `
        <div style="margin-top:14px; border-top:1px solid rgba(148,163,184,0.2); padding-top:12px;">
          <p style="margin:0; font-size:11px; letter-spacing:0.22em; text-transform:uppercase; color:rgba(148,163,184,0.7);">${primaryEnvLayer.name}</p>
          <p style="margin:6px 0 0; font-size:15px; font-weight:600; color:${primaryEnvLayer.color};">${prominentPoint.name}</p>
          <p style="margin:4px 0 0; font-size:12px; color:#cbd5f5;">${primaryEnvLayer.metric}</p>
          <p style="margin:6px 0 0; font-size:20px; font-weight:600; color:#f8fafc;">${prominentPoint.value.toLocaleString()} ${prominentPoint.unit}</p>
          ${
            typeof prominentPoint.change === 'number'
              ? `<p style="margin:4px 0 0; font-size:12px; font-weight:600; color:${prominentPoint.change >= 0 ? '#f97316' : '#22c55e'};">${prominentPoint.change >= 0 ? '+' : ''}${prominentPoint.change}% annual shift</p>`
              : ''
          }
          ${
            prominentPoint.narrative
              ? `<p style="margin:8px 0 0; font-size:12px; line-height:1.45; color:#cbd5f5;">${prominentPoint.narrative}</p>`
              : ''
          }
        </div>
      `;
    })();

    return {
      position: mapCenter,
      color: '#fbbf24',
      popup: `
        <div style="font-family: 'Geist', sans-serif; min-width: 240px; color: #e2e8f0;">
          <p style="margin: 0 0 4px; font-size: 12px; letter-spacing: 0.35em; text-transform: uppercase; color: rgba(148, 163, 184, 0.8);">Active Node</p>
          <h3 style="margin: 0 0 8px; font-size: 18px; font-weight: 600; color: #f8fafc;">${
            selectedLocation.lat >= 0
              ? `${selectedLocation.lat.toFixed(2)}°N`
              : `${Math.abs(selectedLocation.lat).toFixed(2)}°S`
          } / ${
            selectedLocation.lng >= 0
              ? `${selectedLocation.lng.toFixed(2)}°E`
              : `${Math.abs(selectedLocation.lng).toFixed(2)}°W`
          }</h3>
          <p style="margin: 0 0 12px; font-size: 13px; color: #94a3b8;">Tap anywhere on the map to retask this observation grid.</p>
          <div style="display:flex; gap:12px;">${weatherDetails}${airQualityDetails}</div>
          ${activeLayerSummary}
        </div>
      `,
    };
  }, [mapCenter, selectedLocation, weatherData, airQuality, primaryEnvLayer]);

  const mapMarkers = useMemo(() => {
    return [...environmentalMarkers, ...weatherMarkers, ...disasterMarkers, selectedLocationMarker];
  }, [environmentalMarkers, weatherMarkers, disasterMarkers, selectedLocationMarker]);

  const overlayTiles = useMemo<TileLayerConfig[]>(() => {
    const tiles: TileLayerConfig[] = [];

    selectedEnvLayers.forEach((layer) => {
      if (layer.tileUrl) {
        tiles.push({
          id: `env-${layer.id}`,
          name: layer.name,
          urlTemplate: layer.tileUrl,
          attribution: layer.tileAttribution ?? '',
          opacity: layer.tileOpacity,
        });
      }
    });

    selectedWeatherLayers.forEach((layer) => {
      if (layer.tileUrl) {
        tiles.push({
          id: `weather-${layer.id}`,
          name: layer.name,
          urlTemplate: layer.tileUrl,
          attribution: layer.tileAttribution ?? '',
          opacity: layer.tileOpacity,
        });
      }
    });

    selectedDisasterLayers.forEach((layer) => {
      if (layer.tileUrl) {
        tiles.push({
          id: `disaster-${layer.id}`,
          name: layer.name,
          urlTemplate: layer.tileUrl,
          attribution: layer.tileAttribution ?? '',
          opacity: layer.tileOpacity,
        });
      }
    });

    return tiles;
  }, [selectedEnvLayers, selectedWeatherLayers, selectedDisasterLayers]);

  const toggleEnvLayer = useCallback((id: string) => {
    setActiveEnvLayerIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) {
          return prev;
        }
        return prev.filter((item) => item !== id);
      }

      const next = [...prev, id];
      const ordered = environmentalLayers
        .map((layer) => layer.id)
        .filter((layerId) => next.includes(layerId));
      return ordered;
    });
  }, []);

  const toggleWeatherLayer = useCallback((id: string) => {
    setActiveWeatherLayers((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  }, []);

  const toggleDisasterLayer = useCallback((id: string) => {
    setActiveDisasterLayers((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  }, []);

  const latestTemperature = temperatureData.length ? temperatureData[temperatureData.length - 1].value : null;
  const decadeAgoTemperature = temperatureData.length >= 120 ? temperatureData[temperatureData.length - 120].value : null;
  const decadeChange =
    latestTemperature !== null && decadeAgoTemperature !== null
      ? latestTemperature - decadeAgoTemperature
      : null;
  const decadeChangePercent =
    decadeChange !== null && decadeAgoTemperature
      ? (decadeChange / decadeAgoTemperature) * 100
      : null;

  const decadeSeries = useMemo(
    () => processTimeSeriesForChart(temperatureData.slice(-120), 'Global Temperature Anomaly', '#38bdf8'),
    [temperatureData]
  );

  const topHotspot = useMemo(() => {
    if (!primaryEnvLayer) return null;
    return primaryEnvLayer.points.reduce((prev, current) => (current.value > prev.value ? current : prev));
  }, [primaryEnvLayer]);

  const handleExport = (format: 'csv' | 'json' | 'pdf') => {
    if (format === 'csv' || format === 'json') {
      const report = generateReport({ co2Data, temperatureData, arcticData: [] });
      if (format === 'csv') {
        exportToCSV([report], 'climate_report.csv');
      } else {
        exportToJSON([report], 'climate_report.json');
      }
    } else if (format === 'pdf') {
      exportToPDF('dashboard-content', 'climate_report.pdf');
    }
  };

  return (
    <div id="dashboard-content" className="relative h-screen w-full overflow-hidden bg-[#020816] text-slate-50">
      <ClimateMap
        center={mapCenter}
        zoom={3}
        onLocationSelect={handleLocationSelect}
        markers={mapMarkers}
        baseLayer={activeBaseLayer}
        overlayTiles={overlayTiles}
      />

      {loading && (
        <div className="pointer-events-auto absolute inset-0 z-30 flex items-center justify-center bg-[#020816]/85">
          <div className="text-center space-y-4 text-slate-300">
            <div className="mx-auto h-14 w-14 animate-spin rounded-full border-[3px] border-sky-400/30 border-t-sky-400"></div>
            <div>
              <p className="text-lg font-medium uppercase tracking-[0.35em] text-sky-300">Factory Droid</p>
              <p className="text-sm text-slate-400">Synchronizing orbital feeds & telemetry…</p>
            </div>
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 flex flex-col">
        <header className="pointer-events-auto flex flex-wrap items-start justify-between gap-3 px-4 py-4 md:px-6 md:py-5">
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.4em] text-sky-300/80 md:text-xs">Factory Droid</p>
            <h1 className="text-xl font-semibold text-slate-50 drop-shadow-md md:text-3xl lg:text-4xl">
              Global Climate Operations Console
            </h1>
            <p className="max-w-xl text-xs text-slate-300/80 md:text-sm lg:text-base hidden sm:block">
              Live satellite imagery layered with atmospheric chemistry, deforestation intelligence, severe weather, and disaster telemetry. Tap anywhere to retask the monitoring node.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1 rounded-full border border-white/10 bg-slate-900/50 px-2 py-1 backdrop-blur-md md:gap-2 md:px-3 md:py-1.5">
              {baseLayers.map((layer) => (
                <button
                  key={layer.id}
                  onClick={() => setActiveBaseLayerId(layer.id)}
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide transition-all md:px-4 md:py-1 md:text-xs ${
                    activeBaseLayerId === layer.id
                      ? 'bg-sky-400/25 text-sky-100 shadow-[0_8px_30px_rgba(56,189,248,0.35)]'
                      : 'text-slate-300 hover:text-slate-100'
                  }`}
                >
                  {layer.name}
                </button>
              ))}
            </div>
            <ExportButton onExport={handleExport} disabled={loading} />
            <ShareButton elementId="dashboard-content" title="Factory Droid Climate Feed" />
          </div>
        </header>

        <div className="pointer-events-none flex flex-1 items-start justify-between px-6 pb-16">
          <aside className="pointer-events-auto mt-24 hidden max-h-[calc(100vh-12rem)] w-80 flex-col gap-4 overflow-y-auto pr-2 lg:flex">
            <section className="rounded-3xl border border-white/10 bg-slate-900/55 p-5 backdrop-blur-xl">
              <h2 className="text-sm font-semibold text-slate-100">Environmental Layers</h2>
              <p className="mt-1 text-xs text-slate-400">CO₂, tree cover, and thermal anomalies sourced from NASA & NOAA feeds.</p>
              <div className="mt-4 space-y-2">
                {environmentalLayers.map((layer) => {
                  const isActive = activeEnvLayerIds.includes(layer.id);
                  return (
                    <button
                      key={layer.id}
                      onClick={() => toggleEnvLayer(layer.id)}
                      className={`flex w-full flex-col rounded-2xl border px-4 py-3 text-left transition-all ${
                        isActive
                          ? 'border-sky-400/70 bg-sky-400/15 text-sky-100 shadow-[0_15px_35px_-20px_rgba(56,189,248,0.7)]'
                          : 'border-white/10 bg-slate-950/40 hover:border-slate-400/40'
                      }`}
                    >
                      <span className="text-sm font-semibold">{layer.name}</span>
                      <span className="text-xs text-slate-400">{layer.metric}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-slate-900/55 p-5 backdrop-blur-xl">
              <h2 className="text-sm font-semibold text-slate-100">Weather Systems</h2>
              <p className="mt-1 text-xs text-slate-400">Storms, precipitation, winds, and thermal extremes updated hourly.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {weatherLayers.map((layer) => (
                  <button
                    key={layer.id}
                    onClick={() => toggleWeatherLayer(layer.id)}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition-all ${
                      activeWeatherLayers.includes(layer.id)
                        ? 'border-sky-300 bg-sky-300/20 text-sky-100'
                        : 'border-white/10 bg-slate-950/40 text-slate-300 hover:border-slate-300/30'
                    }`}
                  >
                    {layer.name}
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-slate-900/55 p-5 backdrop-blur-xl">
              <h2 className="text-sm font-semibold text-slate-100">Disaster Tracking</h2>
              <p className="mt-1 text-xs text-slate-400">Wildfires, floods, and volcanic SO₂ plumes from global alert grids.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {disasterLayers.map((layer) => (
                  <button
                    key={layer.id}
                    onClick={() => toggleDisasterLayer(layer.id)}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition-all ${
                      activeDisasterLayers.includes(layer.id)
                        ? 'border-rose-300 bg-rose-300/20 text-rose-100'
                        : 'border-white/10 bg-slate-950/40 text-slate-300 hover:border-rose-200/25'
                    }`}
                  >
                    {layer.name}
                  </button>
                ))}
              </div>
            </section>

          </aside>

          <div className="flex-1 pointer-events-none" />

          <aside className="pointer-events-auto mt-24 hidden max-h-[calc(100vh-12rem)] w-80 flex-col gap-4 overflow-y-auto pl-2 lg:flex">
            <section className="rounded-3xl border border-white/10 bg-slate-900/55 p-5 backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Selected Coordinates</p>
              <p className="mt-3 text-2xl font-semibold text-slate-100">
                {selectedLocation.lat >= 0
                  ? `${selectedLocation.lat.toFixed(2)}°N`
                  : `${Math.abs(selectedLocation.lat).toFixed(2)}°S`}{' '}/{' '}
                {selectedLocation.lng >= 0
                  ? `${selectedLocation.lng.toFixed(2)}°E`
                  : `${Math.abs(selectedLocation.lng).toFixed(2)}°W`}
              </p>
              <dl className="mt-4 grid grid-cols-3 gap-2 text-xs text-slate-400">
                <div>
                  <dt className="uppercase tracking-wide">Temp</dt>
                  <dd className="text-base text-slate-100">
                    {weatherData ? `${formatNumber(weatherData.temperature, 1)}°C` : '—'}
                  </dd>
                </div>
                <div>
                  <dt className="uppercase tracking-wide">Humidity</dt>
                  <dd className="text-base text-slate-100">
                    {weatherData ? `${Math.round(weatherData.humidity)}%` : '—'}
                  </dd>
                </div>
                <div>
                  <dt className="uppercase tracking-wide">Wind</dt>
                  <dd className="text-base text-slate-100">
                    {weatherData ? `${formatNumber(weatherData.windSpeed, 1)} m/s` : '—'}
                  </dd>
                </div>
              </dl>
            </section>

            <section className="rounded-3xl border border-white/10 bg-slate-900/55 p-5 backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Air Quality Index</p>
              <p className="mt-3 text-3xl font-semibold text-slate-100">{airQuality ? airQuality.aqi : '—'}</p>
              <p className="text-sm text-slate-300/80">{aqiCategory?.label ?? 'Awaiting readings'}</p>
              <p className="mt-4 text-xs text-slate-400 leading-relaxed">
                {aqiCategory?.description ?? 'Tap anywhere on the map to refresh localized AQ telemetry.'}
              </p>
            </section>

            <section className="rounded-3xl border border-white/10 bg-slate-900/55 p-5 backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{primaryEnvLayer?.metric}</p>
              <p className="mt-3 text-3xl font-semibold text-slate-100">
                {topHotspot ? `${topHotspot.value.toLocaleString()} ${topHotspot.unit}` : '—'}
              </p>
              <p className="text-sm text-slate-300/80">Peak hotspot: {topHotspot?.name ?? '—'}</p>
              {typeof topHotspot?.change === 'number' && (
                <p className={`mt-2 text-xs font-semibold ${topHotspot.change >= 0 ? 'text-orange-300' : 'text-emerald-300'}`}>
                  {topHotspot.change >= 0 ? '+' : ''}
                  {topHotspot.change}% annual shift
                </p>
              )}
            </section>

            <section className="rounded-3xl border border-white/10 bg-slate-900/55 p-5 backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">10-Year Temperature History</p>
              <p className="mt-3 text-3xl font-semibold text-slate-100">
                {latestTemperature !== null ? `${formatNumber(latestTemperature, 2)}°C` : '—'}
              </p>
              <p
                className={`text-sm ${
                  decadeChange !== null ? (decadeChange >= 0 ? 'text-orange-300' : 'text-emerald-300') : 'text-slate-300/80'
                }`}
              >
                {decadeChange !== null && decadeChangePercent !== null
                  ? `${decadeChange >= 0 ? '+' : ''}${formatNumber(decadeChange, 2)}°C | ${decadeChange >= 0 ? '+' : ''}${formatNumber(decadeChangePercent, 1)}% vs 2014`
                  : 'Insufficient data range'}
              </p>
            </section>
          </aside>
        </div>

        {!loading && (
          <div className="pointer-events-auto fixed inset-x-0 bottom-6 z-30 hidden px-6 lg:block">
            <div className="mx-auto w-full max-w-5xl">
              <div className="grid gap-4">
                <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl shadow-[0_30px_80px_-40px_rgba(56,189,248,0.6)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-100">Global Temperature Trajectory</h2>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Monthly anomalies • last decade</p>
                    </div>
                    <span className="rounded-full border border-sky-400/40 bg-sky-400/10 px-3 py-1 text-xs text-sky-100">
                      Live feed
                    </span>
                  </div>
                  <div className="mt-4">
                    <LineChart data={decadeSeries} yAxisLabel="°C anomaly" height={240} />
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="pointer-events-auto fixed top-20 right-4 z-40 rounded-full border border-white/10 bg-slate-900/90 p-3 backdrop-blur-md shadow-lg transition-all hover:bg-slate-800/90 lg:hidden"
          aria-label="Toggle menu"
        >
          <svg
            className="h-6 w-6 text-slate-100"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {showMobileMenu ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Mobile Menu Popup */}
        {showMobileMenu && (
          <div className="pointer-events-auto fixed inset-0 z-30 bg-slate-950/95 backdrop-blur-sm lg:hidden" onClick={() => setShowMobileMenu(false)}>
            <div 
              className="absolute inset-x-3 top-28 bottom-20 overflow-y-auto rounded-3xl border border-white/10 bg-slate-900/95 p-4 backdrop-blur-xl shadow-[0_25px_80px_-40px_rgba(56,189,248,0.6)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.34em] text-slate-400">Environmental</p>
                  <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                    {environmentalLayers.map((layer) => {
                      const isActive = activeEnvLayerIds.includes(layer.id);
                      return (
                        <button
                          key={layer.id}
                          onClick={() => toggleEnvLayer(layer.id)}
                          className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide transition-all ${
                            isActive
                              ? 'border border-sky-400/60 bg-sky-400/20 text-sky-100'
                              : 'border border-white/10 bg-slate-950/40 text-slate-300'
                          }`}
                        >
                          {layer.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.34em] text-slate-400">Weather & Disasters</p>
                  <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                    {weatherLayers.map((layer) => (
                      <button
                        key={layer.id}
                        onClick={() => toggleWeatherLayer(layer.id)}
                        className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition-all ${
                          activeWeatherLayers.includes(layer.id)
                            ? 'border-sky-300 bg-sky-300/20 text-sky-100'
                            : 'border-white/10 bg-slate-950/40 text-slate-300'
                        }`}
                      >
                        {layer.name}
                      </button>
                    ))}
                    {disasterLayers.map((layer) => (
                      <button
                        key={layer.id}
                        onClick={() => toggleDisasterLayer(layer.id)}
                        className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition-all ${
                          activeDisasterLayers.includes(layer.id)
                            ? 'border-rose-300 bg-rose-300/20 text-rose-100'
                            : 'border-white/10 bg-slate-950/40 text-slate-300'
                        }`}
                      >
                        {layer.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Always Visible: Coordinate Info */}
        <div className="pointer-events-auto fixed inset-x-3 bottom-3 z-30 lg:hidden">
          <section className="rounded-2xl border border-white/10 bg-slate-900/90 p-4 backdrop-blur-xl shadow-lg">
            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">Selected Coordinates</p>
            <p className="mt-2 text-lg font-semibold text-slate-100">
              {selectedLocation.lat >= 0
                ? `${selectedLocation.lat.toFixed(2)}°N`
                : `${Math.abs(selectedLocation.lat).toFixed(2)}°S`}{' '}/{' '}
              {selectedLocation.lng >= 0
                ? `${selectedLocation.lng.toFixed(2)}°E`
                : `${Math.abs(selectedLocation.lng).toFixed(2)}°W`}
            </p>
            <dl className="mt-3 grid grid-cols-3 gap-2 text-[10px] text-slate-400">
              <div>
                <dt className="uppercase tracking-wide">Temp</dt>
                <dd className="text-sm text-slate-100">
                  {weatherData ? `${formatNumber(weatherData.temperature, 1)}°C` : '—'}
                </dd>
              </div>
              <div>
                <dt className="uppercase tracking-wide">Humidity</dt>
                <dd className="text-sm text-slate-100">
                  {weatherData ? `${Math.round(weatherData.humidity)}%` : '—'}
                </dd>
              </div>
              <div>
                <dt className="uppercase tracking-wide">Wind</dt>
                <dd className="text-sm text-slate-100">
                  {weatherData ? `${formatNumber(weatherData.windSpeed, 1)} m/s` : '—'}
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}
