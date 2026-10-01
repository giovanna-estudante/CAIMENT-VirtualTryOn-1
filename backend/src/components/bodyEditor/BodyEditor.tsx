// ============================================================
// CAIMENT - EDITOR CORPORAL
// Arquivo: BodyEditor.tsx
// ============================================================
//
// Controla o modelo corporal e as medidas editáveis.
// ============================================================

import { useState } from "react";

import { FemaleBody } from "./FemaleBody";
import { MaleBody } from "./MaleBody";
import { UnisexBody } from "./UnisexBody";

import {
  type BodyModel,
  type EditableMeasurements,
} from "../../types/measurements";

import {
  defaultFemaleMeasurements,
  defaultMaleMeasurements,
  defaultUnisexMeasurements,
} from "../../data/bodyMeasurement";


// ============================================================
// COMPONENTE
// ============================================================

export function BodyEditor() {

  // Modelo atualmente selecionado
  const [modelo, setModelo] = useState<BodyModel>("feminino");

  // Medidas atualmente utilizadas pelo editor
  const [medidas, setMedidas] = useState<EditableMeasurements>(
    defaultFemaleMeasurements
  );

  // Medida selecionada
  const [medidaSelecionada, setMedidaSelecionada] =
    useState<keyof EditableMeasurements>("altura");


  // ==========================================================
  // TROCA DO MODELO CORPORAL
  // ==========================================================

  function alterarModelo(novoModelo: BodyModel) {
    setModelo(novoModelo);

    // Cada modelo começa com seus próprios valores iniciais
    if (novoModelo === "feminino") {
      setMedidas(defaultFemaleMeasurements);
    }

    if (novoModelo === "masculino") {
      setMedidas(defaultMaleMeasurements);
    }

    if (novoModelo === "unissex") {
      setMedidas(defaultUnisexMeasurements);
    }

    setMedidaSelecionada("altura");
  }


  // ==========================================================
  // ALTERAÇÃO DE UMA MEDIDA
  // ==========================================================

  function alterarMedida(
    nome: keyof EditableMeasurements,
    valor: number
  ) {
    setMedidas((medidasAtuais) => ({
      ...medidasAtuais,
      [nome]: valor,
    }));
  }


  // ==========================================================
  // CORPO QUE SERÁ EXIBIDO
  // ==========================================================

  function renderizarCorpo() {
    if (modelo === "feminino") {
      return (
        <FemaleBody
          medidas={medidas}
          medidaSelecionada={medidaSelecionada}
          onSelectMeasurement={setMedidaSelecionada}
        />
      );
    }

    if (modelo === "masculino") {
      return (
        <MaleBody
          medidas={medidas}
          medidaSelecionada={medidaSelecionada}
          onSelectMeasurement={setMedidaSelecionada}
        />
      );
    }

    return (
      <UnisexBody
        medidas={medidas}
        medidaSelecionada={medidaSelecionada}
        onSelectMeasurement={setMedidaSelecionada}
      />
    );
  }


  // ==========================================================
  // INTERFACE
  // ==========================================================

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "900px",
        margin: "0 auto",
        padding: "24px",
        boxSizing: "border-box",
      }}
    >

      {/* Título */}
      <h2>Personalizar corpo</h2>

      {/* Escolha do modelo */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "24px",
        }}
      >
        <button
          type="button"
          onClick={() => alterarModelo("feminino")}
        >
          Feminino
        </button>

        <button
          type="button"
          onClick={() => alterarModelo("masculino")}
        >
          Masculino
        </button>

        <button
          type="button"
          onClick={() => alterarModelo("unissex")}
        >
          Unissex
        </button>
      </div>


      {/* Área principal */}
      <div
        style={{
          display: "flex",
          gap: "40px",
          alignItems: "flex-start",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >

        {/* Corpo */}
        <div>
          {renderizarCorpo()}
        </div>


        {/* Medidas */}
        <div
          style={{
            width: "240px",
          }}
        >
          <h3>Medidas</h3>

          {/* Altura */}
          <label>
            Altura (cm)

            <input
              type="number"
              min="1"
              value={medidas.altura}
              onChange={(event) =>
                alterarMedida(
                  "altura",
                  Number(event.target.value)
                )
              }
              onFocus={() => setMedidaSelecionada("altura")}
            />
          </label>


          {/* Ombros */}
          <label>
            Ombros (cm)

            <input
              type="number"
              min="1"
              value={medidas.ombros}
              onChange={(event) =>
                alterarMedida(
                  "ombros",
                  Number(event.target.value)
                )
              }
              onFocus={() => setMedidaSelecionada("ombros")}
            />
          </label>


          {/* Tórax */}
          <label>
            Tórax (cm)

            <input
              type="number"
              min="1"
              value={medidas.torax ?? ""}
              onChange={(event) =>
                alterarMedida(
                  "torax",
                  Number(event.target.value)
                )
              }
              onFocus={() => setMedidaSelecionada("torax")}
            />
          </label>


          {/* Cintura */}
          <label>
            Cintura (cm)

            <input
              type="number"
              min="1"
              value={medidas.cintura ?? ""}
              onChange={(event) =>
                alterarMedida(
                  "cintura",
                  Number(event.target.value)
                )
              }
              onFocus={() => setMedidaSelecionada("cintura")}
            />
          </label>


          {/* Quadril */}
          <label>
            Quadril (cm)

            <input
              type="number"
              min="1"
              value={medidas.quadril ?? ""}
              onChange={(event) =>
                alterarMedida(
                  "quadril",
                  Number(event.target.value)
                )
              }
              onFocus={() => setMedidaSelecionada("quadril")}
            />
          </label>

        </div>

      </div>

    </div>
  );
}