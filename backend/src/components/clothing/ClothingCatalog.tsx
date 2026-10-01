import { useMemo, useState } from 'react';
import type { Clothing, ClothingCategory } from '@/types';
import { clothingCategories } from '@/data/mock/mockClothing';
import { ClothingCard } from './ClothingCard';
import { cn } from '@/utils/cn';

interface ClothingCatalogProps {
  items: Clothing[];
  favorites?: Set<string>;
  onToggleFavorite?: (id: string) => void;
  onSelect?: (clothing: Clothing) => void;
  onTry?: (clothing: Clothing) => void;
}

export function ClothingCatalog({ items, favorites, onToggleFavorite, onSelect, onTry }: ClothingCatalogProps) {
  const [activeCategory, setActiveCategory] = useState<ClothingCategory | 'todas'>('todas');

  const filtered = useMemo(
    () => (activeCategory === 'todas' ? items : items.filter((i) => i.category === activeCategory)),
    [items, activeCategory],
  );

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-3">
        <button
          onClick={() => setActiveCategory('todas')}
          className={cn(
            'shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors',
            activeCategory === 'todas'
              ? 'bg-caiment-ink text-white'
              : 'bg-caiment-purple-50 text-caiment-ink-soft hover:bg-caiment-purple-100',
          )}
        >
          Todas
        </button>
        {clothingCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              'shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors',
              activeCategory === cat.id
                ? 'bg-caiment-ink text-white'
                : 'bg-caiment-purple-50 text-caiment-ink-soft hover:bg-caiment-purple-100',
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((clothing) => (
          <ClothingCard
            key={clothing.id}
            clothing={clothing}
            isFavorite={favorites?.has(clothing.id)}
            onToggleFavorite={onToggleFavorite}
            onSelect={onSelect}
            onTry={onTry}
          />
        ))}
      </div>
    </div>
  );
}
