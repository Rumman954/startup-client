import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers } from 'react-icons/fi';
import api from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner';
import PageHeader from '../components/PageHeader';

const BrowseStartups = () => {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/startups?status=approved')
      .then((res) => setStartups(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="page-container">
      <PageHeader
        eyebrow="Explore"
        title="Browse Startups"
        subtitle="Explore innovative startups and find your next venture."
      />
      {startups.length === 0 ? (
        <div className="empty-state">No approved startups yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {startups.map((startup) => (
            <div key={startup._id} className="card h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="h-48 bg-gradient-to-br from-slate-50 to-orange-50/50 dark:from-slate-800 dark:to-orange-500/5 flex items-center justify-center">
                <img src={startup.logo || `https://ui-avatars.com/api/?name=${startup.startup_name}&size=128`} alt="" className="w-24 h-24 object-contain rounded-xl" />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">{startup.startup_name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">By {startup.founder_name || 'Founder'}</p>
                <span className="inline-block mt-2 badge-orange w-fit">{startup.industry}</span>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 flex-1 line-clamp-3">{startup.description}</p>
                <div className="mt-4 flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1"><FiUsers size={14} /> {startup.team_size_needed || 5} needed</span>
                  <Link to={`/startups/${startup._id}`} className="link-accent">View →</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseStartups;
