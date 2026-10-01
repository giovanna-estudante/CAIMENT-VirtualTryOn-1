import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/Button';

export default function VerificationPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...code];
    next[index] = value;
    setCode(next);
    if (value && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleSubmit = () => {
    navigate('/onboarding');
  };

  return (
    <AuthLayout>
      <div className="text-center">
        <h1 className="font-display text-2xl font-medium text-caiment-ink">
          Insira o código
          <br />
          enviado por e-mail
        </h1>

        <div className="mt-8 flex justify-center gap-2">
          {code.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputsRef.current[i] = el;
              }}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              inputMode="numeric"
              maxLength={1}
              className="h-13 w-11 rounded-2xl border border-caiment-line bg-white text-center font-display text-lg text-caiment-ink focus:border-caiment-purple-400 focus:outline-none"
            />
          ))}
        </div>

        <Button size="lg" className="mt-8" onClick={handleSubmit}>
          Confirmar
        </Button>

        <p className="mt-4 text-sm text-caiment-ink-soft">
          Não recebeu o código?{' '}
          <button className="font-medium text-caiment-purple-600">Reenviar</button>
        </p>
      </div>
    </AuthLayout>
  );
}
