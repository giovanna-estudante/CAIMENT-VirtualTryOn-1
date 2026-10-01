import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';

import { db } from './config';

export interface UserMeasurements {
  height: number;
  weight?: number;
  bust: number;
  waist: number;
  hip: number;
  shoulders: number;
  arm: number;
  leg: number;
  gender?: string;
  updatedAt?: unknown;
}

export async function saveMeasurements(
  uid: string,
  measurements: UserMeasurements
) {
  const measurementsRef = doc(
    db,
    'users',
    uid,
    'measurements',
    'current'
  );

  await setDoc(measurementsRef, {
    ...measurements,
    updatedAt: serverTimestamp(),
  });

  return measurementsRef;
}

export async function getMeasurements(uid: string) {
  const measurementsRef = doc(
    db,
    'users',
    uid,
    'measurements',
    'current'
  );

  const snapshot = await getDoc(measurementsRef);

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as UserMeasurements;
}
