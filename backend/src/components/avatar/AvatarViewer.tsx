// Importa recursos do React usados para estado, referências e efeitos.
import {
  Suspense,
  useEffect,
  useRef,
  useState,
} from 'react';

// Importa o Canvas e ferramentas do React Three Fiber.
import {
  Canvas,
  useThree,
} from '@react-three/fiber';

// Importa controles de câmera e sombras do Drei.
import {
  OrbitControls,
  ContactShadows,
} from '@react-three/drei';

// Importa o tipo dos controles da câmera.
import type {
  OrbitControls as OrbitControlsImpl,
} from 'three-stdlib';

// Importa as medidas cadastradas pelo usuário.
import type {
  UserMeasurements,
} from '@/services/firebase/measurements';

// Importa recursos usados para manipular os modelos 3D.
import {
  Box3,
  Vector3,
  Group,
  Mesh,
  Object3D,
} from 'three';

// Carrega arquivos GLTF/GLB.
import {
  GLTFLoader,
} from 'three/examples/jsm/loaders/GLTFLoader.js';

// Importa os ícones dos controles.
import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

// Importa componentes usados pelo visualizador.
import {
  AvatarPlaceholderModel,
} from './AvatarPlaceholderModel';

import {
  LoadingState,
} from '@/components/ui/LoadingState';

import {
  ErrorBoundary,
} from '@/components/ui/ErrorBoundary';

// ============================================================
// PROPRIEDADES DO AVATAR VIEWER
// ============================================================

interface AvatarViewerProps {
  /** URL do avatar 3D salvo. */
  modelUrl?: string | null;

  /** URL da roupa 3D selecionada. */
  clothingModelUrl?: string | null;

  /** Medidas cadastradas pelo usuário. */
  measurements?: UserMeasurements | null;

  /** Classes adicionais do componente. */
  className?: string;

  /** Define se os controles de câmera serão exibidos. */
  showControls?: boolean;
}

// ============================================================
// PROXY DO MODELO TRIPO
// ============================================================

/**
 * Converte a URL original do modelo em uma URL
 * do backend do CAIMENT.
 *
 * Assim, o navegador não acessa diretamente
 * o servidor do Tripo.
 */
function getModelProxyUrl(
  modelUrl: string
): string {
  return `/api/avatar/model?url=${encodeURIComponent(
    modelUrl
  )}`;
}

// ============================================================
// AVATAR REAL
// ============================================================

/**
 * Responsável por carregar o avatar 3D real.
 */
