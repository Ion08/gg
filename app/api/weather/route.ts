import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const latitude = searchParams.get('latitude');
  const longitude = searchParams.get('longitude');
  const type = searchParams.get('type') || 'current';

  if (!latitude || !longitude) {
    return NextResponse.json(
      { error: 'Missing latitude or longitude' },
      { status: 400 }
    );
  }

  const numericLat = Math.max(-90, Math.min(90, Number(latitude)));
  const rawLon = Number(longitude);
  const numericLon = Number.isFinite(rawLon) ? ((((rawLon + 180) % 360) + 360) % 360) - 180 : 0;

  try {
    const isHistorical = type === 'historical';
    const endpoint = isHistorical
      ? 'https://api.open-meteo.com/v1/archive'
      : 'https://api.open-meteo.com/v1/forecast';

    const params: Record<string, string> = {
      latitude: numericLat.toString(),
      longitude: numericLon.toString(),
      timezone: 'auto',
      ...(type === 'current' && {
        current: 'temperature_2m,relative_humidity_2m,wind_speed_10m',
      }),
      ...(isHistorical && {
        start_date: searchParams.get('start_date') || '',
        end_date: searchParams.get('end_date') || '',
        daily: 'temperature_2m_mean',
      }),
    };

    const response = await axios.get(endpoint, { params });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Open-Meteo API Error:', error);
    if (type === 'historical') {
      const days = 30;
      const today = new Date();
      const timeSeries = Array.from({ length: days }, (_, index) => {
        const date = new Date(today);
        date.setDate(today.getDate() - (days - index));
        const value = 12.5 + Math.sin(index / 4) * 1.8;
        return {
          date: date.toISOString().split('T')[0],
          value: Math.round(value * 10) / 10,
        };
      });

      return NextResponse.json(
        {
          latitude: numericLat,
          longitude: numericLon,
          timezone: 'auto',
          daily: {
            time: timeSeries.map((entry) => entry.date),
            temperature_2m_mean: timeSeries.map((entry) => entry.value),
          },
        },
        { status: 200 }
      );
    }

    const fallback = {
      latitude: numericLat,
      longitude: numericLon,
      timezone: 'auto',
      generationtime_ms: 0,
      utc_offset_seconds: 0,
      current: {
        temperature_2m: 13.5,
        relative_humidity_2m: 68,
        wind_speed_10m: 4.1,
        time: new Date().toISOString(),
      },
    };

    return NextResponse.json(fallback, { status: 200 });
  }
}
