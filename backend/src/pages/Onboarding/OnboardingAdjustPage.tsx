import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/Button';
import { TickSlider } from '@/components/ui/TickSlider';
import { PillInput, PillSelect } from '@/components/ui/PillField';

const skinTones = ['#F6D9BB', '#EEC29A', '#D9A066', '#A9713F', '#5C3A21'];

export default function OnboardingAdjustPage() {
  const navigate = useNavigate();
  const [skinTone, setSkinTone] = useState(skinTones[1]);
  const [bust, setBust] = useState(50);
  const [waist, setWaist] = useState(50);
  const [hip, setHip] = useState(50);

  const handleSubmit = () => {
    navigate('/avatar-criacao');
  };

  return (
    <AuthLayout wide>
      <div className="space-y-8">
        <div className="grid gap-6 sm:grid-cols-[1fr_1.2fr]">
          <div className="flex items-center justify-center gap-4 rounded-3xl bg-caiment-purple-50/60 p-5">
            <div className="flex flex-col gap-2.5">
              {skinTones.map((tone) => (
                <button
                  key={tone}
                  onClick={() => setSkinTone(tone)}
                  style={{ backgroundColor: tone }}
                  aria-label={`Tom de pele ${tone}`}
                  className={`h-5 w-5 rounded-full transition-transform ${
                    skinTone === tone ? 'scale-125 ring-2 ring-caiment-purple-500 ring-offset-2' : ''
                  }`}
                />
              ))}
            </div>
            <div
              className="h-52 w-28 rounded-2xl"
              style={{
                background: `linear-gradient(180deg, ${skinTone}dd, ${skinTone})`,
              }}
            />
          </div>

          <div>
            <h1 className="font-display text-2xl font-medium text-caiment-ink">Ajuste</h1>
            <p className="mt-1 text-sm text-caiment-ink-soft">Alterar tom de pele e proporções</p>

            <div className="mt-6 space-y-6">
              <TickSlider label="Busto" value={bust} min={0} max={100} onChange={setBust} />
              <TickSlider label="Cintura" value={waist} min={0} max={100} onChange={setWaist} />
              <TickSlider label="Quadril" value={hip} min={0} max={100} onChange={setHip} />
            </div>
          </div>
        </div>

        <div className="border-t border-caiment-line pt-6">
          <h2 className="font-display text-lg font-medium text-caiment-ink">Preencha seus dados</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <PillSelect label="Gênero" options={['Feminino', 'Masculino', 'Prefiro não dizer']} />
            <PillInput label="Qual sua idade?" placeholder="Ex: 28" inputMode="numeric" />
            <PillInput label="Qual sua altura?" placeholder="Ex: 168 cm" />
            <PillInput label="Qual seu peso?" placeholder="Ex: 62 kg" />
          </div>

          <div className="mt-6 flex justify-center sm:justify-start">
            <Button size="lg" onClick={handleSubmit}>
              Confirmar
            </Button>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
