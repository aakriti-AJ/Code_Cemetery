
import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

import {
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { auth, db } from "../lib/firebase";
import type { RegisterData } from "../types/user";

// Register a new user
export async function registerUser(data: RegisterData) {
  const name = data.name.trim();
  const username = data.username.trim().toLowerCase();
  const email = data.email.trim().toLowerCase();

  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    data.password
  );

  try {
    // Set the name in Firebase Authentication
    await updateProfile(credential.user, {
      displayName: name,
    });

    // Create the user's Firestore profile
    await setDoc(doc(db, "users", credential.user.uid), {
      uid: credential.user.uid,
      name,
      username,
      email: credential.user.email ?? email,
      githubUsername: "",
      githubAutoImport: false,
      bio: "",
      skills: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return credential.user;
  } catch (error) {
    // Attempt to remove a partially created account
    // if profile creation fails.
    try {
      await deleteUser(credential.user);
    } catch {
      console.error(
        "Account cleanup failed after profile creation error."
      );
    }

    throw error;
  }
}

// Log in an existing user
export async function loginUser(
  email: string,
  password: string
) {
  const credential = await signInWithEmailAndPassword(
    auth,
    email.trim(),
    password
  );

  return credential.user;
}

// Log out the current user
export async function logoutUser() {
  await signOut(auth);
}
