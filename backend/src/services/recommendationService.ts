import type { Clothing, SizeRecommendation } from '@/types';

// ============================================================================
// MOCK — não existe IA de recomendação real nesta etapa. A função abaixo
// apenas escolhe um tamanho e uma compatibilidade de forma determinística
// (baseada no id da peça) para que a UI tenha dados consistentes.
// ============================================================================

export function getMockSizeRecommendation(clothing: Clothing): SizeRecommendation {
  const seed = clothing.id.charCodeAt(clothing.id.length - 1);
  const size = clothing.sizes[seed % clothing.sizes.length];
  const compatibilityOptions: SizeRecommendation['compatibility'][] = ['alta', 'media', 'baixa'];
  const compatibility = compatibilityOptions[seed % compatibilityOptions.length];

  const notes: Record<SizeRecommendation['compatibility'], string> = {
    alta: 'Esse tamanho tende a acompanhar bem o caimento da peça.',
    media: 'Pode ficar bom, mas vale conferir a modelagem antes de decidir.',
    baixa: 'Talvez valha a pena considerar outro tamanho para mais conforto.',
  };

  return {
    clothingId: clothing.id,
    recommendedSize: size,
    compatibility,
    note: notes[compatibility],
  };
}
