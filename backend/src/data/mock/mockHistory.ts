import type { FittingSession, Favorite } from '@/types';

export const mockHistory: FittingSession[] = [
  { id: 'fs-001', clothingId: 'cl-001', date: '2026-08-24T15:30:00.000Z', recommendedSize: 'M', result: 'aprovado' },
  { id: 'fs-002', clothingId: 'cl-003', date: '2026-08-20T11:10:00.000Z', recommendedSize: '40', result: 'ajustar' },
  { id: 'fs-003', clothingId: 'cl-004', date: '2026-08-15T18:45:00.000Z', recommendedSize: 'P', result: 'aprovado' },
  { id: 'fs-004', clothingId: 'cl-005', date: '2026-08-09T09:05:00.000Z', recommendedSize: 'G', result: 'nao_recomendado' },
  { id: 'fs-005', clothingId: 'cl-007', date: '2026-07-30T20:15:00.000Z', recommendedSize: 'M', result: 'aprovado' },
];

export const mockFavorites: Favorite[] = [
  { id: 'fav-001', clothingId: 'cl-001', savedAt: '2026-08-24T15:35:00.000Z' },
  { id: 'fav-002', clothingId: 'cl-004', savedAt: '2026-08-15T18:50:00.000Z' },
  { id: 'fav-003', clothingId: 'cl-008', savedAt: '2026-08-05T13:20:00.000Z' },
];
