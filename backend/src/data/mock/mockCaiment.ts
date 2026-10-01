import type { CaimentMessage } from '@/types';

export const caimentMessages: CaimentMessage[] = [
  { id: 'c1', text: 'Oi! Vamos criar seu avatar?', context: 'avatar-creation' },
  { id: 'c2', text: 'Envie as quatro fotos e eu cuido do resto.', context: 'avatar-creation' },
  { id: 'c3', text: 'Estou preparando seu provador.', context: 'processing' },
  { id: 'c4', text: 'Já estou analisando suas fotos com cuidado.', context: 'processing' },
  { id: 'c5', text: 'Encontrei uma boa correspondência para esta peça.', context: 'recommendation' },
  { id: 'c6', text: 'Esse tamanho tende a ficar confortável no seu caso.', context: 'recommendation' },
  { id: 'c7', text: 'Toque em qualquer peça para experimentar no seu avatar.', context: 'fitting-room' },
  { id: 'c8', text: 'Oi, eu sou a Caiment! Posso te ajudar por aqui.', context: 'general' },
];

export function getCaimentMessage(context: CaimentMessage['context']): string {
  const list = caimentMessages.filter((m) => m.context === context);
  return list[Math.floor(Math.random() * list.length)]?.text ?? caimentMessages[caimentMessages.length - 1].text;
}
