import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const OpportunityDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [opp, setOpp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ portfolio_link: '', motivation: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/api/opportunities/${id}`)
      .then((res) => setOpp(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login', { state: { from: { pathname: `/opportunities/${id}` } } });
    if (user.role !== 'collaborator') return toast.error('Only collaborators can apply');

    setSubmitting(true);
    try {
      await api.post('/api/applications', { opportunity_id: id, ...form });
      toast.success('Application submitted!');
      navigate('/collaborator/applications');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (!opp) return <div className="empty-state page-container-narrow">Opportunity not found</div>;

  return (
    <div className="page-container-narrow">
      <div className="card p-8 sm:p-10 mb-8">
        <p className="section-eyebrow mb-2">Opportunity</p>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{opp.role_title}</h1>
        <p className="text-orange-500 font-semibold mt-2">{opp.startup_id?.startup_name}</p>
        <div className="flex flex-wrap gap-2 mt-5">
          {(opp.required_skills || []).map((s) => (
            <span key={s} className="badge-orange">{s}</span>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-sm">
          <div><span className="text-slate-500 dark:text-slate-400 block text-xs uppercase tracking-wide mb-1">Work Type</span> <span className="font-semibold capitalize text-slate-800 dark:text-slate-200">{opp.work_type}</span></div>
          <div><span className="text-slate-500 dark:text-slate-400 block text-xs uppercase tracking-wide mb-1">Commitment</span> <span className="font-semibold capitalize text-slate-800 dark:text-slate-200">{opp.commitment_level}</span></div>
          <div><span className="text-slate-500 dark:text-slate-400 block text-xs uppercase tracking-wide mb-1">Deadline</span> <span className="font-semibold text-slate-800 dark:text-slate-200">{new Date(opp.deadline).toLocaleDateString()}</span></div>
          <div><span className="text-slate-500 dark:text-slate-400 block text-xs uppercase tracking-wide mb-1">Industry</span> <span className="font-semibold text-slate-800 dark:text-slate-200">{opp.startup_id?.industry}</span></div>
        </div>
      </div>

      <div className="card p-8 sm:p-10">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Apply to this Opportunity</h2>
        <form onSubmit={handleApply} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Portfolio Link</label>
            <input type="url" className="input-field" placeholder="https://yourportfolio.com" value={form.portfolio_link} onChange={(e) => setForm({ ...form, portfolio_link: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Motivation Message</label>
            <textarea required rows={4} className="input-field" placeholder="Why do you want to join this team?" value={form.motivation} onChange={(e) => setForm({ ...form, motivation: e.target.value })} />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-50">
            {submitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OpportunityDetails;
