import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AvatarViewer } from '@/components/avatar/AvatarViewer';
import { useToast } from '@/components/ui/Toast';
import { mockMeasurements, measurementLabels, measurementRanges } from '@/data/mock/mockMeasurements';
import { mockAvatar } from '@/data/mock/mockAvatar';
import type { Measurements } from '@/types';

export default function MeasurementsPage() {
  const [values, setValues] = useState<Measurements>(mockMeasurements);
  const { show } = useToast();

  const handleChange = (key: keyof Measurements, value: number) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    show('Medidas atualizadas com sucesso.');
  };

  return (
    <DashboardLayout title="Medidas">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <Card padding="none" className="overflow-hidden">
          <AvatarViewer modelUrl={mockAvatar.modelUrl} className="aspect-[3/4] w-full" showControls={false} />
        </Card>

        <Card>
          <h3 className="font-display text-lg font-medium text-caiment-ink">Ajustar minhas medidas</h3>
          <p className="mt-1 text-sm text-caiment-ink-soft">
            Esses dados são usados apenas para personalizar seu avatar e recomendar tamanhos.
          </p>

          <div className="mt-6 space-y-5">
            {(Object.keys(values) as (keyof Measurements)[]).map((key) => {
              const range = measurementRanges[key];
              return (
                <div key={key}>
                  <div className="flex items-center justify-between text-sm">
                    <label htmlFor={key} className="font-medium text-caiment-ink">
                      {measurementLabels[key]}
                    </label>
                    <span className="text-caiment-ink-soft">{values[key]} cm</span>
                  </div>
                  <input
                    id={key}
                    type="range"
                    min={range.min}
                    max={range.max}
                    value={values[key]}
                    onChange={(e) => handleChange(key, Number(e.target.value))}
                    className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-caiment-purple-100 accent-caiment-purple-500"
                  />
                </div>
              );
            })}
          </div>

          <Button fullWidth size="lg" className="mt-8" onClick={handleSave}>
            Confirmar
          </Button>
        </Card>
      </div>
    </DashboardLayout>
  );
}
