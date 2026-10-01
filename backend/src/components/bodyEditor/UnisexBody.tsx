// ============================================================
// CAIMENT - CORPO UNISSEX
// Arquivo: UnisexBody.tsx
// ============================================================
//
// Exibe a representação 2D do corpo unissex
// e seus principais pontos de medida.
// ============================================================

import { MeasurementPoint } from "./MeasurementPoint";
import type { EditableMeasurements } from "../../types/measurements";


// ============================================================
// PROPRIEDADES
// ============================================================

interface UnisexBodyProps {
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

export function UnisexBody({
  medidas,
  medidaSelecionada,
  onSelectMeasurement,
}: UnisexBodyProps) {
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
        aria-label="Modelo corporal unissex"
      >
        {/* Cabeça */}
        <ellipse
          cx="140"
          cy="45"
          rx="29"
          ry="35"
          fill="#ead8cc"
        />

        {/* Pescoço */}
        <rect
          x="124"
          y="75"
          width="32"
          height="36"
          rx="9"
          fill="#ead8cc"
        />

        {/* Tronco */}
        <path
          d="
            M124 90
            C101 94 81 107 67 128
            L84 265
            C89 295 101 320 109 343
            L171 343
            C179 320 191 295 196 265
            L213 128
            C199 107 179 94 156 90
            Z
          "
          fill="#ead8cc"
        />

        {/* Braço esquerdo */}
        <path
          d="
            M74 124
            C57 134 47 159 44 193
            L34 300
            C33 316 43 325 54 321
            C63 318 66 308 67 295
            L80 205
            L91 145
            Z
          "
          fill="#ead8cc"
        />

        {/* Braço direito */}
        <path
          d="
            M206 124
            C223 134 233 159 236 193
            L246 300
            C247 316 237 325 226 321
            C217 318 214 308 213 295
            L200 205
            L189 145
            Z
          "
          fill="#ead8cc"
        />

        {/* Perna esquerda */}
        <path
          d="
            M109 335
            C106 380 103 430 101 478
            C100 494 109 503 123 503
            C134 503 139 495 138 480
            L140 350
            Z
          "
          fill="#ead8cc"
        />

        {/* Perna direita */}
        <path
          d="
            M171 335
            C174 380 177 430 179 478
            C180 494 171 503 157 503
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