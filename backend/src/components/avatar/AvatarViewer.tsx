/*
============================================================
CAIMENT — AvatarViewer
============================================================

REGRA FIXA DE EIXOS DA ROUPA

Blender/GLB → VSCode/Three.js

GLB X → Three X = largura
GLB Y → Three Z = profundidade
GLB Z → Three Y = altura

No AvatarViewer:

X = largura
Y = altura
Z = profundidade

IMPORTANTE:
- Não trocar largura, altura e profundidade.
- Não interpretar GLB Y como altura.
- Não interpretar GLB Z como profundidade.
- A conversão de eixos é feita pela orientação da roupa.
- Depois da conversão, todo cálculo usa X/largura,
  Y/altura e Z/profundidade.
- As medidas cadastradas da camiseta permanecem com
  os mesmos valores definidos no código.
============================================================
*/

import {
  Suspense,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Canvas,
  useThree,
} from '@react-three/fiber';

import {
  OrbitControls,
  ContactShadows,
} from '@react-three/drei';

import type {
  OrbitControls as OrbitControlsImpl,
} from 'three-stdlib';

import type {
  UserMeasurements,
} from '@/types/measurements';

import {
  Box3,
  Vector3,
  Group,
  Mesh,
  Object3D,
} from 'three';

import {
  GLTFLoader,
} from 'three/examples/jsm/loaders/GLTFLoader.js';

import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

import {
  AvatarPlaceholderModel,
} from './AvatarPlaceholderModel';

import {
  LoadingState,
} from '@/components/ui/LoadingState';

import {
  ErrorBoundary,
} from '@/components/ui/ErrorBoundary';

interface AvatarViewerProps {
  modelUrl?: string | null;
  clothingModelUrl?: string | null;
  measurements?: UserMeasurements | null;
  className?: string;
  showControls?: boolean;
}

interface AvatarFitData {
  box: Box3;
  size: Vector3;
  center: Vector3;
}

// ============================================================
// REGRA FIXA DE EIXOS — CAIMENT
//
// Blender/GLB → VSCode/Three.js:
//
// GLB X → Three X = largura
// GLB Y → Three Z = profundidade
// GLB Z → Three Y = altura
//
// Portanto, no VSCode:
//
// X = largura
// Y = altura
// Z = profundidade
//
// Esta conversão NÃO troca nem recalcula as medidas da roupa.
// Ela somente coloca os eixos do GLB na convenção usada pelo
// AvatarViewer.
//
// A rotação abaixo representa essa conversão de eixos.
// Ela não é uma tentativa de corrigir o tamanho da camiseta.
// ============================================================

const CLOTHING_AXIS_ROTATION_X = -Math.PI / 2;

interface ClothingMeasurements {
  largura?: number;
  profundidade?: number;
  comprimento?: number;
  torax?: number;
  cintura?: number;
  ombros?: number;
  manga?: number;
}

type BodyMeasurementName =
  | 'torax'
  | 'cintura'
  | 'ombros';

interface ClothingShapeKeyConfig {
  key: string;
  measurement: BodyMeasurementName;
}

interface ClothingProfile {
  measurements: ClothingMeasurements;
  shapeKeys: ClothingShapeKeyConfig[];
}

// ============================================================
// URL DO MODELO DO AVATAR
// ============================================================

function getModelProxyUrl(
  modelUrl: string
): string {
  return `/api/avatar/model?url=${encodeURIComponent(
    modelUrl
  )}`;
}

// ============================================================
// CARREGA O AVATAR
// ============================================================

