import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiBriefcase, FiUsers, FiCheckCircle } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../lib/api';
import LoadingSpinner from '../../components/LoadingSpinner';

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
      <h1 className="text-2xl font-bold mb-8">Founder Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { icon: FiBriefcase, label: 'Total Opportunities', value: stats?.totalOpportunities || 0, color: 'indigo' },
          { icon: FiUsers, label: 'Total Applications', value: stats?.totalApplications || 0, color: 'sky' },
          { icon: FiCheckCircle, label: 'Accepted Members', value: stats?.acceptedMembers || 0, color: 'green' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="card p-6">
            <div className={`w-12 h-12 bg-${color}-100 rounded-lg flex items-center justify-center mb-4`}>
              <Icon className={`text-${color}-600`} size={22} />
            </div>
            <p className="text-3xl font-bold">{value}</p>
            <p className="text-slate-500 text-sm mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="card p-6 mb-8">
        <h2 className="font-bold text-lg mb-4">Statistics Chart</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {!stats?.startup && (
        <div className="card p-6 bg-indigo-50 border border-indigo-100">
          <p className="font-medium text-indigo-900">You haven&apos;t created a startup profile yet.</p>
          <Link to="/founder/my-startup" className="btn-primary inline-block mt-4 text-sm">Create Startup</Link>
        </div>
      )}
    </div>
  );
};

export default FounderOverview;
