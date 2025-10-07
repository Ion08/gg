export interface MapLayerPoint {
  id: string;
  name: string;
  coordinates: [number, number];
  value: number;
  unit: string;
  change?: number;
  narrative?: string;
  severity?: 'low' | 'moderate' | 'high' | 'extreme';
}

export interface MapLayer {
  id: string;
  name: string;
  metric: string;
  unit: string;
  color: string;
  description: string;
  points: MapLayerPoint[];
  tileUrl?: string;
  tileAttribution?: string;
  tileOpacity?: number;
}

export interface TileLayerConfig {
  id: string;
  name: string;
  urlTemplate: string;
  attribution: string;
  options?: {
    maxZoom?: number;
    minZoom?: number;
    subdomains?: string[];
  };
  opacity?: number;
}

export const baseLayers: TileLayerConfig[] = [
  {
    id: 'live-satellite',
    name: 'Live Satellite',
    urlTemplate:
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution:
      'Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community',
    options: {
      maxZoom: 19,
    },
  },
  {
    id: 'night-interface',
    name: 'Night Interface',
    urlTemplate: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    options: {
      subdomains: ['a', 'b', 'c', 'd'],
      maxZoom: 19,
    },
  },
  {
    id: 'terrain-observatory',
    name: 'Terrain Observatory',
    urlTemplate: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, SRTM | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
    options: {
      subdomains: ['a', 'b', 'c'],
      maxZoom: 17,
    },
  },
];

