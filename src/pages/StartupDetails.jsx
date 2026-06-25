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
  if (!startup) return <div className="text-center py-20 text-slate-500">Startup not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="card p-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <img src={startup.logo || `https://ui-avatars.com/api/?name=${startup.startup_name}&size=128`} alt="" className="w-32 h-32 object-contain rounded-xl bg-slate-100 p-2" />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900">{startup.startup_name}</h1>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-sm rounded-full">{startup.industry}</span>
              <span className="px-3 py-1 bg-green-50 text-green-600 text-sm rounded-full">{startup.funding_stage}</span>
              <span className="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-full capitalize">{startup.status}</span>
            </div>
            <p className="text-slate-600 mt-4 leading-relaxed">{startup.description}</p>
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-slate-500">Founder:</span> <span className="font-medium">{startup.founder_email}</span></div>
              <div><span className="text-slate-500">Team Size Needed:</span> <span className="font-medium">{startup.team_size_needed || 5}</span></div>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <Link to="/opportunities" className="btn-primary">View Opportunities</Link>
        </div>
      </div>
    </div>
  );
};

export default StartupDetails;