function RealModel({
  url,
  onLoaded,
  onError,
}: {
  url: string;
  onLoaded?: () => void;
  onError?: (error: unknown) => void;
}) {
  // Guarda o modelo depois que ele for carregado.
  const [model, setModel] =
    useState<Object3D | null>(null);

  // Guarda as funções de retorno em referências.
  const onLoadedRef =
    useRef(onLoaded);

  const onErrorRef =
    useRef(onError);

  // Mantém a referência da função de sucesso atualizada.
  useEffect(() => {
    onLoadedRef.current = onLoaded;
  }, [onLoaded]);

  // Mantém a referência da função de erro atualizada.
  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  // Inicia o carregamento do avatar.
  useEffect(() => {
    let cancelled = false;

    // Verifica se existe uma URL válida.
    if (!url) {
      console.error(
        '❌ URL do avatar está vazia.'
      );

      onErrorRef.current?.(
        new Error(
          'URL do avatar está vazia.'
        )
      );

      return;
    }

    // Cria a URL usada pelo backend do CAIMENT.
    const proxyUrl =
      getModelProxyUrl(url);

    // Mostra informações do carregamento no console.
    console.log('');
    console.log(
      '===================================='
    );
    console.log(
      '🎯 CARREGANDO AVATAR PELO BACKEND'
    );
    console.log(
      '===================================='
    );

    console.log(
      '🌐 Endpoint:',
      '/api/avatar/model'
    );

    console.log(
      '🔗 Host do modelo original:',
      (() => {
        try {
          return new URL(url)
            .hostname;
        } catch {
          return 'URL inválida';
        }
      })()
    );

    console.log(
      '📡 URL usada pelo GLTFLoader:',
      proxyUrl
    );

    // Cria o carregador GLTF.
    const loader =
      new GLTFLoader();

    // Carrega o avatar.
    loader.load(
      proxyUrl,

      // Quando o avatar termina de carregar.
      (gltf) => {
        if (cancelled) {
          return;
        }

        console.log('');
        console.log(
          '===================================='
        );
        console.log(
          '✅ AVATAR 3D CARREGADO!'
        );
        console.log(
          '===================================='
        );

        // Mostra a cena carregada.
        console.log(
          'Cena:',
          gltf.scene
        );

        // Conta as Meshes existentes no modelo.
        let meshCount = 0;

        // Percorre todos os objetos do avatar.
        gltf.scene.traverse(
          (child) => {
            const mesh =
              child as Mesh;

            // Trata somente objetos que são Mesh.
            if (mesh.isMesh) {
              meshCount++;

              // Garante que a Mesh fique visível.
              mesh.visible = true;

              // Permite que ela projete sombras.
              mesh.castShadow = true;

              // Permite que ela receba sombras.
              mesh.receiveShadow = true;

              // Garante que os materiais fiquem visíveis.
              if (mesh.material) {
                const materials =
                  Array.isArray(
                    mesh.material
                  )
                    ? mesh.material
                    : [mesh.material];

                materials.forEach(
                  (material) => {
                    material.visible = true;
                    material.needsUpdate = true;
                  }
                );
              }
            }
          }
        );

        // Mostra quantas Meshes foram encontradas.
        console.log(
          '🧩 Meshes encontradas:',
          meshCount
        );

        // Verifica se o arquivo realmente possui Meshes.
        if (meshCount === 0) {
          console.error(
            '❌ O modelo foi carregado, mas não possui meshes.'
          );

          onErrorRef.current?.(
            new Error(
              'O modelo 3D não possui meshes.'
            )
          );

          return;
        }

        // Guarda a cena carregada.
        setModel(gltf.scene);

        // Informa que o avatar está pronto.
        console.log(
          '🎉 Avatar pronto para visualizar!'
        );

        onLoadedRef.current?.();
      },

      // Mostra o progresso do carregamento.
      (progress) => {
        if (progress.total > 0) {
          const percent =
            Math.round(
              (progress.loaded /
                progress.total) *
                100
            );

          console.log(
            `📥 Avatar: ${percent}%`
          );
        }
      },

      // Trata erros no carregamento.
      (error) => {
        if (cancelled) {
          return;
        }

        console.error('');
        console.error(
          '===================================='
        );
        console.error(
          '❌ ERRO AO CARREGAR AVATAR 3D'
        );
        console.error(
          '===================================='
        );

        console.error(
          'Endpoint usado:',
          '/api/avatar/model'
        );

        console.error(
          'URL do proxy:',
          proxyUrl
        );

        console.error(
          'Erro:',
          error
        );

        onErrorRef.current?.(
          error
        );
      }
    );

    // Cancela atualizações quando o componente sai da tela.
    return () => {
      cancelled = true;
    };
  }, [url]);

  // Enquanto o modelo não existir, não renderiza nada.
  if (!model) {
    return null;
  }

  // Envia o modelo para o componente que prepara seu tamanho.
  return (
    <AvatarModelObject
      model={model}
    />
  );
}

// ============================================================
// PREPARAÇÃO DO AVATAR
// ============================================================

/**
 * Centraliza o avatar e define sua altura
 * dentro da cena 3D.
 */
