import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiBriefcase, FiUsers, FiCheckCircle } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../lib/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const STAT_CARDS = [
  {
    icon: FiBriefcase,
    label: 'Total Opportunities',
    key: 'totalOpportunities',
    iconBg: 'bg-orange-100 dark:bg-orange-500/15',
    iconColor: 'text-orange-600 dark:text-orange-400',
  },
  {
    icon: FiUsers,
    label: 'Total Applications',
    key: 'totalApplications',
    iconBg: 'bg-sky-100 dark:bg-sky-500/15',
    iconColor: 'text-sky-600 dark:text-sky-400',
  },
  {
    icon: FiCheckCircle,
    label: 'Accepted Members',
    key: 'acceptedMembers',
    iconBg: 'bg-emerald-100 dark:bg-emerald-500/15',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
];

const FounderOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/users/founder/stats')
      .then((res) => setStats(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const chartData = [
    { name: 'Opportunities', value: stats?.totalOpportunities || 0 },
    { name: 'Applications', value: stats?.totalApplications || 0 },
    { name: 'Accepted', value: stats?.acceptedMembers || 0 },
  ];

  return (
    <div>
      <h1 className="dashboard-title mb-8">Founder Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {STAT_CARDS.map(({ icon: Icon, label, key, iconBg, iconColor }) => (
          <div key={label} className="dashboard-stat-card">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${iconBg}`}>
              <Icon className={iconColor} size={22} />
            </div>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{stats?.[key] || 0}</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="card p-6 sm:p-8 mb-8">
        <h2 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Statistics Overview</h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.3)" />
            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                border: '1px solid rgba(148,163,184,0.2)',
                background: 'rgba(255,255,255,0.95)',
              }}
            />
            <Bar dataKey="value" fill="#f97316" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {!stats?.startup && (
        <div className="alert-card-orange">
          <p className="font-semibold text-orange-900 dark:text-orange-200">You haven&apos;t created a startup profile yet.</p>
          <p className="text-sm text-orange-700/80 dark:text-orange-300/80 mt-1">Create your startup to start posting opportunities.</p>
          <Link to="/founder/my-startup" className="btn-primary inline-block mt-4 text-sm">Create Startup</Link>
        </div>
      )}
    </div>
  );
};

export default FounderOverview;
