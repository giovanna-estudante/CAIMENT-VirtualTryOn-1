// ============================================================
// CAIMENT - CADASTRO - ETAPA 2
// Arquivo: RegisterMeasurementsPage.tsx
// ============================================================
//
// Esta página representa a segunda etapa do cadastro.
//
// Fluxo:
//
// Cadastro
//    ↓
// Conta criada
//    ↓
// Cadastro de medidas
//    ↓
// Usuário ajusta o corpo
//    ↓
// Salvar medidas no Firebase
//    ↓
// Dashboard
//
// IMPORTANTE:
//
// Esta página NÃO cria nem altera o avatar.
// Ela apenas coleta e salva as medidas corporais.
//
// O BodyEditor continua sendo responsável por:
// - mostrar o corpo;
// - mostrar as bolinhas;
// - permitir arrastar as bolinhas;
// - permitir digitar as medidas.
//
// Esta página é responsável por:
// - organizar a tela;
// - orientar o usuário;
// - receber as medidas do BodyEditor;
// - salvar as medidas no Firebase.
//
// ============================================================

import {
  useState,
  useEffect,
  type FormEvent,
} from "react";

import { useNavigate } from "react-router-dom";

import { BodyEditor } from "@/components/bodyEditor/BodyEditor";

import { Button } from "@/components/ui/Button";

import { useAuth } from "@/context/AuthContext";

import { useToast } from "@/components/ui/Toast";

import {
  getMeasurements,
  saveMeasurements,
} from "@/services/firebase/measurements";

import { updateUserProfile } from "@/services/firebase/users";

import type {
  EditableMeasurements,
} from "@/types/measurements";

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

