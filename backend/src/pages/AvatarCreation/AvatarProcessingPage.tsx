import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';

import { CaimentAvatar } from '@/components/caiment/CaimentBubble';
import { cn } from '@/utils/cn';

import {
  getAvatarTask,
} from '@/services/api';

import {
  updateAvatarRecord,
} from '@/services/firebase/avatar';

import {
  useAuth,
} from '@/context/AuthContext';

const steps = [
  'Enviando suas fotos',
  'Analisando as imagens',
  'Construindo seu avatar 3D',
  'Aplicando detalhes',
];

export default function AvatarProcessingPage() {
  const navigate = useNavigate();

  const { user } = useAuth();

  const [progress, setProgress] =
    useState(0);

  const [status, setStatus] =
    useState(
      'Iniciando...',
    );

  const [currentStep, setCurrentStep] =
    useState(0);

  useEffect(() => {
    const taskId =
      sessionStorage.getItem(
        'caiment_avatar_task_id',
      );

    if (!user) {
      setStatus(
        'Usuário não encontrado. Faça login novamente.',
      );

      return;
    }

    if (!taskId) {
      setStatus(
        'Não encontramos a tarefa do avatar.',
      );

      return;
    }

    let cancelled = false;

    const checkTask =
      async () => {
        try {
          const data =
            await getAvatarTask(
              taskId,
            );

          if (cancelled) {
            return;
          }

          const task =
            data.task;

          console.log(
            '📡 Status atual do Tripo:',
            task,
          );

          const taskProgress =
            Math.min(
              100,
              Math.max(
                0,
                Number(
                  task.progress ?? 0,
                ),
              ),
            );

          setProgress(
            taskProgress,
          );

          if (
            task.status ===
            'queued'
          ) {
            setCurrentStep(1);

            setStatus(
              'Sua tarefa está na fila do Tripo...',
            );
          } else if (
            task.status ===
            'running'
          ) {
            setCurrentStep(2);

            setStatus(
              'Caiment está construindo seu avatar 3D...',
            );
          } else if (
            task.status ===
            'success'
          ) {
            setCurrentStep(3);

            setProgress(100);

            setStatus(
              'Seu avatar 3D foi criado!',
            );

            console.log(
              'AVATAR GERADO COM SUCESSO',
            );

            console.log(
              'RESULTADO COMPLETO DO TRIPO:',
              task,
            );

            console.log(
              'OUTPUT:',
              task.output,
            );

            const modelUrl =
              task.output
                ?.model_url ||
              null;

            const previewUrl =
              task.output
                ?.rendered_image_url ||
              null;

            console.log(
              'MODEL URL:',
              modelUrl,
            );

            console.log(
              'PREVIEW URL:',
              previewUrl,
            );

            if (!modelUrl) {
              throw new Error(
                'O Tripo terminou a geração, mas não retornou o modelo 3D.',
              );
            }

            /*
             * ==================================
             * SALVA O AVATAR NO FIRESTORE
             * DO USUÁRIO LOGADO
             * ==================================
             */

            await updateAvatarRecord(
              user.uid,
              {
                status: 'ready',
                taskId,
                modelUrl,
                previewUrl,
                source: 'tripo',
              },
            );

            console.log(
              '✅ Avatar salvo no perfil do usuário.',
            );

            /*
             * Removemos o taskId porque
             * o processamento terminou.
             */
            sessionStorage.removeItem(
              'caiment_avatar_task_id',
            );

            setTimeout(
              () => {
                navigate(
                  '/avatar',
                );
              },
              1200,
            );

            return;
          } else if (
            task.status ===
              'failed' ||
            task.status ===
              'banned' ||
            task.status ===
              'expired' ||
            task.status ===
              'cancelled' ||
            task.status ===
              'unknown'
          ) {
            throw new Error(
              `A geração do avatar terminou com status: ${task.status}`,
            );
          }

          if (
            task.status !==
              'success' &&
            !cancelled
          ) {
            setTimeout(
              checkTask,
              3000,
            );
          }
        } catch (error) {
          console.error(
            'Erro no processamento:',
            error,
          );

          if (!cancelled) {
            setStatus(
              error instanceof Error
                ? error.message
                : 'Erro ao processar avatar.',
            );

            /*
             * Se houver erro depois
             * que a tarefa foi criada,
             * marcamos o avatar como erro.
             */
            try {
              await updateAvatarRecord(
                user.uid,
                {
                  status: 'error',
                  taskId,
                },
              );
            } catch (
              firebaseError
            ) {
              console.error(
                'Erro ao salvar status do avatar:',
                firebaseError,
              );
            }
          }
        }
      };

    checkTask();

    return () => {
      cancelled = true;
    };
  }, [navigate, user]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-caiment-bg px-6">

      <span className="animate-float">
        <CaimentAvatar
          size={64}
        />
      </span>

      <h1 className="mt-6 font-display text-2xl font-medium text-caiment-ink">
        Caiment está criando seu avatar...
      </h1>

      <p className="mt-2 max-w-sm text-center text-sm text-caiment-ink-soft">
        {status}
      </p>

      <div className="mt-10 w-full max-w-sm">

        <div className="h-1.5 w-full overflow-hidden rounded-full bg-caiment-purple-100">

          <div
            className="h-full rounded-full bg-caiment-purple-500 transition-all duration-700"
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

        <div className="mt-2 text-right text-xs text-caiment-ink-soft">
          {progress}%
        </div>

        <ul className="mt-6 space-y-3">

          {steps.map(
            (
              label,
              index,
            ) => {

              const isDone =
                index <
                currentStep;

              const isActive =
                index ===
                currentStep;

              return (
                <li
                  key={label}
                  className="flex items-center gap-3"
                >

                  <span
                    className={cn(
                      'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs',

                      isDone
                        ? 'border-caiment-lime-deep bg-caiment-lime text-caiment-ink'
                        : isActive
                          ? 'border-caiment-purple-400 text-caiment-purple-500'
                          : 'border-caiment-line text-caiment-ink-soft/40',
                    )}
                  >

                    {isDone ? (

                      <Check
                        size={13}
                      />

                    ) : isActive ? (

                      <span className="h-2 w-2 animate-pulse rounded-full bg-caiment-purple-400" />

                    ) : (

                      <span className="h-1.5 w-1.5 rounded-full bg-current" />

                    )}

                  </span>

                  <span
                    className={cn(
                      'text-sm',

                      isDone ||
                        isActive
                        ? 'text-caiment-ink'
                        : 'text-caiment-ink-soft/50',
                    )}
                  >
                    {label}
                  </span>

                </li>
              );
            },
          )}

        </ul>

      </div>

    </div>
  );
}