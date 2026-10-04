// ============================================================
// CAIMENT - CORPO UNISSEX
// Arquivo: UnisexBody.tsx
// ============================================================

import { MeasurementPoint } from "./MeasurementPoint";

import type {
  EditableMeasurements,
  MeasurementName,
} from "../../types/measurements";

// ============================================================
// PROPRIEDADES
// ============================================================

interface UnisexBodyProps {
  medidas: EditableMeasurements;
  medidaSelecionada?: string;

  onSelectMeasurement?: (
    medida: keyof EditableMeasurements
  ) => void;

  onChangeMeasurement?: (
    medida: MeasurementName,
    valor: number
  ) => void;
}

// ============================================================
// FUNÇÃO AUXILIAR
// ============================================================

function limitar(
  valor: number,
  minimo: number,
  maximo: number
) {
  return Math.max(
    minimo,
    Math.min(maximo, valor)
  );
}

// ============================================================
// COMPONENTE
// ============================================================

export function UnisexBody({
  medidas,
  medidaSelecionada,
  onSelectMeasurement,
  onChangeMeasurement,
}: UnisexBodyProps) {

  // ==========================================================
  // CENTRO DO CORPO
  // ==========================================================

  const centro = 140;

  // ==========================================================
  // LARGURA DOS OMBROS
  // ==========================================================

  const larguraOmbros = limitar(
    92 + (medidas.ombros - 40) * 3,
    70,
    160
  );

  // ==========================================================
  // LARGURA DO TÓRAX
  // ==========================================================

  const larguraTorax = limitar(
    82 + ((medidas.torax ?? 88) - 88) * 2.2,
    65,
    145
  );

  // ==========================================================
  // LARGURA DA CINTURA
  // ==========================================================

  const larguraCintura = limitar(
    62 + ((medidas.cintura ?? 70) - 70) * 2,
    50,
    120
  );

  // ==========================================================
  // LARGURA DO QUADRIL
  // ==========================================================

  const larguraQuadril = limitar(
    96 + ((medidas.quadril ?? 96) - 96) * 2,
    75,
    150
  );

  // ==========================================================
  // ESCALA DA ALTURA
  // ==========================================================

  const escalaAltura = limitar(
    medidas.altura / 165,
    0.78,
    1.18
  );

  // ==========================================================
  // POSIÇÕES VERTICAIS
  // ==========================================================

  const peY = 510;

  const cabecaY =
    peY - 465 * escalaAltura;

  const pescocoTopoY =
    cabecaY + 60 * escalaAltura;

  const pescocoBaseY =
    cabecaY + 88 * escalaAltura;

  const ombroY =
    cabecaY + 98 * escalaAltura;

  const toraxY =
    cabecaY + 165 * escalaAltura;

  const cinturaY =
    cabecaY + 235 * escalaAltura;

  const quadrilY =
    cabecaY + 292 * escalaAltura;

  const finalQuadrilY =
    cabecaY + 320 * escalaAltura;

  // ==========================================================
  // POSIÇÃO DOS BRAÇOS
  // ==========================================================

  const inicioBracoEsquerdo =
    centro - larguraOmbros / 2;

  const inicioBracoDireito =
    centro + larguraOmbros / 2;

  // ==========================================================
  // POSIÇÃO DAS PERNAS
  // ==========================================================

  const inicioPernaY =
    finalQuadrilY;

  const finalPernaY =
    peY;

  // ==========================================================
  // RENDERIZAÇÃO
  // ==========================================================

  return (
    <div
      style={{
        position: "relative",
        width: "320px",
        height: "590px",
        margin: "0 auto",
      }}
    >

      {/* ====================================================
          CORPO SVG
          ==================================================== */}

      <svg
        viewBox="0 0 280 520"
        width="100%"
        height="100%"
        aria-label="Modelo corporal unissex"
        preserveAspectRatio="xMidYMid meet"
      >

        {/* ==================================================
            CABEÇA
            ================================================== */}

        <ellipse
          cx={centro}
          cy={cabecaY + 30 * escalaAltura}
          rx={29 * escalaAltura}
          ry={35 * escalaAltura}
          fill="#ead8cc"
        />

        {/* ==================================================
            PESCOÇO
            ================================================== */}

        <path
          d={`
            M ${centro - 16}
              ${pescocoTopoY}

            L ${centro - 16}
              ${pescocoBaseY}

            C ${centro - 16}
              ${pescocoBaseY + 5}
              ${centro - 10}
              ${pescocoBaseY + 8}
              ${centro}
              ${pescocoBaseY + 8}

            C ${centro + 10}
              ${pescocoBaseY + 8}
              ${centro + 16}
              ${pescocoBaseY + 5}
              ${centro + 16}
              ${pescocoBaseY}

            L ${centro + 16}
              ${pescocoTopoY}

            Z
          `}
          fill="#ead8cc"
        />

        {/* ==================================================
            TRONCO DINÂMICO
            ================================================== */}

        <path
          d={`
            M ${centro - larguraOmbros / 2}
              ${ombroY}

            C ${centro - larguraOmbros / 2 - 7}
              ${ombroY + 5}
              ${centro - larguraTorax / 2 - 5}
              ${ombroY + 18}
              ${centro - larguraTorax / 2}
              ${toraxY - 45 * escalaAltura}

            L ${centro - larguraTorax / 2 + 7}
              ${toraxY}

            C ${centro - larguraTorax / 2 + 11}
              ${toraxY + 25 * escalaAltura}
              ${centro - larguraCintura / 2 - 4}
              ${cinturaY - 20 * escalaAltura}
              ${centro - larguraCintura / 2}
              ${cinturaY}

            C ${centro - larguraCintura / 2 - 2}
              ${cinturaY + 16 * escalaAltura}
              ${centro - larguraQuadril / 2 + 5}
              ${quadrilY - 8 * escalaAltura}
              ${centro - larguraQuadril / 2}
              ${quadrilY}

            C ${centro - larguraQuadril / 2 + 10}
              ${quadrilY + 14 * escalaAltura}
              ${centro - larguraQuadril / 2 + 24}
              ${finalQuadrilY}
              ${centro}
              ${finalQuadrilY}

            C ${centro + larguraQuadril / 2 - 24}
              ${finalQuadrilY}
              ${centro + larguraQuadril / 2 - 10}
              ${quadrilY + 14 * escalaAltura}
              ${centro + larguraQuadril / 2}
              ${quadrilY}

            C ${centro + larguraQuadril / 2 - 5}
              ${quadrilY - 8 * escalaAltura}
              ${centro + larguraCintura / 2 + 2}
              ${cinturaY + 16 * escalaAltura}
              ${centro + larguraCintura / 2}
              ${cinturaY}

            C ${centro + larguraCintura / 2 + 4}
              ${cinturaY - 20 * escalaAltura}
              ${centro + larguraTorax / 2 - 11}
              ${toraxY + 25 * escalaAltura}
              ${centro + larguraTorax / 2 - 7}
              ${toraxY}

            L ${centro + larguraTorax / 2}
              ${toraxY - 45 * escalaAltura}

            C ${centro + larguraTorax / 2 + 5}
              ${ombroY + 18}
              ${centro + larguraOmbros / 2 + 7}
              ${ombroY + 5}
              ${centro + larguraOmbros / 2}
              ${ombroY}

            Z
          `}
          fill="#ead8cc"
        />

        {/* ==================================================
            BRAÇO ESQUERDO
            ================================================== */}

        <path
          d={`
            M ${inicioBracoEsquerdo}
              ${ombroY}

            C ${inicioBracoEsquerdo - 13}
              ${ombroY + 5}
              ${inicioBracoEsquerdo - 23}
              ${ombroY + 16}
              ${inicioBracoEsquerdo - 30}
              ${ombroY + 32}

            C ${inicioBracoEsquerdo - 36}
              ${ombroY + 47}
              ${inicioBracoEsquerdo - 40}
              ${ombroY + 66}
              ${inicioBracoEsquerdo - 42}
              ${ombroY + 88}

            L ${inicioBracoEsquerdo - 52}
              ${ombroY + 173}

            C ${inicioBracoEsquerdo - 54}
              ${ombroY + 189}
              ${inicioBracoEsquerdo - 47}
              ${ombroY + 201}
              ${inicioBracoEsquerdo - 36}
              ${ombroY + 204}

            C ${inicioBracoEsquerdo - 25}
              ${ombroY + 207}
              ${inicioBracoEsquerdo - 17}
              ${ombroY + 199}
              ${inicioBracoEsquerdo - 15}
              ${ombroY + 186}

            L ${inicioBracoEsquerdo - 4}
              ${ombroY + 105}

            L ${inicioBracoEsquerdo + 7}
              ${ombroY + 48}

            C ${inicioBracoEsquerdo + 10}
              ${ombroY + 30}
              ${inicioBracoEsquerdo + 8}
              ${ombroY + 13}
              ${inicioBracoEsquerdo}
              ${ombroY}

            Z
          `}
          fill="#ead8cc"
        />

        {/* ==================================================
            BRAÇO DIREITO
            ================================================== */}

        <path
          d={`
            M ${inicioBracoDireito}
              ${ombroY}

            C ${inicioBracoDireito + 13}
              ${ombroY + 5}
              ${inicioBracoDireito + 23}
              ${ombroY + 16}
              ${inicioBracoDireito + 30}
              ${ombroY + 32}

            C ${inicioBracoDireito + 36}
              ${ombroY + 47}
              ${inicioBracoDireito + 40}
              ${ombroY + 66}
              ${inicioBracoDireito + 42}
              ${ombroY + 88}

            L ${inicioBracoDireito + 52}
              ${ombroY + 173}

            C ${inicioBracoDireito + 54}
              ${ombroY + 189}
              ${inicioBracoDireito + 47}
              ${ombroY + 201}
              ${inicioBracoDireito + 36}
              ${ombroY + 204}

            C ${inicioBracoDireito + 25}
              ${ombroY + 207}
              ${inicioBracoDireito + 17}
              ${ombroY + 199}
              ${inicioBracoDireito + 15}
              ${ombroY + 186}

            L ${inicioBracoDireito + 4}
              ${ombroY + 105}

            L ${inicioBracoDireito - 7}
              ${ombroY + 48}

            C ${inicioBracoDireito - 10}
              ${ombroY + 30}
              ${inicioBracoDireito - 8}
              ${ombroY + 13}
              ${inicioBracoDireito}
              ${ombroY}

            Z
          `}
          fill="#ead8cc"
        />

        {/* ==================================================
            PERNA ESQUERDA
            ================================================== */}

        <path
          d={`
            M ${centro - 48}
              ${inicioPernaY - 24}

            C ${centro - 51}
              ${inicioPernaY + 10}
              ${centro - 53}
              ${inicioPernaY + 55}
              ${centro - 54}
              ${inicioPernaY + 100}

            L ${centro - 56}
              ${finalPernaY - 38}

            C ${centro - 56}
              ${finalPernaY - 21}
              ${centro - 48}
              ${finalPernaY - 10}
              ${centro - 34}
              ${finalPernaY - 8}

            C ${centro - 22}
              ${finalPernaY - 7}
              ${centro - 14}
              ${finalPernaY - 15}
              ${centro - 14}
              ${finalPernaY - 28}

            L ${centro - 12}
              ${inicioPernaY + 90}

            L ${centro - 6}
              ${inicioPernaY + 20}

            C ${centro - 20}
              ${inicioPernaY + 17}
              ${centro - 36}
              ${inicioPernaY + 5}
              ${centro - 48}
              ${inicioPernaY - 24}

            Z
          `}
          fill="#ead8cc"
        />

        {/* ==================================================
            PERNA DIREITA
            ================================================== */}

        <path
          d={`
            M ${centro + 48}
              ${inicioPernaY - 24}

            C ${centro + 51}
              ${inicioPernaY + 10}
              ${centro + 53}
              ${inicioPernaY + 55}
              ${centro + 54}
              ${inicioPernaY + 100}

            L ${centro + 56}
              ${finalPernaY - 38}

            C ${centro + 56}
              ${finalPernaY - 21}
              ${centro + 48}
              ${finalPernaY - 10}
              ${centro + 34}
              ${finalPernaY - 8}

            C ${centro + 22}
              ${finalPernaY - 7}
              ${centro + 14}
              ${finalPernaY - 15}
              ${centro + 14}
              ${finalPernaY - 28}

            L ${centro + 12}
              ${inicioPernaY + 90}

            L ${centro + 6}
              ${inicioPernaY + 20}

            C ${centro + 20}
              ${inicioPernaY + 17}
              ${centro + 36}
              ${inicioPernaY + 5}
              ${centro + 48}
              ${inicioPernaY - 24}

            Z
          `}
          fill="#ead8cc"
        />

        {/* ==================================================
            PÉ ESQUERDO
            ================================================== */}

        <path
          d={`
            M ${centro - 56}
              ${finalPernaY - 40}

            C ${centro - 61}
              ${finalPernaY - 28}
              ${centro - 62}
              ${finalPernaY - 16}
              ${centro - 58}
              ${finalPernaY - 7}

            C ${centro - 53}
              ${finalPernaY + 4}
              ${centro - 41}
              ${finalPernaY + 9}
              ${centro - 26}
              ${finalPernaY + 7}

            L ${centro - 10}
              ${finalPernaY + 5}

            C ${centro - 5}
              ${finalPernaY + 4}
              ${centro - 3}
              ${finalPernaY - 1}
              ${centro - 6}
              ${finalPernaY - 5}

            C ${centro - 11}
              ${finalPernaY - 12}
              ${centro - 20}
              ${finalPernaY - 15}
              ${centro - 32}
              ${finalPernaY - 16}

            L ${centro - 34}
              ${finalPernaY - 37}

            Z
          `}
          fill="#ead8cc"
        />

        {/* ==================================================
            PÉ DIREITO
            ================================================== */}

        <path
          d={`
            M ${centro + 56}
              ${finalPernaY - 40}

            C ${centro + 61}
              ${finalPernaY - 28}
              ${centro + 62}
              ${finalPernaY - 16}
              ${centro + 58}
              ${finalPernaY - 7}

            C ${centro + 53}
              ${finalPernaY + 4}
              ${centro + 41}
              ${finalPernaY + 9}
              ${centro + 26}
              ${finalPernaY + 7}

            L ${centro + 10}
              ${finalPernaY + 5}

            C ${centro + 5}
              ${finalPernaY + 4}
              ${centro + 3}
              ${finalPernaY - 1}
              ${centro + 6}
              ${finalPernaY - 5}

            C ${centro + 11}
              ${finalPernaY - 12}
              ${centro + 20}
              ${finalPernaY - 15}
              ${centro + 32}
              ${finalPernaY - 16}

            L ${centro + 34}
              ${finalPernaY - 37}

            Z
          `}
          fill="#ead8cc"
        />

      </svg>

      {/* ====================================================
          PONTOS DE MEDIÇÃO
          ==================================================== */}

      <MeasurementPoint
        medida="ombros"
        x={50}
        y={22}
        valor={medidas.ombros}
        valorBase={40}
        valorMinimo={25}
        valorMaximo={60}
        selecionado={
          medidaSelecionada === "ombros"
        }
        onClick={() =>
          onSelectMeasurement?.("ombros")
        }
        onChange={onChangeMeasurement}
      />

      <MeasurementPoint
        medida="torax"
        x={50}
        y={36}
        valor={medidas.torax ?? 0}
        valorBase={88}
        valorMinimo={50}
        valorMaximo={140}
        selecionado={
          medidaSelecionada === "torax"
        }
        onClick={() =>
          onSelectMeasurement?.("torax")
        }
        onChange={onChangeMeasurement}
      />

      <MeasurementPoint
        medida="cintura"
        x={50}
        y={48}
        valor={medidas.cintura ?? 0}
        valorBase={70}
        valorMinimo={45}
        valorMaximo={130}
        selecionado={
          medidaSelecionada === "cintura"
        }
        onClick={() =>
          onSelectMeasurement?.("cintura")
        }
        onChange={onChangeMeasurement}
      />

      <MeasurementPoint
        medida="quadril"
        x={50}
        y={60}
        valor={medidas.quadril ?? 0}
        valorBase={96}
        valorMinimo={60}
        valorMaximo={150}
        selecionado={
          medidaSelecionada === "quadril"
        }
        onClick={() =>
          onSelectMeasurement?.("quadril")
        }
        onChange={onChangeMeasurement}
      />

      <MeasurementPoint
        medida="altura"
        x={10}
        y={50}
        valor={medidas.altura}
        valorBase={165}
        valorMinimo={130}
        valorMaximo={220}
        selecionado={
          medidaSelecionada === "altura"
        }
        onClick={() =>
          onSelectMeasurement?.("altura")
        }
        onChange={onChangeMeasurement}
      />

      {/*
        PONTOS UTILIZADOS PARA POSTERIORMENTE POSICIONAR A PEÇA DE ROUPA
      */}
      <MeasurementPoint
        medida="alturaPeCintura"
        x={10}
        y={72}
        valor={medidas.alturaPeCintura}
        valorBase={95}
        valorMinimo={70}
        valorMaximo={140}
        selecionado={
          medidaSelecionada === "alturaPeCintura"
        }
        onClick={() =>
          onSelectMeasurement?.("alturaPeCintura")
        }
        onChange={onChangeMeasurement}
      />

      <MeasurementPoint
        medida="alturaCinturaOmbros"
        x={90}
        y={30}
        valor={medidas.alturaCinturaOmbros}
        valorBase={45}
        valorMinimo={30}
        valorMaximo={70}
        selecionado={
          medidaSelecionada === "alturaCinturaOmbros"
        }
        onClick={() =>
          onSelectMeasurement?.("alturaCinturaOmbros")
        }
        onChange={onChangeMeasurement}
      />

    </div>
  );
}