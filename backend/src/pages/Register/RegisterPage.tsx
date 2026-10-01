import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';

import { AuthLayout } from '@/components/layout/AuthLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

import { registerUser } from '@/services/firebase/auth';
import { createUserProfile } from '@/services/firebase/users';

export default function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accepted, setAccepted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setError('');

    // Verifica se as senhas são iguais
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    // Verifica tamanho da senha
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    // Verifica aceite da política
    if (!accepted) {
      setError('Você precisa aceitar a política de privacidade.');
      return;
    }

    setLoading(true);

    try {
      console.log('1. Iniciando cadastro no Firebase Auth...');

      // Cria o usuário no Firebase Authentication
      const user = await registerUser(email, password);

      console.log('2. Usuário criado no Firebase Auth:', user.uid);

      console.log('3. Salvando perfil no Firestore...');

      // Cria o perfil do usuário no Firestore
      await createUserProfile(
        user.uid,
        name,
        user.email ?? email
      );

      console.log('4. Perfil salvo no Firestore!');

console.log('5. Usuário autenticado:', user.uid);
console.log('6. Redirecionando para o Dashboard...');

// Pequeno atraso para garantir que o estado de autenticação
// seja atualizado antes da troca de página.
setTimeout(() => {
  navigate('/dashboard', { replace: true });
}, 100);
    } catch (error: any) {
      console.error('ERRO NO CADASTRO:', error);

      switch (error?.code) {
        case 'auth/email-already-in-use':
          setError('Este e-mail já possui uma conta.');
          break;

        case 'auth/invalid-email':
          setError('Digite um e-mail válido.');
          break;

        case 'auth/weak-password':
          setError(
            'A senha é muito fraca. Use pelo menos 6 caracteres.'
          );
          break;

        case 'auth/operation-not-allowed':
          setError(
            'O cadastro por e-mail e senha não está ativado no Firebase.'
          );
          break;

        case 'permission-denied':
        case 'firestore/permission-denied':
          setError(
            'O Firebase não permitiu salvar seu perfil.'
          );
          break;

        default:
          setError(
            error?.message ||
              'Não foi possível criar sua conta. Tente novamente.'
          );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout wide>
      <div className="grid gap-8 sm:grid-cols-2">

        {/* ========================================= */}
        {/* LADO ESQUERDO */}
        {/* ========================================= */}

        <div className="flex flex-col justify-center">

          <h1 className="font-display text-3xl font-medium leading-tight text-caiment-ink">
            Cadastre-se
            <br />

            <span className="text-caiment-purple-600">
              CAIMENT
            </span>
          </h1>

          <p className="mt-3 max-w-xs text-sm text-caiment-ink-soft">
            O seu provador virtual está a poucos passos.
            Crie sua conta para começar.
          </p>

          <p className="mt-8 text-sm text-caiment-ink-soft">
            Já tem uma conta?{' '}

            <Link to="/login">
              <Button
                variant="secondary"
                size="sm"
                className="ml-1"
              >
                Entrar
              </Button>
            </Link>
          </p>

        </div>

        {/* ========================================= */}
        {/* LADO DIREITO */}
        {/* ========================================= */}

        <div>

          <h2 className="font-display text-lg font-medium text-caiment-ink">
            Crie sua conta
          </h2>

          <form
            onSubmit={handleSubmit}
            className="mt-5 space-y-3.5"
          >

            {/* NOME */}

            <Input
              placeholder="Nome"
              icon={<User size={16} />}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            {/* E-MAIL */}

            <Input
              placeholder="E-mail"
              type="email"
              icon={<Mail size={16} />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* SENHA */}

            <Input
              placeholder="Senha"
              type="password"
              icon={<Lock size={16} />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* CONFIRMAR SENHA */}

            <Input
              placeholder="Confirmar senha"
              type="password"
              icon={<Lock size={16} />}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            {/* POLÍTICA DE PRIVACIDADE */}

            <label className="flex items-start gap-2.5 pt-1 text-xs text-caiment-ink-soft">

              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) =>
                  setAccepted(e.target.checked)
                }
                className="mt-0.5 h-4 w-4 rounded border-caiment-line text-caiment-purple-600 focus:ring-caiment-purple-400"
                required
              />

              <span>
                Li e aceito a{' '}

                <span className="font-medium text-caiment-purple-600 underline underline-offset-2">
                  política de privacidade
                </span>{' '}

                do CAIMENT.
              </span>

            </label>

            {/* ERRO */}

            {error && (
              <p className="text-sm text-red-600">
                {error}
              </p>
            )}

            {/* BOTÃO */}

            <div className="flex justify-end pt-2">

              <Button
                type="submit"
                size="lg"
                disabled={loading}
              >
                {loading
                  ? 'Criando conta...'
                  : 'Avançar'}
              </Button>

            </div>

          </form>

        </div>

      </div>
    </AuthLayout>
  );
}