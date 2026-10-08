import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  Ruler,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AvatarViewer } from '@/components/avatar/AvatarViewer';
import SizeRecommendation from '@/components/clothing/SizeRecommendation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CaimentBubble } from '@/components/caiment/CaimentBubble';

import { useAuth } from '@/context/AuthContext';

import {
  getAvatar,
} from '@/services/firebase/avatar';
import { 
  getUserProfile
} from '@/services/firebase/users';

import { getMeasurements } from '@/services/firebase/measurements';

import { getCaimentMessage } from '@/data/mock/mockCaiment';
import { formatCurrency } from '@/utils/format';

interface SelectedProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  size: string;
  color: string;
  clothingModel?: string;
}

export default function FittingRoomPage() {
  const { user } = useAuth();

  const [modelUrl, setModelUrl] =
    useState<string | null>(null);

  const [avatarReady, setAvatarReady] =
    useState(false);

  const [product, setProduct] =
    useState<SelectedProduct | null>(null);

  const [measurementsReady, setMeasurementsReady] =
  useState<boolean | null>(null);

  const [measurements, setMeasurements] =
  useState<Awaited<ReturnType<typeof getMeasurements>>>(null);

  useEffect(() => {
    async function loadFittingRoom() {
      if (!user) {
        setMeasurementsReady(false);
        return;
      }

      try {
        // Verifica se o usuário já cadastrou suas medidas.
        const profile = await getUserProfile(user.uid);

        const userMeasurements =
          await getMeasurements(user.uid);

        console.log(
          '========== MEDIDAS DO USUÁRIO =========='
        );

        console.log(
          'UID:',
          user.uid
        );

        console.log(
          'PROFILE:',
          profile
        );

        console.log(
          'measurementsCompleted:',
          profile?.measurementsCompleted
        );

        console.log(
          'MEASUREMENTS:',
          userMeasurements
        );

        setMeasurements(
          userMeasurements
        );

        setMeasurementsReady(
          profile?.measurementsCompleted === true
        );

        // Carrega o avatar salvo do usuário.
        const avatar = await getAvatar(user.uid);

        if (avatar?.modelUrl) {
          setModelUrl(avatar.modelUrl);
          setAvatarReady(true);
        }

        // Recupera a peça escolhida na Fitsense.
        const savedProduct =
          sessionStorage.getItem(
            'caiment_selected_product'
          );

        if (savedProduct) {
          try {
            const parsedProduct =
              JSON.parse(savedProduct);

            setProduct(parsedProduct);
          } catch {
            console.error(
              'Não foi possível carregar a peça selecionada.'
            );
          }
        }
      } catch (error) {
        console.error(
          'Erro ao carregar dados do provador:',
          error
        );

        // Se não for possível confirmar as medidas,
        // tratamos a etapa como ainda não concluída.
        setMeasurementsReady(false);
      }
    }

    loadFittingRoom();
  }, [user]);

  const recommendation = {
    recommendedSize:
      product?.size || 'M',

    confidence: 92,

    reason:
      'Recomendação baseada nas medidas cadastradas no seu perfil e nas características da peça.',
  };

  // ============================================================
  // BLOQUEIO DO PROVADOR
  // ============================================================
  //
  // As medidas são obrigatórias para a prova da roupa,
  // pois serão utilizadas posteriormente na deformação
  // e no ajuste da peça ao corpo.
  // ============================================================
  if (measurementsReady === null) {
    return (
      <DashboardLayout title="Provador virtual">
        <Card className="flex min-h-[420px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-caiment-purple-100 border-t-caiment-purple-500" />

            <p className="mt-4 text-sm text-caiment-ink-soft">
              Verificando suas medidas...
            </p>
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  // Sem medidas cadastradas, o usuário precisa passar
  // pela etapa de personalização antes de usar o provador.
  if (!measurementsReady) {
    return (
      <DashboardLayout title="Provador virtual">
        <Card className="overflow-hidden">
          <div className="relative flex min-h-[420px] flex-col items-center justify-center overflow-hidden rounded-3xl bg-caiment-ink px-6 py-12 text-center">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-caiment-purple-600/30 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-caiment-lime/10 blur-3xl" />

            <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl bg-caiment-purple-500 text-white shadow-lg">
              <Ruler size={28} />
            </div>

            <h3 className="relative mt-6 font-display text-2xl font-medium text-white">
              Personalize suas medidas
            </h3>

            <p className="relative mt-2 max-w-md text-sm leading-relaxed text-white/60">
              Antes de usar o provador virtual,
              precisamos das suas medidas para
              personalizar sua experiência e
              recomendar tamanhos.
            </p>

            <div className="relative mt-7 flex flex-col gap-3 sm:flex-row">
              <Link to="/medidas">
                <Button className="bg-caiment-lime text-caiment-ink hover:bg-caiment-lime-soft">
                  Personalizar agora
                </Button>
              </Link>

              <Link to="/avatar">
                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Mais tarde
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Provador virtual">

      <div className="space-y-6">

        {/* CABEÇALHO */}

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

          <div>

            <p className="text-xs font-semibold uppercase tracking-wider text-caiment-purple-600">
              Provador virtual
            </p>

            <h2 className="mt-1 font-display text-2xl font-medium text-caiment-ink">
              Experimente no seu avatar
            </h2>

            <p className="mt-1 max-w-2xl text-sm text-caiment-ink-soft">
              Escolha uma peça na Fitsense e
              visualize sua experiência
              diretamente no Caiment.
            </p>

          </div>

          <CaimentBubble
            message={getCaimentMessage(
              'fitting-room',
            )}
            size="sm"
          />

        </div>

        {/* SEM PEÇA */}

        {!product ? (

          <Card className="overflow-hidden">

            <div className="relative flex min-h-[820px] flex-col items-center justify-center overflow-hidden rounded-3xl bg-caiment-ink px-6 py-12 text-center">

              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-caiment-purple-600/30 blur-3xl" />

              <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-caiment-lime/10 blur-3xl" />

              <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl bg-caiment-purple-500 text-white shadow-lg">

                <ShoppingBag
                  size={28}
                />

              </div>

              <h3 className="relative mt-6 font-display text-2xl font-medium text-white">
                Escolha uma peça para experimentar
              </h3>

              <p className="relative mt-2 max-w-md text-sm leading-relaxed text-white/60">
                Acesse a Fitsense, escolha
                uma peça de roupa e clique em
                “Experimentar no Caiment” para
                trazê-la para o seu provador.
              </p>

              <Link to="/fitsense">

                <Button
                  className="relative mt-7 bg-caiment-lime text-caiment-ink hover:bg-caiment-lime-soft"
                  icon={
                    <ShoppingBag
                      size={16}
                    />
                  }
                >
                  Explorar a Fitsense
                </Button>

              </Link>

            </div>

          </Card>

        ) : (

          <>

            {/* PROVADOR */}

            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">

              {/* AVATAR */}

              <Card
                padding="none"
                className="overflow-hidden"
              >

                <div className="relative overflow-hidden rounded-3xl bg-caiment-purple-50/60 p-3">
                  
                  {avatarReady &&
                  modelUrl ? (

                    
                    <AvatarViewer
                      modelUrl={modelUrl}
                      clothingModelUrl={product.clothingModel}
                      measurements={measurements}
                      className="h-[820px]"
                    />

                  ) : (

                    <div className="relative flex min-h-[820px] flex-col items-center justify-center overflow-hidden rounded-3xl bg-caiment-ink px-8 py-12 text-center">

                      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-caiment-purple-600/30 blur-3xl" />

                      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-caiment-lime/10 blur-3xl" />

                      <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl bg-caiment-purple-500 text-white shadow-lg">

                        <Sparkles
                          size={28}
                        />

                      </div>

                      <h3 className="relative mt-6 font-display text-2xl font-medium text-white">
                        Seu avatar ainda não está pronto
                      </h3>

                      <p className="relative mt-2 max-w-md text-sm leading-relaxed text-white/60">
                        Crie seu avatar
                        personalizado para
                        visualizar como esta
                        peça poderá ser
                        experimentada no
                        provador virtual.
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

                  {/* BADGE */}

                  {avatarReady &&
                    modelUrl && (
                      <div className="absolute left-6 top-6 flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 shadow-sm backdrop-blur">

                        <span className="h-2 w-2 animate-pulse rounded-full bg-caiment-lime-deep" />

                        <span className="text-xs font-semibold text-caiment-ink">
                          Provador ativo
                        </span>

                      </div>
                    )}

                </div>

                {/* INFORMAÇÕES */}

                <div className="flex items-center justify-between gap-4 border-t border-caiment-line px-5 py-4">

                  <div>

                    <p className="text-xs font-medium uppercase tracking-wide text-caiment-ink-soft">
                      Seu avatar
                    </p>

                    <p className="mt-1 text-sm font-medium text-caiment-ink">

                      {avatarReady &&
                      modelUrl
                        ? 'Modelo personalizado'
                        : 'Avatar ainda não criado'}

                    </p>

                  </div>

                  <Link to="/avatar">

                    <Button
                      size="sm"
                      variant="outline"
                      icon={
                        <Ruler
                          size={14}
                        />
                      }
                    >
                      Ver medidas
                    </Button>

                  </Link>

                </div>

              </Card>

              {/* INFORMAÇÕES DA PEÇA */}

              <div className="flex flex-col gap-4">

                {/* PRODUTO */}

                <Card>

                  <div className="flex gap-4">

                    <div className="h-28 w-24 shrink-0 overflow-hidden rounded-2xl bg-caiment-purple-50">

                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />

                    </div>

                    <div className="min-w-0 flex-1">

                      <p className="text-xs font-medium uppercase tracking-wide text-caiment-purple-600">
                        Fitsense
                      </p>

                      <h3 className="mt-1 font-display text-xl font-medium text-caiment-ink">
                        {product.name}
                      </h3>

                      <p className="mt-1 text-sm text-caiment-ink-soft">
                        {product.category}
                      </p>

                      <p className="mt-3 text-lg font-semibold text-caiment-ink">
                        {formatCurrency(
                          product.price,
                        )}
                      </p>

                    </div>

                  </div>

                </Card>

                {/* CARACTERÍSTICAS */}

                <Card>

                  <p className="text-xs font-semibold uppercase tracking-wide text-caiment-ink-soft">
                    Peça selecionada
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-3">

                    <div className="rounded-2xl bg-caiment-purple-50 p-4">

                      <p className="text-xs text-caiment-ink-soft">
                        Tamanho
                      </p>

                      <p className="mt-1 text-lg font-semibold text-caiment-ink">
                        {product.size}
                      </p>

                    </div>

                    <div className="rounded-2xl bg-caiment-purple-50 p-4">

                      <p className="text-xs text-caiment-ink-soft">
                        Cor
                      </p>

                      <p className="mt-1 text-sm font-semibold text-caiment-ink">
                        {product.color}
                      </p>

                    </div>

                  </div>

                </Card>

                {/* RECOMENDAÇÃO */}

                <SizeRecommendation
                  recommendation={
                    recommendation
                  }
                />

                {/* EXPERIÊNCIA */}

                <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-caiment-purple-900 via-caiment-purple-700 to-caiment-purple-500 p-6 text-white">

                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">

                    <Sparkles
                      size={19}
                    />

                  </div>

                  <h3 className="mt-4 font-display text-xl font-medium">
                    Experiência Caiment
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-white/65">
                    Esta peça foi enviada pela
                    Fitsense para ser
                    experimentada no seu
                    avatar 3D.
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-xs font-medium text-caiment-lime">

                    <span className="h-1.5 w-1.5 rounded-full bg-caiment-lime" />

                    <span>
                      Peça selecionada na Fitsense
                    </span>

                  </div>

                </div>

              </div>

            </div>

            {/* AÇÕES */}

            <Card>

              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                <div>

                  <p className="text-sm font-semibold text-caiment-ink">
                    Gostou da peça?
                  </p>

                  <p className="mt-1 text-sm text-caiment-ink-soft">
                    Volte para a Fitsense para
                    continuar sua compra.
                  </p>

                </div>

                <div className="flex flex-col gap-2 sm:flex-row">

                  <Link
                    to={`/fitsense/produtos/${product.id}`}
                  >

                    <Button
                      variant="outline"
                      icon={
                        <ArrowLeft
                          size={15}
                        />
                      }
                    >
                      Voltar para a peça
                    </Button>

                  </Link>

                  <Link to="/fitsense">

                    <Button
                      className="bg-caiment-ink text-white hover:bg-caiment-purple-900"
                      icon={
                        <ExternalLink
                          size={15}
                        />
                      }
                    >
                      Continuar na Fitsense
                    </Button>

                  </Link>

                </div>

              </div>

            </Card>

          </>

        )}

        {/* COMO FUNCIONA */}

        <div>

          <h3 className="font-display text-lg font-medium text-caiment-ink">
            Como funciona o provador
          </h3>

          <div className="mt-4 grid gap-4 md:grid-cols-3">

            {/* PASSO 1 */}

            <Card>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-caiment-purple-50 text-caiment-purple-600">

                <ShoppingBag
                  size={18}
                />

              </div>

              <p className="mt-4 text-sm font-semibold text-caiment-ink">
                Escolha na Fitsense
              </p>

              <p className="mt-1 text-sm leading-relaxed text-caiment-ink-soft">
                Encontre uma peça no catálogo
                da loja.
              </p>

            </Card>

            {/* PASSO 2 */}

            <Card>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-caiment-purple-50 text-caiment-purple-600">

                <Sparkles
                  size={18}
                />

              </div>

              <p className="mt-4 text-sm font-semibold text-caiment-ink">
                Experimente
              </p>

              <p className="mt-1 text-sm leading-relaxed text-caiment-ink-soft">
                Envie a peça para o
                provador virtual Caiment.
              </p>

            </Card>

            {/* PASSO 3 */}

            <Card>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-caiment-purple-50 text-caiment-purple-600">

                <ShirtIcon />

              </div>

              <p className="mt-4 text-sm font-semibold text-caiment-ink">
                Visualize no avatar
              </p>

              <p className="mt-1 text-sm leading-relaxed text-caiment-ink-soft">
                Veja a peça 3D no seu avatar
                personalizado.
              </p>

            </Card>

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}

function ShirtIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 3l4 2 4-2" />

      <path d="M5 6l-3 3 4 4v8h12v-8l4-4-3-3-4 2H9L5 6z" />
    </svg>
  );
}