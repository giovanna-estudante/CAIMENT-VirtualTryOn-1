import { useState } from 'react'; 
import { DashboardLayout } from '@/components/layout/DashboardLayout'; 
import { Card } from '@/components/ui/Card'; 
import { Button } from '@/components/ui/Button'; 
import { AvatarViewer } from '@/components/avatar/AvatarViewer'; 
import { useToast } from '@/components/ui/Toast'; 
import { mockAvatar } from '@/data/mock/mockAvatar'; 
import type { UnisexMeasurements } from '@/types/measurements'; 
import { useAuth } from '@/context/AuthContext'; 
import { saveMeasurements } from '@/services/firebase/measurements'; 
import { updateUserProfile } from '@/services/firebase/users';

const defaultMeasurements: UnisexMeasurements = { 
  altura: 168, 
  ombros: 39, 
  torax: 92, 
  cintura: 74, 
  quadril: 98, 
};

const measurementLabels: Record<keyof UnisexMeasurements, string> = { 
  altura: 'Altura', 
  ombros: 'Ombros', 
  torax: 'Tórax', 
  cintura: 'Cintura', 
  quadril: 'Quadril', 
};

const measurementRanges: Record< keyof UnisexMeasurements, 
{ min: number; max: number } > = 
  { 
    altura: { 
    min: 140, 
    max: 210 
    }, 
    ombros: { 
      min: 30, 
      max: 60 
    }, 
    torax: { 
      min: 60, 
      max: 140 
    }, 
    cintura: { 
      min: 50, 
      max: 130 
    }, 
    quadril: { 
      min: 60, 
      max: 150 
    }, 
  };

export default function MeasurementsPage() {
  const [values, setValues] =
    useState<UnisexMeasurements>(defaultMeasurements);

  const { show } = useToast();

  const { user } = useAuth();

  // Atualiza uma medida enquanto o usuário movimenta o controle.
  const handleChange = (
    key: keyof UnisexMeasurements,
    value: number
  ) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Salva as medidas e marca a etapa como concluída.
  const handleSave = async () => {
    if (!user) {
      show('É necessário estar logado para salvar suas medidas.');
      return;
    }

    try {
      await saveMeasurements(user.uid, { medidas: values });

      await updateUserProfile(user.uid, {
        measurementsCompleted: true,
      });

      show('Medidas atualizadas com sucesso.');
    } catch (error) {
      console.error('Erro ao salvar medidas:', error);

      show('Não foi possível salvar suas medidas.');
    }
  };

  return (
    <DashboardLayout title="Medidas">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <Card
          padding="none"
          className="overflow-hidden"
        >
          <AvatarViewer
            modelUrl={mockAvatar.modelUrl}
            className="aspect-[3/4] w-full"
            showControls={false}
          />
        </Card>

        <Card>
          <h3 className="font-display text-lg font-medium text-caiment-ink">
            Ajustar minhas medidas
          </h3>

          <p className="mt-1 text-sm text-caiment-ink-soft">
            Esses dados são usados apenas para personalizar seu
            avatar e recomendar tamanhos.
          </p>

          <div className="mt-6 space-y-5">
            {(Object.keys(values) as (keyof UnisexMeasurements)[]).map(
              (key) => {
                const range = measurementRanges[key];

                return (
                  <div key={key}>
                    <div className="flex items-center justify-between text-sm">
                      <label
                        htmlFor={key}
                        className="font-medium text-caiment-ink"
                      >
                        {measurementLabels[key]}
                      </label>

                      <span className="text-caiment-ink-soft">
                        {values[key]} cm
                      </span>
                    </div>

                    <input
                      id={key}
                      type="range"
                      min={range.min}
                      max={range.max}
                      value={values[key]}
                      onChange={(e) =>
                        handleChange(
                          key,
                          Number(e.target.value)
                        )
                      }
                      className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-caiment-purple-100 accent-caiment-purple-500"
                    />
                  </div>
                );
              }
            )}
          </div>

          <Button
            fullWidth
            size="lg"
            className="mt-8"
            onClick={handleSave}
          >
            Confirmar
          </Button>
        </Card>
      </div>
    </DashboardLayout>
  );
}