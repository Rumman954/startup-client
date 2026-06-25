import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers } from 'react-icons/fi';
import api from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="section-title mb-2">Browse Startups</h1>
      <p className="section-subtitle mb-10">Explore innovative startups and find your next venture</p>
      {startups.length === 0 ? (
        <p className="text-center text-slate-500 py-20">No approved startups yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {startups.map((startup) => (
            <div key={startup._id} className="card h-full flex flex-col">
              <div className="h-48 bg-slate-100 flex items-center justify-center">
                <img src={startup.logo || `https://ui-avatars.com/api/?name=${startup.startup_name}&size=128`} alt="" className="w-24 h-24 object-contain rounded-xl" />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-bold text-lg">{startup.startup_name}</h3>
                <span className="inline-block mt-2 px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-full w-fit">{startup.industry}</span>
                <p className="text-sm text-slate-600 mt-3 flex-1 line-clamp-3">{startup.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-slate-500 flex items-center gap-1"><FiUsers size={14} /> {startup.team_size_needed || 5} needed</span>
                  <Link to={`/startups/${startup._id}`} className="text-indigo-600 text-sm font-semibold">View →</Link>
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
