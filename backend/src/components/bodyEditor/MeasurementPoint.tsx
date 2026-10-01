// ============================================================
// CAIMENT - PONTO DE MEDIDA
// Arquivo: MeasurementPoint.tsx
// ============================================================
//
// Representa um ponto de medida sobre o corpo 2D.
// ============================================================

import type { MeasurementName } from "../../types/measurements";


// ============================================================
// PROPRIEDADES
// ============================================================

interface MeasurementPointProps {
  /** Tipo de medida representada pelo ponto. */
  medida: MeasurementName;

  /** Posição horizontal do ponto. */
  x: number;

  /** Posição vertical do ponto. */
  y: number;

  /** Valor atual da medida em centímetros. */
  valor: number;

  /** Indica se o ponto está selecionado. */
  selecionado?: boolean;

  /** Função chamada quando o ponto é clicado. */
  onClick?: () => void;
}


// ============================================================
// COMPONENTE
// ============================================================

export function MeasurementPoint({
  medida,
  x,
  y,
  valor,
  selecionado = false,
  onClick,
}: MeasurementPointProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${medida}: ${valor} cm`}
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        transform: "translate(-50%, -50%)",

        width: selecionado ? "18px" : "14px",
        height: selecionado ? "18px" : "14px",

        borderRadius: "50%",
        border: "2px solid white",

        backgroundColor: selecionado
          ? "#9254e1"
          : "#402b47",

        cursor: "pointer",
        padding: 0,
        zIndex: 10,

        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.25)",
      }}
    >
      <span
        style={{
          position: "absolute",
          left: "50%",
          top: "100%",
          transform: "translateX(-50%)",

          marginTop: "6px",

          whiteSpace: "nowrap",

          fontSize: "12px",
          fontWeight: 600,

          color: "#262423",

          pointerEvents: "none",
        }}
      >
        {valor} cm
      </span>
    </button>
  );
}