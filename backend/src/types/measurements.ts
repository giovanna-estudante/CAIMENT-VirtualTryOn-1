// ============================================================
// CAIMENT - TIPOS DE MEDIDAS
// ============================================================

export type MeasurementName =
  | "altura"
  | "alturaPeCintura"
  | "alturaCinturaOmbros"
  | "ombros"
  | "busto"
  | "torax"
  | "cintura"
  | "quadril";


// ============================================================
// MEDIDAS UNISSEX
// ============================================================

export interface UnisexMeasurements {
  altura: number;
  alturaPeCintura: number;
  alturaCinturaOmbros: number;

  ombros: number;
  busto: number;
  torax: number;
  cintura: number;
  quadril: number;
}


// ============================================================
// MEDIDAS DO USUÁRIO
// ============================================================

export type UserMeasurements = UnisexMeasurements;


// ============================================================
// ORIGEM DA MEDIDA
// ============================================================

export type MeasurementSource =
  | "usuario"
  | "editor"
  | "estimativa"
  | "foto";


// ============================================================
// VALOR DA MEDIDA
// ============================================================

export interface MeasurementValue {
  valor: number;
  unidade: "cm";
  origem: MeasurementSource;
}


// ============================================================
// MEDIDAS DETALHADAS
// ============================================================

export interface DetailedBodyMeasurements {
  altura: MeasurementValue;
  alturaPeCintura: MeasurementValue;
  alturaCinturaOmbros: MeasurementValue;

  ombros: MeasurementValue;
  busto: MeasurementValue;
  torax: MeasurementValue;
  cintura: MeasurementValue;
  quadril: MeasurementValue;
}


// ============================================================
// PERFIL CORPORAL
// ============================================================

export interface BodyProfile {
  medidas: DetailedBodyMeasurements;
}


// ============================================================
// MEDIDAS EDITÁVEIS
// ============================================================

export interface EditableMeasurements {
  altura: number;
  alturaPeCintura: number;
  alturaCinturaOmbros: number;

  ombros: number;
  busto: number;
  torax: number;
  cintura: number;
  quadril: number;
}