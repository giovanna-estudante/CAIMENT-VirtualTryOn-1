import { Heart } from 'lucide-react';
import type { Clothing } from '@/types';
import { formatCurrency } from '@/utils/format';
import { cn } from '@/utils/cn';

interface ClothingCardProps {
  clothing: Clothing;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  onSelect?: (clothing: Clothing) => void;
  onTry?: (clothing: Clothing) => void;
}

export function ClothingCard({ clothing, isFavorite, onToggleFavorite, onSelect, onTry }: ClothingCardProps) {
  return (
    <div className="group overflow-hidden rounded-3xl border border-caiment-line bg-white transition-shadow hover:shadow-lg hover:shadow-caiment-purple-900/8">
      <div
        className="relative aspect-[3/4] cursor-pointer overflow-hidden bg-caiment-purple-50"
        onClick={() => onSelect?.(clothing)}
      >
        <img
          src={clothing.imageUrl}
          alt={clothing.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(clothing.id);
            }}
            aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full glass"
          >
            <Heart
              size={15}
              className={cn(isFavorite ? 'fill-caiment-purple-500 text-caiment-purple-500' : 'text-caiment-ink')}
            />
          </button>
        )}
      </div>
      <div className="p-4">
        <p className="font-display text-[15px] font-medium leading-snug text-caiment-ink">{clothing.name}</p>
        <p className="mt-0.5 text-xs text-caiment-ink-soft">{clothing.brand}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-caiment-ink">{formatCurrency(clothing.price)}</span>
          <div className="flex -space-x-1">
            {clothing.colors.slice(0, 4).map((color) => (
              <span
                key={color}
                style={{ backgroundColor: color }}
                className="h-4 w-4 rounded-full border-2 border-white"
              />
            ))}
          </div>
        </div>
        {onTry && (
          <button
            onClick={() => onTry(clothing)}
            className="mt-3 w-full rounded-full bg-caiment-ink py-2 text-xs font-medium text-white transition-colors hover:bg-caiment-purple-700"
          >
            Experimentar
          </button>
        )}
      </div>
    </div>
  );
}
