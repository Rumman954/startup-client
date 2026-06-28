import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiBriefcase, FiUsers, FiCheckCircle } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';

const STAT_CARDS = [
  {
    icon: FiBriefcase,
    label: 'Total Opportunities',
    key: 'totalOpportunities',
    iconWrap: 'bg-violet-100 dark:bg-violet-500/15',
    iconColor: 'text-violet-600 dark:text-violet-400',
  },
  {
    icon: FiUsers,
    label: 'Total Applications',
    key: 'totalApplications',
    iconWrap: 'bg-sky-100 dark:bg-sky-500/15',
    iconColor: 'text-sky-600 dark:text-sky-400',
  },
  {
    icon: FiCheckCircle,
    label: 'Accepted Members',
    key: 'acceptedMembers',
    iconWrap: 'bg-emerald-100 dark:bg-emerald-500/15',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
];

const CHART_COLORS = ['#8b5cf6', '#8b5cf6', '#c4b5fd'];

const FounderOverview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/users/founder/stats')
      .then((res) => setStats(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleGoPremium = () => navigate('/premium');

  if (loading) return <LoadingSpinner />;

  const firstName = user?.name?.split(' ')?.[0] || 'Founder';
  const showPremiumBanner =
    !user?.isPremium && (stats?.totalOpportunities || 0) >= 3;

  const chartData = [
    { name: 'Opportunities', value: stats?.totalOpportunities || 0 },
    { name: 'Applications', value: stats?.totalApplications || 0 },
    { name: 'Accepted', value: stats?.acceptedMembers || 0 },
  ];

  return (
    <div className="founder-dashboard-page">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Welcome back, {firstName} 👋
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm sm:text-base">
          Here&apos;s an overview of your startup activity.
        </p>
      </div>

      {showPremiumBanner && (
        <div className="founder-premium-banner mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="font-bold text-slate-900 dark:text-white">Upgrade to Premium</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              You&apos;ve used all 3 free opportunity slots. Go premium to post unlimited.
            </p>
          </div>
          <button
            type="button"
            onClick={handleGoPremium}
            className="shrink-0 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm px-5 py-2.5 rounded-lg shadow-md shadow-orange-500/20 transition-colors"
          >
            Go Premium
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {STAT_CARDS.map(({ icon: Icon, label, key, iconWrap, iconColor }) => (
          <div key={label} className="founder-stat-card">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${iconWrap}`}>
              <Icon className={iconColor} size={20} />
            </div>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white leading-none">
              {stats?.[key] || 0}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{label}</p>
          </div>
        ))}
      </div>

      <div className="founder-chart-card">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Activity Overview</h2>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} barCategoryGap="28%">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.25)" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: 'rgba(139, 92, 246, 0.08)' }}
              contentStyle={{
                borderRadius: '12px',
                border: '1px solid rgba(148,163,184,0.2)',
                background: 'rgba(255,255,255,0.98)',
                boxShadow: '0 8px 24px rgba(15,23,42,0.08)',
              }}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={72}>
              {chartData.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {!stats?.startup && (
        <div className="alert-card-orange mt-8">
          <p className="font-semibold text-orange-900 dark:text-orange-200">You haven&apos;t created a startup profile yet.</p>
          <p className="text-sm text-orange-700/80 dark:text-orange-300/80 mt-1">Create your startup to start posting opportunities.</p>
          <Link to="/founder/my-startup" className="btn-primary inline-block mt-4 text-sm">Create Startup</Link>
        </div>
      )}
    </div>
  );
};

export default FounderOverview;
