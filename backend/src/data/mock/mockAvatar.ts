import type { Avatar, AvatarGenerationTask } from '@/types';

export const mockAvatar: Avatar = {
  id: 'avatar-001',
  userId: 'user-001',
  modelUrl: null, // sem GLB real ainda — o AvatarViewer usa um placeholder
  previewUrl: null,
  createdAt: '2026-03-12T10:20:00.000Z',
  updatedAt: '2026-08-20T14:05:00.000Z',
};

export const idleGenerationTask: AvatarGenerationTask = {
  taskId: null,
  status: 'idle',
  progress: 0,
  modelUrl: null,
  previewUrl: null,
  error: null,
};