export default function RegisterMeasurementsPage() {

  // ----------------------------------------------------------
  // NAVEGAÇÃO
  // ----------------------------------------------------------
  //
  // Usamos o navigate para levar o usuário ao Dashboard
  // depois que as medidas forem salvas.
  //
  const navigate = useNavigate();

  // ----------------------------------------------------------
  // USUÁRIO AUTENTICADO
  // ----------------------------------------------------------
  //
  // Pegamos o usuário que acabou de criar a conta.
  //
  // O UID será utilizado para salvar as medidas no Firebase.
  //
  const { user } = useAuth();

  // ----------------------------------------------------------
  // TOAST
  // ----------------------------------------------------------
  //
  // Usamos o Toast para mostrar mensagens de sucesso ou erro.
  //
  const { show } = useToast();
  // ----------------------------------------------------------
  // MEDIDAS
  // ----------------------------------------------------------
  //
  // Valores iniciais utilizados pelo editor.
  //
  // Esses valores são apenas uma referência inicial.
  // O usuário pode alterá-los arrastando as bolinhas
  // ou digitando os valores.
  //
  const [medidas, setMedidas] =
    useState<EditableMeasurements>({
      altura: 165,
      alturaPeCintura: 100,
      alturaCinturaOmbros: 45,
      ombros: 40,
      torax: 88,
      busto: 88,
      cintura: 70,
      quadril: 96,
    });

    useEffect(() => {
      async function carregarMedidas() {
        if (!user) return;

        try {
          const medidasSalvas =
            await getMeasurements(user.uid);

          if (!medidasSalvas) return;

          setMedidas({
            altura: medidasSalvas.altura ?? 165,
            alturaPeCintura:
              medidasSalvas.alturaPeCintura ?? 100,
            alturaCinturaOmbros:
              medidasSalvas.alturaCinturaOmbros ?? 45,
            ombros: medidasSalvas.ombros ?? 40,
            torax: medidasSalvas.torax ?? 88,
            busto: medidasSalvas.busto ?? 88,
            cintura: medidasSalvas.cintura ?? 70,
            quadril: medidasSalvas.quadril ?? 96,
          });
        } catch (error) {
          console.error(
            "Erro ao carregar medidas:",
            error
          );
        }
      }

      carregarMedidas();
    }, [user]);

  // ----------------------------------------------------------
  // ESTADO DE SALVAMENTO
  // ----------------------------------------------------------
  //
  // Enquanto o Firebase estiver salvando os dados,
  // desabilitamos o botão para evitar vários envios.
  //
  const [saving, setSaving] =
    useState(false);

  // ==========================================================
  // RECEBE ALTERAÇÕES DO BODY EDITOR
  // ==========================================================
  //
  // Sempre que o usuário:
  //
  // - muda o modelo corporal;
  // - arrasta uma bolinha;
  // - altera uma medida;
  //
  // o BodyEditor chama esta função.
  //
  function handleBodyChange(
    novasMedidas: EditableMeasurements
  ) {
    // Atualiza as medidas atuais.
    setMedidas(novasMedidas);
  }

  // ==========================================================
  // SALVAR MEDIDAS
  // ==========================================================
  //
  // Esta função é executada quando o usuário clica
  // em "Salvar medidas".
  //
  async function handleSubmit(
    event: FormEvent
  ) {

    // Impede o formulário de recarregar a página.
    event.preventDefault();

    // --------------------------------------------------------
    // VERIFICA SE EXISTE USUÁRIO
    // --------------------------------------------------------
    //
    // Sem usuário autenticado não temos UID para salvar
    // os dados no Firestore.
    //
    if (!user) {

      show(
        "Não foi possível identificar sua conta."
      );

      return;
    }

    // Ativa o estado de carregamento.
    setSaving(true);

    try {

      // ------------------------------------------------------
      // SALVA AS MEDIDAS
      // ------------------------------------------------------
      //
      // As medidas serão salvas em:
      //
      // users/{uid}/measurements/current
      //
      await saveMeasurements(
        user.uid,
          medidas
      );

      // ------------------------------------------------------
      // MARCA A ETAPA COMO CONCLUÍDA
      // ------------------------------------------------------
      //
      // Isso permite saber que o usuário já terminou
      // o cadastro das medidas.
      //
      await updateUserProfile(
        user.uid,
        {
          measurementsCompleted: true,
        }
      );

      // Mostra mensagem de sucesso.
      show(
        "Suas medidas foram salvas com sucesso."
      );

      // ------------------------------------------------------
      // VAI PARA O DASHBOARD
      // ------------------------------------------------------
      //
      // replace: true evita que o usuário volte para essa
      // etapa usando o botão voltar do navegador.
      //
      navigate(
        "/dashboard",
        {
          replace: true,
        }
      );

    } catch (error) {

      // Mostra o erro no console para facilitar
      // a identificação de problemas durante o desenvolvimento.
      console.error(
        "Erro ao salvar medidas:",
        error
      );

      // Mostra uma mensagem amigável para o usuário.
      show(
        "Não foi possível salvar suas medidas."
      );

    } finally {

      // Independentemente de sucesso ou erro,
      // libera o botão novamente.
      setSaving(false);
    }
  }

  // ==========================================================
  // INTERFACE
  // ==========================================================

  return (

    <div
      className="
        min-h-screen
        bg-caiment-bg
        px-4
        py-8
        sm:px-6
      "
    >

      <div
        className="
          mx-auto
          w-full
          max-w-6xl
        "
      >

        {/* ====================================================
            CABEÇALHO
            ==================================================== */}

        <header className="mb-8">

          {/* Identificação da etapa */}
          <p
            className="
              text-sm
              font-semibold
              uppercase
              tracking-wide
              text-caiment-purple-600
            "
          >
            Etapa 2 de 2
          </p>

          {/* Título principal */}
          <h1
            className="
              mt-1
              font-display
              text-3xl
              font-medium
              text-caiment-ink
              sm:text-4xl
            "
          >
            Personalize suas medidas
          </h1>

          {/* Explicação */}
          <p
            className="
              mt-3
              max-w-2xl
              text-sm
              leading-6
              text-caiment-ink-soft
              sm:text-base
            "
          >
            Você não precisa saber todas as suas medidas
            exatas. Ajuste as bolinhas no corpo para
            aproximar suas medidas ou digite os valores
            caso já os conheça.
          </p>

        </header>

        {/* ====================================================
            FORMULÁRIO PRINCIPAL
            ==================================================== */}

        <form
          onSubmit={handleSubmit}
          className="
            overflow-hidden
            rounded-3xl
            border
            border-caiment-line
            bg-white
            shadow-sm
          "
        >

          {/* ==================================================
              ÁREA DE ORIENTAÇÃO
              ================================================== */}

          <div
            className="
              border-b
              border-caiment-line
              bg-caiment-purple-50
              px-5
              py-4
              sm:px-6
            "
          >

            <div
              className="
                flex
                items-start
                gap-3
              "
            >

              {/* Ícone visual */}
              <div
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-caiment-purple-100
                  text-caiment-purple-600
                "
                aria-hidden="true"
              >
                ?
              </div>

              <div>

                <p
                  className="
                    text-sm
                    font-semibold
                    text-caiment-ink
                  "
                >
                  Como ajustar suas medidas?
                </p>

                <p
                  className="
                    mt-1
                    text-sm
                    leading-5
                    text-caiment-ink-soft
                  "
                >
                  Arraste as bolinhas que aparecem no
                  corpo para ajustar cada medida. Você
                  também pode clicar nos campos e digitar
                  um valor em centímetros.
                </p>

              </div>

            </div>

          </div>
          
          {/* ========================================================
              ÁREA PRINCIPAL DO EDITOR
              ======================================================== */}

          <div
            className="
              grid
              gap-8
              px-4
              py-6
              sm:px-6
              sm:py-8
              lg:grid-cols-[1fr_280px]
            "
          >

            {/* ======================================================
                EDITOR CORPORAL
                ====================================================== */}

            <div>

              <BodyEditor
                medidasIniciais={medidas}
                onChange={handleBodyChange}
              />

            </div>

            {/* ======================================================
                ORIENTAÇÃO DO CAIMENT
                ====================================================== */}

            <aside
              className="
                flex
                flex-col
                items-center
                justify-start
                gap-4
              "
            >

              {/* ----------------------------------------------------
                  ÁREA RESERVADA PARA O ROBÔ
                  ---------------------------------------------------- */}

              <div
                className="
                  flex
                  h-40
                  w-40
                  items-center
                  justify-center
                  rounded-full
                  bg-caiment-purple-50
                "
              >

                <span
                  className="
                    text-sm
                    font-semibold
                    text-caiment-purple-600
                  "
                >
                  CAIMENT
                </span>

              </div>

              {/* ----------------------------------------------------
                  BALÃO DE FALA
                  ---------------------------------------------------- */}

              <div
                className="
                  relative
                  w-full
                  rounded-2xl
                  border
                  border-caiment-line
                  bg-white
                  p-4
                  shadow-sm
                "
              >

                {/* Pequena "cauda" do balão */}

                <div
                  className="
                    absolute
                    -top-2
                    left-1/2
                    h-4
                    w-4
                    -translate-x-1/2
                    rotate-45
                    border-l
                    border-t
                    border-caiment-line
                    bg-white
                  "
                />

                {/* Título */}

                <p
                  className="
                    relative
                    text-sm
                    font-semibold
                    text-caiment-ink
                  "
                >
                  Como ajustar?
                </p>

                {/* Explicação */}

                <p
                  className="
                    relative
                    mt-2
                    text-sm
                    leading-5
                    text-caiment-ink-soft
                  "
                >
                  Não sabe suas medidas? Sem problema!
                  Arraste as bolinhas do corpo para ajustar
                  visualmente suas medidas.
                </p>

                <p
                  className="
                    relative
                    mt-2
                    text-sm
                    leading-5
                    text-caiment-ink-soft
                  "
                >
                  Se você já souber os valores, também pode
                  digitá-los nos campos.
                </p>

              </div>

            </aside>

          </div>

          {/* ==================================================
              ÁREA INFERIOR
              ================================================== */}

          <div
            className="
              border-t
              border-caiment-line
              bg-caiment-bg
              px-5
              py-5
              sm:px-6
            "
          >

            <div
              className="
                flex
                flex-col
                gap-4
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >

              {/* Informação antes do botão */}
              <div>

                <p
                  className="
                    text-sm
                    font-medium
                    text-caiment-ink
                  "
                >
                  Pronto para continuar?
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    text-caiment-ink-soft
                  "
                >
                  Suas medidas serão salvas na sua conta.
                </p>

              </div>

              {/* Botão de salvar */}
              <Button
                type="submit"
                size="lg"
                disabled={saving}
              >
                {saving
                  ? "Salvando medidas..."
                  : "Salvar medidas"}
              </Button>

            </div>

          </div>

        </form>

      </div>

    </div>
  );
}