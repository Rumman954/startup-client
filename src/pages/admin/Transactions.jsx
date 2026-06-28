import { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';
import api from '../../lib/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatMoney } from '../../lib/currency';

const statusClass = (status) => {
  if (status === 'completed') return 'status-accepted';
  if (status === 'failed') return 'status-rejected';
  return 'status-pending';
};

const formatDetailAmount = (tx) => {
  if (tx.amount_paid && tx.currency && tx.currency !== 'usd') {
    return formatMoney(tx.amount_paid, tx.currency);
  }
  return `$${Number(tx.amount).toFixed(2)}`;
};

const resolveStatus = (tx) => {
  if (tx.payment_status === 'failed') return 'failed';
  if (tx.payment_status === 'completed' || tx.paid_at) return 'completed';
  return 'pending';
};

const TransactionDetailModal = ({ id, onClose }) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/api/admin/transactions/${id}`)
      .then((res) => setDetail(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="admin-tx-modal-backdrop" onClick={onClose}>
      <div className="admin-tx-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-tx-modal-header">
          <h2>Payment Details</h2>
          <button type="button" onClick={onClose} className="admin-tx-modal-close" aria-label="Close">
            <FiX size={20} />
          </button>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : detail ? (
          <dl className="admin-tx-detail-grid">
            <div><dt>User Name</dt><dd>{detail.user_name}</dd></div>
            <div><dt>Email</dt><dd>{detail.user_email}</dd></div>
            <div><dt>Customer Email</dt><dd>{detail.customer_email || detail.user_email}</dd></div>
            <div><dt>Plan</dt><dd>{detail.plan === 'pro_plus' ? 'Pro+' : detail.plan ? detail.plan.charAt(0).toUpperCase() + detail.plan.slice(1) : '—'}</dd></div>
            <div><dt>Billing</dt><dd className="capitalize">{detail.billing_interval || '—'}</dd></div>
            <div><dt>Amount (USD)</dt><dd>${Number(detail.amount).toFixed(2)}</dd></div>
            <div><dt>Amount Paid</dt><dd>{formatDetailAmount(detail)}</dd></div>
            <div><dt>Currency</dt><dd className="uppercase">{detail.currency || 'usd'}</dd></div>
            {detail.exchange_rate && (
              <div><dt>Exchange Rate</dt><dd>1 USD = {detail.exchange_rate}</dd></div>
            )}
            <div><dt>Transaction ID</dt><dd className="font-mono text-xs break-all">{detail.transaction_id}</dd></div>
            <div><dt>Payment Method</dt><dd className="capitalize">{detail.payment_method || 'card'}</dd></div>
            {detail.card_brand && (
              <div><dt>Card</dt><dd className="capitalize">{detail.card_brand} •••• {detail.card_last4}</dd></div>
            )}
            <div><dt>Billing Country</dt><dd>{detail.billing_country || '—'}</dd></div>
            <div><dt>Status</dt><dd><span className={`${statusClass(resolveStatus(detail))} capitalize`}>{resolveStatus(detail)}</span></dd></div>
            <div><dt>Paid At</dt><dd>{new Date(detail.paid_at).toLocaleString()}</dd></div>
          </dl>
        ) : (
          <p className="text-slate-500 py-8 text-center">Could not load payment details.</p>
        )}
      </div>
    </div>
  );
};

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    api.get('/api/admin/transactions')
      .then((res) => setTransactions(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          <span className="browse-opp-title-gradient">Transactions</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm sm:text-base">
          Click a row to view full payment details
        </p>
      </div>

      <div className="premium-table-wrap">
        <table className="premium-table admin-tx-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Mail</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr><td colSpan={4} className="text-center text-slate-500 dark:text-slate-400 py-12">No transactions yet</td></tr>
            ) : transactions.map((tx) => (
              <tr
                key={tx._id}
                className="admin-tx-row"
                onClick={() => setSelectedId(tx._id)}
              >
                <td className="font-semibold text-slate-900 dark:text-white">{tx.user_name}</td>
                <td className="text-slate-600 dark:text-slate-300">{tx.user_email}</td>
                <td className="font-semibold text-slate-900 dark:text-white">${Number(tx.amount).toFixed(2)}</td>
                <td>
                  <span className={`${statusClass(resolveStatus(tx))} capitalize`}>
                    {resolveStatus(tx)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedId && (
        <TransactionDetailModal id={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </div>
  );
};

export default Transactions;
