import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// A strictly read-only, local design showcase runs when client credentials are absent.
// Never persist demo documents to a production Firestore instance.
const supplied = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
export const isPreviewMode = Object.values(supplied).some(value => !value);
const firebaseConfig = isPreviewMode ? {
  apiKey: 'preview-mode-no-network',
  authDomain: 'codecemetery-preview.invalid',
  projectId: 'codecemetery-preview',
  storageBucket: 'codecemetery-preview.invalid',
  messagingSenderId: '000000000',
  appId: '1:000000000:web:preview',
} : supplied;

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
