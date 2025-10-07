import { TimeSeriesData, ChartData, PredictionData } from '@/types/climate';
import * as tf from '@tensorflow/tfjs';

export function processTimeSeriesForChart(
  data: TimeSeriesData[],
  label: string,
  color: string
): ChartData {
  return {
    labels: data.map((item) => item.date),
    datasets: [
      {
        label,
        data: data.map((item) => item.value),
        borderColor: color,
        backgroundColor: color + '20',
        fill: true,
      },
    ],
  };
}

export function calculateMovingAverage(
  data: TimeSeriesData[],
  windowSize: number
): TimeSeriesData[] {
  const result: TimeSeriesData[] = [];
  
  for (let i = 0; i < data.length; i++) {
    if (i < windowSize - 1) {
      result.push(data[i]);
      continue;
    }
    
    const window = data.slice(i - windowSize + 1, i + 1);
    const average = window.reduce((sum, item) => sum + item.value, 0) / windowSize;
    
    result.push({
      date: data[i].date,
      value: average,
    });
  }
  
  return result;
}

export function calculateTrend(data: TimeSeriesData[]): 'increasing' | 'decreasing' | 'stable' {
  if (data.length < 2) return 'stable';
  
  const firstHalf = data.slice(0, Math.floor(data.length / 2));
  const secondHalf = data.slice(Math.floor(data.length / 2));
  
  const firstAvg = firstHalf.reduce((sum, item) => sum + item.value, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, item) => sum + item.value, 0) / secondHalf.length;
  
  const percentChange = ((secondAvg - firstAvg) / firstAvg) * 100;
  
  if (percentChange > 1) return 'increasing';
  if (percentChange < -1) return 'decreasing';
  return 'stable';
}

export async function predictFuture(
  data: TimeSeriesData[],
  steps: number = 30
): Promise<PredictionData> {
  const values = data.map((item) => item.value);
  
  const normalized = normalizeData(values);
  const sequences = createSequences(normalized, 30);
  
  const xs = tf.tensor2d(sequences.inputs);
  const ys = tf.tensor2d(sequences.outputs, [sequences.outputs.length, 1]);
  
  const model = tf.sequential({
    layers: [
      tf.layers.dense({ inputShape: [30], units: 50, activation: 'relu' }),
      tf.layers.dense({ units: 25, activation: 'relu' }),
      tf.layers.dense({ units: 1 }),
    ],
  });
  
  model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });
  
  await model.fit(xs, ys, {
    epochs: 50,
    verbose: 0,
  });
  
  const lastSequence = normalized.slice(-30);
  const predictions: number[] = [];
  const currentSequence = [...lastSequence];
  
  for (let i = 0; i < steps; i++) {
    const input = tf.tensor2d([currentSequence]);
    const prediction = model.predict(input) as tf.Tensor;
    const value = (await prediction.data())[0];
    
    predictions.push(denormalizeValue(value, values));
    currentSequence.shift();
    currentSequence.push(value);
    
    prediction.dispose();
    input.dispose();
  }
  
  xs.dispose();
  ys.dispose();
  model.dispose();
  
  const trend = calculateTrend(data);
  
  return {
    predicted: predictions,
    confidence: 0.75,
    trend,
  };
}

function normalizeData(data: number[]): number[] {
  const min = Math.min(...data);
  const max = Math.max(...data);
  return data.map((value) => (value - min) / (max - min));
}

function denormalizeValue(value: number, originalData: number[]): number {
  const min = Math.min(...originalData);
  const max = Math.max(...originalData);
  return value * (max - min) + min;
}

function createSequences(
  data: number[],
  sequenceLength: number
): { inputs: number[][]; outputs: number[] } {
  const inputs: number[][] = [];
  const outputs: number[] = [];
  
  for (let i = 0; i < data.length - sequenceLength; i++) {
    inputs.push(data.slice(i, i + sequenceLength));
    outputs.push(data[i + sequenceLength]);
  }
  
  return { inputs, outputs };
}

export function formatNumber(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}

export function getAQICategory(aqi: number): {
  label: string;
  color: string;
  description: string;
} {
  if (aqi <= 50) {
    return {
      label: 'Good',
      color: '#00e400',
      description: 'Air quality is satisfactory',
    };
  } else if (aqi <= 100) {
    return {
      label: 'Moderate',
      color: '#ffff00',
      description: 'Acceptable air quality',
    };
  } else if (aqi <= 150) {
    return {
      label: 'Unhealthy for Sensitive Groups',
      color: '#ff7e00',
      description: 'Members of sensitive groups may experience health effects',
    };
  } else if (aqi <= 200) {
    return {
      label: 'Unhealthy',
      color: '#ff0000',
      description: 'Everyone may begin to experience health effects',
    };
  } else if (aqi <= 300) {
    return {
      label: 'Very Unhealthy',
      color: '#8f3f97',
      description: 'Health alert: everyone may experience serious effects',
    };
  } else {
    return {
      label: 'Hazardous',
      color: '#7e0023',
      description: 'Health warnings of emergency conditions',
    };
  }
}
