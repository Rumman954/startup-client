import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';

const ManageOpportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  const fetchData = () => {
    api.get('/api/opportunities/founder/mine')
      .then((res) => setOpportunities(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/opportunities/${editing}`, form);
      toast.success('Updated!');
      setEditing(null);
      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this opportunity?')) return;
    try {
      await api.delete(`/api/opportunities/${id}`);
      toast.success('Deleted');
      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Manage Opportunities</h1>
        <Link to="/founder/add-opportunity" className="btn-primary text-sm">Add New</Link>
      </div>
      {opportunities.length === 0 ? (
        <p className="text-slate-500">No opportunities yet.</p>
      ) : (
        <div className="space-y-4">
          {opportunities.map((opp) => (
            <div key={opp._id} className="card p-6">
              {editing === opp._id ? (
                <form onSubmit={handleUpdate} className="space-y-3">
                  <input className="input-field" value={form.role_title} onChange={(e) => setForm({ ...form, role_title: e.target.value })} />
                  <input className="input-field" value={form.required_skills?.join?.(', ') || form.required_skills} onChange={(e) => setForm({ ...form, required_skills: e.target.value.split(',').map((s) => s.trim()) })} />
                  <div className="flex gap-2">
                    <button type="submit" className="btn-primary text-sm">Save</button>
                    <button type="button" onClick={() => setEditing(null)} className="btn-secondary text-sm">Cancel</button>
                  </div>
                </form>
              ) : (
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{opp.role_title}</h3>
                    <p className="text-sm text-slate-500 capitalize">{opp.work_type} · {opp.commitment_level}</p>
                    <p className="text-sm text-slate-500">Deadline: {new Date(opp.deadline).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditing(opp._id); setForm({ ...opp, required_skills: opp.required_skills }); }} className="text-indigo-600 text-sm font-medium">Edit</button>
                    <button onClick={() => handleDelete(opp._id)} className="text-red-600 text-sm font-medium">Delete</button>
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