function RealModel({
  url,
  onLoaded,
  onError,
  onFitData,
}: {
  url: string;
  onLoaded?: () => void;
  onError?: (error: unknown) => void;
  onFitData?: (data: AvatarFitData) => void;
}) {
  const [model, setModel] =
    useState<Object3D | null>(null);

  const onLoadedRef =
    useRef(onLoaded);

  const onErrorRef =
    useRef(onError);

  useEffect(() => {
    onLoadedRef.current = onLoaded;
  }, [onLoaded]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    let cancelled = false;

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

    const proxyUrl =
      getModelProxyUrl(url);

    console.log(
      '🎯 Carregando avatar:',
      proxyUrl
    );

    const loader =
      new GLTFLoader();

    loader.load(
      proxyUrl,

      (gltf) => {
        if (cancelled) {
          return;
        }

        let meshCount = 0;

        gltf.scene.traverse(
          (child) => {
            const mesh =
              child as Mesh;

            if (!mesh.isMesh) {
              return;
            }

            meshCount++;

            mesh.visible = true;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            if (mesh.material) {
              const materials =
                Array.isArray(mesh.material)
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
        );

        if (meshCount === 0) {
          onErrorRef.current?.(
            new Error(
              'O modelo 3D não possui meshes.'
            )
          );

          return;
        }

        setModel(gltf.scene);

        console.log(
          '✅ Avatar 3D carregado.'
        );

        onLoadedRef.current?.();
      },

      undefined,

      (error) => {
        if (cancelled) {
          return;
        }

        console.error(
          '❌ Erro ao carregar avatar:',
          error
        );

        onErrorRef.current?.(error);
      }
    );

    return () => {
      cancelled = true;
    };
  }, [url]);

  if (!model) {
    return null;
  }

  return (
    <AvatarModelObject
      model={model}
      onFitData={onFitData}
    />
  );
}

// ============================================================
// AJUSTA O AVATAR
// ============================================================

function AvatarModelObject({
  model,
  onFitData,
}: {
  model: Object3D;
  onFitData?: (
    data: AvatarFitData
  ) => void;
}) {
  const groupRef =
    useRef<Group | null>(null);

  useEffect(() => {
    const group =
      groupRef.current;

    if (!group || !model) {
      return;
    }

    // Reseta transformações.
    group.scale.setScalar(1);

    group.position.set(
      0,
      0,
      0
    );

    group.rotation.set(
      0,
      0,
      0
    );

    group.updateMatrixWorld(true);

    // Mede o avatar original.
    const originalBox =
      new Box3().setFromObject(group);

    const originalSize =
      new Vector3();

    originalBox.getSize(
      originalSize
    );

    if (originalSize.y <= 0) {
      console.error(
        '❌ Altura do avatar inválida.'
      );

      return;
    }

    // Altura padrão do avatar.
    const targetHeight = 3.4;

    const scale =
      targetHeight /
      originalSize.y;

    group.scale.setScalar(scale);

    group.updateMatrixWorld(true);

    const scaledBox =
      new Box3().setFromObject(group);

    const scaledCenter =
      new Vector3();

    const scaledSize =
      new Vector3();

    scaledBox.getCenter(
      scaledCenter
    );

    scaledBox.getSize(
      scaledSize
    );

    // Centraliza o avatar.
    group.position.x =
      -scaledCenter.x;

    group.position.z =
      -scaledCenter.z;

    // Encosta os pés no chão.
    group.position.y =
      -scaledBox.min.y;

    group.updateMatrixWorld(true);

    const finalBox =
      new Box3().setFromObject(group);

    const finalSize =
      new Vector3();

    const finalCenter =
      new Vector3();

    finalBox.getSize(
      finalSize
    );

    finalBox.getCenter(
      finalCenter
    );

    console.log(
      '===================================='
    );

    console.log(
      '🧍 AVATAR AJUSTADO'
    );

    console.log(
      '===================================='
    );

    console.log(
      '📐 Dimensão original:',
      {
        x: originalSize.x,
        y: originalSize.y,
        z: originalSize.z,
      }
    );

    console.log(
      '📐 Escala do avatar:',
      scale
    );

    console.log(
      '📐 Dimensão final:',
      {
        x: finalSize.x,
        y: finalSize.y,
        z: finalSize.z,
      }
    );

    console.log(
      '📍 Centro final:',
      {
        x: finalCenter.x,
        y: finalCenter.y,
        z: finalCenter.z,
      }
    );

    onFitData?.({
      box: finalBox.clone(),
      size: finalSize.clone(),
      center: finalCenter.clone(),
    });
  }, [
    model,
    onFitData,
  ]);

  return (
    <group ref={groupRef}>
      <primitive object={model} />
    </group>
  );
}

// ============================================================
// CARREGA E VESTE A ROUPA
// ============================================================

function ClothingModel({
  url,
  measurements,
  avatarFitData,
}: {
  url: string;
  measurements?: UserMeasurements | null;
  avatarFitData: AvatarFitData;
}) {
  const [model, setModel] =
    useState<Object3D | null>(null);

  const groupRef =
    useRef<Group | null>(null);

  // ----------------------------------------------------------
  // Carrega o GLB da roupa.
  // ----------------------------------------------------------

  useEffect(() => {
    let cancelled = false;

    const loader =
      new GLTFLoader();

    loader.load(
      url,

      (gltf) => {
        if (cancelled) {
          return;
        }

        console.log(
          '👕 Roupa carregada.'
        );

        gltf.scene.traverse(
          (child) => {
            const mesh =
              child as Mesh;

            if (!mesh.isMesh) {
              return;
            }

            mesh.visible = true;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            if (
              mesh.morphTargetDictionary &&
              mesh.morphTargetInfluences
            ) {
              console.log(
                '🎯 Shape Keys:',
                Object.keys(
                  mesh.morphTargetDictionary
                )
              );
            }
          }
        );

        setModel(gltf.scene);
      },

      undefined,

      (error) => {
        console.error(
          '❌ Erro ao carregar roupa:',
          error
        );
      }
    );

    return () => {
      cancelled = true;
    };
  }, [url]);

  // ----------------------------------------------------------
  // Ajusta a roupa.
  // ----------------------------------------------------------

  useEffect(() => {
    const group =
      groupRef.current;

    if (!group || !model) {
      return;
    }

    if (!measurements) {
      console.warn(
        '⚠️ Medidas do usuário não disponíveis.'
      );

      return;
    }

    const medidas =
      measurements;

    // ========================================================
    // CADASTRO DA CAMISETA P
    // ========================================================

    const CAMISETA_P: ClothingProfile = {
      measurements: {
        largura: 100,
        profundidade: 29.7,
        comprimento: 70,
        manga: 23,
      },

      shapeKeys: [
        {
          key: 'Tórax',
          measurement: 'torax',
        },
        {
          key: 'Busto',
          measurement: 'torax',
        },
        {
          key: 'Cintura',
          measurement: 'cintura',
        },
        {
          key: 'Ajuste lateral',
          measurement: 'cintura',
        },
        {
          key: 'Ombros',
          measurement: 'ombros',
        },
      ],
    };

    // ========================================================
    // RESET
    // ========================================================

    group.scale.set(
      1,
      1,
      1
    );

    group.position.set(
      0,
      0,
      0
    );

    group.rotation.set(
      0,
      0,
      0
    );

    group.updateMatrixWorld(true);

    // ========================================================
    // ZERA TODAS AS SHAPE KEYS
    // ========================================================

    model.traverse(
      (child) => {
        const mesh =
          child as Mesh;

        if (
          !mesh.isMesh ||
          !mesh.morphTargetInfluences
        ) {
          return;
        }

        mesh.morphTargetInfluences.fill(0);
      }
    );

    // ========================================================
    // APLICA SHAPE KEYS
    // ========================================================

    for (
      const config of CAMISETA_P.shapeKeys
    ) {
      const valorCorpo =
        medidas[
          config.measurement
        ];

      const valorRoupa =
        CAMISETA_P.measurements[
          config.measurement
        ];

      // Só aplica se a roupa tiver
      // uma medida correspondente.
      if (
        valorCorpo === undefined ||
        valorRoupa === undefined ||
        valorRoupa <= 0
      ) {
        continue;
      }

      const proporcao =
        valorCorpo /
        valorRoupa;

      const diferenca =
        Math.abs(
          proporcao - 1
        );

      const influencia =
        Math.min(
          1,
          diferenca
        );

      model.traverse(
        (child) => {
          const mesh =
            child as Mesh;

          if (
            !mesh.isMesh ||
            !mesh.morphTargetDictionary ||
            !mesh.morphTargetInfluences
          ) {
            return;
          }

          const index =
            mesh.morphTargetDictionary[
              config.key
            ];

          if (
            index !== undefined
          ) {
            mesh.morphTargetInfluences[
              index
            ] = influencia;
          }
        }
      );
    }

    group.updateMatrixWorld(true);

    // ========================================================
    // ORIENTAÇÃO
    //
    // GLB X → Three X = largura
    // GLB Y → Three Z = profundidade
    // GLB Z → Three Y = altura
    //
    // A camiseta é rotacionada ANTES da medição.
    // ========================================================

    group.rotation.set(
      CLOTHING_AXIS_ROTATION_X,
      0,
      0
    );

    group.updateMatrixWorld(true);

    // ========================================================
    // MEDE A ROUPA JÁ ORIENTADA
    // ========================================================

    const orientedBox =
      new Box3().setFromObject(
        group
      );

    const orientedSize =
      new Vector3();
    orientedBox.getSize(
      orientedSize
    );
    console.log(
      '===================================='
    );

    console.log(
      '👕 ROUPA APÓS ORIENTAÇÃO'
    );

    console.log(
      '===================================='
    );

    console.log(
      '📐 Dimensão antes da escala:',
      {
        x: orientedSize.x,
        y: orientedSize.y,
        z: orientedSize.z,
      }
    );

    if (
      orientedSize.x <= 0 ||
      orientedSize.y <= 0 ||
      orientedSize.z <= 0
    ) {
      console.error(
        '❌ Dimensão orientada da roupa inválida.'
      );

      return;
    }

    // ========================================================
    // DIMENSÕES ALVO
    //
    // Aqui já estamos usando os eixos do Three.js:
    //
    // X = largura
    // Y = altura
    // Z = profundidade
    // ========================================================

    const larguraAlvo =
      (
        CAMISETA_P.measurements.largura ??
        orientedSize.x * 100
      ) / 100;

    const alturaAlvo =
      (
        CAMISETA_P.measurements.comprimento ??
        orientedSize.y * 100
      ) / 100;

    const profundidadeAlvo =
      (
        CAMISETA_P.measurements.profundidade ??
        orientedSize.z * 100
      ) / 100;

    // ========================================================
    // ESCALA
    //
    // Calculada depois da orientação.
    //
    // Não usamos a escala do avatar.
    // ========================================================

    const escalaLargura =
      larguraAlvo /
      orientedSize.x;

    const escalaAltura =
      alturaAlvo /
      orientedSize.y;

    const escalaProfundidade =
      profundidadeAlvo /
      orientedSize.z;

    group.scale.set(
      escalaLargura,
      escalaAltura,
      escalaProfundidade
    );

    group.updateMatrixWorld(true);

    // ========================================================
    // MEDE NOVAMENTE DEPOIS DA ESCALA
    // ========================================================

    const scaledBox =
      new Box3().setFromObject(
        group
      );

    const scaledSize =
      new Vector3();

    const scaledCenter =
      new Vector3();

    scaledBox.getSize(
      scaledSize
    );

    scaledBox.getCenter(
      scaledCenter
    );

    // ========================================================
    // POSIÇÃO DOS OMBROS
    // ========================================================

    let alturaOmbros =
      avatarFitData.size.y *
      0.68;

    if (
      medidas.altura !== undefined &&
      medidas.altura > 0 &&
      medidas.alturaPeCintura !== undefined &&
      medidas.alturaCinturaOmbros !== undefined
    ) {
      const alturaOmbrosCm =
        medidas.alturaPeCintura +
        medidas.alturaCinturaOmbros;

      alturaOmbros =
        (
          alturaOmbrosCm /
          medidas.altura
        ) *
        avatarFitData.size.y;
    }

    const topoCamiseta =
      avatarFitData.box.min.y +
      alturaOmbros;

    const centroCamisetaY =
      topoCamiseta -
      scaledSize.y / 2;

    // ========================================================
    // CENTRALIZA NO AVATAR
    // ========================================================

    group.position.set(
      avatarFitData.center.x -
        scaledCenter.x,

      centroCamisetaY -
        scaledCenter.y,

      avatarFitData.center.z -
        scaledCenter.z
    );

    group.updateMatrixWorld(true);

    // ========================================================
    // DIMENSÃO FINAL
    // ========================================================

    const finalBox =
      new Box3().setFromObject(
        group
      );

    const finalSize =
      new Vector3();

    const finalCenter =
      new Vector3();

    finalBox.getSize(
      finalSize
    );

    finalBox.getCenter(
      finalCenter
    );

    // ========================================================
    // LOGS
    // ========================================================

    console.log(
      '===================================='
    );

    console.log(
      '👕 ROUPA VESTIDA NO AVATAR'
    );

    console.log(
      '===================================='
    );

    console.log(
      '🔄 REGRA FIXA DE EIXOS:',
      {
        'GLB X → Three X':
          'largura',

        'GLB Y → Three Z':
          'profundidade',

        'GLB Z → Three Y':
          'altura',

        'Three X':
          'largura',

        'Three Y':
          'altura',

        'Three Z':
          'profundidade',
      }
    );

    console.log(
      '🔄 Conversão de eixos aplicada:',
      '-90° no eixo X'
    );

    console.log(
      '📏 Cadastro da roupa:',
      CAMISETA_P.measurements
    );

    console.log(
      '📐 Dimensão orientada:',
      {
        largura:
          orientedSize.x,

        altura:
          orientedSize.y,

        profundidade:
          orientedSize.z,
      }
    );

    console.log(
      '📐 Escalas aplicadas:',
      {
        largura:
          escalaLargura,

        altura:
          escalaAltura,

        profundidade:
          escalaProfundidade,
      }
    );

    console.log(
      '🎯 Dimensão alvo:',
      {
        largura:
          larguraAlvo,

        altura:
          alturaAlvo,

        profundidade:
          profundidadeAlvo,
      }
    );

    console.log(
      '📐 Dimensão final:',
      {
        x: finalSize.x,
        y: finalSize.y,
        z: finalSize.z,
      }
    );

    console.log(
      '📍 Centro final:',
      {
        x: finalCenter.x,
        y: finalCenter.y,
        z: finalCenter.z,
      }
    );

    console.log(
      '📍 Altura usada para posicionamento:',
      alturaOmbros
    );
  }, [
    model,
    measurements,
    avatarFitData,
  ]);

  if (!model) {
    return null;
  }

  return (
    <group ref={groupRef}>
      <primitive object={model} />
    </group>
  );
}

// ============================================================
// CENA
// ============================================================

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
  const [
    avatarFitData,
    setAvatarFitData,
  ] =
    useState<AvatarFitData | null>(
      null
    );

  return (
    <>
      <hemisphereLight
        args={[
          '#F4F1FC',
          '#6E42D1',
          0.55,
        ]}
      />

      <ambientLight
        intensity={0.4}
      />

      <directionalLight
        position={[3, 5, 4]}
        intensity={1.2}
        castShadow
      />

      <directionalLight
        position={[-3, 2, -3]}
        intensity={0.4}
      />

      <pointLight
        position={[0, 2.5, -2]}
        intensity={0.3}
        color="#C6F24E"
      />

      <Suspense fallback={null}>
        {modelUrl ? (
          <RealModel
            url={modelUrl}
            onLoaded={
              onAvatarLoaded
            }
            onError={
              onAvatarError
            }
            onFitData={
              setAvatarFitData
            }
          />
        ) : (
          <AvatarPlaceholderModel />
        )}

        {clothingModelUrl &&
          avatarFitData && (
            <ClothingModel
              url={
                clothingModelUrl
              }
              measurements={
                measurements
              }
              avatarFitData={
                avatarFitData
              }
            />
          )}
      </Suspense>

      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.35}
        scale={4}
        blur={2.4}
        far={2}
      />
    </>
  );
}

