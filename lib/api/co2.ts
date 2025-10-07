import axios from 'axios';
import { TimeSeriesData } from '@/types/climate';

const API_BASE_URL = '/api/co2';

export async function getGlobalCO2Data(): Promise<TimeSeriesData[]> {
  try {
    const response = await axios.get(API_BASE_URL, {
      params: { type: 'co2' },
    });

    return response.data.co2.slice(-365).map((item: { year: string; month: string; day: string; trend: string }) => ({
      date: `${item.year}-${item.month.toString().padStart(2, '0')}-${item.day.toString().padStart(2, '0')}`,
      value: parseFloat(item.trend),
    }));
  } catch (error) {
    console.error('Error fetching CO2 data:', error);
    return [];
  }
}

export async function getGlobalTemperatureData(): Promise<TimeSeriesData[]> {
  try {
    const response = await axios.get(API_BASE_URL, {
      params: { type: 'temperature' },
    });

    return response.data.result.slice(-120).map((item: { time: string; station: string }) => ({
      date: item.time,
      value: parseFloat(item.station),
    }));
  } catch (error) {
    console.error('Error fetching temperature data:', error);
    return [];
  }
}

export async function getArcticIceData(): Promise<TimeSeriesData[]> {
  try {
    const response = await axios.get(API_BASE_URL, {
      params: { type: 'arctic' },
    });

    return response.data.arcticData.slice(-365).map((item: { date: string; extent: string }) => ({
      date: item.date,
      value: parseFloat(item.extent),
    }));
  } catch (error) {
    console.error('Error fetching arctic ice data:', error);
    return [];
  }
}
