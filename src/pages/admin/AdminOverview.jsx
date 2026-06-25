import { useEffect, useState } from 'react';
import { FiUsers, FiBriefcase, FiList, FiDollarSign } from 'react-icons/fi';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import api from '../../lib/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/admin/overview')
      .then((res) => setStats(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const chartData = [
    { name: 'Users', value: stats?.totalUsers || 0 },
    { name: 'Startups', value: stats?.totalStartups || 0 },
    { name: 'Opportunities', value: stats?.totalOpportunities || 0 },
  ];
  const COLORS = ['#6366f1', '#0ea5e9', '#f59e0b'];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { icon: FiUsers, label: 'Total Users', value: stats?.totalUsers || 0 },
          { icon: FiBriefcase, label: 'Total Startups', value: stats?.totalStartups || 0 },
          { icon: FiList, label: 'Total Opportunities', value: stats?.totalOpportunities || 0 },
          { icon: FiDollarSign, label: 'Total Revenue', value: `$${stats?.totalRevenue || 0}` },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="card p-6">
            <Icon className="text-indigo-600 mb-3" size={22} />
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-slate-500 text-sm">{label}</p>
          </div>
        ))}
      </div>
      <div className="card p-6">
        <h2 className="font-bold mb-4">Platform Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
              {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminOverview;
