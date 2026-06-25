import { useEffect, useState } from 'react';
import api from '../../lib/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/applications/mine')
      .then((res) => setApplications(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">My Applications</h1>
      {applications.length === 0 ? (
        <p className="text-slate-500">You haven&apos;t applied to any opportunities yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full card">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-slate-600">Opportunity</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-600">Startup</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-600">Applied Date</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id} className="border-b last:border-0">
                  <td className="p-4 text-sm font-medium">{app.opportunity_id?.role_title}</td>
                  <td className="p-4 text-sm text-slate-600">{app.opportunity_id?.startup_id?.startup_name}</td>
                  <td className="p-4 text-sm text-slate-500">{new Date(app.applied_at).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                      app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                      app.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>{app.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyApplications;
