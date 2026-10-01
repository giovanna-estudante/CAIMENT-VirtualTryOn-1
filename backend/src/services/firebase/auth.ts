import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  type User,
} from "firebase/auth";

import { auth } from "./config";

export async function registerUser(
  email: string,
  password: string
) {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  return credential.user;
}

export async function loginUser(
  email: string,
  password: string
) {
  const credential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  return credential.user;
}

export async function logoutUser() {
  await signOut(auth);
}

export async function resetPassword(email: string) {
  await sendPasswordResetEmail(auth, email);
}

export function listenToAuthChanges(
  callback: (user: User | null) => void
) {
  return onAuthStateChanged(auth, callback);
}
