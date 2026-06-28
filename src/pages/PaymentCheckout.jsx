import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FiCreditCard } from 'react-icons/fi';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  CURRENCIES,
  convertFromUsd,
  detectDefaultCurrency,
  formatMoney,
  formatRate,
} from '../lib/currency';
import { PREMIUM_PLANS, getPlanPrice } from '../lib/premiumPlans';

const COUNTRIES = [
  { code: 'BD', name: 'Bangladesh' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'IN', name: 'India' },
  { code: 'DE', name: 'Germany' },
];

const CardBrands = () => (
  <div className="stripe-card-brands" aria-hidden="true">
    <span className="stripe-brand stripe-brand-visa">VISA</span>
    <span className="stripe-brand stripe-brand-mc">MC</span>
    <span className="stripe-brand stripe-brand-amex">AMEX</span>
    <span className="stripe-brand stripe-brand-discover">DISC</span>
  </div>
);

const PaymentCheckout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, issueJwt } = useAuth();
  const sessionId = searchParams.get('session_id');
  const plan = searchParams.get('plan') || 'pro_plus';
  const billing = searchParams.get('billing') === 'yearly' ? 'yearly' : 'monthly';
  const planInfo = PREMIUM_PLANS[plan];
  const priceUsd = getPlanPrice(plan, billing) || 0;

  const [paying, setPaying] = useState(false);
  const [saveInfo, setSaveInfo] = useState(false);
  const [currency, setCurrency] = useState(() => detectDefaultCurrency());
  const checkoutCurrencies = useMemo(() => {
    const local = detectDefaultCurrency();
    return local === 'usd' ? ['usd'] : ['usd', local];
  }, []);
  const [form, setForm] = useState({
    email: user?.email || '',
    cardNumber: '',
    expiry: '',
    cvc: '',
    name: '',
    country: detectDefaultCurrency() === 'bdt' ? 'BD' : 'US',
  });

  const localAmount = useMemo(
    () => convertFromUsd(priceUsd, currency),
    [priceUsd, currency]
  );

  useEffect(() => {
    if (!sessionId || !planInfo) navigate('/premium', { replace: true });
  }, [sessionId, planInfo, navigate]);

  useEffect(() => {
    if (user?.email) setForm((prev) => ({ ...prev, email: user.email }));
    if (user?.name) setForm((prev) => ({ ...prev, name: user.name }));
  }, [user]);

  const handlePay = async (e) => {
    e.preventDefault();
    if (!sessionId || !planInfo) return;

    const digits = form.cardNumber.replace(/\D/g, '');
    if (digits.length < 12) {
      toast.error('Enter a valid card number');
      return;
    }
    if (!form.expiry.trim()) {
      toast.error('Enter card expiry date');
      return;
    }
    if (!form.cvc.trim()) {
      toast.error('Enter CVC');
      return;
    }
    if (!form.name.trim()) {
      toast.error('Enter cardholder name');
      return;
    }

    setPaying(true);
    try {
      const selected = CURRENCIES[currency];
      await api.post('/api/payments/verify', {
        sessionId,
        plan,
        billing,
        paymentDetails: {
          currency,
          amount_paid: localAmount,
          exchange_rate: selected?.rate,
          billing_country: form.country,
          customer_email: form.email,
          card_last4: digits.slice(-4),
          card_brand: digits.startsWith('4') ? 'visa' : digits.startsWith('5') ? 'mastercard' : 'card',
          payment_method: 'card',
          plan,
          billing,
        },
      });
      await issueJwt();
      toast.success('Payment successful!');
      navigate(`/payment-success?session_id=${sessionId}`, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Payment failed');
    } finally {
      setPaying(false);
    }
  };

  if (!sessionId || !planInfo) return <LoadingSpinner fullScreen />;

  return (
    <div className="stripe-checkout-page">
      <div className="stripe-checkout-shell">
        <div className="stripe-checkout-summary">
          <div className="stripe-checkout-brand">
            <span>StartUp Labs</span>
            <span className="stripe-sandbox-badge">Sandbox</span>
          </div>

          <p className="stripe-currency-label">Choose a currency:</p>
          <div className="stripe-currency-toggle">
            {checkoutCurrencies.map((code) => {
              const item = CURRENCIES[code];
              const converted = convertFromUsd(priceUsd, code);
              const active = currency === code;
              return (
                <button
                  key={code}
                  type="button"
                  className={`stripe-currency-btn ${active ? 'stripe-currency-btn-active' : ''}`}
                  onClick={() => setCurrency(code)}
                >
                  <span>{item.flag}</span>
                  <span>{formatMoney(converted, code)}</span>
                </button>
              );
            })}
          </div>
          {formatRate(currency) && (
            <p className="stripe-exchange-rate">{formatRate(currency)}</p>
          )}

          <div className="stripe-product-row">
            <div>
              <p className="stripe-product-name">StartUp Labs {planInfo.name}</p>
              <p className="stripe-product-desc">
                {planInfo.tagline} · {billing === 'yearly' ? 'Yearly' : 'Monthly'}
              </p>
            </div>
            <p className="stripe-product-price">{formatMoney(localAmount, currency)}</p>
          </div>

          <div className="stripe-total-row">
            <span>Total due</span>
            <span>{formatMoney(localAmount, currency)}</span>
          </div>
        </div>

        <div className="stripe-checkout-form-wrap">
          <form onSubmit={handlePay} className="stripe-checkout-form">
            <section className="stripe-form-section">
              <h2>Contact information</h2>
              <label className="stripe-field-label" htmlFor="checkout-email">Email</label>
              <input
                id="checkout-email"
                className="stripe-field"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </section>

            <section className="stripe-form-section">
              <h2>Payment method</h2>

              <div className="stripe-method-tab stripe-method-tab-active">
                <FiCreditCard size={18} strokeWidth={1.75} />
                <span>Card</span>
              </div>

              <label className="stripe-field-label">Card information</label>
              <div className="stripe-card-group">
                <div className="stripe-card-number-row">
                  <input
                    className="stripe-card-input"
                    value={form.cardNumber}
                    onChange={(e) => setForm({ ...form, cardNumber: e.target.value })}
                    placeholder="1234 1234 1234 1234"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    required
                  />
                  <CardBrands />
                </div>
                <div className="stripe-card-bottom-row">
                  <input
                    className="stripe-card-input stripe-card-expiry"
                    value={form.expiry}
                    onChange={(e) => setForm({ ...form, expiry: e.target.value })}
                    placeholder="MM / YY"
                    autoComplete="cc-exp"
                    required
                  />
                  <input
                    className="stripe-card-input stripe-card-cvc"
                    value={form.cvc}
                    onChange={(e) => setForm({ ...form, cvc: e.target.value })}
                    placeholder="CVC"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    required
                  />
                  <span className="stripe-cvc-hint" title="3-digit security code">
                    <FiCreditCard size={14} />
                  </span>
                </div>
              </div>

              <label className="stripe-field-label" htmlFor="checkout-name">Cardholder name</label>
              <input
                id="checkout-name"
                className="stripe-field"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Full name on card"
                autoComplete="cc-name"
                required
              />

              <label className="stripe-field-label" htmlFor="checkout-country">Country or region</label>
              <select
                id="checkout-country"
                className="stripe-field stripe-field-select"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
            </section>

            <label className="stripe-save-info">
              <input
                type="checkbox"
                checked={saveInfo}
                onChange={(e) => setSaveInfo(e.target.checked)}
              />
              <span>
                <strong>Save my information for faster checkout</strong>
                <small>Pay securely at StartUp Labs and everywhere Link is accepted.</small>
              </span>
            </label>

            <button type="submit" disabled={paying} className="stripe-pay-btn">
              {paying ? 'Processing...' : 'Pay'}
            </button>

            <footer className="stripe-checkout-footer">
              <span>Powered by <strong>stripe</strong></span>
              <span className="stripe-footer-divider">|</span>
              <a href="https://stripe.com/legal/terms" target="_blank" rel="noreferrer">Terms</a>
              <span className="stripe-footer-divider">|</span>
              <a href="https://stripe.com/privacy" target="_blank" rel="noreferrer">Privacy</a>
            </footer>
          </form>

          <Link to="/premium" className="stripe-cancel-link">← Back to Premium plans</Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentCheckout;
