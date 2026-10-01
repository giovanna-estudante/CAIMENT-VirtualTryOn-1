import type { AvatarGenerationStatus } from '@/types';

// ============================================================================
// Este serviço NÃO chama nenhuma API externa. Ele apenas simula o fluxo de
// geração de avatar para que a UI (tela de processamento) tenha algo real
// para orquestrar. Quando o backend + Tripo AI estiverem prontos, a função
// `generateAvatar` deve ser substituída por uma chamada HTTP real, mantendo
// a mesma assinatura de retorno (taskId, status, progresso via callback).
// ============================================================================

export interface GenerationStep {
  key: string;
  label: string;
  status: AvatarGenerationStatus;
}

const STEP_LABELS = [
  'Analisando imagens',
  'Processando dados',
  'Criando modelo 3D',
  'Finalizando avatar',
];

export function simulateAvatarGeneration(
  onStep: (stepIndex: number, progress: number) => void,
  onComplete: (result: { taskId: string; modelUrl: null; previewUrl: null }) => void,
): () => void {
  let stepIndex = 0;
  let progress = 0;
  const taskId = `sim-task-${Date.now()}`;

  const interval = window.setInterval(() => {
    progress += 4 + Math.random() * 6;
    if (progress >= (stepIndex + 1) * (100 / STEP_LABELS.length)) {
      stepIndex = Math.min(stepIndex + 1, STEP_LABELS.length - 1);
    }
    onStep(stepIndex, Math.min(progress, 100));

    if (progress >= 100) {
      window.clearInterval(interval);
      // Nenhum GLB real é gerado nesta etapa — modelUrl permanece nulo
      // até a integração real com o Tripo AI.
      onComplete({ taskId, modelUrl: null, previewUrl: null });
    }
  }, 450);

  return () => window.clearInterval(interval);
}

export const avatarGenerationSteps = STEP_LABELS;
