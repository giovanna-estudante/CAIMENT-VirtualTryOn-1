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

/*
 * ============================================================
 * REFERÊNCIA DA CAMISETA
 * ============================================================
 *
 * Dimensões do novo GLB em Blender:
 *
 * X = largura      = 0.554 m
 * Y = profundidade = 0.346 m
 * Z = altura       = 0.687 m
 *
 * Conversão usada pelo CAIMENT:
 *
 * Blender X -> Three X = largura
 * Blender Y -> Three Z = profundidade
 * Blender Z -> Three Y = altura
 */
const REFERENCE = {
  width: 0.554,
  depth: 0.346,
  height: 0.687,

  /*
   * Referências corporais usadas para calcular
   * as Shape Keys relacionadas às medidas.
   */
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

  /**
   * Carrega o GLB original, aplica SOMENTE a deformação
   * da roupa e devolve um GLB novo já "congelado".
   *
   * O AvatarViewer recebe o resultado pronto.
   */
  async deform(
    originalGlbUrl: string,
    measurements: ClothingMeasurements,
  ): Promise<DeformedClothing> {
    console.log('====================================');
    console.log('👕 INÍCIO DO DEFORMADOR');
    console.log('====================================');

    console.log('🔗 GLB original:', originalGlbUrl);
    console.log('📏 Medidas recebidas:', measurements);

    const gltf = await this.load(originalGlbUrl);

    // Trabalhamos em uma cópia para nunca alterar a cena/GLB original.
    const clothing = cloneSkeleton(gltf.scene);

    console.log('====================================');
    console.log('👕 APLICANDO DEFORMAÇÃO');
    console.log('====================================');

    clothing.traverse((node) => {
      const mesh = node as MorphMesh;

      if (!mesh.isMesh) return;

      console.log('------------------------------------');
      console.log('👕 Mesh:', mesh.name);

      // Cada mesh recebe sua própria geometria.
      mesh.geometry = mesh.geometry.clone();

      this.applyShapeKeys(mesh, measurements);
      this.bakeMorphTargets(mesh);
    });

    const url = await this.exportAsGlb(clothing);

    console.log('====================================');
    console.log('✅ DEFORMAÇÃO FINALIZADA');
    console.log('====================================');

    return {
      object: clothing,
      url,
      revoke: () => URL.revokeObjectURL(url),
    };
  }

  private async load(url: string): Promise<GLTF> {
    console.log('====================================');
    console.log('👕 CARREGANDO GLB DA ROUPA');
    console.log('====================================');

    console.log('🔗 URL:', url);

    return new Promise((resolve, reject) => {
      this.loader.load(
        url,
        (gltf) => {
          console.log('✅ GLB carregado com sucesso');

          gltf.scene.traverse((node) => {
            const mesh = node as MorphMesh;

            if (!mesh.isMesh) return;

            console.log('------------------------------------');
            console.log('👕 MESH ENCONTRADA:', mesh.name);

            if (!mesh.morphTargetDictionary) {
              console.log(
                '🧩 Nenhuma Shape Key encontrada nesta mesh.',
              );
              return;
            }

            console.log(
              '🧩 SHAPE KEYS ENCONTRADAS:',
              mesh.morphTargetDictionary,
            );

            if (!mesh.morphTargetInfluences) {
              console.log(
                '⚠️ A mesh possui Shape Keys, mas não possui valores de influência.',
              );
              return;
            }

            console.log('🎨 VALORES ATUAIS DAS SHAPE KEYS:');

            Object.entries(mesh.morphTargetDictionary).forEach(
              ([name, index]) => {
                const value =
                  mesh.morphTargetInfluences?.[index] ?? 0;

                console.log(
                  `🎨 Shape Key "${name}": ${value.toFixed(3)}`,
                );
              },
            );

            console.log('------------------------------------');
          });

          console.log('====================================');

          resolve(gltf);
        },
        undefined,
        (error) => {
          console.error('❌ ERRO AO CARREGAR GLB:', error);
          reject(error);
        },
      );
    });
  }

  private applyShapeKeys(
    mesh: MorphMesh,
    measurements: ClothingMeasurements,
  ): void {
    if (!mesh.morphTargetDictionary || !mesh.morphTargetInfluences) {
      console.log(
        '⚠️ Esta mesh não possui Shape Keys:',
        mesh.name,
      );
      return;
    }

    console.log('====================================');
    console.log('🧩 APLICANDO SHAPE KEYS');
    console.log('====================================');

    const influence = (name: string, value: number) => {
      const index = mesh.morphTargetDictionary?.[name];

      if (index === undefined) {
        console.log(
          `❌ Shape Key "${name}" não encontrada.`,
        );
        return;
      }

      const valorAnterior =
        mesh.morphTargetInfluences?.[index] ?? 0;

      const finalValue = THREE.MathUtils.clamp(
        value,
        0,
        1,
      );

      mesh.morphTargetInfluences![index] = finalValue;

      console.log(
        `🎨 Shape Key "${name}" | antes: ${valorAnterior.toFixed(
          3,
        )} | aplicado: ${finalValue.toFixed(3)}`,
      );
    };

    /*
     * ========================================================
     * 1. CINTURA
     * ========================================================
     *
     * A Shape Key reduz a cintura da camiseta.
     */
    const cinturaDelta =
      REFERENCE.waist - measurements.cintura;

    influence(
      SHAPE_KEYS.Cintura,
      THREE.MathUtils.clamp(
        cinturaDelta / 20,
        0,
        1,
      ),
    );

    /*
     * ========================================================
     * 2. TÓRAX
     * ========================================================
     *
     * A Shape Key aumenta principalmente a profundidade
     * da região do tórax.
     */
    const toraxDelta =
      measurements.torax - REFERENCE.torso;

    influence(
      SHAPE_KEYS.Torax,
      THREE.MathUtils.clamp(
        toraxDelta / 15,
        0,
        1,
      ),
    );

    /*
     * ========================================================
     * 3. MANGA
     * ========================================================
     *
     * A Shape Key altera principalmente a região das mangas.
     *
     * Mantemos a relação com a diferença dos ombros.
     */
    const shoulderDelta =
      measurements.ombros - REFERENCE.shoulder;

    influence(
      SHAPE_KEYS.Manga,
      THREE.MathUtils.clamp(
        Math.abs(shoulderDelta) / 10,
        0,
        1,
      ),
    );

    /*
     * ========================================================
     * 4. OMBROS
     * ========================================================
     *
     * Nesta camiseta, a modelagem original possui o ombro
     * muito caído.
     *
     * Por isso, esta Shape Key funciona como uma correção
     * fixa da modelagem e permanece em 100%.
     *
     * A Manga continua sendo calculada separadamente.
     */
    influence(
      SHAPE_KEYS.Ombros,
      1,
    );

    /*
     * ========================================================
     * 5. GOLA
     * ========================================================
     *
     * Relacionada à diferença dos ombros.
     */
    influence(
      SHAPE_KEYS.Gola,
      THREE.MathUtils.clamp(
        shoulderDelta / 10,
        0,
        1,
      ),
    );

    /*
     * ========================================================
     * 6. BUSTO
     * ========================================================
     *
     * A Shape Key Busto altera principalmente a região frontal
     * do busto.
     *
     * Ela não deve ser confundida com uma escala geral da
     * camiseta, pois a alteração acontece principalmente
     * na frente da peça.
     */
    const bustDelta =
      measurements.busto - REFERENCE.bust;

    influence(
      SHAPE_KEYS.Busto,
      THREE.MathUtils.clamp(
        bustDelta / 15,
        0,
        1,
      ),
    );

    /*
     * ========================================================
     * 7. BARRA
     * ========================================================
     *
     * Relacionada à diferença entre quadril e busto.
     */
    const hipDelta =
      measurements.quadril - measurements.busto;

    influence(
      SHAPE_KEYS.Barra,
      THREE.MathUtils.clamp(
        hipDelta / 20,
        0,
        1,
      ),
    );

    /*
     * ========================================================
     * 8. AJUSTE LATERAL
     * ========================================================
     *
     * Relacionado à diferença entre quadril e cintura.
     */
    const lateralDelta =
      measurements.quadril - measurements.cintura;

    influence(
      SHAPE_KEYS.AjusteLateral,
      THREE.MathUtils.clamp(
        (lateralDelta - 20) / 30,
        0,
        1,
      ),
    );

    /*
     * ========================================================
     * 9. CAIMENTO
     * ========================================================
     *
     * Mantido em 0 por enquanto.
     *
     * A Shape Key Caimento produz uma alteração muito grande
     * na camiseta e será calibrada separadamente.
     */
    influence(
      SHAPE_KEYS.Caimento,
      0,
    );

    console.log('====================================');
    console.log('🧩 FIM DAS SHAPE KEYS');
    console.log('====================================');
  }

  /**
   * Transforma os morph targets aplicados em geometria definitiva.
   */
  private bakeMorphTargets(mesh: MorphMesh): void {
    const geometry = mesh.geometry;

    const position =
      geometry.getAttribute('position');

    if (!position || !mesh.morphTargetInfluences) {
      console.log(
        '⚠️ Não foi possível fazer bake das Shape Keys:',
        mesh.name,
      );
      return;
    }

    const morphPositions =
      geometry.morphAttributes.position;

    if (!morphPositions?.length) {
      console.log(
        '⚠️ A mesh não possui morph targets de posição:',
        mesh.name,
      );
      return;
    }

    const influences =
      mesh.morphTargetInfluences;

    const relative =
      geometry.morphTargetsRelative === true;

    const positionArray =
      position.array as ArrayLike<number> & {
        [index: number]: number;
      };

    console.log('====================================');
    console.log('🔥 CONGELANDO SHAPE KEYS');
    console.log('====================================');

    for (
      let i = 0;
      i < morphPositions.length;
      i += 1
    ) {
      const amount =
        influences[i] ?? 0;

      if (amount === 0) {
        continue;
      }

      console.log(
        `🔥 Morph Target ${i} aplicado com valor ${amount.toFixed(
          3,
        )}`,
      );

      const morph =
        morphPositions[i];

      const morphArray =
        morph.array as ArrayLike<number> & {
          [index: number]: number;
        };

      for (
        let j = 0;
        j < position.count * 3;
        j += 1
      ) {
        if (relative) {
          positionArray[j] +=
            morphArray[j] * amount;
        } else {
          positionArray[j] +=
            (morphArray[j] - positionArray[j]) *
            amount;
        }
      }
    }

    position.needsUpdate = true;

    // A deformação agora está nos vértices.
    // Removemos os morph targets para impedir nova alteração externa.
    geometry.morphAttributes.position = [];
    geometry.morphAttributes.normal = [];

    mesh.morphTargetDictionary = {};
    mesh.morphTargetInfluences = [];

    geometry.computeVertexNormals();

    console.log(
      '✅ Shape Keys congeladas na geometria.',
    );
  }

  private async exportAsGlb(
    scene: THREE.Object3D,
  ): Promise<string> {
    const exporter = new GLTFExporter();

    return new Promise((resolve, reject) => {
      exporter.parse(
        scene,
        (result) => {
          if (!(result instanceof ArrayBuffer)) {
            reject(
              new Error(
                'O exportador não retornou um GLB binário.',
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

          const url =
            URL.createObjectURL(blob);

          console.log(
            '📦 GLB deformado exportado:',
            url,
          );

          resolve(url);
        },
        (error) => {
          reject(
            error instanceof Error
              ? error
              : new Error(
                  'Não foi possível exportar a roupa deformada.',
                ),
          );
        },
        {
          binary: true,
          onlyVisible: true,
          trs: false,
        },
      );
    });
  }
}

export const clothingDeformer =
  new ClothingDeformer();