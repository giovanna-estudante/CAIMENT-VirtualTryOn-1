import { useState } from 'react';
import { Heart } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ClothingCatalog } from '@/components/clothing/ClothingCatalog';
import { EmptyState } from '@/components/ui/EmptyState';
import { getClothingById } from '@/data/mock/mockClothing';
import { mockFavorites } from '@/data/mock/mockHistory';

export default function FavoritesPage() {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(
    new Set(mockFavorites.map((f) => f.clothingId)),
  );

  const items = Array.from(favoriteIds)
    .map((id) => getClothingById(id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const toggleFavorite = (id: string) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <DashboardLayout title="Favoritos">
      <p className="mb-5 text-sm text-caiment-ink-soft">Peças que você marcou como favoritas.</p>

      {items.length === 0 ? (
        <EmptyState
          icon={<Heart size={22} />}
          title="Nenhum favorito ainda"
          description="Toque no coração de uma peça no provador para salvá-la aqui."
        />
      ) : (
        <ClothingCatalog items={items} favorites={favoriteIds} onToggleFavorite={toggleFavorite} />
      )}
    </DashboardLayout>
  );
}
