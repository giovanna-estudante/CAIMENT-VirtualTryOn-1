// ============================================================
// CAIMENT - TIPOS DE MEDIDAS
// ============================================================
//
// Define o formato das medidas utilizadas pelo CAIMENT.
// Os valores das medidas são trabalhados em centímetros.
// ============================================================


// ============================================================
// NOMES DAS MEDIDAS
// ============================================================

/**
 * Medidas utilizadas pelo sistema.
 */
export type MeasurementName =
  | "altura"
  | "alturaPeCintura"
  | "alturaCinturaOmbros"
  | "ombros"
  | "torax"
  | "cintura"
  | "quadril";


// ============================================================
// MEDIDAS UNISSEX
// ============================================================

/**
 * Medidas utilizadas pelo modelo unissex.
 */
export interface UnisexMeasurements {
  altura: number;
  alturaPeCintura: number;
  alturaCinturaOmbros: number;
  ombros: number;
  busto: number;
  torax?: number;
  cintura?: number;
  quadril?: number;
}


// ============================================================
// MEDIDAS DO USUÁRIO
// ============================================================

/**
 * Guarda o modelo corporal e suas respectivas medidas.
 */
export type UserMeasurements = UnisexMeasurements;


// ============================================================
// ORIGEM DA MEDIDA
// ============================================================

/**
 * Indica como uma medida foi obtida.
 */
export type MeasurementSource =
  | "usuario"
  | "editor"
  | "estimativa"
  | "foto";


// ============================================================
// VALOR DA MEDIDA
// ============================================================

/**
 * Guarda o valor, a unidade e a origem da medida.
 */
export interface MeasurementValue {

  /** Valor numérico da medida. */
  valor: number;

  /** Unidade utilizada pelo sistema. */
  unidade: "cm";

  /** Origem da informação. */
  origem: MeasurementSource;
}


// ============================================================
// MEDIDAS DETALHADAS
// ============================================================

/**
 * Versão detalhada das medidas do corpo.
 *
 * Além do valor, permite registrar a origem
 * de cada medida individualmente.
 */
export interface DetailedBodyMeasurements {
  altura: MeasurementValue;
  alturaPeCintura: MeasurementValue;
  alturaCinturaOmbros: MeasurementValue;
  ombros: MeasurementValue;
  torax?: MeasurementValue;
  cintura?: MeasurementValue;
  quadril?: MeasurementValue;
}


// ============================================================
// PERFIL CORPORAL
// ============================================================

/**
 * Perfil corporal completo do usuário.
 */
export interface BodyProfile {

  /** Medidas detalhadas do corpo. */
  medidas: DetailedBodyMeasurements;
}


// ============================================================
// MEDIDAS EDITÁVEIS
// ============================================================

/**
 * Formato utilizado quando as medidas são alteradas
 * diretamente pelo editor corporal.
 */
export interface EditableMeasurements {
  altura: number;
  alturaPeCintura: number;
  alturaCinturaOmbros: number;
  ombros: number;
  torax?: number;
  busto: number;
  cintura?: number;
  quadril?: number;
}