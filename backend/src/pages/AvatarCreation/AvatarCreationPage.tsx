import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Info } from 'lucide-react';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PhotoUpload } from '@/components/upload/PhotoUpload';
import { Button } from '@/components/ui/Button';
import { CaimentBubble } from '@/components/caiment/CaimentBubble';
import { useToast } from '@/components/ui/Toast';

import type {
  AvatarPhoto,
  PhotoAngle,
} from '@/types';

import { getCaimentMessage } from '@/data/mock/mockCaiment';
import {
  generateAvatar,
  isLovableCloudConfigured,
} from '@/services/api';

import { useAuth } from '@/context/AuthContext';
import { createAvatarRecord } from '@/services/firebase/avatar';

const angles: {
  angle: PhotoAngle;
  label: string;
}[] = [
  {
    angle: 'front',
    label: 'Frontal',
  },
  {
    angle: 'back',
    label: 'Traseira',
  },
  {
    angle: 'left',
    label: 'Lateral esquerda',
  },
  {
    angle: 'right',
    label: 'Lateral direita',
  },
];

export default function AvatarCreationPage() {
  const navigate = useNavigate();

  const { show } = useToast();

  const { user } = useAuth();

  const [photos, setPhotos] =
    useState<
      Record<
        PhotoAngle,
        AvatarPhoto
      >
    >(() =>
      Object.fromEntries(
        angles.map(
          ({ angle }) => [
            angle,
            {
              id: angle,
              angle,
              previewUrl: null,
              file: null,
            },
          ],
        ),
      ) as Record<
        PhotoAngle,
        AvatarPhoto
      >,
    );

  const [isSending, setIsSending] =
    useState(false);

  const allFilled =
    angles.every(
      ({ angle }) =>
        Boolean(
          photos[angle]
            .previewUrl,
        ),
    );

  const handleChange = (
    angle: PhotoAngle,
    file: File,
  ) => {
    const url =
      URL.createObjectURL(file);

    setPhotos((prev) => ({
      ...prev,

      [angle]: {
        ...prev[angle],
        previewUrl: url,
        file,
      },
    }));
  };

  const handleRemove = (
    angle: PhotoAngle,
  ) => {
    setPhotos((prev) => ({
      ...prev,

      [angle]: {
        ...prev[angle],
        previewUrl: null,
        file: null,
      },
    }));
  };

  const handleGenerate =
    async () => {
      if (!user) {
        show(
          'Você precisa estar conectado para criar seu avatar.',
          'warning',
        );

        navigate('/login');

        return;
      }

      if (!allFilled) {
        show(
          'Envie as quatro fotos para continuar.',
          'warning',
        );

        return;
      }

      if (isSending) {
        return;
      }

      try {
        setIsSending(true);

        const formData =
          new FormData();

        const front =
          photos.front.file;

        const left =
          photos.left.file;

        const back =
          photos.back.file;

        const right =
          photos.right.file;

        if (
          !front ||
          !left ||
          !back ||
          !right
        ) {
          show(
            'As quatro fotos são obrigatórias.',
            'warning',
          );

          return;
        }

        formData.append(
          'front',
          front,
        );

        formData.append(
          'left',
          left,
        );

        formData.append(
          'back',
          back,
        );

        formData.append(
          'right',
          right,
        );

        show(
          isLovableCloudConfigured
            ? 'Enviando fotos para o backend seguro do CAIMENT...'
            : 'Enviando fotos para o CAIMENT...',
          'success',
        );

        const data =
          await generateAvatar(
            formData,
          );

        console.log(
          '🎯 Task ID:',
          data.taskId,
        );

        /*
         * SALVA A TAREFA NO PERFIL
         * DO USUÁRIO
         */
        await createAvatarRecord(
          user.uid,
          data.taskId,
        );

        /*
         * Mantemos temporariamente
         * apenas o taskId para a tela
         * de processamento.
         */
        sessionStorage.setItem(
          'caiment_avatar_task_id',
          data.taskId,
        );

        navigate(
          '/avatar-criacao/processando',
        );
      } catch (error) {
        console.error(
          '❌ Erro:',
          error,
        );

        show(
          error instanceof Error
            ? error.message
            : 'Erro ao criar o avatar.',
          'warning',
        );
      } finally {
        setIsSending(false);
      }
    };

  return (
    <DashboardLayout title="Criar meu avatar">

      <div className="mx-auto max-w-3xl space-y-6">

        <CaimentBubble
          message={getCaimentMessage(
            'avatar-creation',
          )}
        />

        <div className="flex items-start gap-2.5 rounded-2xl border border-caiment-purple-100 bg-caiment-purple-50/60 p-4 text-sm text-caiment-ink-soft">

          <Info
            size={16}
            className="mt-0.5 shrink-0 text-caiment-purple-400"
          />

          <span>
            Utilize fotos de corpo inteiro,
            com boa iluminação e sem cortes.
          </span>

        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">

          {angles.map(
            ({
              angle,
              label,
            }) => (
              <PhotoUpload
                key={angle}
                photo={
                  photos[angle]
                }
                label={label}
                onChange={
                  handleChange
                }
                onRemove={
                  handleRemove
                }
              />
            ),
          )}

        </div>

        <Button
          fullWidth
          size="lg"
          icon={
            <Sparkles
              size={17}
            />
          }
          onClick={
            handleGenerate
          }
          disabled={
            !allFilled ||
            isSending
          }
        >
          {isSending
            ? 'Enviando fotos...'
            : 'Gerar meu avatar'}
        </Button>

      </div>

    </DashboardLayout>
  );
}