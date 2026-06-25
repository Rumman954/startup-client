import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';
import api from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) { setLoading(false); return; }

    api.post('/api/payments/verify', { sessionId })
      .then((res) => setPayment(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [searchParams]);

  if (loading) return <LoadingSpinner fullScreen message="Verifying payment..." />;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="card p-12 text-center max-w-md">
        <FiCheckCircle className="text-green-500 mx-auto mb-6" size={64} />
        <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-slate-600 mb-4">Your premium founder package is now active.</p>
        {payment && (
          <div className="bg-slate-50 rounded-lg p-4 text-sm text-left mb-6">
            <p><span className="text-slate-500">Amount:</span> ${payment.amount}</p>
            <p><span className="text-slate-500">Transaction ID:</span> {payment.transaction_id?.slice(0, 20)}...</p>
          </div>
        )}
        <Link to="/founder/dashboard" className="btn-primary">Go to Dashboard</Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
