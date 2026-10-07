// ============================================================
// CAIMENT - EDITOR CORPORAL
// ============================================================
//
// Controla o modelo corporal e as medidas editáveis:
// - alterar as medidas;
// - destacar a medida selecionada;
// - enviar as alterações para a página que estiver utilizando
//   o editor.
//
// ============================================================

import { useState } from "react";

import { UnisexBody } from "./UnisexBody";

import {
  type EditableMeasurements,
} from "../../types/measurements";

import {
  defaultUnisexMeasurements,
} from "../../data/bodyMeasurement";

// ============================================================
// PROPRIEDADES DO COMPONENTE
// ============================================================
//
// A página que utilizar o BodyEditor poderá receber:
// - as medidas atuais.
//
// Isso será utilizado posteriormente pela página de cadastro
// para salvar as medidas no Firebase.
//
// ============================================================

interface BodyEditorProps {
  medidasIniciais?: EditableMeasurements;
  onChange?: (
    medidas: EditableMeasurements
  ) => void;
}

// ============================================================
// COMPONENTE
// ============================================================

export function BodyEditor({
  medidasIniciais,
  onChange,
}: BodyEditorProps) {

  // ==========================================================
  // MEDIDAS ATUAIS
  // ==========================================================
  //
  // Guarda as medidas utilizadas pelo modelo corporal.

  const [medidas, setMedidas] =
    useState<EditableMeasurements>({
      ...defaultUnisexMeasurements,
      ...medidasIniciais,

      // ========================================================
      // COMPATIBILIDADE COM CADASTROS ANTIGOS
      // ========================================================
      //
      // Caso o usuário já tenha cadastro anterior à introdução
      // dessas medidas, usamos o valor padrão.
      //
      // BUSTO:
      // será utilizado pela Shape Key "Busto".
      //
      // OMBROS:
      // será utilizado pela Shape Key "Ombros".
      // ========================================================

      busto:
        medidasIniciais?.busto ??
        defaultUnisexMeasurements.busto,

      ombros:
        medidasIniciais?.ombros ??
        defaultUnisexMeasurements.ombros,

      alturaPeCintura:
        medidasIniciais?.alturaPeCintura ??
        defaultUnisexMeasurements.alturaPeCintura,

      alturaCinturaOmbros:
        medidasIniciais?.alturaCinturaOmbros ??
        defaultUnisexMeasurements.alturaCinturaOmbros,
    });

  // ==========================================================
  // MEDIDA SELECIONADA
  // ==========================================================
  //
  // Guarda qual medida está sendo editada/visualizada.
  //
  // Inicialmente, a medida selecionada é a altura.
  //
  // ==========================================================

  const [medidaSelecionada, setMedidaSelecionada] =
    useState<keyof EditableMeasurements>("altura");

  // ==========================================================
  // ALTERAÇÃO DE UMA MEDIDA
  // ==========================================================
  //
  // Atualiza uma medida específica sem apagar as outras.
  //
  // ==========================================================

  function alterarMedida(
    nome: keyof EditableMeasurements,
    valor: number
  ) {

    setMedidas((medidasAtuais) => {

      // ------------------------------------------------------
      // Cria uma nova versão das medidas.
      // ------------------------------------------------------

      const novasMedidas = {
        ...medidasAtuais,
        [nome]: valor,
      };

      // ------------------------------------------------------
      // Informa para o componente externo quais são as
      // medidas atualizadas.
      //
      // Isso será utilizado pela página de cadastro para
      // manter os dados que deverão ser salvos.
      // ------------------------------------------------------

      onChange?.(novasMedidas);

      return novasMedidas;
    });
  }

  // ==========================================================
  // CORPO QUE SERÁ EXIBIDO
  // ==========================================================
  //
  // Escolhe qual componente corporal deve ser renderizado
  // de acordo com o modelo selecionado.
  //
  // ==========================================================

  function renderizarCorpo() {

    // --------------------------------------------------------
    // MODELO UNISSEX
    // --------------------------------------------------------

    return (
      <UnisexBody
        medidas={medidas}
        medidaSelecionada={medidaSelecionada}
        onSelectMeasurement={setMedidaSelecionada}
        onChangeMeasurement={alterarMedida}
      />
    );
  }

  // ==========================================================
  // INTERFACE
  // ==========================================================

  // ============================================================
  // INTERFACE DO EDITOR
  // ============================================================
  //
  // Aqui organizamos visualmente:
  //
  // 1. Título do editor;
  // 2. Seleção do modelo corporal;
  // 3. Boneco;
  // 4. Campos das medidas.
  //
  // A lógica das medidas continua exatamente a mesma.
  // ============================================================

  return (
    <div
      style={{
        // Ocupa toda a largura disponível.
        width: "100%",

        // Evita que o editor fique grande demais
        // em telas muito largas.
        maxWidth: "1000px",

        // Centraliza o editor.
        margin: "0 auto",

        // Mantém um espaçamento interno.
        padding: "8px",

        // Garante que padding não aumente
        // a largura total do elemento.
        boxSizing: "border-box",
      }}
    >

      {/* ======================================================
          TÍTULO DO EDITOR
          ====================================================== */}

      <div
        style={{
          marginBottom: "20px",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "22px",
            fontWeight: 600,
            color: "#262423",
          }}
        >
          Personalizar seu corpo
        </h2>

        <p
          style={{
            marginTop: "6px",
            marginBottom: 0,
            fontSize: "14px",
            lineHeight: 1.5,
            color: "#6f6870",
          }}
        >
          Arraste as bolinhas do corpo para ajustar suas
          medidas ou digite os valores ao lado.
        </p>
      </div>


      {/* ======================================================
          ÁREA PRINCIPAL
          ====================================================== */}

      <div
        style={{
          display: "grid",

          // Em telas grandes:
          // boneco à esquerda e medidas à direita.
          gridTemplateColumns:
            "minmax(300px, 1fr) minmax(240px, 320px)",

          gap: "48px",

          alignItems: "start",

          justifyContent: "center",
        }}
      >

        {/* ====================================================
            ÁREA DO BONECO
            ==================================================== */}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",

            // Garante uma área confortável
            // para o boneco.
            minHeight: "560px",
          }}
        >

          {renderizarCorpo()}

        </div>

        {/* ====================================================
            PAINEL DE MEDIDAS
            ==================================================== */}

        <div
          style={{
            width: "100%",
            maxWidth: "320px",
          }}
        >

          {/* Título */}
          <h3
            style={{
              margin: 0,
              fontSize: "18px",
              fontWeight: 600,
              color: "#262423",
            }}
          >
            Suas medidas
          </h3>

          {/* Explicação */}
          <p
            style={{
              marginTop: "6px",
              marginBottom: "20px",
              fontSize: "13px",
              lineHeight: 1.5,
              color: "#6f6870",
            }}
          >
            Você pode ajustar os valores diretamente
            pelos campos.
          </p>

          {/* ==================================================
              ALTURA
              ================================================== */}

          <div
            style={{
              marginBottom: "14px",
            }}
          >

            <label
              htmlFor="altura"
              style={{
                display: "block",
                marginBottom: "6px",
                fontSize: "13px",
                fontWeight: 600,
                color: "#402b47",
              }}
            >
              Altura
            </label>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >

              <input
                id="altura"
                type="number"
                min="1"
                value={medidas.altura}
                onChange={(event) =>
                  alterarMedida(
                    "altura",
                    Number(event.target.value)
                  )
                }
                onFocus={() =>
                  setMedidaSelecionada("altura")
                }
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #ddd5df",
                  borderRadius: "10px",
                  outline: "none",
                  fontSize: "14px",
                  color: "#262423",
                  boxSizing: "border-box",
                }}
              />

              <span
                style={{
                  fontSize: "13px",
                  color: "#6f6870",
                }}
              >
                cm
              </span>

            </div>

          </div>

          {/* ==================================================
              OMBROS
              ================================================== */}

          <div
            style={{
              marginBottom: "14px",
            }}
          >

            <label
              htmlFor="ombros"
              style={{
                display: "block",
                marginBottom: "6px",
                fontSize: "13px",
                fontWeight: 600,
                color: "#402b47",
              }}
            >
              Ombros
            </label>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >

              <input
                id="ombros"
                type="number"
                min="1"
                value={medidas.ombros}
                onChange={(event) =>
                  alterarMedida(
                    "ombros",
                    Number(event.target.value)
                  )
                }
                onFocus={() =>
                  setMedidaSelecionada("ombros")
                }
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #ddd5df",
                  borderRadius: "10px",
                  outline: "none",
                  fontSize: "14px",
                  color: "#262423",
                  boxSizing: "border-box",
                }}
              />

              <span
                style={{
                  fontSize: "13px",
                  color: "#6f6870",
                }}
              >
                cm
              </span>

            </div>

          </div>

          {/* ==================================================
              TÓRAX
              ================================================== */}

          <div
            style={{
              marginBottom: "14px",
            }}
          >

            <label
              htmlFor="torax"
              style={{
                display: "block",
                marginBottom: "6px",
                fontSize: "13px",
                fontWeight: 600,
                color: "#402b47",
              }}
            >
              Tórax
            </label>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >

              <input
                id="torax"
                type="number"
                min="1"
                value={medidas.torax ?? ""}
                onChange={(event) =>
                  alterarMedida(
                    "torax",
                    Number(event.target.value)
                  )
                }
                onFocus={() =>
                  setMedidaSelecionada("torax")
                }
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #ddd5df",
                  borderRadius: "10px",
                  outline: "none",
                  fontSize: "14px",
                  color: "#262423",
                  boxSizing: "border-box",
                }}
              />

              <span
                style={{
                  fontSize: "13px",
                  color: "#6f6870",
                }}
              >
                cm
              </span>

            </div>

          </div>

          {/* ==================================================
              BUSTO
              ================================================== */}

          <div
            style={{
              marginBottom: "14px",
            }}
          >

            <label
              htmlFor="busto"
              style={{
                display: "block",
                marginBottom: "6px",
                fontSize: "13px",
                fontWeight: 600,
                color: "#402b47",
              }}
            >
              Busto
            </label>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >

              <input
                id="busto"
                type="number"
                min="1"
                value={medidas.busto ?? ""}
                onChange={(event) =>
                  alterarMedida(
                    "busto",
                    Number(event.target.value)
                  )
                }
                onFocus={() =>
                  setMedidaSelecionada("busto")
                }
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #ddd5df",
                  borderRadius: "10px",
                  outline: "none",
                  fontSize: "14px",
                  color: "#262423",
                  boxSizing: "border-box",
                }}
              />

              <span
                style={{
                  fontSize: "13px",
                  color: "#6f6870",
                }}
              >
                cm
              </span>

            </div>

          </div>

          {/* ==================================================
              CINTURA
              ================================================== */}

          <div
            style={{
              marginBottom: "14px",
            }}
          >

            <label
              htmlFor="cintura"
              style={{
                display: "block",
                marginBottom: "6px",
                fontSize: "13px",
                fontWeight: 600,
                color: "#402b47",
              }}
            >
              Cintura
            </label>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >

              <input
                id="cintura"
                type="number"
                min="1"
                value={medidas.cintura ?? ""}
                onChange={(event) =>
                  alterarMedida(
                    "cintura",
                    Number(event.target.value)
                  )
                }
                onFocus={() =>
                  setMedidaSelecionada("cintura")
                }
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #ddd5df",
                  borderRadius: "10px",
                  outline: "none",
                  fontSize: "14px",
                  color: "#262423",
                  boxSizing: "border-box",
                }}
              />

              <span
                style={{
                  fontSize: "13px",
                  color: "#6f6870",
                }}
              >
                cm
              </span>

            </div>

          </div>

          {/* ==================================================
              QUADRIL
              ================================================== */}

          <div
            style={{
              marginBottom: "0",
            }}
          >

            <label
              htmlFor="quadril"
              style={{
                display: "block",
                marginBottom: "6px",
                fontSize: "13px",
                fontWeight: 600,
                color: "#402b47",
              }}
            >
              Quadril
            </label>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >

              <input
                id="quadril"
                type="number"
                min="1"
                value={medidas.quadril ?? ""}
                onChange={(event) =>
                  alterarMedida(
                    "quadril",
                    Number(event.target.value)
                  )
                }
                onFocus={() =>
                  setMedidaSelecionada("quadril")
                }
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #ddd5df",
                  borderRadius: "10px",
                  outline: "none",
                  fontSize: "14px",
                  color: "#262423",
                  boxSizing: "border-box",
                }}
              />

              <span
                style={{
                  fontSize: "13px",
                  color: "#6f6870",
                }}
              >
                cm
              </span>

            </div>

          </div>

          {/* ==================================================
              ALTURA PÉ CINTURA
              ================================================== */}

          <div
            style={{
              marginBottom: "14px",
            }}
          >
            <label
              htmlFor="alturaPeCintura"
              style={{
                display: "block",
                marginBottom: "6px",
                fontSize: "13px",
                fontWeight: 600,
                color: "#402b47",
              }}
            >
              Pernas - chão até cintura
            </label>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <input
                id="alturaPeCintura"
                type="number"
                min="1"
                value={medidas.alturaPeCintura}
                onChange={(event) =>
                  alterarMedida(
                    "alturaPeCintura",
                    Number(event.target.value)
                  )
                }
                onFocus={() =>
                  setMedidaSelecionada("alturaPeCintura")
                }
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #ddd5df",
                  borderRadius: "10px",
                  outline: "none",
                  fontSize: "14px",
                  color: "#262423",
                  boxSizing: "border-box",
                }}
              />

              <span
                style={{
                  fontSize: "13px",
                  color: "#6f6870",
                }}
              >
                cm
              </span>
            </div>
          </div>

          {/* ==================================================
              ALTURA CINTURA OMBROS
              ================================================== */}
          <div
            style={{
              marginBottom: "14px",
            }}
          >
            <label
              htmlFor="alturaCinturaOmbros"
              style={{
                display: "block",
                marginBottom: "6px",
                fontSize: "13px",
                fontWeight: 600,
                color: "#402b47",
              }}
            >
              Tronco - cintura até ombros
            </label>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <input
                id="alturaCinturaOmbros"
                type="number"
                min="1"
                value={medidas.alturaCinturaOmbros}
                onChange={(event) =>
                  alterarMedida(
                    "alturaCinturaOmbros",
                    Number(event.target.value)
                  )
                }
                onFocus={() =>
                  setMedidaSelecionada("alturaCinturaOmbros")
                }
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #ddd5df",
                  borderRadius: "10px",
                  outline: "none",
                  fontSize: "14px",
                  color: "#262423",
                  boxSizing: "border-box",
                }}
              />

              <span
                style={{
                  fontSize: "13px",
                  color: "#6f6870",
                }}
              >
                cm
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}