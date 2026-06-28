import api from './api';

export const startPremiumCheckout = async ({ plan, billing = 'monthly' }) => {
  const { data } = await api.post('/api/payments/create-checkout', { plan, billing });

  if (data?.url) {
    window.location.assign(data.url);
    return data;
  }

  throw new Error('Could not start checkout');
};
