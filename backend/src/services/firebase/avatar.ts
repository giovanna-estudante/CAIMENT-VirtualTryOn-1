import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';

import { db } from './config';

export type AvatarStatus =
  | 'none'
  | 'processing'
  | 'ready'
  | 'error';

export interface UserAvatar {
  status: AvatarStatus;
  taskId?: string | null;
  modelUrl?: string | null;
  previewUrl?: string | null;
  source?: 'tripo' | 'manual';
  createdAt?: unknown;
  updatedAt?: unknown;
}

function avatarRef(uid: string) {
  return doc(
    db,
    'users',
    uid,
    'avatar',
    'current'
  );
}

export async function createAvatarRecord(
  uid: string,
  taskId?: string
) {
  await setDoc(avatarRef(uid), {
    status: 'processing',
    taskId: taskId ?? null,
    modelUrl: null,
    previewUrl: null,
    source: 'tripo',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateAvatarRecord(
  uid: string,
  data: Partial<UserAvatar>
) {
  await updateDoc(avatarRef(uid), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function getAvatar(uid: string) {
  const snapshot = await getDoc(
    avatarRef(uid)
  );

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as UserAvatar;
}