function AvatarModelObject({
  model,
}: {
  model: Object3D;
}) {
  // Referência ao grupo que envolve o avatar.
  const groupRef =
    useRef<Group | null>(null);

  // Ajusta o modelo quando ele estiver disponível.
  useEffect(() => {
    const group =
      groupRef.current;

    if (!group) {
      return;
    }

    // Atualiza as transformações antes de medir.
    group.updateMatrixWorld(true);

    // Calcula os limites do avatar.
    const box =
      new Box3().setFromObject(
        group
      );

    // Guarda as dimensões do avatar.
    const size =
      new Vector3();

    box.getSize(size);

    // Mostra as dimensões no console.
    console.log(
      '📐 Tamanho do avatar:',
      {
        x: size.x,
        y: size.y,
        z: size.z,
      }
    );

    // Define a altura desejada para o avatar.
    const targetHeight =
      3.4;

    // Só redimensiona se a altura for válida.
    if (size.y > 0) {
      const scale =
        targetHeight /
        size.y;

      // Mantém a proporção do corpo.
      group.scale.setScalar(
        scale
      );
    }

    // Atualiza as transformações depois da escala.
    group.updateMatrixWorld(
      true
    );

    // Mede novamente o avatar.
    const scaledBox =
      new Box3().setFromObject(
        group
      );

    // Descobre o centro do avatar.
    const center =
      new Vector3();

    scaledBox.getCenter(
      center
    );

    // Centraliza horizontalmente.
    group.position.x =
      -center.x;

    // Centraliza no eixo Z.
    group.position.z =
      -center.z;

    // Coloca a base do avatar no chão.
    group.position.y =
      -scaledBox.min.y;

    group.updateMatrixWorld(
      true
    );

    console.log(
      '✅ Avatar posicionado.'
    );
  }, [model]);

  return (
    <group ref={groupRef}>
      <primitive
        object={model}
      />
    </group>
  );
}

// ============================================================
// ROUPA
// ============================================================

/**
 * Carrega e posiciona a roupa 3D.
 *
 * As medidas do usuário já são recebidas aqui.
 * Neste momento elas ainda não alteram a roupa.
 * Primeiro vamos descobrir quais Shape Keys
 * existem no arquivo GLB.
 */
function ClothingModel({
  url,
  measurements,
}: {
  url: string;
  measurements?: UserMeasurements | null;
}) {
  // Guarda a roupa carregada.
  const [model, setModel] =
    useState<Object3D | null>(
      null
    );

  // Carrega o arquivo GLB da roupa.
  useEffect(() => {
    const loader =
      new GLTFLoader();

    loader.load(
      url,

      // Executado quando a roupa termina de carregar.
      (gltf) => {
        console.log(
          '✅ Roupa carregada.'
        );

        // Percorre as partes da roupa.
        gltf.scene.traverse(
          (child) => {
            const mesh =
              child as Mesh;

            // Trata somente objetos que são Mesh.
            if (mesh.isMesh) {
              // Garante que a roupa fique visível.
              mesh.visible = true;

              // Permite que a roupa projete sombras.
              mesh.castShadow = true;

              // Permite que a roupa receba sombras.
              mesh.receiveShadow = true;

              // Verifica se esta Mesh possui Shape Keys.
              if (
                mesh.morphTargetDictionary
              ) {
                console.log(
                  '🎯 Shape Keys encontradas na roupa:',
                  mesh.name,
                  mesh.morphTargetDictionary
                );
              }
            }
          }
        );

        // Guarda a roupa carregada.
        setModel(
          gltf.scene
        );
      },

      // Não precisamos acompanhar o progresso da roupa neste momento.
      undefined,

      // Trata erros no carregamento da roupa.
      (error) => {
        console.error(
          '❌ Erro ao carregar roupa:',
          error
        );
      }
    );
  }, [url]);

  // Referência ao grupo que controla a roupa.
  const groupRef =
    useRef<Group | null>(null);

  // Posiciona a roupa depois que ela foi carregada.
  useEffect(() => {
    const group =
      groupRef.current;

    // Só continua quando grupo e modelo existirem.
    if (!group || !model) {
      return;
    }

    // Atualiza as transformações.
    group.updateMatrixWorld(
      true
    );

    // Calcula os limites da roupa.
    const box =
      new Box3().setFromObject(
        group
      );

    // Guarda as dimensões.
    const size =
      new Vector3();

    // Guarda o centro.
    const center =
      new Vector3();

    box.getSize(size);
    box.getCenter(center);

    // Não tenta calcular escala sem altura.
    if (size.y <= 0) {
      return;
    }

    // Altura usada atualmente para a roupa.
    const targetHeight =
      1.65;

    // Redimensiona a roupa proporcionalmente.
    group.scale.setScalar(
      targetHeight /
        size.y
    );

    // Atualiza depois da escala.
    group.updateMatrixWorld(
      true
    );

    // Mede novamente a roupa.
    const scaledBox =
      new Box3().setFromObject(
        group
      );

    // Calcula o novo centro.
    const scaledCenter =
      new Vector3();

    scaledBox.getCenter(
      scaledCenter
    );

    // Centraliza no eixo X.
    group.position.x =
      -scaledCenter.x;

    // Centraliza no eixo Z.
    group.position.z =
      -scaledCenter.z;

    // Posiciona a roupa na altura atual.
    group.position.y =
      0.95 -
      scaledCenter.y;

    // Pequeno ajuste para frente.
    group.position.z +=
      0.08;

    // Mostra as medidas recebidas somente para conferência.
    if (measurements) {
      console.log(
        '📏 Medidas recebidas pela roupa:',
        measurements
      );
    }
  }, [
    model,
    measurements,
  ]);

  // Enquanto a roupa não carregar, não renderiza nada.
  if (!model) {
    return null;
  }

  return (
    <group ref={groupRef}>
      <primitive
        object={model}
      />
    </group>
  );
}

