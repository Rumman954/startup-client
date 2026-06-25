import { useEffect, useState } from 'react';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';

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
      <h1 className="text-2xl font-bold mb-8">Manage Startups</h1>
      <div className="space-y-4">
        {startups.map((startup) => (
          <div key={startup._id} className="card p-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div className="flex items-center gap-4">
              <img src={startup.logo || `https://ui-avatars.com/api/?name=${startup.startup_name}`} alt="" className="w-14 h-14 rounded-lg object-contain bg-slate-100" />
              <div>
                <h3 className="font-bold">{startup.startup_name}</h3>
                <p className="text-sm text-slate-500">{startup.industry} · {startup.founder_email}</p>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs capitalize ${
                  startup.status === 'approved' ? 'bg-green-100 text-green-700' :
                  startup.status === 'removed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                }`}>{startup.status}</span>
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
