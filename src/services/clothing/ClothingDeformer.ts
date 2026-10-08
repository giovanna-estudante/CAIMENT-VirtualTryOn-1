import * as THREE from 'three';
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { clone as cloneSkeleton } from 'three/examples/jsm/utils/SkeletonUtils.js';

export interface ClothingMeasurements {
  altura: number;
  ombros: number;
  torax: number;
  busto: number;
  cintura: number;
  quadril: number;
  pernas: number;
  tronco: number;
}

export interface DeformedClothing {
  object: THREE.Object3D;
  url: string;
  revoke: () => void;
}

const REFERENCE = {
  width: 0.499,
  depth: 0.297,
  height: 0.699,

  shoulder: 42,
  torso: 45,
  bust: 86,
  waist: 68,
};

const SHAPE_KEYS = {
  Cintura: 'Cintura',
  Torax: 'Tórax',
  Manga: 'Manga',
  Ombros: 'Ombros',
  Gola: 'Gola',
  Caimento: 'Caimento',
  Barra: 'Barra',
  AjusteLateral: 'Ajuste lateral',
  Busto: 'Busto',
};

type MorphMesh = THREE.Mesh & {
  morphTargetDictionary?: Record<string, number>;
  morphTargetInfluences?: number[];
};

export class ClothingDeformer {
  private readonly loader = new GLTFLoader();

