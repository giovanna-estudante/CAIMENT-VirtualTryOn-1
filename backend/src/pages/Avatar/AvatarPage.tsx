import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Ruler,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AvatarViewer } from '@/components/avatar/AvatarViewer';
import { CaimentRobot } from '@/components/caiment/CaimentRobot';

import { useAuth } from '@/context/AuthContext';

import { getAvatar } from '@/services/firebase/avatar';

import {
  getMeasurements,
  type UserMeasurements,
} from '@/services/firebase/measurements';

export default function AvatarPage() {
  const { user } = useAuth();

  const [modelUrl, setModelUrl] =
    useState<string | null>(null);

  const [measurements, setMeasurements] =
    useState<UserMeasurements | null>(null);

  const [loadingAvatar, setLoadingAvatar] =
    useState(true);

  useEffect(() => {
    async function loadAvatarData() {
      if (!user) {
        setLoadingAvatar(false);
        return;
      }

      try {
        const [avatar, savedMeasurements] =
          await Promise.all([
            getAvatar(user.uid),
            getMeasurements(user.uid),
          ]);

        if (avatar?.modelUrl) {
          setModelUrl(avatar.modelUrl);
        }

        if (savedMeasurements) {
          setMeasurements(savedMeasurements);
        }
      } catch (error) {
        console.error(
          'Erro ao carregar dados do avatar:',
          error
        );
      } finally {
        setLoadingAvatar(false);
      }
    }

    loadAvatarData();
  }, [user]);

  return (
    <DashboardLayout title="Meu Avatar">
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">

        {/* ========================= */}
        {/* AVATAR */}
        {/* ========================= */}

        <Card
          padding="none"
          className="overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 pt-5">

            <h2 className="font-display text-xl font-medium text-caiment-ink">
              <span className="italic">
                Meu
              </span>
              CAIMENT
            </h2>

            <CaimentRobot
              pose="heart"
              size={56}
            />

          </div>

          {/* CARREGANDO */}

          {loadingAvatar ? (

            <div className="flex aspect-[4/5] w-full items-center justify-center bg-caiment-purple-50/60">

              <p className="text-sm text-caiment-ink-soft">
                Carregando seu avatar...
              </p>

            </div>

          ) : modelUrl ? (

            /* AVATAR REAL */

            <AvatarViewer
              modelUrl={modelUrl}
              className="aspect-[4/5] w-full"
            />

          ) : (

            /* ESTADO SEM AVATAR */

            <div className="relative flex aspect-[4/5] w-full flex-col items-center justify-center overflow-hidden bg-caiment-ink px-8 text-center">

              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-caiment-purple-600/30 blur-3xl" />

              <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-caiment-lime/10 blur-3xl" />

              <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl bg-caiment-purple-500 text-white shadow-lg">
                <Sparkles size={28} />
              </div>

              <h3 className="relative mt-6 font-display text-2xl font-medium text-white">
                Seu avatar ainda não foi criado
              </h3>

              <p className="relative mt-2 max-w-md text-sm leading-relaxed text-white/60">
                Crie seu avatar personalizado
                para começar a experimentar
                suas peças no provador virtual.
              </p>

              <Link to="/avatar-criacao">
                <Button
                  className="relative mt-7 bg-caiment-lime text-caiment-ink hover:bg-caiment-lime-soft"
                >
                  Criar meu avatar
                </Button>
              </Link>

            </div>
          )}

          {/* RODAPÉ */}

          <div className="flex items-center justify-between border-t border-caiment-line px-6 py-4">

            <p className="text-xs text-caiment-ink-soft">
              {modelUrl
                ? 'Avatar personalizado disponível'
                : 'Nenhum avatar criado ainda'}
            </p>

            <Link to="/avatar-criacao">
              <Button
                size="sm"
                variant="outline"
                icon={<RefreshCw size={14} />}
              >
                {modelUrl
                  ? 'Refazer fotos'
                  : 'Criar avatar'}
              </Button>
            </Link>

          </div>
        </Card>

        {/* ========================= */}
        {/* INFORMAÇÕES */}
        {/* ========================= */}

        <div className="space-y-6">

          {/* MEDIDAS */}

          <Card>

            <div className="flex items-center gap-2.5">

              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-caiment-purple-50 text-caiment-purple-500">
                <Ruler size={17} />
              </span>

              <h3 className="font-display text-lg font-medium text-caiment-ink">
                Suas medidas
              </h3>

            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">

              {measurements ? (

                <>
                  {/* ALTURA */}

                  <MeasurementCard
                    label="Altura"
                    value={measurements.height}
                    unit="cm"
                  />

                  {/* PESO */}

                  <MeasurementCard
                    label="Peso"
                    value={measurements.weight}
                    unit="kg"
                  />

                  {/* OMBROS */}

                  <MeasurementCard
                    label="Ombros"
                    value={measurements.shoulders}
                    unit="cm"
                  />

                  {/* BUSTO */}

                  <MeasurementCard
                    label="Busto / Tórax"
                    value={measurements.bust}
                    unit="cm"
                  />

                  {/* CINTURA */}

                  <MeasurementCard
                    label="Cintura"
                    value={measurements.waist}
                    unit="cm"
                  />

                  {/* QUADRIL */}

                  <MeasurementCard
                    label="Quadril"
                    value={measurements.hip}
                    unit="cm"
                  />

                  {/* BRAÇO */}

                  <MeasurementCard
                    label="Braço"
                    value={measurements.arm}
                    unit="cm"
                  />

                  {/* PERNA */}

                  <MeasurementCard
                    label="Perna"
                    value={measurements.leg}
                    unit="cm"
                  />
                </>

              ) : (

                <div className="col-span-2 rounded-2xl bg-caiment-purple-50/60 p-5 text-center">

                  <p className="text-sm text-caiment-ink-soft">
                    Você ainda não cadastrou
                    suas medidas.
                  </p>

                </div>

              )}

            </div>

            <Link to="/configuracoes">

              <Button
                fullWidth
                size="sm"
                variant="outline"
                className="mt-4"
              >
                Editar medidas
              </Button>

            </Link>

          </Card>

          {/* INFORMAÇÃO */}

          <Card className="bg-caiment-purple-50/50">

            <p className="text-sm text-caiment-ink">
              Suas medidas são utilizadas para
              personalizar o avatar e auxiliar na
              experiência de provador virtual.
            </p>

          </Card>

        </div>

      </div>
    </DashboardLayout>
  );
}

/* ========================= */
/* COMPONENTE DE MEDIDA */
/* ========================= */

function MeasurementCard({
  label,
  value,
  unit,
}: {
  label: string;
  value?: number;
  unit: string;
}) {
  const hasValue =
    typeof value === 'number' &&
    value > 0;

  return (
    <div className="rounded-2xl bg-caiment-purple-50/60 px-3.5 py-2.5">

      <p className="text-[11px] text-caiment-ink-soft">
        {label}
      </p>

      <p className="text-sm font-medium text-caiment-ink">
        {hasValue
          ? `${value} ${unit}`
          : '--'}
      </p>

    </div>
  );
}