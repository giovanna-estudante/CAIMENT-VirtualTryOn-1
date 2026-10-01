// ============================================================
// CAIMENT - CORPO MASCULINO
// Arquivo: MaleBody.tsx
// ============================================================
//
// Exibe a representação 2D do corpo masculino
// e seus principais pontos de medida.
// ============================================================

import { MeasurementPoint } from "./MeasurementPoint";
import type { EditableMeasurements } from "../../types/measurements";


// ============================================================
// PROPRIEDADES
// ============================================================

interface MaleBodyProps {
  /** Medidas atuais do corpo. */
  medidas: EditableMeasurements;

  /** Medida atualmente selecionada. */
  medidaSelecionada?: string;

  /** Função chamada ao selecionar uma medida. */
  onSelectMeasurement?: (medida: keyof EditableMeasurements) => void;
}


// ============================================================
// COMPONENTE
// ============================================================

export function MaleBody({
  medidas,
  medidaSelecionada,
  onSelectMeasurement,
}: MaleBodyProps) {
  return (
    <div
      style={{
        position: "relative",
        width: "280px",
        height: "520px",
        margin: "0 auto",
      }}
    >
      {/* Representação inicial do corpo */}
      <svg
        viewBox="0 0 280 520"
        width="100%"
        height="100%"
        aria-label="Modelo corporal masculino"
      >
        {/* Cabeça */}
        <ellipse
          cx="140"
          cy="45"
          rx="30"
          ry="36"
          fill="#ead8cc"
        />

        {/* Pescoço */}
        <rect
          x="123"
          y="75"
          width="34"
          height="38"
          rx="8"
          fill="#ead8cc"
        />

        {/* Tronco */}
        <path
          d="
            M123 90
            C98 94 78 108 62 130
            L82 270
            C88 300 100 325 108 345
            L172 345
            C180 325 192 300 198 270
            L218 130
            C202 108 182 94 157 90
            Z
          "
          fill="#ead8cc"
        />

        {/* Braço esquerdo */}
        <path
          d="
            M70 125
            C52 135 43 160 40 195
            L30 300
            C29 316 39 326 50 322
            C59 319 62 309 63 296
            L76 205
            L88 145
            Z
          "
          fill="#ead8cc"
        />

        {/* Braço direito */}
        <path
          d="
            M210 125
            C228 135 237 160 240 195
            L250 300
            C251 316 241 326 230 322
            C221 319 218 309 217 296
            L204 205
            L192 145
            Z
          "
          fill="#ead8cc"
        />

        {/* Perna esquerda */}
        <path
          d="
            M108 335
            C105 380 102 430 100 478
            C99 494 108 503 123 503
            C134 503 139 495 138 480
            L140 350
            Z
          "
          fill="#ead8cc"
        />

        {/* Perna direita */}
        <path
          d="
            M172 335
            C175 380 178 430 180 478
            C181 494 172 503 157 503
            C146 503 141 495 142 480
            L140 350
            Z
          "
          fill="#ead8cc"
        />
      </svg>

      {/* Ponto dos ombros */}
      <MeasurementPoint
        medida="ombros"
        x={50}
        y={22}
        valor={medidas.ombros}
        selecionado={medidaSelecionada === "ombros"}
        onClick={() => onSelectMeasurement?.("ombros")}
      />

      {/* Ponto do tórax */}
      <MeasurementPoint
        medida="torax"
        x={50}
        y={31}
        valor={medidas.torax ?? 0}
        selecionado={medidaSelecionada === "torax"}
        onClick={() => onSelectMeasurement?.("torax")}
      />

      {/* Ponto da cintura */}
      <MeasurementPoint
        medida="cintura"
        x={50}
        y={48}
        valor={medidas.cintura ?? 0}
        selecionado={medidaSelecionada === "cintura"}
        onClick={() => onSelectMeasurement?.("cintura")}
      />

      {/* Ponto do quadril */}
      <MeasurementPoint
        medida="quadril"
        x={50}
        y={60}
        valor={medidas.quadril ?? 0}
        selecionado={medidaSelecionada === "quadril"}
        onClick={() => onSelectMeasurement?.("quadril")}
      />

      {/* Ponto da altura */}
      <MeasurementPoint
        medida="altura"
        x={15}
        y={50}
        valor={medidas.altura}
        selecionado={medidaSelecionada === "altura"}
        onClick={() => onSelectMeasurement?.("altura")}
      />
    </div>
  );
}