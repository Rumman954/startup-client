import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { uploadImageFile } from '../../lib/uploadImage';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';

const MyStartup = () => {
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    startup_name: '', logo: '', industry: '', description: '', funding_stage: '', team_size_needed: 5,
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    api.get('/api/startups/founder/mine')
      .then((res) => {
        if (res.data.data) {
          setStartup(res.data.data);
          setForm({
            startup_name: res.data.data.startup_name,
            logo: res.data.data.logo,
            industry: res.data.data.industry,
            description: res.data.data.description,
            funding_stage: res.data.data.funding_stage,
            team_size_needed: res.data.data.team_size_needed || 5,
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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
      setForm({ startup_name: '', logo: '', industry: '', description: '', funding_stage: '', team_size_needed: 5 });
      toast.success('Startup deleted');
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">{startup ? 'Manage Startup' : 'Create Startup'}</h1>
      <div className="card p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Startup Name</label>
            <input required className="input-field" value={form.startup_name} onChange={(e) => setForm({ ...form, startup_name: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Logo</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="input-field" />
            {uploading && <p className="text-sm text-slate-500 mt-1">Uploading...</p>}
            {form.logo && <img src={form.logo} alt="" className="w-20 h-20 mt-2 rounded-lg object-contain" />}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Industry</label>
            <select required className="input-field" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })}>
              <option value="">Select Industry</option>
              {['Technology', 'Healthcare', 'Finance', 'Education', 'E-commerce', 'Other'].map((i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea required rows={4} className="input-field" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Funding Stage</label>
            <select required className="input-field" value={form.funding_stage} onChange={(e) => setForm({ ...form, funding_stage: e.target.value })}>
              <option value="">Select Stage</option>
              {['Pre-seed', 'Seed', 'Series A', 'Series B', 'Bootstrapped'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Team Size Needed</label>
            <input type="number" min={1} className="input-field" value={form.team_size_needed} onChange={(e) => setForm({ ...form, team_size_needed: parseInt(e.target.value) })} />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
              {saving ? 'Saving...' : startup ? 'Update Startup' : 'Create Startup'}
            </button>
            {startup && (
              <button type="button" onClick={handleDelete} className="btn-danger">Delete</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyStartup;
