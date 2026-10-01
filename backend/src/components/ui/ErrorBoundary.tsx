import { Component, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary capturou um erro:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex h-full min-h-[240px] flex-col items-center justify-center gap-2 rounded-3xl bg-caiment-purple-50/60 p-6 text-center">
            <AlertTriangle size={20} className="text-caiment-purple-400" />
            <p className="text-sm text-caiment-ink-soft">Não foi possível carregar este conteúdo.</p>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
