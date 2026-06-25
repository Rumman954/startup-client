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
  if (!opp) return <div className="text-center py-20 text-slate-500">Opportunity not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="card p-8 mb-8">
        <h1 className="text-3xl font-bold">{opp.role_title}</h1>
        <p className="text-indigo-600 font-medium mt-2">{opp.startup_id?.startup_name}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {(opp.required_skills || []).map((s) => (
            <span key={s} className="px-3 py-1 bg-indigo-50 text-indigo-600 text-sm rounded-full">{s}</span>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 text-sm">
          <div><span className="text-slate-500">Work Type:</span> <span className="font-medium capitalize">{opp.work_type}</span></div>
          <div><span className="text-slate-500">Commitment:</span> <span className="font-medium capitalize">{opp.commitment_level}</span></div>
          <div><span className="text-slate-500">Deadline:</span> <span className="font-medium">{new Date(opp.deadline).toLocaleDateString()}</span></div>
          <div><span className="text-slate-500">Industry:</span> <span className="font-medium">{opp.startup_id?.industry}</span></div>
        </div>
      </div>

      <div className="card p-8">
        <h2 className="text-xl font-bold mb-6">Apply to this Opportunity</h2>
        <form onSubmit={handleApply} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Portfolio Link</label>
            <input type="url" className="input-field" placeholder="https://yourportfolio.com" value={form.portfolio_link} onChange={(e) => setForm({ ...form, portfolio_link: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Motivation Message</label>
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
