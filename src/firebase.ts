import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, User } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { UserProfile } from './types';

const rawApiKey = import.meta.env.VITE_FIREBASE_API_KEY || "";
const isPlaceholderKey = !rawApiKey || rawApiKey.includes('YOUR_FIREBASE') || rawApiKey === "your_firebase_api_key_here";

const firebaseConfig = {
  apiKey: rawApiKey,
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

/**
 * Clean Google Login handler matching exact user specification
 * Ensures NO custom parameters like custom continueUrl or redirectUrl are passed
 */
export const handleGoogleLogin = async (): Promise<User | null> => {
  try {
    const provider = new GoogleAuthProvider();
    // Ensure NO custom parameters like custom continueUrl or redirectUrl are passed here
    const result = await signInWithPopup(auth, provider);

    console.log("Logged in user:", result.user);
    return result.user;
  } catch (error: any) {
    console.error("Authentication error:", error);
    throw error;
  }
};

export async function signInWithGoogle(): Promise<UserProfile> {
  if (isPlaceholderKey) {
    throw new Error('⚠️ Invalid Firebase API Key in .env! Please open .env and replace VITE_FIREBASE_API_KEY with your actual Web API Key from Firebase Console (https://console.firebase.google.com -> Project Settings -> General -> Web API Key). Or click "⚡ Quick Demo Sign-In" below.');
  }

  try {
    const user = await handleGoogleLogin();
    if (!user) throw new Error("Google login failed.");
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
    } else if (err.code === 'auth/configuration-not-found' || err.message?.includes('configuration-not-found')) {
      throw new Error('⚠️ Google Sign-In is not enabled in Firebase Console! Go to Firebase Console (https://console.firebase.google.com) -> Authentication -> Sign-in method -> Click "Google" -> Enable & Save.');
    } else if (err.code === 'auth/invalid-api-key' || err.code === 'auth/api-key-not-valid' || err.message?.includes('API key')) {
      throw new Error('⚠️ Invalid Firebase API Key! Please copy your real Web API Key from Firebase Console (https://console.firebase.google.com -> Project Settings -> General) and paste it into .env as VITE_FIREBASE_API_KEY.');
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
