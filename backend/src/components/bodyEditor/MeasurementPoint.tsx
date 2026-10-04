// ============================================================
// CAIMENT - PONTO DE MEDIDA
// Arquivo: MeasurementPoint.tsx
// ============================================================
//
// Este componente representa uma bolinha de medida sobre
// o corpo.
//
// Agora, além de selecionar a medida, a bolinha também pode
// ser ARRastada pelo usuário.
//
// Funcionamento:
//
// - medidas horizontais:
//   ombros, tórax, cintura e quadril
//   → arrastar para esquerda/direita;
//
// - altura:
//   → arrastar para cima/baixo;
//
// O componente não altera o estado do BodyEditor diretamente.
// Ele apenas informa para o componente pai qual deve ser
// o novo valor.
//
// ============================================================

import {
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  MeasurementName,
} from "../../types/measurements";

// ============================================================
// PROPRIEDADES DO COMPONENTE
// ============================================================

interface MeasurementPointProps {

  // ----------------------------------------------------------
  // Nome da medida representada pela bolinha.
  // ----------------------------------------------------------

  medida: MeasurementName;

  // ----------------------------------------------------------
  // Posição horizontal inicial da bolinha.
  // ----------------------------------------------------------

  x: number;

  // ----------------------------------------------------------
  // Posição vertical inicial da bolinha.
  // ----------------------------------------------------------

  y: number;

  // ----------------------------------------------------------
  // Valor atual da medida.
  // ----------------------------------------------------------

  valor: number;

  // ----------------------------------------------------------
  // Valor que será considerado como posição central.
  //
  // Exemplo:
  //
  // Ombros = 40 cm
  //
  // Se o usuário aumentar para 45 cm,
  // a bolinha se desloca para um lado.
  //
  // ----------------------------------------------------------

  valorBase: number;

  // ----------------------------------------------------------
  // Menor valor permitido.
  // ----------------------------------------------------------

  valorMinimo: number;

  // ----------------------------------------------------------
  // Maior valor permitido.
  // ----------------------------------------------------------

  valorMaximo: number;

  // ----------------------------------------------------------
  // Indica se a medida está selecionada.
  // ----------------------------------------------------------

  selecionado?: boolean;

  // ----------------------------------------------------------
  // Função executada ao selecionar a medida.
  // ----------------------------------------------------------

  onClick?: () => void;

  // ----------------------------------------------------------
  // Função chamada quando o usuário altera a medida
  // arrastando a bolinha.
  // ----------------------------------------------------------

  onChange?: (
    medida: MeasurementName,
    valor: number
  ) => void;
}

// ============================================================
// COMPONENTE
// ============================================================