// ============================================================
// CONTROLE DA CÂMERA
// ============================================================

function CameraController() {
  const { camera } =
    useThree();

  useEffect(() => {
    camera.position.set(
      0,
      1.7,
      5.2
    );

    camera.lookAt(
      0,
      1.7,
      0
    );
  }, [camera]);

  return null;
}

// ============================================================
// AVATAR VIEWER
// ============================================================

export function AvatarViewer({
  modelUrl,
  clothingModelUrl,
  measurements,
  className,
  showControls = true,
}: AvatarViewerProps) {
  const controlsRef =
    useRef<OrbitControlsImpl | null>(
      null
    );

  const [ready, setReady] =
    useState(false);

  const [modelError, setModelError] =
    useState(false);

  useEffect(() => {
    console.log(
      '🖼️ AvatarViewer modelUrl:',
      modelUrl
    );

    setModelError(false);
    setReady(false);
  }, [modelUrl]);

  // ----------------------------------------------------------
  // Reseta a câmera.
  // ----------------------------------------------------------

  const handleReset = () => {
    const controls =
      controlsRef.current;

    if (!controls) {
      return;
    }

    const camera =
      controls.object;

    camera.position.set(
      0,
      1.7,
      5.2
    );

    controls.target.set(
      0,
      1.7,
      0
    );

    controls.update();
  };

  // ----------------------------------------------------------
  // Zoom.
  // ----------------------------------------------------------

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
      {!ready &&
        !modelError && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
            <LoadingState
              label="Carregando avatar..."
            />
          </div>
        )}

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
            <CameraController />

            <Scene
              modelUrl={modelUrl}
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
                1.7,
                0,
              ]}
            />
          </Canvas>
        </ErrorBoundary>
      )}

      {showControls &&
        !modelError && (
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full glass px-2 py-2">
            <button
              onClick={() =>
                handleZoom(-1)
              }
              aria-label="Diminuir zoom"
              className="flex h-8 w-8 items-center justify-center rounded-full text-caiment-ink-soft hover:bg-white/70"
            >
              <ZoomOut
                size={15}
              />
            </button>

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

            <button
              onClick={() =>
                handleZoom(1)
              }
              aria-label="Aumentar zoom"
              className="flex h-8 w-8 items-center justify-center rounded-full text-caiment-ink-soft hover:bg-white/70"
            >
              <ZoomIn
                size={15}
              />
            </button>
          </div>
        )}
    </div>
  );
}