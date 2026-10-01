import { Sparkles } from 'lucide-react';

interface SizeRecommendationProps {
  recommendation: {
    recommendedSize: string;
    confidence: number;
    reason: string;
  };
}

export default function SizeRecommendation({
  recommendation,
}: SizeRecommendationProps) {
  return (
    <div className="rounded-3xl border border-caiment-line bg-white p-5 shadow-sm">
      {/* CABEÇALHO */}
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-caiment-purple-50 text-caiment-purple-600">
          <Sparkles size={17} />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-caiment-ink-soft">
            Inteligência Caiment
          </p>

          <p className="text-sm font-semibold text-caiment-ink">
            Tamanho recomendado
          </p>
        </div>
      </div>

      {/* TAMANHO */}
      <div className="mt-5 flex items-center justify-between rounded-2xl bg-caiment-purple-50 p-4">
        <div>
          <p className="text-xs text-caiment-ink-soft">
            Melhor opção
          </p>

          <p className="mt-1 font-display text-4xl font-medium text-caiment-ink">
            {recommendation.recommendedSize}
          </p>
        </div>

        <div className="rounded-full bg-caiment-lime-soft px-3 py-1.5">
          <span className="text-xs font-semibold text-caiment-lime-deep">
            {recommendation.confidence}% de compatibilidade
          </span>
        </div>
      </div>

      {/* EXPLICAÇÃO */}
      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-caiment-ink-soft">
          Por que esse tamanho?
        </p>

        <p className="mt-2 text-sm leading-relaxed text-caiment-ink-soft">
          {recommendation.reason}
        </p>
      </div>

      {/* AVISO */}
      <p className="mt-4 border-t border-caiment-line pt-4 text-[11px] leading-relaxed text-caiment-ink-soft/70">
        Esta é uma estimativa simulada para demonstração do protótipo.
        A recomendação real será calculada pelo sistema com base nas
        medidas do usuário e nas características de cada peça.
      </p>
    </div>
  );
}