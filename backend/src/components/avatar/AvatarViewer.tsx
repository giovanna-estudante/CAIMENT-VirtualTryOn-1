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
// A rotação abaixo é somente o alinhamento visual da camiseta
// com a orientação do avatar no Canvas.
// Ela não altera os significados de X, Y e Z.
// ============================================================

const CLOTHING_VISUAL_ROTATION_Y = Math.PI / 2;

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

type ClothingPlacement =
  | 'ombros'
  | 'cintura';

interface ClothingProfile {
  measurements: ClothingMeasurements;
  shapeKeys: ClothingShapeKeyConfig[];
  placement: ClothingPlacement;
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

      // REGRA DE POSICIONAMENTO DA PEÇA:
      // camiseta começa na região dos ombros.
      // Esta regra serve SOMENTE para posicionar a roupa.
      // Ela não participa do cálculo da escala.
      placement: 'ombros',

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
    // MODELO MATEMÁTICO DAS SHAPE KEYS
    //
    // REGRA:
    //
    // 1. A roupa primeiro é colocada na escala física BASE.
    // 2. Depois calculamos as medidas físicas da roupa.
    // 3. Comparamos essas medidas com as medidas do usuário.
    // 4. Cada Shape Key recebe uma influência baseada na
    //    capacidade REAL daquela Shape Key de alterar a medida.
    //
    // NÃO:
    //
    // diferença percentual = influência
    //
    // SIM:
    //
    // necessidade física / capacidade da Shape Key = influência
    //
    // Exemplo:
    //
    // Roupa = 100 cm de tórax
    // Shape Key Tórax em 1.0 = +10 cm
    // Usuário precisa de 106 cm
    //
    // necessidade = 6 cm
    // capacidade = 10 cm
    // influência = 6 / 10 = 0.60
    //
    // ========================================================


    // ========================================================
    // ESCALA FÍSICA BASE DA PEÇA
    //
    // ATENÇÃO:
    //
    // Esta escala NÃO veste o avatar.
    //
    // Ela apenas transforma o tamanho original do GLB para
    // a dimensão física cadastrada da peça.
    //
    // Depois dela, NÃO haverá outra escala para adaptar o
    // corpo do usuário.
    // ========================================================

    const clothingBoxBase =
      new Box3().setFromObject(model);

    const clothingSizeBase =
      new Vector3();

    clothingBoxBase.getSize(
      clothingSizeBase
    );

    if (
      clothingSizeBase.x <= 0 ||
      clothingSizeBase.y <= 0 ||
      clothingSizeBase.z <= 0
    ) {
      console.error(
        '❌ Dimensão física inicial da roupa inválida.'
      );

      return;
    }


    // --------------------------------------------------------
    // MEDIDAS FÍSICAS CADASTRADAS DA PEÇA
    //
    // Use aqui os valores REAIS já cadastrados para a peça.
    //
    // NÃO coloque P/M/G/GG.
    //
    // NÃO use medidas do usuário.
    //
    // Exemplo:
    //
    // largura = 49.9 cm
    // comprimento = 70 cm
    //
    // Os valores abaixo devem ser substituídos pelos valores
    // que já existem no seu cadastro da camiseta.
    // --------------------------------------------------------

    const larguraRoupaCm =
      CAMISETA_P.measurements.largura;

    const comprimentoRoupaCm =
      CAMISETA_P.measurements.comprimento;

    if (
      larguraRoupaCm === undefined ||
      comprimentoRoupaCm === undefined ||
      larguraRoupaCm <= 0 ||
      comprimentoRoupaCm <= 0
    ) {
      console.error(
        '❌ Medidas físicas da camiseta não cadastradas corretamente.'
      );

      return;
    }


    // ========================================================
    // ESCALA BASE FÍSICA
    //
    // Como a regra dos eixos já foi definida:
    //
    // Three X = largura
    // Three Y = altura
    // Three Z = profundidade
    //
    // A escala base usa a largura física cadastrada.
    //
    // Não usamos altura do avatar.
    // Não usamos altura do usuário.
    // Não usamos P/M/G/GG.
    // ========================================================

    const larguraRoupaBaseM =
      larguraRoupaCm / 100;

