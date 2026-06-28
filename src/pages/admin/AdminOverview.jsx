import { useEffect, useState } from 'react';
import { FiUsers, FiBriefcase, FiList, FiDollarSign } from 'react-icons/fi';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import api from '../../lib/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const STAT_CARDS = [
  { icon: FiUsers, label: 'Total Users', key: 'totalUsers', iconWrap: 'bg-violet-100 dark:bg-violet-500/15', iconColor: 'text-violet-600' },
  { icon: FiBriefcase, label: 'Total Startups', key: 'totalStartups', iconWrap: 'bg-indigo-100 dark:bg-indigo-500/15', iconColor: 'text-indigo-600' },
  { icon: FiList, label: 'Total Opportunities', key: 'totalOpportunities', iconWrap: 'bg-purple-100 dark:bg-purple-500/15', iconColor: 'text-purple-600' },
  { icon: FiDollarSign, label: 'Total Revenue', key: 'totalRevenue', prefix: '$', iconWrap: 'bg-emerald-100 dark:bg-emerald-500/15', iconColor: 'text-emerald-600', format: (v) => Number(v || 0).toFixed(2) },
];

/** Users = blue, Startups = violet, Opportunities = green (matches reference chart) */
const PIE_COLORS = ['#3b82f6', '#8b5cf6', '#4ade80'];

const PIE_LABELS = {
  Users: 'Users',
  Startups: 'Startups',
  Opportunities: 'Opps',
};

const renderPieLabel = ({ name, value, cx, cy, midAngle, outerRadius }) => {
  if (!value) return null;
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 28;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const label = PIE_LABELS[name] || name;

  return (
    <text
      x={x}
      y={y}
      fill="currentColor"
      className="fill-slate-600 dark:fill-slate-300"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize={13}
      fontWeight={600}
    >
      {label}: {value}
    </text>
  );
};

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

  const hasChartData = chartData.some((d) => d.value > 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Admin <span className="browse-opp-title-gradient">Dashboard</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm sm:text-base">Platform overview and key metrics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {STAT_CARDS.map(({ icon: Icon, label, key, prefix = '', iconWrap, iconColor, format }) => (
          <div key={label} className="founder-stat-card">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${iconWrap}`}>
              <Icon className={iconColor} size={20} />
            </div>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white leading-none">
              {prefix}{format ? format(stats?.[key]) : (stats?.[key] || 0)}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{label}</p>
          </div>
        ))}
      </div>

      <div className="founder-chart-card">
        <h2 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Platform Overview</h2>
        {hasChartData ? (
          <ResponsiveContainer width="100%" height={340}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="44%"
                outerRadius={100}
                paddingAngle={2}
                stroke="var(--pie-stroke, #ffffff)"
                strokeWidth={2}
                label={renderPieLabel}
                labelLine={{ stroke: '#94a3b8', strokeWidth: 1 }}
              >
                {chartData.map((entry, i) => (
                  <Cell key={entry.name} fill={PIE_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [value, name === 'Opportunities' ? 'Opportunities' : name]}
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid rgba(148,163,184,0.2)',
                  background: 'rgba(255,255,255,0.98)',
                  boxShadow: '0 8px 24px rgba(15,23,42,0.08)',
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={40}
                iconType="square"
                iconSize={10}
                formatter={(value) => (value === 'Opportunities' ? 'Opportunities' : value)}
                wrapperStyle={{ fontSize: 13, paddingTop: 8 }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-slate-500 dark:text-slate-400 py-16">No platform data yet</p>
        )}
      </div>
    </div>
  );
};

export default AdminOverview;
