import { useEffect, useState } from 'react';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';

const FounderApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    api.get('/api/applications/founder/all')
      .then((res) => setApplications(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/api/applications/${id}/status`, { status });
      toast.success(`Application ${status}`);
      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Applications</h1>
      {applications.length === 0 ? (
        <p className="text-slate-500">No applications yet.</p>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app._id} className="card p-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div>
                  <h3 className="font-bold">{app.opportunity_id?.role_title}</h3>
                  <p className="text-sm text-slate-500">{app.applicant_email}</p>
                  {app.portfolio_link && (
                    <a href={app.portfolio_link} target="_blank" rel="noreferrer" className="text-sm text-indigo-600 hover:underline">{app.portfolio_link}</a>
                  )}
                  <p className="text-sm text-slate-600 mt-2">{app.motivation}</p>
                  <p className="text-xs text-slate-400 mt-2">Applied: {new Date(app.applied_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                    app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                    app.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>{app.status}</span>
                  {app.status === 'pending' && (
                    <>
                      <button onClick={() => updateStatus(app._id, 'accepted')} className="btn-primary text-xs py-1.5 px-3">Accept</button>
                      <button onClick={() => updateStatus(app._id, 'rejected')} className="btn-danger text-xs py-1.5 px-3">Reject</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FounderApplications;
