// ============================================================
// CAIMENT
// Arquivo: SettingsPage.tsx
// ============================================================
//
// Esta página reúne as configurações do usuário.
//
// Seções:
// - Perfil
// - Dados do avatar / Medidas
// - Privacidade
// - Notificações
// - Preferências
//
// A parte de MEDIDAS utiliza a mesma estrutura criada para
// o cadastro da segunda etapa:
//
// UserMeasurements
// ├── modelo
// └── medidas
//     ├── altura
//     ├── ombros
//     ├── torax
//     ├── cintura
//     └── quadril
//     └── busto
//
// Os dados são salvos no Firebase em:
//
// users/{uid}/measurements/current
//
// IMPORTANTE:
// Esta página NÃO cria nem altera o avatar.
// Ela apenas permite consultar e editar as medidas salvas.
// ============================================================

import { useEffect, useState } from 'react';

// ============================================================
// ÍCONES
// ============================================================

import {
  User,
  Ruler,
  ShieldCheck,
  Bell,
  SlidersHorizontal,
  Pencil,
  Phone,
  Mail as MailIcon,
  FileText,
  Trash2,
} from 'lucide-react';

// ============================================================
// COMPONENTES
// ============================================================

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

// ============================================================
// AUTENTICAÇÃO
// ============================================================

import { useAuth } from '@/context/AuthContext';

// ============================================================
// FIREBASE - PERFIL
// ============================================================

import {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
} from '@/services/firebase/users';

// ============================================================
// FIREBASE - MEDIDAS
// ============================================================
//
// O serviço possui:
// - getMeasurements()
// - saveMeasurements()
//
// ============================================================

import {
  getMeasurements,
  saveMeasurements,
} from '@/services/firebase/measurements';

// ============================================================
// FIREBASE AUTH
// ============================================================

import { deleteCurrentUser } from '@/services/firebase/auth';

// ============================================================
// TIPOS DAS MEDIDAS
// ============================================================

import type {
  EditableMeasurements,
  UserMeasurements,
} from '@/types/measurements';

// ============================================================
// DADOS PADRÃO
// ============================================================
//
// Usamos os mesmos valores iniciais utilizados pelo BodyEditor.
//
// ============================================================

import {
  defaultUnisexMeasurements,
} from '@/data/bodyMeasurement';

// ============================================================
// UTILITÁRIO DE CLASSES
// ============================================================

import { cn } from '@/utils/cn';

// ============================================================
// TIPOS DAS SEÇÕES
// ============================================================

type Section =
  | 'perfil'
  | 'medidas'
  | 'privacidade'
  | 'notificacoes'
  | 'preferencias';

// ============================================================
// MENU DE CONFIGURAÇÕES
// ============================================================

const sections: {
  id: Section;
  label: string;
  icon: typeof User;
}[] = [
  {
    id: 'perfil',
    label: 'Perfil',
    icon: User,
  },
  {
    id: 'medidas',
    label: 'Dados do avatar',
    icon: Ruler,
  },
  {
    id: 'privacidade',
    label: 'Privacidade',
    icon: ShieldCheck,
  },
  {
    id: 'notificacoes',
    label: 'Notificações',
    icon: Bell,
  },
  {
    id: 'preferencias',
    label: 'Preferências',
    icon: SlidersHorizontal,
  },
];

// ============================================================
// COMPONENTE TOGGLE
// ============================================================
//
// Esse componente é usado nas seções de:
// - Privacidade
// - Notificações
// - Preferências
//
// ============================================================

function Toggle({
  label,
  description,
  defaultChecked,
}: {
  label: string;
  description: string;
  defaultChecked?: boolean;
}) {
  const [checked, setChecked] = useState(
    !!defaultChecked
  );

  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div>
        <p className="text-sm font-medium text-caiment-ink">
          {label}
        </p>

        <p className="text-xs text-caiment-ink-soft">
          {description}
        </p>
      </div>

      <button
        onClick={() =>
          setChecked((value) => !value)
        }
        role="switch"
        aria-checked={checked}
        className={cn(
          'relative h-6 w-11 shrink-0 rounded-full transition-colors',
          checked
            ? 'bg-caiment-purple-600'
            : 'bg-caiment-purple-100',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
            checked
              ? 'translate-x-5'
              : 'translate-x-0.5',
          )}
        />
      </button>
    </div>
  );
}

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

