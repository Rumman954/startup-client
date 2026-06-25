import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, fetchUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    image: user?.image || '',
    skills: (user?.skills || []).join(', '),
    bio: user?.bio || '',
  });
  const [loading, setLoading] = useState(false);

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
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="section-title mb-8">My Profile</h1>
      <div className="card p-8">
        <div className="flex items-center gap-4 mb-8">
          <img src={user?.image || `https://ui-avatars.com/api/?name=${user?.name}`} alt="" className="w-20 h-20 rounded-full object-cover" />
          <div>
            <p className="font-bold text-lg">{user?.name}</p>
            <p className="text-slate-500 text-sm">{user?.email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs rounded-full capitalize">{user?.role}</span>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input type="text" className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Image URL</label>
            <input type="url" className="input-field" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Skills (comma separated)</label>
            <input type="text" className="input-field" placeholder="React, Node.js, Design" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Bio</label>
            <textarea rows={4} className="input-field" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
