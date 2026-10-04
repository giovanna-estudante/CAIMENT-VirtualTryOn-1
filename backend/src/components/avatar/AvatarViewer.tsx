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

function getModelProxyUrl(
  modelUrl: string
): string {
  return `/api/avatar/model?url=${encodeURIComponent(
    modelUrl
  )}`;
}

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

    if (!group) {
      return;
    }

    group.scale.setScalar(1);
    group.position.set(0, 0, 0);

    group.updateMatrixWorld(true);

    const originalBox =
      new Box3().setFromObject(group);

    const originalSize =
      new Vector3();

    originalBox.getSize(
      originalSize
    );

    console.log(
      '📐 Avatar original:',
      {
        x: originalSize.x,
        y: originalSize.y,
        z: originalSize.z,
      }
    );

    const targetHeight = 3.4;

    if (originalSize.y <= 0) {
      console.error(
        '❌ Altura do avatar inválida.'
      );

      return;
    }

    const scale =
      targetHeight /
      originalSize.y;

    group.scale.setScalar(scale);

    group.updateMatrixWorld(true);

    const scaledBox =
      new Box3().setFromObject(group);

    const scaledCenter =
      new Vector3();

    scaledBox.getCenter(
      scaledCenter
    );

    group.position.x =
      -scaledCenter.x;

    group.position.z =
      -scaledCenter.z;

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
      '📐 Avatar final:',
      {
        tamanho: {
          x: finalSize.x,
          y: finalSize.y,
          z: finalSize.z,
        },
        centro: {
          x: finalCenter.x,
          y: finalCenter.y,
          z: finalCenter.z,
        },
      }
    );

    onFitData?.({
      box: finalBox,
      size: finalSize,
      center: finalCenter,
    });
  }, [model, onFitData]);

  return (
    <group ref={groupRef}>
      <primitive object={model} />
    </group>
  );
}

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

  useEffect(() => {
    const group =
      groupRef.current;

    if (!group || !model) {
      return;
    }

    console.log(
      '===================================='
    );

    console.log(
      '👕 INICIANDO ENCAIXE DA ROUPA'
    );

    console.log(
      '===================================='
    );

    /*
     * Sempre começa do tamanho original.
     * Isso evita acumular escala quando
     * as medidas mudarem.
     */
    group.scale.setScalar(1);

    group.position.set(0, 0, 0);

    group.rotation.set(0, 0, 0);

    group.updateMatrixWorld(true);

    /*
     * Aplica as Shape Keys antes de medir
     * a camiseta.
     */
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

        const dictionary =
          mesh.morphTargetDictionary;

        const influences =
          mesh.morphTargetInfluences;

        const calcularInfluence = (
          medida: number,
          minimo: number,
          maximo: number
        ) => {
          if (maximo <= minimo) {
            return 0;
          }

          const valor =
            (medida - minimo) /
            (maximo - minimo);

          return Math.max(
            0,
            Math.min(1, valor)
          );
        };

        /*
         * Zera primeiro todas as Shape Keys
         * que ainda não possuem calibração.
         */
        const shapeKeysZero = [
          'Manga',
          'Gola',
          'Caimento',
          'Barra',
          'Ajuste lateral',
          'Manga_Final',
          'Frente_Costas',
          'Comprimento',
        ];

        shapeKeysZero.forEach(
          (key) => {
            const index =
              dictionary[key];

            if (index !== undefined) {
              influences[index] = 0;
            }
          }
        );

        if (!measurements) {
          return;
        }

        /*
         * Cintura
         */
        const cinturaIndex =
          dictionary['Cintura'];

        if (
          cinturaIndex !== undefined &&
          measurements.medidas.cintura !==
            undefined
        ) {
          influences[cinturaIndex] =
            calcularInfluence(
              measurements.medidas.cintura,
              60,
              100
            );
        }

        /*
         * Tórax
         */
        const toraxIndex =
          dictionary['Tórax'];

        if (
          toraxIndex !== undefined &&
          measurements.medidas.torax !==
            undefined
        ) {
          influences[toraxIndex] =
            calcularInfluence(
              measurements.medidas.torax,
              70,
              120
            );
        }

        /*
         * Ombros
         */
        const ombrosIndex =
          dictionary['Ombros'];

        if (
          ombrosIndex !== undefined
        ) {
          influences[ombrosIndex] =
            calcularInfluence(
              measurements.medidas.ombros,
              30,
              55
            );
        }

        console.log(
          '🎯 Shape Keys aplicadas:',
          `Cintura=${cinturaIndex !== undefined ? influences[cinturaIndex].toFixed(3) : '0.000'}`,
          `Tórax=${toraxIndex !== undefined ? influences[toraxIndex].toFixed(3) : '0.000'}`,
          `Ombros=${ombrosIndex !== undefined ? influences[ombrosIndex].toFixed(3) : '0.000'}`
        );
      }
    );

    /*
     * Atualiza as transformações depois
     * das Shape Keys.
     */
    group.updateMatrixWorld(true);

    /*
     * Mede a camiseta já deformada.
     */
    const box =
      new Box3().setFromObject(group);

    const size =
      new Vector3();

    box.getSize(size);

    console.log(
      '👕 Tamanho após Shape Keys:',
      {
        x: size.x,
        y: size.y,
        z: size.z,
      }
    );

    /*
     * Seu modelo foi criado no Blender
     * com Z como altura.
     *
     * Se o GLB chegar ao Three.js ainda
     * com Z como eixo vertical, convertemos
     * para Y-up.
     */
    if (
      size.z > size.y * 1.3
    ) {
      group.rotation.x =
        -Math.PI / 2;

      group.updateMatrixWorld(true);

      console.log(
        '🔄 Roupa convertida de Z-up para Y-up.'
      );
    }

    /*
     * Mede novamente depois da
     * possível rotação.
     */
    const orientedBox =
      new Box3().setFromObject(group);

    const orientedSize =
      new Vector3();

    orientedBox.getSize(
      orientedSize
    );

    const orientedCenter =
      new Vector3();

    orientedBox.getCenter(
      orientedCenter
    );

    console.log(
      '👕 Tamanho no eixo do Viewer:',
      {
        x: orientedSize.x,
        y: orientedSize.y,
        z: orientedSize.z,
      }
    );

    if (orientedSize.y <= 0) {
      console.error(
        '❌ Altura da roupa inválida.'
      );

      return;
    }

    /*
     * A camiseta ocupa aproximadamente
     * 42% da altura do avatar.
     *
     * Esse valor será calibrado depois
     * com o modelo real.
     */
    const targetClothingHeight =
      avatarFitData.size.y * 0.42;

    const clothingScale =
      targetClothingHeight /
      orientedSize.y;

    group.scale.setScalar(
      clothingScale
    );

    group.updateMatrixWorld(true);

    /*
     * Mede a camiseta depois da escala.
     */
    const scaledBox =
      new Box3().setFromObject(group);

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

    /*
     * Centraliza a camiseta no mesmo
     * eixo horizontal do avatar.
     */
    group.position.x =
      avatarFitData.center.x -
      scaledCenter.x;

    group.position.z =
      avatarFitData.center.z -
      scaledCenter.z;

    /*
     * Centro aproximado do tórax.
     *
     * Depois vamos trocar esse valor
     * por uma referência corporal real.
     */
    const chestHeight =
      avatarFitData.box.min.y +
      avatarFitData.size.y * 0.68;

    group.position.y =
      chestHeight -
      scaledCenter.y;

    group.updateMatrixWorld(true);

    /*
     * Mede a roupa na posição final.
     */
    const finalClothingBox =
      new Box3().setFromObject(group);

    const finalClothingSize =
      new Vector3();

    finalClothingBox.getSize(
      finalClothingSize
    );

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
      'Tamanho final:',
      {
        x: finalClothingSize.x,
        y: finalClothingSize.y,
        z: finalClothingSize.z,
      }
    );

    console.log(
      'Posição:',
      {
        x: group.position.x,
        y: group.position.y,
        z: group.position.z,
      }
    );

    if (measurements) {
      console.log(
        '📏 Medidas usadas:',
        measurements.medidas
      );
    }
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
  ] = useState<AvatarFitData | null>(
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

      <ambientLight intensity={0.4} />

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
            onLoaded={onAvatarLoaded}
            onError={onAvatarError}
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
              url={clothingModelUrl}
              measurements={measurements}
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

  const handleReset = () => {
    controlsRef.current?.reset();
  };

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
              <ZoomOut size={15} />
            </button>

            <button
              onClick={
                handleReset
              }
              aria-label="Resetar câmera"
              className="flex h-8 w-8 items-center justify-center rounded-full text-caiment-ink-soft hover:bg-white/70"
            >
              <RotateCcw size={15} />
            </button>

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