export const environmentalLayers: MapLayer[] = [
  {
    id: 'co2',
    name: 'CO₂ Concentration',
    metric: 'Atmospheric CO₂ hotspot',
    unit: 'ppm',
    color: '#f97316',
    description:
      'Satellite-derived CO₂ concentrations highlighting fossil fuel and industrial emission hubs.',
    points: [
      {
        id: 'shanghai-co2',
        name: 'Yangtze River Delta, China',
        coordinates: [31.2304, 121.4737],
        value: 426,
        unit: 'ppm',
        change: 2.1,
        narrative: 'Dense industrial corridor with rapid urban expansion.',
      },
      {
        id: 'losangeles-co2',
        name: 'Los Angeles Basin, USA',
        coordinates: [34.0522, -118.2437],
        value: 421,
        unit: 'ppm',
        change: 1.3,
        narrative: 'Transport emissions trapped by basin topography.',
      },
      {
        id: 'saopaulo-co2',
        name: 'São Paulo, Brazil',
        coordinates: [-23.5505, -46.6333],
        value: 417,
        unit: 'ppm',
        change: 1.0,
        narrative: 'High population density with mixed industrial sources.',
      },
      {
        id: 'rotterdam-co2',
        name: 'Rotterdam Port, Netherlands',
        coordinates: [51.9244, 4.4777],
        value: 418,
        unit: 'ppm',
        change: 1.5,
        narrative: 'Europe’s largest port and energy-processing hub.',
      },
      {
        id: 'riyadh-co2',
        name: 'Riyadh, Saudi Arabia',
        coordinates: [24.7136, 46.6753],
        value: 424,
        unit: 'ppm',
        change: 2.4,
        narrative: 'Oil and gas operations with rapid urban build-out.',
      },
    ],
  },
  {
    id: 'deforestation',
    name: 'Tree Cover Loss',
    metric: 'Annual forest loss intensity',
    unit: 'kha',
    color: '#22c55e',
    description:
      'Areas experiencing rapid primary forest loss based on Global Forest Watch composites.',
    points: [
      {
        id: 'amazon-deforestation',
        name: 'Amazon Basin, Brazil',
        coordinates: [-5.1633, -60.0241],
        value: 1320,
        unit: 'kha',
        change: -8.2,
        narrative: 'Agricultural expansion and infrastructure corridors.',
      },
      {
        id: 'bornean-deforestation',
        name: 'Central Kalimantan, Indonesia',
        coordinates: [-1.6815, 113.3824],
        value: 780,
        unit: 'kha',
        change: -5.6,
        narrative: 'Palm oil concessions and peatland draining.',
      },
      {
        id: 'congo-deforestation',
        name: 'Ituri, DRC',
        coordinates: [1.5675, 28.6993],
        value: 510,
        unit: 'kha',
        change: -3.4,
        narrative: 'Artisanal logging alongside shifting cultivation.',
      },
      {
        id: 'cerrado-deforestation',
        name: 'Cerrado, Brazil',
        coordinates: [-13.004, -48.0306],
        value: 670,
        unit: 'kha',
        change: -4.1,
        narrative: 'Soy and cattle-driven vegetation conversion.',
      },
      {
        id: 'madagascar-deforestation',
        name: 'Eastern Madagascar',
        coordinates: [-19.0154, 46.7386],
        value: 230,
        unit: 'kha',
        change: -2.9,
        narrative: 'Smallholder clearing and charcoal production.',
      },
    ],
  },
  {
    id: 'temperature',
    name: 'Surface Temperature Anomaly',
    metric: 'Temperature anomaly versus 20th century baseline',
    unit: '°C',
    color: '#38bdf8',
    description:
      'Reanalysis temperature anomalies emphasising rapid warming regions.',
    points: [
      {
        id: 'arctic-temperature',
        name: 'Svalbard, Arctic Ocean',
        coordinates: [78.2232, 15.6469],
        value: 3.8,
        unit: '°C',
        change: 1.4,
        narrative: 'Polar amplification accelerating local warming.',
      },
      {
        id: 'siberia-temperature',
        name: 'Yakutsk, Siberia',
        coordinates: [62.0355, 129.6755],
        value: 2.9,
        unit: '°C',
        change: 1.1,
        narrative: 'Permafrost thaw triggering regional feedback loops.',
      },
      {
        id: 'mediterranean-temperature',
        name: 'Athens, Greece',
        coordinates: [37.9838, 23.7275],
        value: 1.7,
        unit: '°C',
        change: 0.8,
        narrative: 'Urban heat island compounding marine heatwaves.',
      },
      {
        id: 'middleeast-temperature',
        name: 'Kuwait City, Kuwait',
        coordinates: [29.3759, 47.9774],
        value: 2.3,
        unit: '°C',
        change: 1.0,
        narrative: 'Extreme heat events increasing in frequency and duration.',
      },
      {
        id: 'australia-temperature',
        name: 'Western Sydney, Australia',
        coordinates: [-33.8688, 150.2093],
        value: 1.6,
        unit: '°C',
        change: 0.9,
        narrative: 'Compounded by drought and landscape change.',
      },
    ],
  },
  {
    id: 'cryosphere',
    name: 'Arctic Cryosphere Pulse',
    metric: 'Sea ice concentration anomaly',
    unit: 'M km²',
    color: '#a855f7',
    description:
      'Polar sea ice health derived from passive microwave measurements and reanalysis composites.',
    points: [
      {
        id: 'beaufort-cryosphere',
        name: 'Beaufort Gyre',
        coordinates: [74.5, -150.0],
        value: 4.6,
        unit: 'M km²',
        change: -12.5,
        narrative: 'Persistent negative anomaly exposing open water pockets across the western Arctic Ocean.',
        severity: 'high',
      },
      {
        id: 'svalbard-cryosphere',
        name: 'Fram Strait & Svalbard',
        coordinates: [79.0, 5.0],
        value: 1.3,
        unit: 'M km²',
        change: -18.2,
        narrative: 'Atlantification accelerates melt export through the primary Arctic gateway.',
        severity: 'extreme',
      },
      {
        id: 'laptev-cryosphere',
        name: 'Laptev Sea',
        coordinates: [76.5, 125.0],
        value: 2.1,
        unit: 'M km²',
        change: -15.4,
        narrative: 'Record-low early season refreeze following marine heatwave conditions.',
        severity: 'extreme',
      },
      {
        id: 'greenland-cryosphere',
        name: 'Greenland Sea',
        coordinates: [72.0, -20.0],
        value: 1.9,
        unit: 'M km²',
        change: -9.7,
        narrative: 'Enhanced cyclonic mixing redistributes multi-year ice into the North Atlantic.',
        severity: 'moderate',
      },
      {
        id: 'chukchi-cryosphere',
        name: 'Chukchi Shelf',
        coordinates: [70.5, -165.0],
        value: 1.5,
        unit: 'M km²',
        change: -13.6,
        narrative: 'Delayed autumn freeze keeps coastal waters navigable well into polar night.',
        severity: 'high',
      },
    ],
  },
];

