// ============================================================================
// CAIMENT — Tipos de domínio
// Nenhum destes tipos assume integração real com Tripo AI, Supabase ou
// autenticação. Servem para deixar o frontend pronto para a etapa seguinte.
// ============================================================================

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
}

// ---- Avatar / Tripo AI -----------------------------------------------------

export type AvatarGenerationStatus =
  | 'idle'
  | 'uploading'
  | 'processing'
  | 'completed'
  | 'error';

export type PhotoAngle = 'front' | 'back' | 'left' | 'right';

export interface AvatarPhoto {
  id: string;
  angle: PhotoAngle;
  previewUrl: string | null;
  file?: File | null;
}

export interface AvatarGenerationTask {
  taskId: string | null;
  status: AvatarGenerationStatus;
  progress: number; // 0-100, simulado nesta etapa
  modelUrl: string | null; // será preenchido pelo Tripo AI futuramente
  previewUrl: string | null;
  error?: string | null;
}

export interface Avatar {
  id: string;
  userId: string;
  modelUrl: string | null; // .glb — placeholder nesta etapa
  previewUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

// ---- Medidas ----------------------------------------------------------------

export interface Measurements {
  height: number; // cm
  bust: number; // cm
  waist: number; // cm
  hip: number; // cm
  shoulders: number; // cm
  arm: number; // cm
  leg: number; // cm
}

// ---- Roupas / Provador -------------------------------------------------------

export type ClothingCategory =
  | 'camisetas'
  | 'blusas'
  | 'calcas'
  | 'vestidos'
  | 'jaquetas'
  | 'acessorios';

export interface Clothing {
  id: string;
  name: string;
  brand: string;
  category: ClothingCategory;
  price: number;
  imageUrl: string;
  colors: string[];
  sizes: string[];
  clothingModelUrl?: string | null; // preparado para modelo 3D futuro
  description?: string;
}

export type SizeCompatibility = 'alta' | 'media' | 'baixa';

export interface SizeRecommendation {
  clothingId: string;
  recommendedSize: string;
  compatibility: SizeCompatibility;
  note?: string;
}

export interface FittingSession {
  id: string;
  clothingId: string;
  date: string;
  recommendedSize: string;
  result: 'aprovado' | 'ajustar' | 'nao_recomendado';
}

export interface Favorite {
  id: string;
  clothingId: string;
  savedAt: string;
}

// ---- Caiment (assistente virtual) -----------------------------------------------

export interface CaimentMessage {
  id: string;
  text: string;
  context: 'avatar-creation' | 'processing' | 'recommendation' | 'fitting-room' | 'general';
}
