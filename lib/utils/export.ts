import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { TimeSeriesData } from '@/types/climate';

export function exportToCSV(data: Record<string, unknown>[], filename: string = 'climate_data.csv') {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map((row) =>
      headers.map((header) => {
        const value = row[header];
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value;
      }).join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToJSON(data: Record<string, unknown>[], filename: string = 'climate_data.json') {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function exportToPDF(
  elementId: string,
  filename: string = 'climate_report.pdf'
) {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      logging: false,
      useCORS: true,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
}

export function generateReport(data: {
  co2Data: TimeSeriesData[];
  temperatureData: TimeSeriesData[];
  arcticData: TimeSeriesData[];
}) {
  const latestCO2 = data.co2Data[data.co2Data.length - 1];
  const latestTemp = data.temperatureData[data.temperatureData.length - 1];
  const latestArctic = data.arcticData[data.arcticData.length - 1];

  return {
    generatedAt: new Date().toISOString(),
    summary: {
      co2: {
        current: latestCO2?.value || 0,
        unit: 'ppm',
        trend: calculateSimpleTrend(data.co2Data),
      },
      temperature: {
        current: latestTemp?.value || 0,
        unit: '°C anomaly',
        trend: calculateSimpleTrend(data.temperatureData),
      },
      arcticIce: {
        current: latestArctic?.value || 0,
        unit: 'Million km²',
        trend: calculateSimpleTrend(data.arcticData),
      },
    },
    data: {
      co2: data.co2Data,
      temperature: data.temperatureData,
      arcticIce: data.arcticData,
    },
  };
}

function calculateSimpleTrend(data: TimeSeriesData[]): string {
  if (data.length < 2) return 'stable';
  
  const recent = data.slice(-30);
  const older = data.slice(-60, -30);
  
  if (older.length === 0) return 'stable';
  
  const recentAvg = recent.reduce((sum, item) => sum + item.value, 0) / recent.length;
  const olderAvg = older.reduce((sum, item) => sum + item.value, 0) / older.length;
  
  const change = ((recentAvg - olderAvg) / olderAvg) * 100;
  
  if (change > 1) return 'increasing';
  if (change < -1) return 'decreasing';
  return 'stable';
}