export default function SettingsPage() {

  // ==========================================================
  // SEÇÃO ATUAL
  // ==========================================================

  const [active, setActive] =
    useState<Section>('perfil');

  // ==========================================================
  // AUTENTICAÇÃO E TOAST
  // ==========================================================

  const { show } = useToast();

  const { user } = useAuth();

  // ==========================================================
  // PERFIL
  // ==========================================================

  const [name, setName] = useState('');

  const [email, setEmail] = useState('');

  const [loadingProfile, setLoadingProfile] =
    useState(true);

  const [savingProfile, setSavingProfile] =
    useState(false);

  // ==========================================================
  // MEDIDAS
  // ==========================================================

  const [measurements, setMeasurements] =
    useState<UserMeasurements>({
        ...defaultUnisexMeasurements,
    });

  const [loadingMeasurements, setLoadingMeasurements] =
    useState(false);

  const [savingMeasurements, setSavingMeasurements] =
    useState(false);

  // ==========================================================
  // CARREGAR PERFIL
  // ==========================================================

  useEffect(() => {
    async function loadProfile() {

      // Se não houver usuário autenticado,
      // não há perfil para carregar.

      if (!user) {
        setLoadingProfile(false);
        return;
      }

      try {

        // Busca o perfil no Firestore.

        const profile =
          await getUserProfile(user.uid);

        if (profile) {

          // Utiliza o nome salvo no Firestore.

          setName(profile.name || '');

          // Utiliza o e-mail salvo no Firestore.
          // Caso não exista, utiliza o e-mail do Auth.

          setEmail(
            profile.email ||
              user.email ||
              '',
          );

        } else {

          // Caso o perfil não exista,
          // utiliza os dados disponíveis no Firebase Auth.

          setName(
            user.displayName || '',
          );

          setEmail(
            user.email || '',
          );
        }

      } catch (error) {

        console.error(
          'Erro ao carregar perfil:',
          error,
        );

        // Mesmo se houver erro no Firestore,
        // tentamos utilizar os dados do Auth.

        setName(
          user.displayName || '',
        );

        setEmail(
          user.email || '',
        );

      } finally {

        setLoadingProfile(false);
      }
    }

    loadProfile();

  }, [user]);

  // ==========================================================
  // CARREGAR MEDIDAS
  // ==========================================================
  //
  // As medidas só são buscadas quando o usuário abre
  // a seção "Dados do avatar".
  //
  // ==========================================================

  useEffect(() => {

    async function loadMeasurements() {

      // Sem usuário autenticado, não podemos buscar
      // as medidas.

      if (!user || active !== 'medidas') {
        return;
      }

      setLoadingMeasurements(true);

      try {

        // Busca:
        //
        // users/{uid}/measurements/current

        const saved =
          await getMeasurements(user.uid);

        // Se existirem medidas salvas,
        // colocamos os dados no estado da página.

        if (saved) {
          const savedData = saved as UserMeasurements & {
            medidas?: Partial<UserMeasurements>;
          };

          const { medidas, ...rest } = savedData;

          setMeasurements({
            ...rest,
            ...(medidas ?? {}),
          });
        }

      } catch (error) {

        console.error(
          'Erro ao carregar medidas:',
          error,
        );

        show(
          'Não foi possível carregar suas medidas.',
        );

      } finally {

        setLoadingMeasurements(false);
      }
    }

    loadMeasurements();

  }, [user, active, show]);

  // ==========================================================
  // ALTERAR UMA MEDIDA
  // ==========================================================

  const updateMeasurement = (
    key: keyof EditableMeasurements,
    value: string,
  ) => {
    setMeasurements((previous) => ({
      ...previous,
      [key]:
        value === ''
          ? 0
          : Number(value),
    }));
  };

  // ==========================================================
  // SALVAR PERFIL
  // ==========================================================

  const handleSaveProfile = async () => {

    if (!user) {

      show(
        'Você precisa estar conectado para salvar as alterações.',
      );

      return;
    }

    if (!name.trim()) {

      show('Digite seu nome.');

      return;
    }

    setSavingProfile(true);

    try {

      await updateUserProfile(
        user.uid,
        {
          name: name.trim(),
        },
      );

      show(
        'Perfil atualizado com sucesso.',
      );

    } catch (error) {

      console.error(
        'Erro ao atualizar perfil:',
        error,
      );

      show(
        'Não foi possível atualizar o perfil.',
      );

    } finally {

      setSavingProfile(false);
    }
  };

  // ==========================================================
  // EXCLUIR CONTA
  // ==========================================================
  //
  // Primeiro excluímos o documento do usuário no Firestore.
  //
  // Depois excluímos a conta do Firebase Authentication.
  //
  // ==========================================================

  const handleDeleteAccount = async () => {

    if (!user) {

      show(
        'Você precisa estar conectado para excluir sua conta.',
      );

      return;
    }

    const confirmed = window.confirm(
      'Tem certeza que deseja excluir sua conta? Essa ação não poderá ser desfeita.',
    );

    if (!confirmed) {
      return;
    }

    try {

      // Exclui o perfil salvo no Firestore.

      await deleteUserProfile(user.uid);

      // Exclui a conta no Firebase Authentication.

      await deleteCurrentUser();

      // Redireciona para o login.

      window.location.href = '/login';

    } catch (error: any) {

      console.error(
        'Erro ao excluir conta:',
        error,
      );

      if (
        error?.code ===
        'auth/requires-recent-login'
      ) {

        show(
          'Por segurança, faça login novamente antes de excluir sua conta.',
        );

        return;
      }

      show(
        'Não foi possível excluir sua conta. Tente novamente.',
      );
    }
  };

  // ==========================================================
  // SALVAR MEDIDAS
  // ==========================================================
  //
  // Salva exatamente o mesmo formato usado durante
  // o cadastro:
  //
  // {
  //   medidas
  // }
  //
  // Depois marcamos measurementsCompleted como true.
  //
  // ==========================================================

  const handleSaveMeasurements =
    async () => {

      if (!user) {

        show(
          'Você precisa estar conectado para salvar suas medidas.',
        );

        return;
      }

      // ======================================================
      // MEDIDAS OBRIGATÓRIAS
      // ======================================================

      const requiredMeasurements = [
        measurements.altura,
        measurements.ombros,
        measurements.torax,
        measurements.busto,
        measurements.cintura,
        measurements.quadril,
      ];

      // Verifica se alguma medida está vazia,
      // igual a zero ou negativa.

      const hasInvalidMeasurement =
        requiredMeasurements.some(
          (value) =>
            !value || value <= 0,
        );

      if (hasInvalidMeasurement) {

        show(
          'Preencha todas as medidas obrigatórias.',
        );

        return;
      }

      setSavingMeasurements(true);

      try {

        // Salva as medidas no mesmo documento utilizado
        // pelo cadastro.

        await saveMeasurements(
          user.uid,
          measurements,
        );

        // Indica no perfil que o usuário já concluiu
        // o cadastro das medidas.

        await updateUserProfile(
          user.uid,
          {
            measurementsCompleted:
              true,
          },
        );

        show(
          'Medidas salvas com sucesso.',
        );

      } catch (error) {

        console.error(
          'Erro ao salvar medidas:',
          error,
        );

        show(
          'Não foi possível salvar suas medidas.',
        );

      } finally {

        setSavingMeasurements(false);
      }
    };

  // ==========================================================
  // RENDERIZAÇÃO
  // ==========================================================

  return (
    <DashboardLayout title="Configurações">

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">

        {/* ==================================================
            MENU
            ================================================== */}

        <nav className="flex gap-1.5 overflow-x-auto lg:flex-col lg:overflow-visible">

          {sections.map(
            ({
              id,
              label,
              icon: Icon,
            }) => (

              <button
                key={id}
                onClick={() =>
                  setActive(id)
                }
                className={cn(
                  'flex shrink-0 items-center gap-2.5 rounded-2xl px-4 py-2.5 text-left text-sm font-medium transition-colors',

                  active === id
                    ? 'bg-caiment-ink text-white'
                    : 'text-caiment-ink-soft hover:bg-caiment-purple-50 hover:text-caiment-ink',
                )}
              >

                <Icon size={16} />

                {label}

              </button>
            ),
          )}

        </nav>

        <Card
          padding={
            active === 'perfil'
              ? 'none'
              : 'md'
          }
        >

          {/* ==================================================
              PERFIL
              ================================================== */}

          {active === 'perfil' && (

            <div className="grid overflow-hidden rounded-3xl sm:grid-cols-2">

              <div className="bg-caiment-purple-700 p-7">

                <h3 className="font-display text-xl font-medium text-white">

                  <span className="italic">
                    Meu
                  </span>

                  CAIMENT

                </h3>

                <div className="mt-6 space-y-3">

                  {/* NOME */}

                  <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5">

                    <input
                      value={name}
                      onChange={(event) =>
                        setName(
                          event.target.value,
                        )
                      }
                      placeholder={
                        loadingProfile
                          ? 'Carregando...'
                          : 'Nome'
                      }
                      disabled={
                        loadingProfile
                      }
                      className="w-full bg-transparent text-sm text-caiment-ink focus:outline-none"
                    />

                    <Pencil
                      size={13}
                      className="shrink-0 text-caiment-ink-soft"
                    />

                  </div>

                  {/* EMAIL */}

                  <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5">

                    <input
                      value={email}
                      readOnly
                      disabled
                      className="w-full bg-transparent text-sm text-caiment-ink/70 focus:outline-none"
                    />

                    <MailIcon
                      size={13}
                      className="shrink-0 text-caiment-ink-soft"
                    />

                  </div>

                  {/* TELEFONE */}

                  <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5">

                    <input
                      defaultValue="(11) 94433-9483"
                      className="w-full bg-transparent text-sm text-caiment-ink focus:outline-none"
                    />

                    <Phone
                      size={13}
                      className="shrink-0 text-caiment-ink-soft"
                    />

                  </div>

                  {/* SENHA */}

                  <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5">

                    <input
                      type="password"
                      value="••••••••"
                      readOnly
                      className="w-full bg-transparent text-sm text-caiment-ink focus:outline-none"
                    />

                    <Pencil
                      size={13}
                      className="shrink-0 text-caiment-ink-soft"
                    />

                  </div>

                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-5"
                  onClick={
                    handleSaveProfile
                  }
                  disabled={
                    savingProfile ||
                    loadingProfile
                  }
                >

                  {savingProfile
                    ? 'Salvando...'
                    : 'Salvar alterações'}

                </Button>

              </div>

              <div className="space-y-4 bg-caiment-lime-soft p-7">

                <a
                  href="#"
                  className="flex items-center gap-2.5 text-sm text-caiment-ink hover:underline"
                >

                  <FileText size={16} />

                  Termos de Uso

                </a>

                <div className="h-px bg-caiment-ink/10" />

                <p className="flex items-center gap-2.5 text-sm text-caiment-ink">

                  <Phone size={16} />

                  (11) 94433-9483

                </p>

                <p className="flex items-center gap-2.5 text-sm text-caiment-ink">

                  <MailIcon size={16} />

                  {email || 'Carregando...'}

                </p>

                <div className="pt-16">

                  <button
                    onClick={
                      handleDeleteAccount
                    }
                    className="flex items-center gap-2 text-xs font-medium text-caiment-ink/70 hover:text-caiment-ink"
                  >

                    <Trash2 size={13} />

                    Excluir conta

                  </button>

                </div>

              </div>

            </div>
          )}

          {/* ==================================================
              MEDIDAS
              ================================================== */}

          {active === 'medidas' && (

            <div>

              <div>

                <h3 className="font-display text-lg font-medium text-caiment-ink">
                  Dados do avatar
                </h3>

                <p className="mt-1 text-sm text-caiment-ink-soft">
                  Cadastre ou atualize suas medidas
                  para personalizar seu perfil corporal.
                </p>

              </div>

              {loadingMeasurements ? (

                <div className="mt-6 rounded-2xl bg-caiment-purple-50/60 p-6 text-center">

                  <p className="text-sm text-caiment-ink-soft">
                    Carregando suas medidas...
                  </p>

                </div>

              ) : (

                <>

                  {/* ==================================================
                      CAMPOS DE MEDIDAS
                      ================================================== */}

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">

                    {/* ALTURA */}

                    <div>

                      <label className="text-xs font-medium text-caiment-ink-soft">
                        Altura (cm)
                      </label>

                      <input
                        type="number"
                        min="1"
                        value={
                          measurements.altura ||
                          ''
                        }
                        onChange={(event) =>
                          updateMeasurement(
                            'altura',
                            event.target.value,
                          )
                        }
                        placeholder="Ex.: 168"
                        className="mt-1.5 w-full rounded-2xl border border-caiment-line bg-white px-4 py-3 text-sm text-caiment-ink outline-none transition focus:border-caiment-purple-500"
                      />

                    </div>

                    {/* OMBROS */}

                    <div>

                      <label className="text-xs font-medium text-caiment-ink-soft">
                        Ombros (cm)
                      </label>

                      <input
                        type="number"
                        min="1"
                        value={
                          measurements.ombros ||
                          ''
                        }
                        onChange={(event) =>
                          updateMeasurement(
                            'ombros',
                            event.target.value,
                          )
                        }
                        placeholder="Ex.: 42"
                        className="mt-1.5 w-full rounded-2xl border border-caiment-line bg-white px-4 py-3 text-sm text-caiment-ink outline-none transition focus:border-caiment-purple-500"
                      />

                    </div>

                    {/* TÓRAX */}

                    <div>

                      <label className="text-xs font-medium text-caiment-ink-soft">
                        Tórax (cm)
                      </label>

                      <input
                        type="number"
                        min="1"
                        value={
                          measurements.torax ||
                          ''
                        }
                        onChange={(event) =>
                          updateMeasurement(
                            'torax',
                            event.target.value,
                          )
                        }
                        placeholder="Ex.: 90"
                        className="mt-1.5 w-full rounded-2xl border border-caiment-line bg-white px-4 py-3 text-sm text-caiment-ink outline-none transition focus:border-caiment-purple-500"
                      />

                    </div>

                    {/* BUSTO */}

                    <div>

                      <label className="text-xs font-medium text-caiment-ink-soft">
                        Busto (cm)
                      </label>

                      <input
                        type="number"
                        min="1"
                        value={
                          measurements.busto ||
                          ''
                        }
                        onChange={(event) =>
                          updateMeasurement(
                            'busto',
                            event.target.value,
                          )
                        }
                        placeholder="Ex.: 92"
                        className="mt-1.5 w-full rounded-2xl border border-caiment-line bg-white px-4 py-3 text-sm text-caiment-ink outline-none transition focus:border-caiment-purple-500"
                      />

                    </div>

                    {/* CINTURA */}

                    <div>

                      <label className="text-xs font-medium text-caiment-ink-soft">
                        Cintura (cm)
                      </label>

                      <input
                        type="number"
                        min="1"
                        value={
                          measurements.cintura ||
                          ''
                        }
                        onChange={(event) =>
                          updateMeasurement(
                            'cintura',
                            event.target.value,
                          )
                        }
                        placeholder="Ex.: 72"
                        className="mt-1.5 w-full rounded-2xl border border-caiment-line bg-white px-4 py-3 text-sm text-caiment-ink outline-none transition focus:border-caiment-purple-500"
                      />

                    </div>

                    {/* QUADRIL */}

                    <div>

                      <label className="text-xs font-medium text-caiment-ink-soft">
                        Quadril (cm)
                      </label>

                      <input
                        type="number"
                        min="1"
                        value={
                          measurements.quadril ||
                          ''
                        }
                        onChange={(event) =>
                          updateMeasurement(
                            'quadril',
                            event.target.value,
                          )
                        }
                        placeholder="Ex.: 96"
                        className="mt-1.5 w-full rounded-2xl border border-caiment-line bg-white px-4 py-3 text-sm text-caiment-ink outline-none transition focus:border-caiment-purple-500"
                      />

                    </div>
                    
                    {/* ALTURA PÉ CINTURA */}

                    <div>

                      <label className="text-xs font-medium text-caiment-ink-soft">
                        Pernas (considere do chão até sua cintura) (cm)
                      </label>

                      <input
                        type="number"
                        min="1"
                        value={measurements.alturaPeCintura || ''}
                        onChange={(event) =>
                          updateMeasurement(
                            'alturaPeCintura',
                            event.target.value,
                          )
                        }
                        placeholder="Ex.: 96"
                        className="mt-1.5 w-full rounded-2xl border border-caiment-line bg-white px-4 py-3 text-sm text-caiment-ink outline-none transition focus:border-caiment-purple-500"
                      />

                    </div>

                    {/* ALTURA CINTURA OMBROS */}

                    <div>

                      <label className="text-xs font-medium text-caiment-ink-soft">
                        Tronco (considere da cintura até seus ombros) (cm)
                      </label>

                      <input
                        type="number"
                        min="1"
                        value={measurements.alturaCinturaOmbros || ''}
                        onChange={(event) =>
                          updateMeasurement(
                            'alturaCinturaOmbros',
                            event.target.value,
                          )
                        }
                        placeholder="Ex.: 46"
                        className="mt-1.5 w-full rounded-2xl border border-caiment-line bg-white px-4 py-3 text-sm text-caiment-ink outline-none transition focus:border-caiment-purple-500"
                      />

                    </div>
                  </div>

                  {/* ==================================================
                      BOTÃO SALVAR
                      ================================================== */}

                  <div className="mt-5 flex justify-end">

                    <Button
                      size="sm"
                      onClick={
                        handleSaveMeasurements
                      }
                      disabled={
                        savingMeasurements
                      }
                    >

                      {savingMeasurements
                        ? 'Salvando...'
                        : 'Salvar medidas'}

                    </Button>

                  </div>

                </>
              )}

            </div>
          )}

          {/* ==================================================
              PRIVACIDADE
              ================================================== */}

          {active === 'privacidade' && (

            <div className="divide-y divide-caiment-line">

              <h3 className="pb-2 font-display text-lg font-medium text-caiment-ink">
                Privacidade
              </h3>

              <Toggle
                label="Compartilhar dados de medidas com marcas parceiras"
                description="Ajuda a melhorar recomendações de tamanho em outras lojas."
              />

              <Toggle
                label="Manter fotos do avatar salvas"
                description="Suas fotos originais são usadas apenas para gerar o avatar."
                defaultChecked
              />

            </div>
          )}

          {/* ==================================================
              NOTIFICAÇÕES
              ================================================== */}

          {active === 'notificacoes' && (

            <div className="divide-y divide-caiment-line">

              <h3 className="pb-2 font-display text-lg font-medium text-caiment-ink">
                Notificações
              </h3>

              <Toggle
                label="Novidades e lançamentos"
                description="Receba avisos sobre novas peças no catálogo."
                defaultChecked
              />

              <Toggle
                label="Lembretes da Caiment"
                description="Dicas e sugestões durante o uso do provador."
                defaultChecked
              />

              <Toggle
                label="E-mails promocionais"
                description="Ofertas e descontos especiais."
              />

            </div>
          )}

          {/* ==================================================
              PREFERÊNCIAS
              ================================================== */}

          {active === 'preferencias' && (

            <div className="divide-y divide-caiment-line">

              <h3 className="pb-2 font-display text-lg font-medium text-caiment-ink">
                Preferências
              </h3>

              <Toggle
                label="Unidade de medida em centímetros"
                description="Desative para usar polegadas."
                defaultChecked
              />

              <Toggle
                label="Animações reduzidas"
                description="Diminui transições e efeitos visuais."
              />

            </div>
          )}

        </Card>

      </div>

    </DashboardLayout>
  );
}