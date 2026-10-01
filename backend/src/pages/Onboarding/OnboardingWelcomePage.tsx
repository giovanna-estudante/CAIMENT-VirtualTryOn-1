import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { CaimentRobot } from '@/components/caiment/CaimentRobot';
import { Button } from '@/components/ui/Button';

export default function OnboardingWelcomePage() {
  const navigate = useNavigate();

  return (
    <AuthLayout>
      <div className="flex flex-col items-center text-center">
        <span className="animate-float">
          <CaimentRobot pose="wave" size={140} />
        </span>

        <h1 className="mt-2 font-display text-2xl font-medium text-caiment-purple-600">CAIMENT</h1>
        <p className="mt-3 max-w-xs text-sm text-caiment-ink-soft">
          Oi! Eu sou a Caiment, sua assistente inteligente para encontrar o tamanho perfeito.
        </p>

        <Button
          variant="secondary"
          size="lg"
          className="mt-7"
          onClick={() => navigate('/onboarding/ajuste')}
        >
          Vamos começar
        </Button>
      </div>
    </AuthLayout>
  );
}
