import { History as HistoryIcon } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { mockHistory } from '@/data/mock/mockHistory';
import { getClothingById } from '@/data/mock/mockClothing';
import { formatDate, formatCurrency } from '@/utils/format';
import { cn } from '@/utils/cn';
import type { FittingSession } from '@/types';

const resultLabel: Record<FittingSession['result'], string> = {
  aprovado: 'Aprovado',
  ajustar: 'Ajustar tamanho',
  nao_recomendado: 'Não recomendado',
};

const resultColor: Record<FittingSession['result'], string> = {
  aprovado: 'bg-caiment-lime-soft text-caiment-lime-deep',
  ajustar: 'bg-amber-100 text-amber-600',
  nao_recomendado: 'bg-orange-100 text-orange-600',
};

export default function HistoryPage() {
  return (
    <DashboardLayout title="Histórico">
      <p className="mb-5 text-sm text-caiment-ink-soft">
        Suas últimas experimentações no provador virtual.
      </p>

      {mockHistory.length === 0 ? (
        <EmptyState
          icon={<HistoryIcon size={22} />}
          title="Nenhuma experimentação ainda"
          description="Experimente uma peça no provador para começar seu histórico."
        />
      ) : (
        <Card padding="none" className="divide-y divide-caiment-line">
          {mockHistory.map((session) => {
            const clothing = getClothingById(session.clothingId);
            if (!clothing) return null;
            return (
              <div key={session.id} className="flex items-center gap-4 px-5 py-4">
                <img
                  src={clothing.imageUrl}
                  alt={clothing.name}
                  className="h-14 w-11 shrink-0 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-caiment-ink">{clothing.name}</p>
                  <p className="text-xs text-caiment-ink-soft">
                    Tamanho {session.recommendedSize} · {formatCurrency(clothing.price)}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <span
                    className={cn(
                      'rounded-full px-2.5 py-1 text-[11px] font-medium',
                      resultColor[session.result],
                    )}
                  >
                    {resultLabel[session.result]}
                  </span>
                  <span className="text-xs text-caiment-ink-soft">{formatDate(session.date)}</span>
                </div>
              </div>
            );
          })}
        </Card>
      )}
    </DashboardLayout>
  );
}