export const weatherLayers: MapLayer[] = [
  {
    id: 'storms',
    name: 'Storm Systems',
    metric: 'Cyclone intensity',
    unit: 'kt',
    color: '#fb7185',
    description: 'Active tropical cyclones tracked via NOAA and JTWC bulletins.',
    points: [
      {
        id: 'cyclone-lorna',
        name: 'Cyclone Lorna',
        coordinates: [-12.2, 72.4],
        value: 115,
        unit: 'kt',
        change: 8.5,
        narrative: 'Peak winds 213 km/h with defined eyewall.',
        severity: 'extreme',
      },
      {
        id: 'typhoon-kusanagi',
        name: 'Typhoon Kusanagi',
        coordinates: [20.7, 132.1],
        value: 95,
        unit: 'kt',
        change: 6.1,
        narrative: 'Rapid intensification over warm Kuroshio waters.',
        severity: 'high',
      },
      {
        id: 'hurricane-amber',
        name: 'Hurricane Amber',
        coordinates: [18.4, -59.2],
        value: 105,
        unit: 'kt',
        change: 4.2,
        narrative: 'Category 3 system angling towards the Lesser Antilles.',
        severity: 'high',
      },
    ],
    tileUrl: 'https://tilecache.rainviewer.com/v2/sat/now/256/{z}/{x}/{y}/2/1_1.png',
    tileAttribution: 'Satellite mosaics © RainViewer',
    tileOpacity: 0.45,
  },
  {
    id: 'precipitation',
    name: 'Global Precipitation',
    metric: 'Rainfall intensity',
    unit: 'mm/h',
    color: '#38bdf8',
    description: 'Radar composites tracking convective rain and frontal systems.',
    points: [
      {
        id: 'amazon-precip',
        name: 'Manaus Mesoscale Complex',
        coordinates: [-3.1, -60.0],
        value: 28,
        unit: 'mm/h',
        change: 3.2,
        narrative: 'Deep convection triggered along moisture convergence line.',
        severity: 'moderate',
      },
      {
        id: 'bangladesh-precip',
        name: 'Bay of Bengal Monsoon Surge',
        coordinates: [20.4, 90.2],
        value: 42,
        unit: 'mm/h',
        change: 4.5,
        narrative: 'Monsoon trough anchored near Chattogram producing sustained rain bands.',
        severity: 'high',
      },
      {
        id: 'uk-precip',
        name: 'Atlantic Frontal Rain Shield',
        coordinates: [54.3, -4.8],
        value: 18,
        unit: 'mm/h',
        change: 1.8,
        narrative: 'Moist conveyor belt streaming into western Europe.',
        severity: 'moderate',
      },
    ],
    tileUrl: 'https://tilecache.rainviewer.com/v2/radar/now/256/{z}/{x}/{y}/2/1_1.png',
    tileAttribution: 'Radar data © RainViewer',
    tileOpacity: 0.55,
  },
  {
    id: 'wind',
    name: 'Wind Fields',
    metric: 'Surface gusts',
    unit: 'km/h',
    color: '#f97316',
    description: 'High wind alerts drawn from NOAA GFS gust forecasts.',
    points: [
      {
        id: 'patagonia-wind',
        name: 'Patagonian Jet Burst',
        coordinates: [-50.2, -72.1],
        value: 118,
        unit: 'km/h',
        change: 5.2,
        narrative: 'Channeled westerlies accelerating along the Andes barrier.',
        severity: 'high',
      },
      {
        id: 'iceland-wind',
        name: 'Icelandic Low',
        coordinates: [63.9, -21.0],
        value: 96,
        unit: 'km/h',
        change: 3.4,
        narrative: 'Explosive cyclogenesis driving onshore gales.',
        severity: 'moderate',
      },
      {
        id: 'southchina-wind',
        name: 'South China Sea Jet',
        coordinates: [15.2, 114.3],
        value: 102,
        unit: 'km/h',
        change: 4.8,
        narrative: 'Enhanced monsoonal flow feeding typhoon circulation.',
        severity: 'high',
      },
    ],
  },
  {
    id: 'thermal',
    name: 'Thermal Extremes',
    metric: 'Surface temperature',
    unit: '°C',
    color: '#facc15',
    description: 'Synoptic heat pockets and cold outbreaks from ECMWF reanalysis.',
    points: [
      {
        id: 'deathvalley-thermal',
        name: 'Death Valley Heat Dome',
        coordinates: [36.5, -116.9],
        value: 51.4,
        unit: '°C',
        change: 1.6,
        narrative: 'Persistent ridge maintaining extreme desert heat.',
        severity: 'extreme',
      },
      {
        id: 'spain-thermal',
        name: 'Iberian Heat Pulse',
        coordinates: [40.4, -3.7],
        value: 44.1,
        unit: '°C',
        change: 1.2,
        narrative: 'Saharan air mass advecting into central Spain.',
        severity: 'high',
      },
      {
        id: 'mongolia-thermal',
        name: 'Mongolian Cold Core',
        coordinates: [47.9, 106.9],
        value: -28.7,
        unit: '°C',
        change: -2.1,
        narrative: 'Siberian high driving intense radiative cooling.',
        severity: 'high',
      },
    ],
  },
];

