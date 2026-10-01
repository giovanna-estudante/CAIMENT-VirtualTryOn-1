import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';

import { db } from './config';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  gender?: string;
  birthDate?: string;
  profileCompleted?: boolean;
  measurementsCompleted?: boolean;
  avatarStatus?: 'none' | 'processing' | 'ready' | 'error';
  createdAt?: unknown;
  updatedAt?: unknown;
}

export async function createUserProfile(
  uid: string,
  name: string,
  email: string
) {
  const userRef = doc(db, 'users', uid);

  await setDoc(userRef, {
    uid,
    name,
    email,
    profileCompleted: false,
    measurementsCompleted: false,
    avatarStatus: 'none',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return userRef;
}

export async function getUserProfile(uid: string) {
  const userRef = doc(db, 'users', uid);

  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as UserProfile;
}

export async function updateUserProfile(
  uid: string,
  data: Partial<UserProfile>
) {
  const userRef = doc(db, 'users', uid);

  await updateDoc(userRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}
