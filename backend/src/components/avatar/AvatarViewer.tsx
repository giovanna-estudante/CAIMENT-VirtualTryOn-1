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

import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

import {
  Box3,
  Vector3,
  Group,
  Mesh,
  Object3D,
} from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

import { AvatarPlaceholderModel } from './AvatarPlaceholderModel';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

interface AvatarViewerProps {
  modelUrl?: string | null;
  clothingModelUrl?: string | null;
  className?: string;
  showControls?: boolean;
}

/* =========================================================
   PROXY DO MODELO TRIPO
========================================================= */

function getModelProxyUrl(
  modelUrl: string
): string {
  return `/api/avatar/model?url=${encodeURIComponent(
    modelUrl
  )}`;
}

/* =========================================================
   AVATAR REAL
========================================================= */

function RealModel({
  url,
  onLoaded,
  onError,
}: {
  url: string;
  onLoaded?: () => void;
  onError?: (error: unknown) => void;
}) {
  const [model, setModel] =
    useState<Object3D | null>(null);

  const onLoadedRef =
    useRef(onLoaded);

  const onErrorRef =
    useRef(onError);

  useEffect(() => {
    onLoadedRef.current =
      onLoaded;
  }, [onLoaded]);

  useEffect(() => {
    onErrorRef.current =
      onError;
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

    /*
     * IMPORTANTE:
     *
     * Antes:
     * loader.load(url)
     *
     * Agora:
     * loader.load(proxyUrl)
     *
     * Assim o navegador NÃO acessa
     * diretamente o servidor do Tripo.
     */

    const proxyUrl =
      getModelProxyUrl(url);

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

    const loader =
      new GLTFLoader();

    loader.load(
      proxyUrl,

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

        console.log(
          'Cena:',
          gltf.scene
        );

        let meshCount = 0;

        gltf.scene.traverse(
          (child) => {
            const mesh =
              child as Mesh;

            if (mesh.isMesh) {
              meshCount++;

              mesh.visible = true;

              mesh.castShadow = true;

              mesh.receiveShadow = true;

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

                    material.needsUpdate =
                      true;
                  }
                );
              }
            }
          }
        );

        console.log(
          '🧩 Meshes encontradas:',
          meshCount
        );

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

        setModel(
          gltf.scene
        );

        console.log(
          '🎉 Avatar pronto para visualizar!'
        );

        onLoadedRef.current?.();
      },

      (progress) => {
        if (
          progress.total > 0
        ) {
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
    />
  );
}

/* =========================================================
   PREPARAÇÃO DO MODELO
========================================================= */

function AvatarModelObject({
  model,
}: {
  model: Object3D;
}) {
  const groupRef =
    useRef<Group | null>(null);

  useEffect(() => {
    const group =
      groupRef.current;

    if (!group) {
      return;
    }

    group.updateMatrixWorld(true);

    const box =
      new Box3().setFromObject(
        group
      );

    const size =
      new Vector3();

    box.getSize(size);

    console.log(
      '📐 Tamanho do avatar:',
      {
        x: size.x,
        y: size.y,
        z: size.z,
      }
    );

    const targetHeight =
      3.4;

    if (size.y > 0) {
      const scale =
        targetHeight /
        size.y;

      group.scale.setScalar(
        scale
      );
    }

    group.updateMatrixWorld(
      true
    );

    const scaledBox =
      new Box3().setFromObject(
        group
      );

    const center =
      new Vector3();

    scaledBox.getCenter(
      center
    );

    group.position.x =
      -center.x;

    group.position.z =
      -center.z;

    group.position.y =
      -scaledBox.min.y -
      0.8;

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

/* =========================================================
   ROUPA
========================================================= */

function ClothingModel({
  url,
}: {
  url: string;
}) {
  const [model, setModel] =
    useState<Object3D | null>(
      null
    );

  useEffect(() => {
    const loader =
      new GLTFLoader();

    loader.load(
      url,

      (gltf) => {
        console.log(
          '✅ Roupa carregada.'
        );

        gltf.scene.traverse(
          (child) => {
            const mesh =
              child as Mesh;

            if (mesh.isMesh) {
              mesh.visible = true;

              mesh.castShadow = true;

              mesh.receiveShadow = true;
            }
          }
        );

        setModel(
          gltf.scene
        );
      },

      undefined,

      (error) => {
        console.error(
          '❌ Erro ao carregar roupa:',
          error
        );
      }
    );
  }, [url]);

  const groupRef =
    useRef<Group | null>(null);

  useEffect(() => {
    const group =
      groupRef.current;

    if (!group || !model) {
      return;
    }

    group.updateMatrixWorld(
      true
    );

    const box =
      new Box3().setFromObject(
        group
      );

    const size =
      new Vector3();

    const center =
      new Vector3();

    box.getSize(size);

    box.getCenter(center);

    if (size.y <= 0) {
      return;
    }

    const targetHeight =
      1.65;

    group.scale.setScalar(
      targetHeight /
        size.y
    );

    group.updateMatrixWorld(
      true
    );

    const scaledBox =
      new Box3().setFromObject(
        group
      );

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
      0.95 -
      scaledCenter.y;

    group.position.z +=
      0.08;
  }, [model]);

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

/* =========================================================
   CENA
========================================================= */

function Scene({
  modelUrl,
  clothingModelUrl,
  onAvatarLoaded,
  onAvatarError,
}: {
  modelUrl?: string | null;
  clothingModelUrl?: string | null;
  onAvatarLoaded: () => void;
  onAvatarError: () => void;
}) {
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
        position={[
          3,
          5,
          4,
        ]}
        intensity={1.2}
        castShadow
      />

      <directionalLight
        position={[
          -3,
          2,
          -3,
        ]}
        intensity={0.4}
      />

      <pointLight
        position={[
          0,
          2.5,
          -2,
        ]}
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
          />
        ) : (
          <AvatarPlaceholderModel />
        )}

        {clothingModelUrl && (
          <ClothingModel
            url={
              clothingModelUrl
            }
          />
        )}

      </Suspense>

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

/* =========================================================
   CÂMERA
========================================================= */

function CameraController() {
  const { camera } =
    useThree();

  useEffect(() => {
    camera.position.set(
      0,
      0.35,
      5.2
    );

    camera.lookAt(
      0,
      0.15,
      0
    );
  }, [camera]);

  return null;
}

/* =========================================================
   VIEWER
========================================================= */

export function AvatarViewer({
  modelUrl,
  clothingModelUrl,
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
            Não foi possível carregar o avatar 3D.
          </p>

          <p className="max-w-xs text-xs text-caiment-ink-soft">
            O avatar foi gerado, mas o
            backend não conseguiu
            entregar o arquivo 3D
            ao visualizador.
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
              modelUrl={
                modelUrl
              }
              clothingModelUrl={
                clothingModelUrl
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
                0.15,
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
              <ZoomIn size={15} />
            </button>
          </div>
        )}
    </div>
  );
}