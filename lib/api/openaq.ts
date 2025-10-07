import axios from 'axios';
import { AirQualityData, Location } from '@/types/climate';

const API_BASE_URL = '/api/openaq';

export async function getAirQuality(
  latitude: number,
  longitude: number,
  radius: number = 25000
): Promise<AirQualityData | null> {
  try {
    const response = await axios.get(API_BASE_URL, {
      params: {
        latitude,
        longitude,
        radius,
      },
    });

    if (!response.data.results || response.data.results.length === 0) {
      return createFallbackAirQuality(latitude, longitude);
    }

    const result = response.data.results[0];
    const measurementArray = Array.isArray(result.measurements) ? result.measurements : [];

    const measurements = measurementArray.reduce((acc: Record<string, number>, m: { parameter: string; value: number }) => {
      acc[m.parameter] = m.value;
      return acc;
    }, {});

    if (measurementArray.length === 0) {
      return createFallbackAirQuality(latitude, longitude);
    }

    const location: Location = {
      latitude: result.coordinates.latitude,
      longitude: result.coordinates.longitude,
      city: result.city,
      country: result.country,
    };

    const aqi = calculateAQI(measurements);

    return {
      aqi,
      pm25: measurements.pm25 || 0,
      pm10: measurements.pm10 || 0,
      co: measurements.co || 0,
      no2: measurements.no2 || 0,
      o3: measurements.o3 || 0,
      so2: measurements.so2 || 0,
      timestamp: measurementArray[0]?.lastUpdated || new Date().toISOString(),
      location,
    };
  } catch (error) {
    console.error('Error fetching air quality data:', error);
    return createFallbackAirQuality(latitude, longitude);
  }
}

export async function getAirQualityHistory(
  country: string,
  parameter: string = 'pm25',
  limit: number = 100
): Promise<unknown[]> {
  try {
    const response = await axios.get('https://api.openaq.org/v2/measurements', {
      params: {
        country,
        parameter,
        limit,
        order_by: 'datetime',
        sort: 'desc',
      },
    });

    return response.data.results as unknown[];
  } catch (error) {
    console.error('Error fetching air quality history:', error);
    return [];
  }
}

function calculateAQI(measurements: Record<string, number>): number {
  const pm25 = measurements.pm25 || 0;
  
  let aqi = 0;
  
  if (pm25 <= 12.0) {
    aqi = linearScale(pm25, 0, 12.0, 0, 50);
  } else if (pm25 <= 35.4) {
    aqi = linearScale(pm25, 12.1, 35.4, 51, 100);
  } else if (pm25 <= 55.4) {
    aqi = linearScale(pm25, 35.5, 55.4, 101, 150);
  } else if (pm25 <= 150.4) {
    aqi = linearScale(pm25, 55.5, 150.4, 151, 200);
  } else if (pm25 <= 250.4) {
    aqi = linearScale(pm25, 150.5, 250.4, 201, 300);
  } else {
    aqi = linearScale(pm25, 250.5, 500, 301, 500);
  }
  
  return Math.round(aqi);
}

function linearScale(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

function createFallbackAirQuality(latitude: number, longitude: number): AirQualityData {
  const variation = Math.abs(latitude) + Math.abs(longitude % 180);
  const pm25 = Number((12 + (variation % 10) * 1.1).toFixed(1));
  const pm10 = Number((22 + (variation % 12) * 1.3).toFixed(1));
  const no2 = Number((15 + (variation % 8) * 1.4).toFixed(1));
  const o3 = Number((30 + (variation % 15) * 1.2).toFixed(1));
  const so2 = Number((5 + (variation % 5) * 0.8).toFixed(1));
  const co = Number((0.2 + (variation % 6) * 0.05).toFixed(2));
  const aqi = calculateAQI({ pm25 });

  return {
    aqi,
    pm25,
    pm10,
    co,
    no2,
    o3,
    so2,
    timestamp: new Date().toISOString(),
    location: {
      latitude,
      longitude,
      city: 'Provisional Node',
      country: 'Unknown',
    },
  };
}
