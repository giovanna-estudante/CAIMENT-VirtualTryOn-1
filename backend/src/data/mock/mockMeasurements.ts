import type { Measurements } from '@/types';

export const mockMeasurements: Measurements = {
  height: 168,
  bust: 92,
  waist: 74,
  hip: 98,
  shoulders: 39,
  arm: 58,
  leg: 104,
};

export const measurementLabels: Record<keyof Measurements, string> = {
  height: 'Altura',
  bust: 'Busto',
  waist: 'Cintura',
  hip: 'Quadril',
  shoulders: 'Ombros',
  arm: 'Braço',
  leg: 'Perna',
};

export const measurementRanges: Record<keyof Measurements, { min: number; max: number }> = {
  height: { min: 140, max: 210 },
  bust: { min: 60, max: 140 },
  waist: { min: 50, max: 130 },
  hip: { min: 60, max: 150 },
  shoulders: { min: 30, max: 55 },
  arm: { min: 40, max: 75 },
  leg: { min: 70, max: 120 },
};
