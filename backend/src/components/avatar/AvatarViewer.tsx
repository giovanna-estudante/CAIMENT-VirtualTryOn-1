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
          '===================================='
        );
        console.log(
          '✅ Roupa carregada.'
        );
        console.log(
          '===================================='
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
              if (mesh.morphTargetDictionary) {
                // Mostra os nomes das Shape Keys existentes na camiseta.
                console.log(
                  "🎯 SHAPE KEYS DA ROUPA:",
                  Object.keys(mesh.morphTargetDictionary)
                );

                // Mostra também o índice de cada Shape Key.
                console.log(
                  "🎯 ÍNDICES DAS SHAPE KEYS:",
                  mesh.morphTargetDictionary
                );

                if (
                  mesh.morphTargetDictionary &&
                  mesh.morphTargetInfluences &&
                  measurements
                ) {
                  // ============================================================
                  // FUNÇÃO PARA CONVERTER UMA MEDIDA EM INFLUÊNCIA
                  // ============================================================
                  //
                  // As Shape Keys trabalham normalmente entre 0 e 1.
                  // As medidas do usuário estão em centímetros.
                  //
                  // Esta função transforma uma medida em um valor entre 0 e 1.
                  // Os limites ainda são provisórios e serão ajustados depois
                  // de testarmos a modelagem da camiseta.
                  // ============================================================

                  const calcularInfluence = (
                    medida: number,
                    minimo: number,
                    maximo: number
                  ) => {
                    const valor =
                      (medida - minimo) /
                      (maximo - minimo);

                    return Math.max(
                      0,
                      Math.min(1, valor)
                    );
                  };

                  // ============================================================
                  // CINTURA
                  // ============================================================

                  const cinturaIndex =
                    mesh.morphTargetDictionary["Cintura"];

                  if (cinturaIndex !== undefined) {
                    const influence = calcularInfluence(
                      measurements.waist,
                      60,
                      100
                    );

                    mesh.morphTargetInfluences[cinturaIndex] =
                      influence;

                    console.log(
                      "👕 SHAPE KEY CINTURA",
                      {
                        medida: measurements.waist,
                        influence,
                      }
                    );
                  }

                  // ============================================================
                  // BUSTO
                  // ============================================================

                  const bustoIndex =
                    mesh.morphTargetDictionary["Busto"];

                  if (bustoIndex !== undefined) {
                    const influence = calcularInfluence(
                      measurements.bust,
                      70,
                      120
                    );

                    mesh.morphTargetInfluences[bustoIndex] =
                      influence;

                    console.log(
                      "👕 SHAPE KEY BUSTO",
                      {
                        medida: measurements.bust,
                        influence,
                      }
                    );
                  }

                  // ============================================================
                  // BUSTO + OMBROS
                  // ============================================================

                  const bustoOmbrosIndex =
                    mesh.morphTargetDictionary["Busto+Ombros"];

                  if (bustoOmbrosIndex !== undefined) {
                    const influence = calcularInfluence(
                      measurements.shoulders,
                      30,
                      55
                    );

                    mesh.morphTargetInfluences[
                      bustoOmbrosIndex
                    ] = influence;

                    console.log(
                      "👕 SHAPE KEY BUSTO + OMBROS",
                      {
                        medida: measurements.shoulders,
                        influence,
                      }
                    );
                  }

                  // ============================================================
                  // MANGA
                  // ============================================================

                  const mangaIndex =
                    mesh.morphTargetDictionary["Manga"];

                  if (mangaIndex !== undefined) {
                    const influence = calcularInfluence(
                      measurements.arm,
                      20,
                      40
                    );

                    mesh.morphTargetInfluences[mangaIndex] =
                      influence;

                    console.log(
                      "👕 SHAPE KEY MANGA",
                      {
                        medida: measurements.arm,
                        influence,
                      }
                    );
                  }

                  // ============================================================
                  // MANGA 2
                  // ============================================================

                  const manga2Index =
                    mesh.morphTargetDictionary["Manga2"];

                  if (manga2Index !== undefined) {
                    const influence = calcularInfluence(
                      measurements.arm,
                      20,
                      40
                    );

                    mesh.morphTargetInfluences[manga2Index] =
                      influence;

                    console.log(
                      "👕 SHAPE KEY MANGA2",
                      {
                        medida: measurements.arm,
                        influence,
                      }
                    );
                  }

                  // ============================================================
                  // COMPRIMENTO
                  // ============================================================

                  const comprimentoIndex =
                    mesh.morphTargetDictionary["Comprimento"];

                  if (comprimentoIndex !== undefined) {
                    const influence = calcularInfluence(
                      measurements.height,
                      150,
                      190
                    );

                    mesh.morphTargetInfluences[
                      comprimentoIndex
                    ] = influence;

                    console.log(
                      "👕 SHAPE KEY COMPRIMENTO",
                      {
                        medida: measurements.height,
                        influence,
                      }
                    );
                  }
                }

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
    // ============================================================
    // 1. VERIFICA SE O MODELO DA ROUPA JÁ ESTÁ DISPONÍVEL
    // ============================================================

    console.log("👕 1 - EFFECT DA ROUPA EXECUTOU", {
      temGrupo: !!groupRef.current,
      temModelo: !!model,
    });

    const group = groupRef.current;

    // Se a roupa ainda não foi carregada, não fazemos nenhum cálculo.
    if (!group || !model) {
      console.log("👕 2 - PAROU: sem group ou model");
      return;
    }

    console.log("👕 3 - GROUP E MODEL OK");

    // ============================================================
    // 2. CALCULA O TAMANHO ORIGINAL DA ROUPA
    // ============================================================
    //
    // O Box3 cria uma "caixa imaginária" ao redor da camiseta.
    // Isso permite descobrir largura, altura e profundidade
    // reais do modelo 3D.
    // ============================================================

    const box = new Box3().setFromObject(group);

    console.log("👕 4 - BOX CALCULADO", box);

    const size = new Vector3();
    const center = new Vector3();

    // Obtém as dimensões da caixa da roupa.
    box.getSize(size);

    // Obtém o ponto central da roupa.
    box.getCenter(center);

    console.log("👕 5 - TAMANHO DA ROUPA", {
      x: size.x,
      y: size.y,
      z: size.z,
    });

    console.log("👕 6 - CENTRO DA ROUPA", {
      x: center.x,
      y: center.y,
      z: center.z,
    });

    // ============================================================
    // 3. VERIFICA SE A ALTURA DA ROUPA É VÁLIDA
    // ============================================================

    if (size.y <= 0) {
      console.log(
        "👕 7 - PAROU: altura da roupa inválida"
      );

      return;
    }

    console.log("👕 8 - VAI ESCALAR A ROUPA");

    // ============================================================
    // 4. AJUSTA A ALTURA DA ROUPA
    // ============================================================
    //
    // Por enquanto estamos usando uma altura de teste.
    // Depois vamos substituir esse valor por um cálculo baseado
    // no avatar e nas medidas do usuário.
    // ============================================================

    const targetHeight = 1.65;

    group.scale.setScalar(
      targetHeight / size.y
    );

    // Atualiza os cálculos internos do Three.js depois da escala.
    group.updateMatrixWorld(true);

    // ============================================================
    // VERIFICA O TAMANHO DA ROUPA DEPOIS DAS SHAPE KEYS
    // ============================================================
    //
    // Aqui medimos novamente a camiseta depois que as Shape Keys
    // já foram aplicadas. Assim conseguimos saber se a geometria
    // realmente foi modificada antes da escala final.
    // ============================================================

    const shapeKeyBox =
      new Box3().setFromObject(group);

    const shapeKeySize =
      new Vector3();

    shapeKeyBox.getSize(shapeKeySize);

    console.log(
      "👕 TAMANHO APÓS SHAPE KEYS",
      {
        x: shapeKeySize.x,
        y: shapeKeySize.y,
        z: shapeKeySize.z,
      }
    );

    console.log("👕 9 - ROUPA ESCALADA");

    // ============================================================
    // 5. CALCULA NOVAMENTE O TAMANHO APÓS A ESCALA
    // ============================================================

    const scaledBox =
      new Box3().setFromObject(group);

    const scaledCenter = new Vector3();

    scaledBox.getCenter(scaledCenter);

    console.log("👕 10 - CENTRO APÓS ESCALA", {
      x: scaledCenter.x,
      y: scaledCenter.y,
      z: scaledCenter.z,
    });

    // ============================================================
    // 6. CENTRALIZA A ROUPA NO AVATAR
    // ============================================================
    //
    // X e Z centralizam a camiseta horizontalmente.
    // Y coloca a camiseta na altura definida atualmente.
    //
    // Esses valores ainda são provisórios.
    // Vamos substituí-los depois por um posicionamento baseado
    // no corpo do avatar.
    // ============================================================

    group.position.x = -scaledCenter.x;

    group.position.z = -scaledCenter.z;

    group.position.y =
      0.95 - scaledCenter.y;

    // Pequeno ajuste provisório para a profundidade.
    group.position.z += 0.08;

    console.log("👕 11 - ROUPA POSICIONADA", {
      x: group.position.x,
      y: group.position.y,
      z: group.position.z,
    });

    // ============================================================
    // 7. CONFIRMA SE AS MEDIDAS DO USUÁRIO FORAM RECEBIDAS
    // ============================================================

    if (measurements) {
      console.log(
        "📏 Medidas recebidas pela roupa:",
        measurements
      );
    }
  }, [model, measurements]);

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