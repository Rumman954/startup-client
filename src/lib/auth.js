import { createAuthClient } from 'better-auth/react';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const authClient = createAuthClient({
  baseURL,
  fetchOptions: {
    credentials: 'include',
  },
});

export const { signIn, signUp, signOut, useSession } = authClient;

const sanitizeNextPath = (next) => {
  let path = '/dashboard';

  if (typeof next !== 'string' || !next.trim()) return path;

  try {
    if (next.startsWith('http')) {
      path = new URL(next).pathname || '/dashboard';
    } else if (next.startsWith('/')) {
      path = next.split('?')[0];
    }
  } catch {
    return path;
  }

  if (!path.startsWith('/') || path.includes('.tsx') || path.includes('.jsx') || path.includes('.')) {
    return '/dashboard';
  }

  return path;
};

export const signInWithGoogle = async (next = '/dashboard') => {
  const nextPath = sanitizeNextPath(next);
  const callbackURL = `${window.location.origin}${nextPath}`;

  const result = await signIn.social({
    provider: 'google',
    callbackURL,
  });

  if (result?.error) {
    throw new Error(result.error.message || 'Google sign-in failed');
  }

  const url = result?.data?.url;
  if (url) {
    window.location.assign(url);
    return;
  }

  throw new Error('Google sign-in did not start. Restart the server: cd server && npm run dev');
};
