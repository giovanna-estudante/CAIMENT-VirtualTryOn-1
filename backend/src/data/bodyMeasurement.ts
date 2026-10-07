// ============================================================
// CAIMENT - MEDIDAS INICIAIS DO CORPO
// Arquivo: bodyMeasurements.ts
// ============================================================
//
// Define os valores iniciais utilizados pelo editor corporal.
// Os valores podem ser alterados posteriormente pelo usuário.
//
// ============================================================

import type {
  UnisexMeasurements,
} from "../types/measurements";

// ============================================================
// MODELO UNISSEX
// ============================================================

export const defaultUnisexMeasurements: UnisexMeasurements = {

  // ----------------------------------------------------------
  // ALTURA
  // ----------------------------------------------------------

  altura: 170,

  // ----------------------------------------------------------
  // ALTURAS DE REFERÊNCIA
  // ----------------------------------------------------------

  alturaPeCintura: 100,

  alturaCinturaOmbros: 45,

  // ----------------------------------------------------------
  // MEDIDAS HORIZONTAIS DO CORPO
  // ----------------------------------------------------------

  ombros: 42,

  torax: 92,

  // NOVA MEDIDA:
  // Busto passa a existir no cadastro e pode ser utilizada
  // diretamente pelas Shape Keys da roupa.
  busto: 92,

  cintura: 76,

  quadril: 96,
};