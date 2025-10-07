import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const fallbackArcticData = {
  arcticData: [
    { date: '2024-07-01', extent: '7.12' },
    { date: '2024-06-01', extent: '8.45' },
    { date: '2024-05-01', extent: '10.23' },
    { date: '2024-04-01', extent: '12.71' },
    { date: '2024-03-01', extent: '13.58' },
    { date: '2024-02-01', extent: '14.12' },
    { date: '2024-01-01', extent: '14.93' },
    { date: '2023-12-01', extent: '12.35' },
    { date: '2023-11-01', extent: '10.91' },
    { date: '2023-10-01', extent: '8.67' },
    { date: '2023-09-01', extent: '5.21' },
    { date: '2023-08-01', extent: '4.89' },
  ],
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'co2';

  const endpoints: Record<string, string> = {
    co2: 'https://global-warming.org/api/co2-api',
    temperature: 'https://global-warming.org/api/temperature-api',
    arctic: 'https://global-warming.org/api/arctic-api',
    methane: 'https://global-warming.org/api/methane-api',
    no2: 'https://global-warming.org/api/nitrous-oxide-api',
  };

  const endpoint = endpoints[type];
  if (!endpoint) {
    return NextResponse.json(
      { error: 'Invalid type parameter' },
      { status: 400 }
    );
  }

  try {
    const response = await axios.get(endpoint, {
      headers: {
        'Accept': 'application/json',
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error(`Global Warming API Error (${type}):`, error);
    if (type === 'arctic') {
      return NextResponse.json(fallbackArcticData, { status: 200 });
    }

    return NextResponse.json({ error: `Failed to fetch ${type} data` }, { status: 500 });
  }
}
