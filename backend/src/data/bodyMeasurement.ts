// ============================================================
// CAIMENT - MEDIDAS INICIAIS DO CORPO
// Arquivo: bodyMeasurements.ts
// ============================================================
//
// Define os valores iniciais utilizados pelo editor corporal.
// Os valores podem ser alterados posteriormente pelo usuário.
// ============================================================

import type {
  FemaleMeasurements,
  MaleMeasurements,
  UnisexMeasurements,
} from "../types/measurements";


// ============================================================
// MODELO FEMININO
// ============================================================

/**
 * Valores iniciais para o modelo feminino.
 */
export const defaultFemaleMeasurements: FemaleMeasurements = {
  altura: 165,
  ombros: 40,
  torax: 88,
  cintura: 70,
  quadril: 96,
};


// ============================================================
// MODELO MASCULINO
// ============================================================

/**
 * Valores iniciais para o modelo masculino.
 */
export const defaultMaleMeasurements: MaleMeasurements = {
  altura: 175,
  ombros: 45,
  torax: 96,
  cintura: 82,
  quadril: 98,
};


// ============================================================
// MODELO UNISSEX
// ============================================================

/**
 * Valores iniciais para o modelo unissex.
 */
export const defaultUnisexMeasurements: UnisexMeasurements = {
  altura: 170,
  ombros: 42,
  torax: 92,
  cintura: 76,
  quadril: 96,
};