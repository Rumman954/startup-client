import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiPlus, FiBriefcase, FiCalendar, FiImage, FiSave } from 'react-icons/fi';
import api from '../../lib/api';
import { uploadImageFile } from '../../lib/uploadImage';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';

const statusClass = (status) => {
  if (status === 'approved') return 'founder-badge-green';
  if (status === 'removed') return 'founder-badge-red';
  return 'founder-badge-amber';
};

const MyStartup = () => {
  const [startup, setStartup] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    startup_name: '', logo: '', industry: '', description: '', funding_stage: '', team_size_needed: 5,
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const logoInputRef = useRef(null);

  const fetchData = async () => {
    try {
      const [startupRes, oppsRes] = await Promise.all([
        api.get('/api/startups/founder/mine'),
        api.get('/api/opportunities/founder/mine').catch(() => ({ data: { data: [] } })),
      ]);

      if (startupRes.data.data) {
        setStartup(startupRes.data.data);
        setForm({
          startup_name: startupRes.data.data.startup_name,
          logo: startupRes.data.data.logo,
          industry: startupRes.data.data.industry,
          description: startupRes.data.data.description,
          funding_stage: startupRes.data.data.funding_stage,
          team_size_needed: startupRes.data.data.team_size_needed || 5,
        });
      }
      setOpportunities(oppsRes.data.data || []);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImageFile(file);
      setForm((f) => ({ ...f, logo: url }));
      toast.success('Logo uploaded!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (startup) {
        const { data } = await api.put(`/api/startups/${startup._id}`, form);
        setStartup(data.data);
        toast.success('Startup updated!');
      } else {
        const { data } = await api.post('/api/startups', form);
        setStartup(data.data);
        toast.success('Startup created!');
      }
      setIsEditing(false);
      fetchData();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete your startup profile?')) return;
    try {
      await api.delete(`/api/startups/${startup._id}`);
      setStartup(null);
      setIsEditing(false);
      setForm({ startup_name: '', logo: '', industry: '', description: '', funding_stage: '', team_size_needed: 5 });
      toast.success('Startup deleted');
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <LoadingSpinner />;

  const showCreateForm = !startup || isEditing;

  return (
    <div className="founder-dashboard-page">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            My Startup
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm sm:text-base">
            Create and manage your startup profile.
          </p>
        </div>
        {startup && !isEditing && (
          <div className="flex gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:border-violet-300 dark:hover:border-violet-500/40 transition-colors"
            >
              <FiEdit2 size={16} /> Edit
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
            >
              <FiTrash2 size={16} /> Delete
            </button>
          </div>
        )}
      </div>

      {showCreateForm ? (
        <div className="founder-form-wrap">
          <div className="founder-form-card">
            <h2 className="founder-form-title">
              <FiPlus size={20} className="text-violet-600" />
              {startup ? 'Edit Startup' : 'Create Startup'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="founder-form-label">
                  Startup Name <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  className="founder-form-input"
                  placeholder="e.g. TechNova"
                  value={form.startup_name}
                  onChange={(e) => setForm({ ...form, startup_name: e.target.value })}
                />
              </div>

              <div>
                <label className="founder-form-label">Logo Image</label>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <div className="flex items-center gap-4">
                  <div className="founder-logo-preview">
                    {form.logo ? (
                      <img src={form.logo} alt="" className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <FiImage size={22} className="text-violet-400" />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={uploading}
                    className="founder-upload-btn flex-1"
                  >
                    {uploading ? 'Uploading...' : 'Upload Logo'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="founder-form-label">
                    Industry <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    className="founder-form-input founder-form-select"
                    value={form.industry}
                    onChange={(e) => setForm({ ...form, industry: e.target.value })}
                  >
                    <option value="">Select industry</option>
                    {['Technology', 'Healthcare', 'Finance', 'Education', 'E-commerce', 'AI/ML', 'Other'].map((i) => (
                      <option key={i} value={i}>{i}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="founder-form-label">
                    Funding Stage <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    className="founder-form-input founder-form-select"
                    value={form.funding_stage}
                    onChange={(e) => setForm({ ...form, funding_stage: e.target.value })}
                  >
                    <option value="">Select stage</option>
                    {['Pre-seed', 'Seed', 'Series A', 'Series B', 'Bootstrapped'].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="founder-form-label">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  className="founder-form-input founder-form-textarea"
                  placeholder="Describe your startup, mission, and what you're building..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div>
                <label className="founder-form-label">Team Size Needed</label>
                <input
                  type="number"
                  min={1}
                  className="founder-form-input"
                  value={form.team_size_needed}
                  onChange={(e) => setForm({ ...form, team_size_needed: parseInt(e.target.value) || 1 })}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button type="submit" disabled={saving || uploading} className="founder-submit-btn sm:flex-1">
                  <FiSave size={18} />
                  {saving ? 'Saving...' : startup ? 'Save Changes' : 'Create Startup'}
                </button>
                {startup && (
                  <button type="button" onClick={() => setIsEditing(false)} className="founder-cancel-btn">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      ) : (
        <>
          <div className="founder-startup-card mb-8">
            <div className="flex flex-col sm:flex-row gap-5 sm:gap-6">
              <div className="shrink-0">
                <img
                  src={startup.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(startup.startup_name)}&size=128&background=8b5cf6&color=fff`}
                  alt=""
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover bg-gradient-to-br from-violet-100 to-sky-100 dark:from-violet-500/20 dark:to-sky-500/20 ring-1 ring-slate-200 dark:ring-slate-700"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                    {startup.startup_name}
                  </h2>
                  <span className="founder-badge-violet">{startup.industry}</span>
                  <span className="founder-badge-muted">{startup.funding_stage}</span>
                  <span className={statusClass(startup.status)}>{startup.status}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                  {startup.description}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
                  Team size needed: <span className="font-semibold text-slate-700 dark:text-slate-200">{startup.team_size_needed || 5}</span>
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Posted Jobs</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Opportunities you&apos;ve uploaded for collaborators to apply.
                </p>
              </div>
              <Link
                to="/founder/add-opportunity"
                className="inline-flex items-center justify-center gap-2 shrink-0 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-md shadow-orange-500/20"
              >
                <FiPlus size={16} /> Add Job
              </Link>
            </div>

            {opportunities.length === 0 ? (
              <div className="empty-state">
                <FiBriefcase className="mx-auto mb-3 text-slate-400" size={28} />
                <p>No jobs posted yet.</p>
                <Link to="/founder/add-opportunity" className="link-accent inline-block mt-3">Post your first opportunity →</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {opportunities.map((opp) => (
                  <div key={opp._id} className="founder-job-card">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-lg text-slate-900 dark:text-white">{opp.role_title}</h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {(opp.required_skills || []).slice(0, 4).map((skill) => (
                            <span key={skill} className="skill-chip">{skill}</span>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm text-slate-500 dark:text-slate-400">
                          <span className="capitalize">{opp.work_type}</span>
                          <span className="capitalize">{opp.commitment_level}</span>
                          <span className="inline-flex items-center gap-1">
                            <FiCalendar size={14} />
                            Deadline: {new Date(opp.deadline).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Link
                        to="/founder/opportunities"
                        className="link-accent shrink-0 text-sm"
                      >
                        Manage →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MyStartup;
