import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { uploadImageFile } from '../lib/uploadImage';
import toast from 'react-hot-toast';
import PageHeader from '../components/PageHeader';

const Profile = () => {
  const { user, fetchUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    image: user?.image || '',
    skills: (user?.skills || []).join(', '),
    bio: user?.bio || '',
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImageFile(file);
      setForm((f) => ({ ...f, image: url }));
      toast.success('Image uploaded!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/api/users/profile', form);
      await fetchUser();
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container-profile">
      <PageHeader eyebrow="Account" title="My Profile" subtitle="Update your profile so founders can learn more about you." />
      <div className="card p-8 sm:p-10">
        <div className="flex items-center gap-5 mb-8 pb-8 border-b border-slate-100 dark:border-slate-800">
          <img
            src={form.image || user?.image || `https://ui-avatars.com/api/?name=${user?.name}`}
            alt=""
            className="w-20 h-20 rounded-full object-cover ring-4 ring-orange-500/15"
          />
          <div>
            <p className="font-bold text-lg text-slate-900 dark:text-white">{user?.name}</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{user?.email}</p>
            <span className="inline-block mt-2 badge-orange capitalize">{user?.role}</span>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Name</label>
            <input type="text" className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Profile Image</label>
            <input type="file" accept="image/*" className="input-field" onChange={handleImageUpload} />
            {uploading && <p className="text-sm text-slate-500 mt-1">Uploading to ImgBB...</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Skills (comma separated)</label>
            <input type="text" className="input-field" placeholder="React, Node.js, Design" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Bio</label>
            <textarea rows={4} className="input-field" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          </div>
          <button type="submit" disabled={loading || uploading} className="btn-primary disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
