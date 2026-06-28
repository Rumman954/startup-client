import { useEffect, useState } from 'react';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';

const statusClass = (status) => {
  if (status === 'approved') return 'status-accepted';
  if (status === 'removed') return 'status-rejected';
  return 'status-pending';
};

const ManageStartups = () => {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStartups = () => {
    api.get('/api/admin/startups')
      .then((res) => setStartups(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchStartups(); }, []);

  const updateStatus = async (id, action) => {
    try {
      await api.patch(`/api/admin/startups/${id}/${action}`);
      toast.success(`Startup ${action === 'approve' ? 'approved' : 'removed'}`);
      fetchStartups();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="dashboard-title mb-8">Manage Startups</h1>
      <div className="space-y-4">
        {startups.map((startup) => (
          <div key={startup._id} className="card p-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4 transition-all hover:shadow-lg">
            <div className="flex items-center gap-4">
              <img src={startup.logo || `https://ui-avatars.com/api/?name=${startup.startup_name}`} alt="" className="w-14 h-14 rounded-xl object-contain bg-slate-100 dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700" />
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">{startup.startup_name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{startup.industry} · {startup.founder_email}</p>
                <span className={`inline-block mt-2 ${statusClass(startup.status)}`}>{startup.status}</span>
              </div>
            </div>
            <div className="flex gap-2">
              {startup.status !== 'approved' && (
                <button onClick={() => updateStatus(startup._id, 'approve')} className="btn-primary text-sm py-1.5 px-4">Approve</button>
              )}
              {startup.status !== 'removed' && (
                <button onClick={() => updateStatus(startup._id, 'remove')} className="btn-danger text-sm py-1.5 px-4">Remove</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageStartups;
