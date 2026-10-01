import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';

import { AuthLayout } from '@/components/layout/AuthLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

import { loginUser } from '@/services/firebase/auth';

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      console.log('1. Iniciando login no Firebase...');

      const user = await loginUser(email, password);

      console.log('2. Login realizado:', user.uid);

      console.log('3. Indo para /dashboard...');

      navigate('/dashboard', { replace: true });

      console.log('4. Navegação executada!');
    } catch (error: any) {
      console.error('ERRO NO LOGIN:', error);

      switch (error?.code) {
        case 'auth/invalid-credential':
          setError('E-mail ou senha incorretos.');
          break;

        case 'auth/user-not-found':
          setError('Não encontramos uma conta com este e-mail.');
          break;

        case 'auth/wrong-password':
          setError('Senha incorreta.');
          break;

        case 'auth/invalid-email':
          setError('Digite um e-mail válido.');
          break;

        case 'auth/user-disabled':
          setError('Esta conta foi desativada.');
          break;

        case 'auth/too-many-requests':
          setError(
            'Muitas tentativas. Aguarde alguns minutos e tente novamente.'
          );
          break;

        default:
          setError(
            error?.message ||
              'Não foi possível entrar. Tente novamente.'
          );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout wide>
      <div className="grid gap-8 sm:grid-cols-2">
        <div className="flex flex-col justify-center">
          <h1 className="font-display text-3xl font-medium leading-tight text-caiment-ink">
            Bem-vindo
            <br />
            <span className="text-caiment-purple-600">de volta</span>
          </h1>

          <p className="mt-3 max-w-xs text-sm text-caiment-ink-soft">
            Entre na sua conta para continuar sua experiência
            no CAIMENT.
          </p>

          <p className="mt-8 text-sm text-caiment-ink-soft">
            Ainda não tem uma conta?{' '}
            <Link to="/cadastro">
              <Button
                variant="secondary"
                size="sm"
                className="ml-1"
              >
                Criar conta
              </Button>
            </Link>
          </p>
        </div>

        <div>
          <h2 className="font-display text-lg font-medium text-caiment-ink">
            Entre na sua conta
          </h2>

          <form
            onSubmit={handleSubmit}
            className="mt-5 space-y-3.5"
          >
            <Input
              placeholder="E-mail"
              type="email"
              icon={<Mail size={16} />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              placeholder="Senha"
              type="password"
              icon={<Lock size={16} />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex justify-end">
              <Link
                to="/recuperar-senha"
                className="text-xs text-caiment-purple-600 hover:underline"
              >
                Esqueci minha senha
              </Link>
            </div>

            {error && (
              <p className="text-sm text-red-600">
                {error}
              </p>
            )}

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                size="lg"
                disabled={loading}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
}