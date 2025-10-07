import axios from 'axios';
import { WeatherData, TimeSeriesData } from '@/types/climate';

const API_BASE_URL = '/api/weather';

export async function getCurrentWeather(
  latitude: number,
  longitude: number
): Promise<WeatherData> {
  try {
    const response = await axios.get(API_BASE_URL, {
      params: {
        latitude,
        longitude,
        type: 'current',
      },
    });

    const { current } = response.data;
    return {
      temperature: current.temperature_2m,
      humidity: current.relative_humidity_2m,
      windSpeed: current.wind_speed_10m,
      timestamp: current.time,
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return {
      temperature: 13.5,
      humidity: 68,
      windSpeed: 4.1,
      timestamp: new Date().toISOString(),
    };
  }
}

export async function getHistoricalTemperature(
  latitude: number,
  longitude: number,
  startDate: string,
  endDate: string
): Promise<TimeSeriesData[]> {
  try {
    const response = await axios.get(API_BASE_URL, {
      params: {
        latitude,
        longitude,
        type: 'historical',
        start_date: startDate,
        end_date: endDate,
      },
    });

    const { daily } = response.data;
    return daily.time.map((date: string, index: number) => ({
      date,
      value: daily.temperature_2m_mean[index],
    }));
  } catch (error) {
    console.error('Error fetching historical temperature:', error);
    return [];
  }
}

export async function getClimateProjections(
  latitude: number,
  longitude: number
): Promise<TimeSeriesData[]> {
  try {
    const response = await axios.get('https://api.open-meteo.com/v1/climate', {
      params: {
        latitude,
        longitude,
        start_date: '2024-01-01',
        end_date: '2050-12-31',
        models: 'EC_Earth3P_HR',
        daily: 'temperature_2m_mean',
      },
    });

    const { daily } = response.data;
    return daily.time.map((date: string, index: number) => ({
      date,
      value: daily.temperature_2m_mean[index],
    }));
  } catch (error) {
    console.error('Error fetching climate projections:', error);
    throw error;
  }
}
