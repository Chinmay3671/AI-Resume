import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { UserProfile } from './types';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "AI-Resume.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "AI-Resume",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "AI-Resume.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789012:web:abcdef1234567890"
};

// Initialize Firebase App singleton
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Export Auth, GoogleAuthProvider, and Firestore DB
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export async function signInWithGoogle(): Promise<UserProfile> {
  try {
    // Real Firebase Google OAuth Popup Sign In
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const idToken = await user.getIdToken();

    return {
      id: user.uid,
      name: user.displayName || user.email?.split('@')[0] || 'Google User',
      email: user.email || '',
      avatarUrl: user.photoURL || `https://lh3.googleusercontent.com/a/default-user=s96-c`,
      role: 'Google Authenticated Job Hunter',
      tier: 'Pro Job Hunter',
      provider: 'google.com',
      token: idToken,
      isLoggedIn: true
    };
  } catch (err: any) {
    console.error('Firebase Google Auth error:', err);
    if (err.code === 'auth/popup-closed-by-user') {
      throw new Error('Google Sign-In popup was closed before completing authentication.');
    } else if (err.code === 'auth/invalid-api-key' || err.code === 'auth/api-key-not-valid' || err.message?.includes('API key')) {
      throw new Error('Firebase API key in .env is invalid. Please update VITE_FIREBASE_API_KEY in .env with your real API key from Firebase Console (https://console.firebase.google.com).');
    }
    throw new Error(err.message || 'Failed to authenticate with Google.');
  }
}

export async function signOutFromFirebase(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (e) {
    console.warn('Firebase signOut notice:', e);
  }
}