    const escalaFisicaBase =
      larguraRoupaBaseM /
      clothingSizeBase.x;

    group.scale.set(
      escalaFisicaBase,
      escalaFisicaBase,
      escalaFisicaBase
    );

    group.updateMatrixWorld(
      true
    );


    // ========================================================
    // MEDE A ROUPA DEPOIS DA ESCALA FÍSICA BASE
    // ========================================================

    const clothingBoxPhysical =
      new Box3().setFromObject(
        group
      );

    const clothingSizePhysical =
      new Vector3();

    clothingBoxPhysical.getSize(
      clothingSizePhysical
    );

    console.log(
      '===================================='
    );

    console.log(
      '📐 ESCALA FÍSICA BASE DA ROUPA'
    );

    console.log(
      '===================================='
    );

    console.log(
      '📏 Largura cadastrada:',
      larguraRoupaCm,
      'cm'
    );

    console.log(
      '📏 Largura GLB:',
      clothingSizeBase.x,
      'm'
    );

    console.log(
      '📐 Escala física base:',
      escalaFisicaBase
    );

    console.log(
      '📐 Dimensão física inicial:',
      {
        largura:
          clothingSizePhysical.x * 100,

        altura:
          clothingSizePhysical.y * 100,

        profundidade:
          clothingSizePhysical.z * 100,
      }
    );


    // ========================================================
    // ZERA TODAS AS SHAPE KEYS
    //
    // A Basis é sempre o ponto inicial.
    //
    // A escala física já foi aplicada acima.
    // Portanto, as Shape Keys trabalham sobre uma roupa
    // que já está na escala física correta.
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
    // CALIBRAÇÃO FÍSICA DAS SHAPE KEYS
    //
    // ESTES VALORES SÃO A CAPACIDADE DE DEFORMAÇÃO DE CADA
    // SHAPE KEY QUANDO SUA INFLUÊNCIA = 1.0.
    //
    // EXEMPLO:
    //
    // delta: 8
    //
    // significa:
    //
    // Shape Key = 0
    // → medida original
    //
    // Shape Key = 1
    // → medida original + 8 cm
    //
    // NÃO significa tamanho P/M/G/GG.
    //
    // ========================================================

    const SHAPE_KEY_CALIBRATION = {

    Tórax: {
      measurement: 'torax',
      delta: 8,
    },

    Busto: {
      measurement: 'torax',
      delta: 8,
    },

    Cintura: {
      measurement: 'cintura',
      delta: 8,
    },

    Ombros: {
      measurement: 'ombros',
      delta: 5,
    },

  } as const;


    // ========================================================
    // FUNÇÃO DE APLICAÇÃO
    // ========================================================

