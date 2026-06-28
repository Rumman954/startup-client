import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatMoney } from '../lib/currency';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const { issueJwt } = useAuth();
  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) {
      setLoading(false);
      return;
    }

    api.get('/api/payments/transactions')
      .then(async (res) => {
        const match = res.data.data?.find((tx) => tx.transaction_id === sessionId);
        if (match) {
          setPayment(match);
          await issueJwt();
          setLoading(false);
          return;
        }

        return api.post('/api/payments/verify', { sessionId })
          .then(async (verifyRes) => {
            setPayment(verifyRes.data.data);
            await issueJwt();
          });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [searchParams, issueJwt]);

  if (loading) return <LoadingSpinner fullScreen message="Verifying payment..." />;

  const paidDisplay = payment?.amount_paid && payment?.currency
    ? formatMoney(payment.amount_paid, payment.currency)
    : payment ? `$${Number(payment.amount).toFixed(2)}` : null;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 page-shell">
      <div className="card p-10 sm:p-12 text-center max-w-md w-full">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center ring-1 ring-emerald-100 dark:ring-emerald-500/20">
          <FiCheckCircle className="text-emerald-500" size={48} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Payment Successful!</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">Your premium founder package is now active.</p>
        {payment && (
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 text-sm text-left mb-8 space-y-2">
            <p><span className="text-slate-500 dark:text-slate-400">Amount:</span> <span className="font-semibold text-slate-800 dark:text-slate-200">{paidDisplay}</span></p>
            <p><span className="text-slate-500 dark:text-slate-400">Transaction ID:</span> <span className="font-mono text-xs text-slate-700 dark:text-slate-300">{payment.transaction_id?.slice(0, 20)}...</span></p>
          </div>
        )}
        <Link to="/founder/dashboard" className="btn-primary">Go to Dashboard</Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
