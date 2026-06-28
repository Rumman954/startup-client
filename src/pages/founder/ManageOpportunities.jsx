import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiBriefcase, FiEdit2, FiPlus, FiSave, FiTrash2 } from 'react-icons/fi';
import api from '../../lib/api';
import { showSuccessToast } from '../../lib/premiumToast';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';

const mapOppToForm = (opp) => ({
  role_title: opp.role_title || '',
  required_skills: Array.isArray(opp.required_skills)
    ? opp.required_skills.join(', ')
    : opp.required_skills || '',
  work_type: opp.work_type || '',
  commitment_level: opp.commitment_level || '',
  deadline: opp.deadline ? new Date(opp.deadline).toISOString().slice(0, 10) : '',
});

const formatLabel = (value) =>
  value
    ? value.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('-')
    : '';

const ManageOpportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  const fetchData = () => {
    setLoading(true);
    api.get('/api/opportunities/founder/mine')
      .then((res) => setOpportunities(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const startEdit = (opp) => {
    setEditing(opp._id);
    setForm(mapOppToForm(opp));
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm({});
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/api/opportunities/${editing}`, {
        role_title: form.role_title,
        required_skills: form.required_skills.split(',').map((s) => s.trim()).filter(Boolean),
        work_type: form.work_type,
        commitment_level: form.commitment_level,
        deadline: form.deadline,
      });
      showSuccessToast('Updated!', 'Opportunity saved successfully.');
      setEditing(null);
      setForm({});
      fetchData();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this opportunity?')) return;
    try {
      await api.delete(`/api/opportunities/${id}`);
      toast.success('Deleted');
      if (editing === id) cancelEdit();
      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="founder-dashboard-page">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Manage Opportunities
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm sm:text-base">
            Edit or remove roles you&apos;ve posted for your startup.
          </p>
        </div>
        <Link
          to="/founder/add-opportunity"
          className="inline-flex items-center justify-center gap-2 shrink-0 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-md shadow-orange-500/20 w-fit"
        >
          <FiPlus size={16} /> Add New
        </Link>
      </div>

      {opportunities.length === 0 ? (
        <div className="empty-state">
          <FiBriefcase className="mx-auto mb-3 text-slate-400" size={28} />
          <p>No opportunities yet. Post your first role to attract collaborators.</p>
          <Link to="/founder/add-opportunity" className="link-accent inline-block mt-3">
            Post your first opportunity →
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {opportunities.map((opp) => (
            <div key={opp._id} className="founder-job-card">
              {editing === opp._id ? (
                <div className="founder-form-card !shadow-none !border-0 !p-0 !bg-transparent max-w-none">
                  <h3 className="founder-form-title mb-6">
                    <FiEdit2 size={18} className="text-violet-600" />
                    Edit Opportunity
                  </h3>

                  <form onSubmit={handleUpdate} className="space-y-6">
                    <div>
                      <label className="founder-form-label">
                        Role Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        className="founder-form-input"
                        placeholder="e.g. Senior React Developer"
                        value={form.role_title}
                        onChange={(e) => setForm({ ...form, role_title: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="founder-form-label">
                        Required Skills <span className="text-red-500">*</span>
                        <span className="font-normal text-slate-500 dark:text-slate-400"> (comma-separated)</span>
                      </label>
                      <input
                        required
                        className="founder-form-input"
                        placeholder="e.g. React, TypeScript, Node.js"
                        value={form.required_skills}
                        onChange={(e) => setForm({ ...form, required_skills: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="founder-form-label">
                          Work Type <span className="text-red-500">*</span>
                        </label>
                        <select
                          required
                          className="founder-form-input founder-form-select"
                          value={form.work_type}
                          onChange={(e) => setForm({ ...form, work_type: e.target.value })}
                        >
                          <option value="">Select type</option>
                          <option value="remote">Remote</option>
                          <option value="hybrid">Hybrid</option>
                          <option value="onsite">Onsite</option>
                        </select>
                      </div>
                      <div>
                        <label className="founder-form-label">
                          Commitment Level <span className="text-red-500">*</span>
                        </label>
                        <select
                          required
                          className="founder-form-input founder-form-select"
                          value={form.commitment_level}
                          onChange={(e) => setForm({ ...form, commitment_level: e.target.value })}
                        >
                          <option value="">Select level</option>
                          <option value="full-time">Full-time</option>
                          <option value="part-time">Part-time</option>
                          <option value="contract">Contract</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="founder-form-label">
                        Application Deadline <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        className="founder-form-input"
                        value={form.deadline}
                        onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-1">
                      <button type="submit" disabled={saving} className="founder-submit-btn sm:flex-1">
                        <FiSave size={18} />
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button type="button" onClick={cancelEdit} className="founder-cancel-btn">
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{opp.role_title}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {(opp.required_skills || []).map((skill) => (
                        <span key={skill} className="skill-chip">{skill}</span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm text-slate-500 dark:text-slate-400">
                      <span className="capitalize">{formatLabel(opp.work_type)}</span>
                      <span className="capitalize">{formatLabel(opp.commitment_level)}</span>
                      <span>Deadline: {new Date(opp.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => startEdit(opp)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm font-semibold text-violet-600 dark:text-violet-400 hover:border-violet-300 dark:hover:border-violet-500/40 transition-colors"
                    >
                      <FiEdit2 size={15} /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(opp._id)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                    >
                      <FiTrash2 size={15} /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageOpportunities;