    const aplicarShapeKey = (
      nomeShapeKey: string,
      influencia: number
    ) => {

      const valor =
        Math.max(
          0,
          Math.min(
            1,
            influencia
          )
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
              nomeShapeKey
            ];

          if (
            index === undefined
          ) {
            return;
          }

          mesh.morphTargetInfluences[
            index
          ] = valor;
        }
      );

      console.log(
        `🎯 Shape Key ${nomeShapeKey}:`,
        valor
      );
    };


    // ========================================================
    // CALCULA A INFLUÊNCIA FÍSICA
    //
    // A fórmula agora é:
    //
    // influência = necessidade / capacidade
    //
    // NÃO:
    //
    // influência = diferença percentual
    //
    // Isso faz com que cada Shape Key tenha sua própria
    // amplitude física.
    // ========================================================

    const calcularInfluenciaFisica = (
      medidaUsuario: number | undefined,
      medidaRoupa: number | undefined,
      deltaShapeKey: number
    ) => {

      if (
        medidaUsuario === undefined ||
        medidaRoupa === undefined ||
        medidaUsuario <= 0 ||
        medidaRoupa <= 0 ||
        deltaShapeKey <= 0
      ) {
        return 0;
      }

      const necessidade =
        medidaUsuario -
        medidaRoupa;

      // ------------------------------------------------------
      // Se o usuário não precisa aumentar essa região,
      // esta Shape Key positiva não deve ser aplicada.
      //
      // Isso é importante porque não queremos transformar
      // uma diferença negativa em uma influência positiva.
      // ------------------------------------------------------

      if (
        necessidade <= 0
      ) {
        return 0;
      }

      const influencia =
        necessidade /
        deltaShapeKey;

      return Math.max(
        0,
        Math.min(
          1,
          influencia
        )
      );
    };


    // ========================================================
    // TÓRAX
    // ========================================================

    if (
      medidas.torax !== undefined &&
      CAMISETA_P.measurements.torax !== undefined
    ) {

      const calibration =
        SHAPE_KEY_CALIBRATION.Tórax;

      const influencia =
        calcularInfluenciaFisica(
          medidas.torax,
          CAMISETA_P.measurements.torax,
          calibration.delta
        );

      aplicarShapeKey(
        'Tórax',
        influencia
      );

      console.log(
        '📐 Tórax:',
        {
          usuario:
            medidas.torax,

          roupa:
            CAMISETA_P.measurements.torax,

          necessidade:
            medidas.torax -
            CAMISETA_P.measurements.torax,

          capacidadeShapeKey:
            calibration.delta,

          influencia,
        }
      );
    }


    // ========================================================
    // CINTURA
    // ========================================================

    if (
      medidas.cintura !== undefined &&
      CAMISETA_P.measurements.cintura !== undefined
    ) {

      const calibration =
        SHAPE_KEY_CALIBRATION.Cintura;

      const influencia =
        calcularInfluenciaFisica(
          medidas.cintura,
          CAMISETA_P.measurements.cintura,
          calibration.delta
        );

      aplicarShapeKey(
        'Cintura',
        influencia
      );

      aplicarShapeKey(
        'Ajuste lateral',
        influencia
      );

      console.log(
        '📐 Cintura:',
        {
          usuario:
            medidas.cintura,

          roupa:
            CAMISETA_P.measurements.cintura,

          necessidade:
            medidas.cintura -
            CAMISETA_P.measurements.cintura,

          capacidadeShapeKey:
            calibration.delta,

          influencia,
        }
      );
    }


    // ========================================================
    // OMBROS
    // ========================================================

    if (
      medidas.ombros !== undefined &&
      CAMISETA_P.measurements.ombros !== undefined
    ) {

      const calibration =
        SHAPE_KEY_CALIBRATION.Ombros;

      const influencia =
        calcularInfluenciaFisica(
          medidas.ombros,
          CAMISETA_P.measurements.ombros,
          calibration.delta
        );

      aplicarShapeKey(
        'Ombros',
        influencia
      );

      console.log(
        '📐 Ombros:',
        {
          usuario:
            medidas.ombros,

          roupa:
            CAMISETA_P.measurements.ombros,

          necessidade:
            medidas.ombros -
            CAMISETA_P.measurements.ombros,

          capacidadeShapeKey:
            calibration.delta,

          influencia,
        }
      );
    }


    // ========================================================
    // CAIMENTO
    //
    // IMPORTANTE:
    //
    // Caimento NÃO recebe mais automaticamente a mesma
    // porcentagem da cintura, tórax ou ombros.
    //
    // Ele só será aplicado quando tivermos uma regra física
    // específica para o caimento.
    //
    // Portanto, por enquanto:
    //
    // Caimento = 0
    //
    // Isso evita deformar a peça sem saber o que a Shape Key
    // representa fisicamente.
    // ========================================================

    aplicarShapeKey(
      'Caimento',
      0
    );


    // ========================================================
    // BARRA
    //
    // Não relacionamos Barra automaticamente à cintura.
    //
    // Barra precisa de sua própria medida/regra física.
    // ========================================================

    aplicarShapeKey(
      'Barra',
      0
    );


    // ========================================================
    // GOLA
    //
    // Só deve ser ativada quando houver uma medida específica
    // de gola/pescoço cadastrada.
    // ========================================================

    aplicarShapeKey(
      'Gola',
      0
    );


    // ========================================================
    // MANGA
    //
    // Não usamos medidas inexistentes no UserMeasurements.
    //
    // Só ativaremos quando existir no tipo de medidas do usuário
    // uma medida corporal correspondente à manga.
    // ========================================================

    aplicarShapeKey(
      'Manga',
      0
    );


    // ========================================================
    // FRENTE/COSTAS
    //
    // Não deve receber automaticamente a mesma influência de
    // cintura ou tórax.
    // ========================================================

    aplicarShapeKey(
      'Frente_Costas',
      0
    );


    // ========================================================
    // RESULTADO DAS SHAPE KEYS
    // ========================================================

    group.updateMatrixWorld(
      true
    );

    console.log(
      '===================================='
    );

    console.log(
      '🎯 AJUSTE FÍSICO POR SHAPE KEYS'
    );

    console.log(
      '===================================='
    );

    console.log(
      '👕 Escala física base:',
      escalaFisicaBase
    );

    console.log(
      '🎯 Shape Keys aplicadas depois da escala física base.'
    );

    console.log(
      '🚫 Escala global para vestir o usuário: NÃO'
    );

    console.log(
      '🚫 P/M/G/GG: NÃO PARTICIPA'
    );

    console.log(
      '🤖 Tamanho recomendado pela IA: INDEPENDENTE'
    );

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
      0,
      CLOTHING_VISUAL_ROTATION_Y,
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
    // ESCALA DA CAMISETA
    //
    // A escala usa SOMENTE a altura inteira do avatar e a
    // altura inteira cadastrada do usuário.
    //
    // A camiseta P possui 70 cm de comprimento.
    // Exemplo: avatar = 3,4 m e usuário = 168 cm:
    // 3,4 × (70 / 168) = 1,4167 m.
    //
    // A dimensão do GLB não é tratada como os 70 cm físicos.
    // Ela é usada somente como base para descobrir a escala
    // necessária para chegar à altura alvo.
    // ========================================================

    const alturaAvatar =
      avatarFitData.size.y;

    const alturaUsuarioCm =
      medidas.altura;

    if (
      alturaUsuarioCm === undefined ||
      alturaUsuarioCm <= 0
    ) {
      console.error(
        '❌ Altura inteira do usuário inválida para calcular a escala da camiseta.'
      );

      return;
    }

    const alturaCamisetaCatalogoCm =
      CAMISETA_P.measurements.comprimento ??
      70;

    const alturaCamisetaCatalogoM =
      alturaCamisetaCatalogoCm / 100;

    const alturaAlvo =
      alturaAvatar *
      (
        alturaCamisetaCatalogoM /
        (alturaUsuarioCm / 100)
      );

    // A referência física do modelo P no Blender é 70 cm.
    // Não usamos orientedSize.y porque ele é medido depois
    // da rotação visual e não representa necessariamente
    // o comprimento físico da camiseta.
    const alturaBaseCamisetaM =
      0.70;

    const escalaUniforme =
      alturaAlvo /
      alturaBaseCamisetaM;

    group.scale.setScalar(
      escalaUniforme
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

    console.log('🧩 ÂNCORA DA CAMISETA');
    console.log('Box min Y:', scaledBox.min.y);
    console.log('Box max Y:', scaledBox.max.y);
    console.log('Centro Y:', scaledCenter.y);
    console.log('Altura Y:', scaledSize.y);

    console.log(
      'Distância centro → topo:',
      scaledBox.max.y - scaledCenter.y
    );

    console.log(
      'Distância centro → base:',
      scaledCenter.y - scaledBox.min.y
    );

    // ========================================================
    // POSICIONAMENTO DA ROUPA — SOMENTE POSICIONAMENTO
    //
    // A escala e a orientação já foram calculadas acima.
    // Aqui usamos somente as medidas do corpo para descobrir
    // onde a peça deve ficar no avatar já escalado.
    //
    // CAMISETA / VESTIDO:
    // pés → cintura → ombros → margem de segurança → topo.
    //
    // CALÇA:
    // pés → cintura → margem de segurança → topo.
    //
    // As medidas são convertidas proporcionalmente para o
    // tamanho final do avatar. Isso NÃO altera a escala da roupa.
    // ========================================================

    let alturaReferenciaCm: number;
    let margemSegurancaCm = 0;

    if (CAMISETA_P.placement === 'ombros') {
      // A referência dos ombros começa nos pés do avatar.
      if (
        medidas.alturaPeCintura !== undefined &&
        medidas.alturaCinturaOmbros !== undefined
      ) {
        alturaReferenciaCm =
          medidas.alturaPeCintura +
          medidas.alturaCinturaOmbros;
      } else {
        // Fallback somente para posicionamento.
        alturaReferenciaCm =
          medidas.altura * 0.68;
      }

      // Evita que a gola entre no corpo do avatar.
      margemSegurancaCm = 2;
    } else {
      // Para peças que começam na cintura.
      alturaReferenciaCm =
        medidas.alturaPeCintura ??
        medidas.altura * 0.5;
    }

    // Fator que transforma as medidas cadastradas do usuário
    // em medidas proporcionais ao avatar final de 3,4 m.
    const alturaAvatarM =
      avatarFitData.size.y;

    const alturaUsuarioM =
      medidas.altura / 100;

    const fatorReferenciaAvatar =
      alturaAvatarM / alturaUsuarioM;

    // Distância dos pés até o ponto de início da roupa
    // dentro do espaço final do avatar.
    const alturaReferencia =
      (alturaReferenciaCm / 100) *
      fatorReferenciaAvatar;

    // Margem de segurança convertida para o mesmo espaço.
    const margemSeguranca =
      (margemSegurancaCm / 100) *
      fatorReferenciaAvatar;

    // O Box3 da roupa é usado somente para posicionar seu
    // centro no ponto calculado. Ele não altera sua escala.
    const topoRoupa =
      avatarFitData.box.min.y +
      alturaReferencia +
      margemSeguranca;

    // A linha dos ombros da camiseta fica abaixo
    // do ponto mais alto da geometria.
    const deslocamentoOmbrosCamiseta = 0.30;

    const ancoraOmbrosCamiseta =
      scaledBox.max.y -
      deslocamentoOmbrosCamiseta;

    const posicaoY =
      topoRoupa -
      ancoraOmbrosCamiseta;

    group.position.set(
      avatarFitData.center.x -
        scaledCenter.x,

      posicaoY,

      avatarFitData.center.z -
        scaledCenter.z
    );

    group.updateMatrixWorld(true);

    const roupaDepoisDaPosicao = new Box3().setFromObject(group);

    console.log('👕 CAMISETA DEPOIS DO POSICIONAMENTO');
    console.log('Min Y final:', roupaDepoisDaPosicao.min.y);
    console.log('Max Y final:', roupaDepoisDaPosicao.max.y);
    console.log('Altura final:', roupaDepoisDaPosicao.max.y - roupaDepoisDaPosicao.min.y);

    console.log('🎯 Referência dos ombros:', topoRoupa);

    console.log(
      '📏 Diferença entre topo da roupa e referência:',
      roupaDepoisDaPosicao.max.y - topoRoupa
    );

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
      '🔄 Alinhamento visual aplicado:',
      '+90° no eixo Y'
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
      '📐 Escala uniforme:',
      escalaUniforme
    );

    console.log(
      '📐 Altura física base da camiseta:',
      alturaBaseCamisetaM
    );

    console.log(
      '🎯 Altura alvo da camiseta:',
      alturaAlvo
    );

    console.log(
      '🧍 Altura inteira do avatar:',
      alturaAvatar
    );

    console.log(
      '🧍 Altura inteira cadastrada:',
      alturaUsuarioCm
    );

    console.log(
      '📐 Altura física cadastrada da camiseta:',
      alturaCamisetaCatalogoCm
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
      '📍 Regra de posicionamento:',
      CAMISETA_P.placement
    );

    console.log(
      '📍 Altura usada somente para posicionamento:',
      alturaReferenciaCm
    );

    console.log(
      '📍 Folga acima da referência:',
      margemSegurancaCm
    );

    console.log(
      '📍 Altura de referência para posicionamento (cm):',
      alturaReferenciaCm
    );

    console.log(
      '📍 Folga acima da referência (cm):',
      margemSegurancaCm
    );

    console.log(
      '📍 Altura usada para posicionamento (m):',
      alturaReferencia
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