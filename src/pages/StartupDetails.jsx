import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner';

const StartupDetails = () => {
  const { id } = useParams();
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/api/startups/${id}`)
      .then((res) => setStartup(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner fullScreen />;
  if (!startup) return <div className="empty-state page-container-narrow">Startup not found</div>;

  return (
    <div className="page-container-narrow">
      <div className="card p-8 sm:p-10">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <img
            src={startup.logo || `https://ui-avatars.com/api/?name=${startup.startup_name}&size=128`}
            alt=""
            className="w-32 h-32 object-contain rounded-2xl bg-slate-100 dark:bg-slate-800 p-3 ring-1 ring-slate-200/80 dark:ring-slate-700"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{startup.startup_name}</h1>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="badge-orange">{startup.industry}</span>
              <span className="badge-green">{startup.funding_stage}</span>
              <span className="badge-muted">{startup.status}</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 mt-5 leading-relaxed">{startup.description}</p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div><span className="text-slate-500 dark:text-slate-400">Founder:</span> <span className="font-semibold text-slate-800 dark:text-slate-200">{startup.founder_email}</span></div>
              <div><span className="text-slate-500 dark:text-slate-400">Team Size Needed:</span> <span className="font-semibold text-slate-800 dark:text-slate-200">{startup.team_size_needed || 5}</span></div>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          <Link to="/opportunities" className="btn-primary">View Opportunities</Link>
        </div>
      </div>
    </div>
  );
};

export default StartupDetails;
