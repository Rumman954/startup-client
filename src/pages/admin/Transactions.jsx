import { useEffect, useState } from 'react';
import api from '../../lib/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/admin/transactions')
      .then((res) => setTransactions(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="dashboard-title mb-8">Transactions</h1>
      <div className="premium-table-wrap">
        <table className="premium-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr><td colSpan={4} className="text-center text-slate-500 dark:text-slate-400 py-12">No transactions yet</td></tr>
            ) : transactions.map((tx) => (
              <tr key={tx._id}>
                <td className="text-slate-700 dark:text-slate-300">{tx.user_email}</td>
                <td className="font-semibold text-slate-900 dark:text-white">${tx.amount}</td>
                <td className="text-slate-500 dark:text-slate-400">{new Date(tx.paid_at).toLocaleDateString()}</td>
                <td>
                  <span className="status-accepted capitalize">{tx.payment_status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;
