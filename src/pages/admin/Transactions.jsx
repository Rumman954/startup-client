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
      <h1 className="text-2xl font-bold mb-8">Transactions</h1>
      <div className="overflow-x-auto card">
        <table className="w-full">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="text-left p-4 text-sm font-semibold">User</th>
              <th className="text-left p-4 text-sm font-semibold">Amount</th>
              <th className="text-left p-4 text-sm font-semibold">Date</th>
              <th className="text-left p-4 text-sm font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr><td colSpan={4} className="p-8 text-center text-slate-500">No transactions yet</td></tr>
            ) : transactions.map((tx) => (
              <tr key={tx._id} className="border-b last:border-0">
                <td className="p-4 text-sm">{tx.user_email}</td>
                <td className="p-4 text-sm font-medium">${tx.amount}</td>
                <td className="p-4 text-sm text-slate-500">{new Date(tx.paid_at).toLocaleDateString()}</td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs capitalize">{tx.payment_status}</span>
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