export const disasterLayers: MapLayer[] = [
  {
    id: 'wildfires',
    name: 'Wildfire Hotspots',
    metric: 'Thermal anomaly power',
    unit: 'MW',
    color: '#f97316',
    description: 'FIRMS thermal hotspots indicating active wildfires.',
    points: [
      {
        id: 'california-wildfire',
        name: 'Sierra Crest Fire Complex',
        coordinates: [38.1, -120.3],
        value: 1320,
        unit: 'MW',
        change: 18.4,
        narrative: 'Crown fire behavior driven by extreme VPD.',
        severity: 'extreme',
      },
      {
        id: 'australia-wildfire',
        name: 'Great Dividing Range Ignitions',
        coordinates: [-33.8, 151.8],
        value: 860,
        unit: 'MW',
        change: 12.6,
        narrative: 'Multiple lightning sparked fires merging downslope.',
        severity: 'high',
      },
      {
        id: 'canada-wildfire',
        name: 'Boreal Fire Cluster',
        coordinates: [55.4, -112.5],
        value: 670,
        unit: 'MW',
        change: 9.3,
        narrative: 'Peatland burning with persistent smoke plume.',
        severity: 'high',
      },
    ],
  },
  {
    id: 'floods',
    name: 'Rapid Flooding',
    metric: 'River discharge anomaly',
    unit: '%',
    color: '#38bdf8',
    description: 'Hydrological alerts from Global Flood Monitoring System.',
    points: [
      {
        id: 'india-flood',
        name: 'Brahmaputra Flood Wave',
        coordinates: [26.2, 92.0],
        value: 265,
        unit: '%',
        change: 22.4,
        narrative: 'River crest 2.4m above danger level near Guwahati.',
        severity: 'extreme',
      },
      {
        id: 'italy-flood',
        name: 'Po Valley Inundation',
        coordinates: [45.0, 9.7],
        value: 187,
        unit: '%',
        change: 14.8,
        narrative: 'Slow-moving frontal rains saturating lowlands.',
        severity: 'high',
      },
      {
        id: 'kenya-flood',
        name: 'Lake Victoria Basin Flash Floods',
        coordinates: [-0.4, 34.8],
        value: 142,
        unit: '%',
        change: 11.2,
        narrative: 'Intense afternoon convection overwhelming drainage.',
        severity: 'moderate',
      },
    ],
  },
  {
    id: 'volcanic',
    name: 'Volcanic Activity',
    metric: 'SO₂ mass loading',
    unit: 'kt',
    color: '#a855f7',
    description: 'TROPOMI sulfur dioxide plumes indicating eruption columns.',
    points: [
      {
        id: 'etna-volcano',
        name: 'Mt. Etna, Italy',
        coordinates: [37.751, 14.993],
        value: 0.42,
        unit: 'kt',
        change: 0.08,
        narrative: 'Frequent strombolian bursts with ash to 5 km.',
        severity: 'moderate',
      },
      {
        id: 'kamchatka-volcano',
        name: 'Sheveluch, Russia',
        coordinates: [56.653, 161.36],
        value: 0.87,
        unit: 'kt',
        change: 0.22,
        narrative: 'Explosive plume drifting across Bering Sea air lanes.',
        severity: 'high',
      },
      {
        id: 'andes-volcano',
        name: 'Sabancaya, Peru',
        coordinates: [-15.78, -71.85],
        value: 0.31,
        unit: 'kt',
        change: 0.06,
        narrative: 'Daily ash pulses sustained above 4 km.',
        severity: 'moderate',
      },
    ],
  },
];

export function getEnvironmentalLayerById(id: string): MapLayer | undefined {
  return environmentalLayers.find((layer) => layer.id === id);
}

export const defaultBaseLayerId = 'live-satellite';
export const defaultEnvironmentalLayerId = 'co2';
