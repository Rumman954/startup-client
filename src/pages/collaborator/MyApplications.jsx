import { useEffect, useState } from 'react';
import api from '../../lib/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const statusClass = (status) => {
  if (status === 'accepted') return 'status-accepted';
  if (status === 'rejected') return 'status-rejected';
  return 'status-pending';
};

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
      <h1 className="dashboard-title mb-8">My Applications</h1>
      {applications.length === 0 ? (
        <div className="empty-state">You haven&apos;t applied to any opportunities yet.</div>
      ) : (
        <div className="premium-table-wrap">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Opportunity</th>
                <th>Startup</th>
                <th>Applied Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id}>
                  <td className="font-semibold text-slate-900 dark:text-white">{app.opportunity_id?.role_title}</td>
                  <td className="text-slate-600 dark:text-slate-400">{app.opportunity_id?.startup_id?.startup_name}</td>
                  <td className="text-slate-500 dark:text-slate-400">{new Date(app.applied_at).toLocaleDateString()}</td>
                  <td>
                    <span className={statusClass(app.status)}>{app.status}</span>
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
