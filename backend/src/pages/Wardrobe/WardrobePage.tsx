import { useState } from 'react';
import { Layers } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ClothingCatalog } from '@/components/clothing/ClothingCatalog';
import { EmptyState } from '@/components/ui/EmptyState';
import { mockClothing } from '@/data/mock/mockClothing';
import { mockFavorites } from '@/data/mock/mockHistory';

// Nesta etapa, o "guarda-roupa" é representado pelas peças já experimentadas
// (mock). Futuramente virá de dados reais salvos pelo usuário.
const savedClothingIds = new Set(['cl-001', 'cl-003', 'cl-004', 'cl-005', 'cl-007']);

export default function WardrobePage() {
  const [favorites, setFavorites] = useState<Set<string>>(
    new Set(mockFavorites.map((f) => f.clothingId)),
  );
  const savedItems = mockClothing.filter((c) => savedClothingIds.has(c.id));

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <DashboardLayout title="Guarda-roupa">
      <p className="mb-5 text-sm text-caiment-ink-soft">
        Peças que você já experimentou ou salvou no seu provador.
      </p>

      {savedItems.length === 0 ? (
        <EmptyState
          icon={<Layers size={22} />}
          title="Seu guarda-roupa está vazio"
          description="As peças que você experimentar no provador aparecerão aqui."
        />
      ) : (
        <ClothingCatalog items={savedItems} favorites={favorites} onToggleFavorite={toggleFavorite} />
      )}
    </DashboardLayout>
  );
}