// ============================================================
// CENA
// ============================================================

/**
 * Monta todos os elementos da cena 3D.
 */
function Scene({
  modelUrl,
  clothingModelUrl,
  measurements,
  onAvatarLoaded,
  onAvatarError,
}: {
  modelUrl?: string | null;
  clothingModelUrl?: string | null;
  measurements?: UserMeasurements | null;
  onAvatarLoaded: () => void;
  onAvatarError: () => void;
}) {
  return (
    <>
      {/* Luz principal da cena. */}
      <hemisphereLight
        args={[
          '#F4F1FC',
          '#6E42D1',
          0.55,
        ]}
      />

      {/* Iluminação geral. */}
      <ambientLight
        intensity={0.4}
      />

      {/* Luz principal com sombras. */}
      <directionalLight
        position={[
          3,
          5,
          4,
        ]}
        intensity={1.2}
        castShadow
      />

      {/* Segunda luz para diminuir áreas escuras. */}
      <directionalLight
        position={[
          -3,
          2,
          -3,
        ]}
        intensity={0.4}
      />

      {/* Luz adicional. */}
      <pointLight
        position={[
          0,
          2.5,
          -2,
        ]}
        intensity={0.3}
        color="#C6F24E"
      />

      {/* Modelos que podem carregar de forma assíncrona. */}
      <Suspense fallback={null}>
        {/* Carrega o avatar real quando existe uma URL. */}
        {modelUrl ? (
          <RealModel
            url={modelUrl}
            onLoaded={
              onAvatarLoaded
            }
            onError={
              onAvatarError
            }
          />
        ) : (
          <AvatarPlaceholderModel />
        )}

        {/* Carrega a roupa quando existe uma URL. */}
        {clothingModelUrl && (
          <ClothingModel
            url={
              clothingModelUrl
            }
            measurements={
              measurements
            }
          />
        )}
      </Suspense>

      {/* Sombra abaixo dos modelos. */}
      <ContactShadows
        position={[
          0,
          -1.55,
          0,
        ]}
        opacity={0.35}
        scale={4}
        blur={2.4}
        far={2}
      />
    </>
  );
}

// ============================================================
// CÂMERA
// ============================================================

/**
 * Define a posição inicial da câmera.
 */
function CameraController() {
  const { camera } =
    useThree();

  useEffect(() => {
    // Define a posição inicial.
    camera.position.set(
      0,
      0.35,
      5.2
    );

    // Faz a câmera olhar para o avatar.
    camera.lookAt(
      0,
      0.15,
      0
    );
  }, [camera]);

  return null;
}

// ============================================================
// VIEWER
// ============================================================

/**
 * Componente principal do visualizador 3D.
 */
