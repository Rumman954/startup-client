import { useEffect, useState } from 'react';
import { FiUsers, FiBriefcase, FiList, FiDollarSign } from 'react-icons/fi';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import api from '../../lib/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const STAT_CARDS = [
  { icon: FiUsers, label: 'Total Users', key: 'totalUsers', iconColor: 'text-orange-500' },
  { icon: FiBriefcase, label: 'Total Startups', key: 'totalStartups', iconColor: 'text-sky-500' },
  { icon: FiList, label: 'Total Opportunities', key: 'totalOpportunities', iconColor: 'text-amber-500' },
  { icon: FiDollarSign, label: 'Total Revenue', key: 'totalRevenue', prefix: '$', iconColor: 'text-emerald-500' },
];

const COLORS = ['#f97316', '#0ea5e9', '#f59e0b'];

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

  return (
    <div>
      <h1 className="dashboard-title mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {STAT_CARDS.map(({ icon: Icon, label, key, prefix = '', iconColor }) => (
          <div key={label} className="dashboard-stat-card">
            <Icon className={`${iconColor} mb-3`} size={24} />
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{prefix}{stats?.[key] || 0}</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{label}</p>
          </div>
        ))}
      </div>
      <div className="card p-6 sm:p-8">
        <h2 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Platform Overview</h2>
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
