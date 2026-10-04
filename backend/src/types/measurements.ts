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

  /** Altura total do corpo em centímetros. */
  altura: number;

  /** Distância entre os ombros em centímetros. */
  ombros: number;

  /** Circunferência do tórax em centímetros. */
  torax?: number;

  /** Circunferência da cintura em centímetros. */
  cintura?: number;

  /** Circunferência do quadril em centímetros. */
  quadril?: number;
}


// ============================================================
// MEDIDAS DO USUÁRIO
// ============================================================

/**
 * Guarda o modelo corporal e suas respectivas medidas.
 */
export interface UserMeasurements {

  /** Medidas correspondentes ao modelo escolhido. */
  medidas:
    | UnisexMeasurements;
}


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

  /** Altura do usuário. */
  altura: MeasurementValue;

  /** Distância entre os ombros. */
  ombros: MeasurementValue;

  /** Circunferência do tórax/busto/peitoral. */
  torax?: MeasurementValue;

  /** Circunferência da cintura. */
  cintura?: MeasurementValue;

  /** Circunferência do quadril. */
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

  /** Altura em centímetros. */
  altura: number;

  /** Distância entre os ombros em centímetros. */
  ombros: number;

  /** Circunferência do tórax em centímetros. */
  torax?: number;

  /** Circunferência da cintura em centímetros. */
  cintura?: number;

  /** Circunferência do quadril em centímetros. */
  quadril?: number;
}