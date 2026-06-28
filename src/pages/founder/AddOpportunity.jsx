import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import toast from 'react-hot-toast';

const AddOpportunity = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    role_title: '', required_skills: '', work_type: 'remote', commitment_level: 'full-time', deadline: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/opportunities', {
        ...form,
        required_skills: form.required_skills.split(',').map((s) => s.trim()),
      });
      toast.success('Opportunity created!');
      navigate('/founder/opportunities');
    } catch (err) {
      if (err.message.includes('Premium')) {
        toast.error('Premium required! Redirecting to checkout...');
        try {
          const { data } = await api.post('/api/payments/create-checkout');
          window.location.href = data.url;
        } catch {
          toast.error('Could not start checkout');
        }
      } else {
        toast.error(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="dashboard-title mb-2">Add Opportunity</h1>
      <p className="dashboard-subtitle mb-8">Post a new role and attract talented collaborators to your startup.</p>
      <div className="card p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Role Title</label>
            <input required className="input-field" value={form.role_title} onChange={(e) => setForm({ ...form, role_title: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Required Skills (comma separated)</label>
            <input required className="input-field" placeholder="React, Node.js, MongoDB" value={form.required_skills} onChange={(e) => setForm({ ...form, required_skills: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Work Type</label>
              <select className="input-field" value={form.work_type} onChange={(e) => setForm({ ...form, work_type: e.target.value })}>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">Onsite</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Commitment Level</label>
              <select className="input-field" value={form.commitment_level} onChange={(e) => setForm({ ...form, commitment_level: e.target.value })}>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Deadline</label>
            <input type="date" required className="input-field" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
            {loading ? 'Creating...' : 'Post Opportunity'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddOpportunity;
