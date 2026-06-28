const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const checkApiHealth = async () => {
  try {
    const res = await fetch(`${API_URL}/api/health`, { credentials: 'include' });
    return res.ok;
  } catch {
    return false;
  }
};

export const formatAuthError = (err, fallback = 'Something went wrong') => {
  const msg = err?.message || '';

  if (msg === 'Failed to fetch' || msg === 'Network Error' || msg.includes('NetworkError')) {
    return 'Backend server is offline. Open a terminal, run: cd server && npm run dev — and make sure server/.env has a real MongoDB URI.';
  }

  if (msg.includes('IMGBB') || msg.includes('Profile image')) {
    return msg;
  }

  return msg || fallback;
};
