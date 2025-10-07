export interface ClimateData {
  id: string;
  timestamp: string;
  location: Location;
  metrics: ClimateMetrics;
}

export interface Location {
  latitude: number;
  longitude: number;
  country?: string;
  city?: string;
  region?: string;
}

export interface ClimateMetrics {
  temperature?: number;
  co2?: number;
  airQualityIndex?: number;
  deforestation?: number;
  seaLevel?: number;
  renewableEnergy?: number;
}

export interface TimeSeriesData {
  date: string;
  value: number;
}

export interface ChartData {
  labels: string[];
  datasets: Dataset[];
}

export interface Dataset {
  label: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string;
  fill?: boolean;
}

export interface RegionFilter {
  continent?: string;
  country?: string;
  city?: string;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  timestamp: string;
}

export interface AirQualityData {
  aqi: number;
  pm25: number;
  pm10: number;
  co: number;
  no2: number;
  o3: number;
  so2: number;
  timestamp: string;
  location: Location;
}

export interface EmissionsData {
  co2: number;
  ch4: number;
  n2o: number;
  country: string;
  year: number;
}

export interface PredictionData {
  predicted: number[];
  confidence: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}