export function AvatarViewer({
  modelUrl,
  clothingModelUrl,
  measurements,
  className,
  showControls = true,
}: AvatarViewerProps) {
  // Referência aos controles da câmera.
  const controlsRef =
    useRef<OrbitControlsImpl | null>(
      null
    );

  // Indica se o avatar terminou de carregar.
  const [ready, setReady] =
    useState(false);

  // Indica se ocorreu erro no avatar.
  const [modelError, setModelError] =
    useState(false);

  // Reinicia o estado quando a URL do avatar muda.
  useEffect(() => {
    console.log(
      '🖼️ AvatarViewer modelUrl:',
      modelUrl
    );

    setModelError(false);
    setReady(false);
  }, [modelUrl]);

  // Reseta a câmera.
  const handleReset = () => {
    controlsRef.current?.reset();
  };

  // Controla o zoom da câmera.
  const handleZoom = (
    dir: 1 | -1
  ) => {
    const controls =
      controlsRef.current;

    if (!controls) {
      return;
    }

    const camera =
      controls.object;

    // Aproxima ou afasta a câmera.
    const factor =
      dir === 1
        ? 0.85
        : 1.15;

    camera.position.multiplyScalar(
      factor
    );

    controls.update();
  };

  console.log(
    '👕 URL DA ROUPA:',
       clothingModelUrl
  );

  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-b from-caiment-purple-50 to-white ${
        className ?? ''
      }`}
    >
      {/* Tela de carregamento. */}
      {!ready &&
        !modelError && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
            <LoadingState
              label="Carregando avatar..."
            />
          </div>
        )}

      {/* Mensagem de erro. */}
      {modelError ? (
        <div className="flex h-full min-h-[240px] flex-col items-center justify-center gap-3 p-6 text-center">
          <div className="text-3xl">
            ⚠️
          </div>

          <p className="text-sm font-medium text-caiment-ink">
            Não foi possível carregar
            o avatar 3D.
          </p>

          <p className="max-w-xs text-xs text-caiment-ink-soft">
            O avatar foi gerado, mas o
            backend não conseguiu entregar
            o arquivo 3D ao visualizador.
          </p>
        </div>
      ) : (
        <ErrorBoundary
          fallback={
            <div className="flex h-full min-h-[240px] items-center justify-center p-6 text-center">
              <p className="text-sm text-caiment-ink-soft">
                Erro inesperado no
                visualizador 3D.
              </p>
            </div>
          }
        >
          {/* Espaço 3D onde avatar e roupa serão renderizados. */}
          <Canvas
            shadows
            camera={{
              position: [
                0,
                0.35,
                5.2,
              ],
              fov: 30,
            }}
            onCreated={() => {
              console.log(
                '🎥 Canvas criado.'
              );
            }}
          >
            {/* Configura a câmera. */}
            <CameraController />

            {/* Envia os dados para a cena. */}
            <Scene
              modelUrl={
                modelUrl
              }
              clothingModelUrl={
                clothingModelUrl
              }
              measurements={
                measurements
              }
              onAvatarLoaded={() => {
                console.log(
                  '🎉 Avatar pronto para visualizar!'
                );

                setReady(true);
              }}
              onAvatarError={() => {
                console.error(
                  '💥 Falha final no avatar.'
                );

                setModelError(true);
              }}
            />

            {/* Controles de rotação e distância. */}
            <OrbitControls
              ref={controlsRef}
              makeDefault
              enablePan={false}
              minDistance={3.2}
              maxDistance={8}
              minPolarAngle={
                Math.PI / 3.2
              }
              maxPolarAngle={
                Math.PI / 1.7
              }
              target={[
                0,
                0.15,
                0,
              ]}
            />
          </Canvas>
        </ErrorBoundary>
      )}

      {/* Botões de controle. */}
      {showControls &&
        !modelError && (
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full glass px-2 py-2">
            {/* Diminuir zoom. */}
            <button
              onClick={() =>
                handleZoom(-1)
              }
              aria-label="Diminuir zoom"
              className="flex h-8 w-8 items-center justify-center rounded-full text-caiment-ink-soft hover:bg-white/70"
            >
              <ZoomOut size={15} />
            </button>

            {/* Resetar câmera. */}
            <button
              onClick={
                handleReset
              }
              aria-label="Resetar câmera"
              className="flex h-8 w-8 items-center justify-center rounded-full text-caiment-ink-soft hover:bg-white/70"
            >
              <RotateCcw
                size={15}
              />
            </button>

            {/* Aumentar zoom. */}
            <button
              onClick={() =>
                handleZoom(1)
              }
              aria-label="Aumentar zoom"
              className="flex h-8 w-8 items-center justify-center rounded-full text-caiment-ink-soft hover:bg-white/70"
            >
              <ZoomIn size={15} />
            </button>
          </div>
        )}
    </div>
  );
}