import { useEffect, useState } from 'react';
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

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/context/AuthContext';

import {
  getUserProfile,
  updateUserProfile,
} from '@/services/firebase/users';

import {
  getMeasurements,
  saveMeasurements,
  type UserMeasurements,
} from '@/services/firebase/measurements';

import { cn } from '@/utils/cn';

type Section =
  | 'perfil'
  | 'medidas'
  | 'privacidade'
  | 'notificacoes'
  | 'preferencias';

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

function Toggle({
  label,
  description,
  defaultChecked,
}: {
  label: string;
  description: string;
  defaultChecked?: boolean;
}) {
  const [checked, setChecked] =
    useState(!!defaultChecked);

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
          setChecked((v) => !v)
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

export default function SettingsPage() {
  const [active, setActive] =
    useState<Section>('perfil');

  const { show } = useToast();
  const { user } = useAuth();

  // PERFIL
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [loadingProfile, setLoadingProfile] =
    useState(true);

  const [savingProfile, setSavingProfile] =
    useState(false);

  // MEDIDAS
  const [measurements, setMeasurements] =
    useState<UserMeasurements>({
      height: 0,
      weight: 0,
      shoulders: 0,
      bust: 0,
      waist: 0,
      hip: 0,
      arm: 0,
      leg: 0,
    });

  const [loadingMeasurements, setLoadingMeasurements] =
    useState(false);

  const [savingMeasurements, setSavingMeasurements] =
    useState(false);

  // =========================
  // CARREGAR PERFIL
  // =========================

  useEffect(() => {
    async function loadProfile() {
      if (!user) {
        setLoadingProfile(false);
        return;
      }

      try {
        const profile =
          await getUserProfile(user.uid);

        if (profile) {
          setName(profile.name || '');
          setEmail(
            profile.email ||
              user.email ||
              '',
          );
        } else {
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

  // =========================
  // CARREGAR MEDIDAS
  // =========================

  useEffect(() => {
    async function loadMeasurements() {
      if (!user || active !== 'medidas') {
        return;
      }

      setLoadingMeasurements(true);

      try {
        const saved =
          await getMeasurements(user.uid);

        if (saved) {
          setMeasurements({
            height: saved.height ?? 0,
            weight: saved.weight ?? 0,
            shoulders:
              saved.shoulders ?? 0,
            bust: saved.bust ?? 0,
            waist: saved.waist ?? 0,
            hip: saved.hip ?? 0,
            arm: saved.arm ?? 0,
            leg: saved.leg ?? 0,
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

  // =========================
  // SALVAR PERFIL
  // =========================

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

  // =========================
  // SALVAR MEDIDAS
  // =========================

  const handleSaveMeasurements =
    async () => {
      if (!user) {
        show(
          'Você precisa estar conectado para salvar suas medidas.',
        );

        return;
      }

      const requiredMeasurements = [
        measurements.height,
        measurements.shoulders,
        measurements.bust,
        measurements.waist,
        measurements.hip,
        measurements.arm,
        measurements.leg,
      ];

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
        await saveMeasurements(
          user.uid,
          measurements,
        );

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

  // =========================
  // ATUALIZAR MEDIDA
  // =========================

  const updateMeasurement = (
    key: keyof UserMeasurements,
    value: string,
  ) => {
    setMeasurements((prev) => ({
      ...prev,
      [key]:
        value === ''
          ? 0
          : Number(value),
    }));
  };

  return (
    <DashboardLayout title="Configurações">

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">

        {/* MENU */}

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

          {/* ========================= */}
          {/* PERFIL */}
          {/* ========================= */}

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
                      onChange={(e) =>
                        setName(
                          e.target.value,
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
                  <FileText
                    size={16}
                  />

                  Termos de Uso
                </a>

                <div className="h-px bg-caiment-ink/10" />

                <p className="flex items-center gap-2.5 text-sm text-caiment-ink">
                  <Phone size={16} />

                  (11) 94433-9483
                </p>

                <p className="flex items-center gap-2.5 text-sm text-caiment-ink">
                  <MailIcon
                    size={16}
                  />

                  {email ||
                    'Carregando...'}
                </p>

                <div className="pt-16">

                  <button className="flex items-center gap-2 text-xs font-medium text-caiment-ink/70 hover:text-caiment-ink">

                    <Trash2
                      size={13}
                    />

                    Excluir conta

                  </button>

                </div>

              </div>

            </div>
          )}

          {/* ========================= */}
          {/* MEDIDAS */}
          {/* ========================= */}

          {active === 'medidas' && (
            <div>

              <div>
                <h3 className="font-display text-lg font-medium text-caiment-ink">
                  Dados do avatar
                </h3>

                <p className="mt-1 text-sm text-caiment-ink-soft">
                  Cadastre suas medidas para
                  personalizar seu avatar e
                  melhorar a experiência no
                  provador virtual.
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

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">

                    {/* ALTURA */}

                    <div>
                      <label className="text-xs font-medium text-caiment-ink-soft">
                        Altura (cm)
                      </label>

                      <input
                        type="number"
                        min="0"
                        value={
                          measurements.height ||
                          ''
                        }
                        onChange={(e) =>
                          updateMeasurement(
                            'height',
                            e.target.value,
                          )
                        }
                        placeholder="Ex.: 168"
                        className="mt-1.5 w-full rounded-2xl border border-caiment-line bg-white px-4 py-3 text-sm text-caiment-ink outline-none transition focus:border-caiment-purple-500"
                      />
                    </div>

                    {/* PESO */}

                    <div>
                      <label className="text-xs font-medium text-caiment-ink-soft">
                        Peso (kg)
                      </label>

                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={
                          measurements.weight ||
                          ''
                        }
                        onChange={(e) =>
                          updateMeasurement(
                            'weight',
                            e.target.value,
                          )
                        }
                        placeholder="Ex.: 65"
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
                        min="0"
                        value={
                          measurements.shoulders ||
                          ''
                        }
                        onChange={(e) =>
                          updateMeasurement(
                            'shoulders',
                            e.target.value,
                          )
                        }
                        placeholder="Ex.: 42"
                        className="mt-1.5 w-full rounded-2xl border border-caiment-line bg-white px-4 py-3 text-sm text-caiment-ink outline-none transition focus:border-caiment-purple-500"
                      />
                    </div>

                    {/* BUSTO */}

                    <div>
                      <label className="text-xs font-medium text-caiment-ink-soft">
                        Busto / Tórax (cm)
                      </label>

                      <input
                        type="number"
                        min="0"
                        value={
                          measurements.bust ||
                          ''
                        }
                        onChange={(e) =>
                          updateMeasurement(
                            'bust',
                            e.target.value,
                          )
                        }
                        placeholder="Ex.: 90"
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
                        min="0"
                        value={
                          measurements.waist ||
                          ''
                        }
                        onChange={(e) =>
                          updateMeasurement(
                            'waist',
                            e.target.value,
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
                        min="0"
                        value={
                          measurements.hip ||
                          ''
                        }
                        onChange={(e) =>
                          updateMeasurement(
                            'hip',
                            e.target.value,
                          )
                        }
                        placeholder="Ex.: 96"
                        className="mt-1.5 w-full rounded-2xl border border-caiment-line bg-white px-4 py-3 text-sm text-caiment-ink outline-none transition focus:border-caiment-purple-500"
                      />
                    </div>

                    {/* BRAÇO */}

                    <div>
                      <label className="text-xs font-medium text-caiment-ink-soft">
                        Braço (cm)
                      </label>

                      <input
                        type="number"
                        min="0"
                        value={
                          measurements.arm ||
                          ''
                        }
                        onChange={(e) =>
                          updateMeasurement(
                            'arm',
                            e.target.value,
                          )
                        }
                        placeholder="Ex.: 28"
                        className="mt-1.5 w-full rounded-2xl border border-caiment-line bg-white px-4 py-3 text-sm text-caiment-ink outline-none transition focus:border-caiment-purple-500"
                      />
                    </div>

                    {/* PERNA */}

                    <div>
                      <label className="text-xs font-medium text-caiment-ink-soft">
                        Perna (cm)
                      </label>

                      <input
                        type="number"
                        min="0"
                        value={
                          measurements.leg ||
                          ''
                        }
                        onChange={(e) =>
                          updateMeasurement(
                            'leg',
                            e.target.value,
                          )
                        }
                        placeholder="Ex.: 90"
                        className="mt-1.5 w-full rounded-2xl border border-caiment-line bg-white px-4 py-3 text-sm text-caiment-ink outline-none transition focus:border-caiment-purple-500"
                      />
                    </div>

                  </div>

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

          {/* ========================= */}
          {/* PRIVACIDADE */}
          {/* ========================= */}

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

          {/* ========================= */}
          {/* NOTIFICAÇÕES */}
          {/* ========================= */}

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

          {/* ========================= */}
          {/* PREFERÊNCIAS */}
          {/* ========================= */}

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