export function MeasurementPoint({
  medida,
  x,
  y,
  valor,
  valorBase,
  valorMinimo,
  valorMaximo,
  selecionado = false,
  onClick,
  onChange,
}: MeasurementPointProps) {

  // ==========================================================
  // CONTROLE DO ARRASTE
  // ==========================================================
  //
  // Guarda se o usuário está atualmente arrastando
  // a bolinha.
  //
  // ==========================================================

  const [arrastando, setArrastando] =
    useState(false);

  // ==========================================================
  // POSIÇÃO VISUAL DA BOLINHA
  // ==========================================================
  //
  // A posição visual começa na posição recebida pelo componente.
  //
  // Depois podemos deslocá-la de acordo com o valor da medida.
  //
  // ==========================================================

  const [posicao, setPosicao] = useState({
    x,
    y,
  });

  // ==========================================================
  // REFERÊNCIA DO INÍCIO DO ARRASTE
  // ==========================================================
  //
  // Usamos uma referência porque precisamos guardar a posição
  // inicial do ponteiro e o valor inicial da medida.
  //
  // ==========================================================

  const inicioArraste = useRef<{
    ponteiroX: number;
    ponteiroY: number;
    valor: number;
  } | null>(null);

  // ==========================================================
  // DIREÇÃO DO ARRASTE
  // ==========================================================
  //
  // As medidas de largura utilizam movimento horizontal.
  //
  // A altura utiliza movimento vertical.
  //
  // ==========================================================

  const medidaVertical =
    medida === "altura";

  // ==========================================================
  // CONVERTE VALOR EM POSIÇÃO VISUAL
  // ==========================================================
  //
  // Quando o valor é alterado digitando no campo, precisamos
  // também movimentar a bolinha.
  //
  // Para isso calculamos uma posição baseada na diferença
  // entre o valor atual e o valor base.
  //
  // ==========================================================

  useEffect(() => {

    const diferenca =
      valor - valorBase;

    // --------------------------------------------------------
    // Altura:
    //
    // valores maiores fazem a bolinha subir.
    // --------------------------------------------------------

    if (medidaVertical) {

      const novaY =
        y - diferenca * 0.5;

      setPosicao({
        x,
        y: Math.max(
          8,
          Math.min(92, novaY)
        ),
      });

      return;
    }

    // --------------------------------------------------------
    // Medidas horizontais:
    //
    // valores maiores fazem a bolinha se deslocar
    // horizontalmente.
    //
    // --------------------------------------------------------

    const novaX =
      x + diferenca * 0.8;

    setPosicao({
      x: Math.max(
        20,
        Math.min(80, novaX)
      ),
      y,
    });

  }, [
    valor,
    valorBase,
    x,
    y,
    medidaVertical,
  ]);

  // ==========================================================
  // INÍCIO DO ARRASTE
  // ==========================================================

  function iniciarArraste(
    event: React.PointerEvent<HTMLButtonElement>
  ) {

    // --------------------------------------------------------
    // Impede que o navegador interprete o movimento como
    // seleção de texto ou outro comportamento padrão.
    // --------------------------------------------------------

    event.preventDefault();

    // --------------------------------------------------------
    // Marca a bolinha como sendo arrastada.
    // --------------------------------------------------------

    setArrastando(true);

    // --------------------------------------------------------
    // Guarda a posição inicial do ponteiro e o valor inicial.
    // --------------------------------------------------------

    inicioArraste.current = {
      ponteiroX: event.clientX,
      ponteiroY: event.clientY,
      valor,
    };

    // --------------------------------------------------------
    // Captura o ponteiro.
    //
    // Isso permite continuar recebendo o movimento mesmo
    // quando o mouse sair um pouco de cima da bolinha.
    // --------------------------------------------------------

    event.currentTarget.setPointerCapture(
      event.pointerId
    );

    // --------------------------------------------------------
    // Seleciona a medida.
    // --------------------------------------------------------

    onClick?.();
  }

  // ==========================================================
  // MOVIMENTO DURANTE O ARRASTE
  // ==========================================================

  function moverArraste(
    event: React.PointerEvent<HTMLButtonElement>
  ) {

    // --------------------------------------------------------
    // Se não estivermos arrastando, não fazemos nada.
    // --------------------------------------------------------

    if (
      !arrastando ||
      !inicioArraste.current
    ) {
      return;
    }

    // --------------------------------------------------------
    // Calcula quanto o ponteiro se moveu desde o início.
    // --------------------------------------------------------

    const deslocamentoX =
      event.clientX -
      inicioArraste.current.ponteiroX;

    const deslocamentoY =
      event.clientY -
      inicioArraste.current.ponteiroY;

    // ========================================================
    // CALCULA O NOVO VALOR
    // ========================================================

    let novoValor: number;

    if (medidaVertical) {

      // ------------------------------------------------------
      // Altura:
      //
      // subir = aumentar
      // descer = diminuir
      //
      // O fator 1.5 deixa a alteração confortável para o
      // usuário.
      // ------------------------------------------------------

      novoValor =
        inicioArraste.current.valor -
        deslocamentoY / 1.5;

    } else {

      // ------------------------------------------------------
      // Demais medidas:
      //
      // direita = aumentar
      // esquerda = diminuir
      //
      // ------------------------------------------------------

      novoValor =
        inicioArraste.current.valor +
        deslocamentoX / 2;
    }

    // --------------------------------------------------------
    // Arredonda para uma casa decimal.
    // --------------------------------------------------------

    novoValor =
      Math.round(novoValor * 10) / 10;

    // --------------------------------------------------------
    // Garante que o valor fique dentro dos limites.
    // --------------------------------------------------------

    novoValor =
      Math.max(
        valorMinimo,
        Math.min(
          valorMaximo,
          novoValor
        )
      );

    // --------------------------------------------------------
    // Envia o novo valor para o BodyEditor.
    // --------------------------------------------------------

    onChange?.(
      medida,
      novoValor
    );
  }

  // ==========================================================
  // FINAL DO ARRASTE
  // ==========================================================

  function finalizarArraste() {

    setArrastando(false);

    inicioArraste.current = null;
  }

  // ==========================================================
  // INTERFACE
  // ==========================================================

  return (

    <button
      type="button"

      // ------------------------------------------------------
      // Início do arraste.
      // ------------------------------------------------------

      onPointerDown={
        iniciarArraste
      }

      // ------------------------------------------------------
      // Movimento da bolinha.
      // ------------------------------------------------------

      onPointerMove={
        moverArraste
      }

      // ------------------------------------------------------
      // Final do arraste.
      // ------------------------------------------------------

      onPointerUp={
        finalizarArraste
      }

      onPointerCancel={
        finalizarArraste
      }

      // ------------------------------------------------------
      // Acessibilidade.
      // ------------------------------------------------------

      aria-label={
        `${medida}: ${valor} cm. ` +
        `Arraste para alterar a medida.`
      }

      style={{
        position: "absolute",

        left: `${posicao.x}%`,

        top: `${posicao.y}%`,

        transform:
          "translate(-50%, -50%)",

        width:
          selecionado || arrastando
            ? "20px"
            : "16px",

        height:
          selecionado || arrastando
            ? "20px"
            : "16px",

        borderRadius: "50%",

        border:
          "3px solid white",

        backgroundColor:
          selecionado || arrastando
            ? "#9254e1"
            : "#402b47",

        cursor:
          arrastando
            ? "grabbing"
            : "grab",

        padding: 0,

        zIndex: 20,

        touchAction: "none",

        boxShadow:
          selecionado || arrastando
            ? "0 0 0 5px rgba(146, 84, 225, 0.18), 0 3px 8px rgba(0, 0, 0, 0.25)"
            : "0 2px 6px rgba(0, 0, 0, 0.25)",

        transition:
          arrastando
            ? "none"
            : "box-shadow 0.15s ease, width 0.15s ease, height 0.15s ease",
      }}
    >

      {/* ====================================================
          VALOR DA MEDIDA
          ==================================================== */}

      <span
        style={{
          position: "absolute",

          left: "50%",

          top: "100%",

          transform:
            "translateX(-50%)",

          marginTop: "7px",

          whiteSpace: "nowrap",

          fontSize: "12px",

          fontWeight: 600,

          color: "#262423",

          pointerEvents: "none",

          backgroundColor:
            "rgba(255, 255, 255, 0.92)",

          padding:
            "2px 6px",

          borderRadius:
            "6px",

          boxShadow:
            "0 1px 4px rgba(0, 0, 0, 0.12)",
        }}
      >
        {valor} cm
      </span>

    </button>
  );
}