// ============================================================
// CAIMENT - CORPO FEMININO
// Arquivo: FemaleBody.tsx
// ============================================================
//
// Exibe a representação 2D do corpo feminino
// e seus principais pontos de medida.
// ============================================================

import { MeasurementPoint } from "./MeasurementPoint";
import type { EditableMeasurements } from "../../types/measurements";


// ============================================================
// PROPRIEDADES
// ============================================================

interface FemaleBodyProps {
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

export function FemaleBody({
  medidas,
  medidaSelecionada,
  onSelectMeasurement,
}: FemaleBodyProps) {
  return (
    <div
      style={{
        position: "relative",
        width: "280px",
        height: "520px",
        margin: "0 auto",
      }}
    >
      {/* Representação simples do corpo */}
      <svg
        viewBox="0 0 280 520"
        width="100%"
        height="100%"
        aria-label="Modelo corporal feminino"
      >
        {/* Cabeça */}
        <ellipse
          cx="140"
          cy="45"
          rx="28"
          ry="35"
          fill="#ead8cc"
        />

        {/* Pescoço */}
        <rect
          x="125"
          y="75"
          width="30"
          height="35"
          rx="10"
          fill="#ead8cc"
        />

        {/* Tronco */}
        <path
          d="
            M125 90
            C105 92 85 105 72 125
            L88 250
            C92 285 105 315 112 340
            L168 340
            C175 315 188 285 192 250
            L208 125
            C195 105 175 92 155 90
            Z
          "
          fill="#ead8cc"
        />

        {/* Braço esquerdo */}
        <path
          d="
            M78 120
            C62 130 52 155 48 190
            L38 300
            C37 315 47 325 57 320
            C65 317 68 307 69 295
            L82 205
            L92 145
            Z
          "
          fill="#ead8cc"
        />

        {/* Braço direito */}
        <path
          d="
            M202 120
            C218 130 228 155 232 190
            L242 300
            C243 315 233 325 223 320
            C215 317 212 307 211 295
            L198 205
            L188 145
            Z
          "
          fill="#ead8cc"
        />

        {/* Perna esquerda */}
        <path
          d="
            M112 330
            C108 375 105 425 103 475
            C102 492 110 502 124 502
            C134 502 139 494 138 480
            L140 345
            Z
          "
          fill="#ead8cc"
        />

        {/* Perna direita */}
        <path
          d="
            M168 330
            C172 375 175 425 177 475
            C178 492 170 502 156 502
            C146 502 141 494 142 480
            L140 345
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