  async deform(
    originalGlbUrl: string,
    measurements: ClothingMeasurements,
  ): Promise<DeformedClothing> {
    console.log('👕 Iniciando deformação da roupa...');
    console.log('📏 Medidas recebidas:', measurements);

    const gltf = await this.load(originalGlbUrl);

    const clothing = cloneSkeleton(gltf.scene);

    clothing.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return;

      const mesh = child as MorphMesh;

      if (mesh.geometry) {
        mesh.geometry = mesh.geometry.clone();
      }

      this.applyShapeKeys(mesh, measurements);
    });

    this.bakeMorphTargets(clothing);

    const url = await this.exportAsGlb(clothing);

    console.log('✅ Roupa deformada e exportada.');

    return {
      object: clothing,
      url,
      revoke: () => URL.revokeObjectURL(url),
    };
  }

  private load(url: string): Promise<GLTF> {
    return new Promise((resolve, reject) => {
      this.loader.load(
        url,
        (gltf) => {
          console.log('📦 GLB carregado:', url);

          gltf.scene.traverse((child) => {
            if (!(child as THREE.Mesh).isMesh) return;

            const mesh = child as MorphMesh;

            console.log('👕 Mesh encontrada:', mesh.name);

            if (mesh.morphTargetDictionary) {
              console.log(
                '🎛️ Shape Keys:',
                mesh.morphTargetDictionary,
              );
            }

            if (mesh.morphTargetInfluences) {
              console.log(
                '🎚️ Influências:',
                mesh.morphTargetInfluences,
              );
            }
          });

          resolve(gltf);
        },
        undefined,
        (error) => {
          console.error('❌ Erro ao carregar GLB:', error);
          reject(error);
        },
      );
    });
  }

  private applyShapeKeys(
    mesh: MorphMesh,
    measurements: ClothingMeasurements,
  ) {
    if (!mesh.morphTargetDictionary || !mesh.morphTargetInfluences) {
      return;
    }

    const dictionary = mesh.morphTargetDictionary;
    const influences = mesh.morphTargetInfluences;

    const setShapeKey = (name: string, value: number) => {
      const index = dictionary[name];

      if (index === undefined) {
        console.warn(`⚠️ Shape Key "${name}" não encontrada.`);
        return;
      }

      influences[index] = THREE.MathUtils.clamp(value, 0, 1);

      console.log(
        `🎛️ ${name}: ${(influences[index] * 100).toFixed(0)}%`,
      );
    };

    /*
     * ============================================================
     * CINTURA
     * ============================================================
     */

    const cinturaDelta =
      REFERENCE.waist - measurements.cintura;

    const cinturaInfluence = THREE.MathUtils.clamp(
      cinturaDelta / 20,
      0,
      1,
    );

    setShapeKey(
      SHAPE_KEYS.Cintura,
      cinturaInfluence,
    );

    /*
     * ============================================================
     * TÓRAX
     * ============================================================
     */

    const toraxDelta =
      measurements.torax - REFERENCE.torso;

    const toraxInfluence = THREE.MathUtils.clamp(
      toraxDelta / 15,
      0,
      1,
    );

    setShapeKey(
      SHAPE_KEYS.Torax,
      toraxInfluence,
    );

    /*
     * ============================================================
     * MANGA
     * ============================================================
     */

    const shoulderDelta =
      Math.abs(
        measurements.ombros - REFERENCE.shoulder,
      );

    const mangaInfluence = THREE.MathUtils.clamp(
      shoulderDelta / 10,
      0,
      1,
    );

    setShapeKey(
      SHAPE_KEYS.Manga,
      mangaInfluence,
    );

    /*
     * ============================================================
     * OMBROS
     * ============================================================
     *
     * Fixo em 100%, conforme solicitado.
     */

    setShapeKey(
      SHAPE_KEYS.Ombros,
      1.0,
    );

    /*
     * ============================================================
     * GOLA
     * ============================================================
     */

    const golaInfluence = THREE.MathUtils.clamp(
      shoulderDelta / 10,
      0,
      1,
    );

    setShapeKey(
      SHAPE_KEYS.Gola,
      golaInfluence,
    );

    /*
     * ============================================================
     * BUSTO
     * ============================================================
     *
     * Fixo em 100%, conforme solicitado.
     *
     * Importante:
     * A própria Shape Key "Busto" é responsável por fazer
     * a alteração localizada somente na região frontal do busto.
     */

    setShapeKey(
      SHAPE_KEYS.Busto,
      1.0,
    );

    /*
     * ============================================================
     * CAIMENTO
     * ============================================================
     *
     * Fixo em 25%, conforme solicitado.
     */

    setShapeKey(
      SHAPE_KEYS.Caimento,
      0.25,
    );

    /*
     * ============================================================
     * BARRA
     * ============================================================
     */

    const diferencaQuadrilBusto =
      measurements.quadril - measurements.busto;

    const barraInfluence = THREE.MathUtils.clamp(
      diferencaQuadrilBusto / 20,
      0,
      1,
    );

    setShapeKey(
      SHAPE_KEYS.Barra,
      barraInfluence,
    );

    /*
     * ============================================================
     * AJUSTE LATERAL
     * ============================================================
     */

    const lateralDelta =
      Math.abs(
        measurements.quadril - measurements.busto,
      );

    const ajusteLateralInfluence = THREE.MathUtils.clamp(
      (lateralDelta - 20) / 30,
      0,
      1,
    );

    setShapeKey(
      SHAPE_KEYS.AjusteLateral,
      ajusteLateralInfluence,
    );
  }

  private bakeMorphTargets(
    object: THREE.Object3D,
  ) {
    object.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return;

      const mesh = child as MorphMesh;

      if (
        !mesh.geometry ||
        !mesh.morphTargetInfluences ||
        !mesh.morphTargetDictionary
      ) {
        return;
      }

      const geometry = mesh.geometry;

      const position =
        geometry.attributes.position;

      const morphAttributes =
        geometry.morphAttributes.position;

      if (!morphAttributes) {
        return;
      }

      const basePositions =
        position.array.slice();

      const resultPositions =
        new Float32Array(basePositions.length);

      resultPositions.set(basePositions);

      const influences =
        mesh.morphTargetInfluences;

      const relative =
        geometry.morphTargetsRelative;

      morphAttributes.forEach(
        (morphAttribute, morphIndex) => {
          const influence =
            influences[morphIndex] ?? 0;

          if (influence === 0) {
            return;
          }

          const morphArray =
            morphAttribute.array;

          for (
            let i = 0;
            i < resultPositions.length;
            i += 3
          ) {
            if (relative) {
              resultPositions[i] +=
                morphArray[i] * influence;

              resultPositions[i + 1] +=
                morphArray[i + 1] * influence;

              resultPositions[i + 2] +=
                morphArray[i + 2] * influence;
            } else {
              resultPositions[i] =
                THREE.MathUtils.lerp(
                  resultPositions[i],
                  morphArray[i],
                  influence,
                );

              resultPositions[i + 1] =
                THREE.MathUtils.lerp(
                  resultPositions[i + 1],
                  morphArray[i + 1],
                  influence,
                );

              resultPositions[i + 2] =
                THREE.MathUtils.lerp(
                  resultPositions[i + 2],
                  morphArray[i + 2],
                  influence,
                );
            }
          }
        },
      );

      geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(
          resultPositions,
          3,
        ),
      );

      geometry.deleteAttribute('normal');

      geometry.computeVertexNormals();

      geometry.morphAttributes.position = [];

      mesh.morphTargetInfluences = [];

      mesh.morphTargetDictionary = {};
    });
  }

  private exportAsGlb(
    object: THREE.Object3D,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const exporter = new GLTFExporter();

      exporter.parse(
        object,
        (result) => {
          if (!(result instanceof ArrayBuffer)) {
            reject(
              new Error(
                'O GLTFExporter não retornou um GLB.',
              ),
            );
            return;
          }

          const blob = new Blob(
            [result],
            {
              type: 'model/gltf-binary',
            },
          );

          resolve(
            URL.createObjectURL(blob),
          );
        },
        (error) => {
          console.error(
            '❌ Erro ao exportar GLB:',
            error,
          );

          reject(error);
        },
        {
          binary: true,
        },
      );
    });
  }
}