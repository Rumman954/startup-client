import { useEffect, useState } from 'react';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    api.get('/api/admin/users')
      .then((res) => setUsers(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleBlock = async (id, block) => {
    try {
      await api.patch(`/api/admin/users/${id}/${block ? 'block' : 'unblock'}`);
      toast.success(block ? 'User blocked' : 'User unblocked');
      fetchUsers();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Manage Users</h1>
      <div className="overflow-x-auto card">
        <table className="w-full">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="text-left p-4 text-sm font-semibold">Name</th>
              <th className="text-left p-4 text-sm font-semibold">Email</th>
              <th className="text-left p-4 text-sm font-semibold">Role</th>
              <th className="text-left p-4 text-sm font-semibold">Status</th>
              <th className="text-left p-4 text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b last:border-0">
                <td className="p-4 text-sm font-medium">{user.name}</td>
                <td className="p-4 text-sm text-slate-600">{user.email}</td>
                <td className="p-4 text-sm capitalize">{user.role}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${user.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {user.isBlocked ? 'Blocked' : 'Active'}
                  </span>
                </td>
                <td className="p-4">
                  {user.role !== 'admin' && (
                    user.isBlocked ? (
                      <button onClick={() => toggleBlock(user._id, false)} className="text-green-600 text-sm font-medium">Unblock</button>
                    ) : (
                      <button onClick={() => toggleBlock(user._id, true)} className="text-red-600 text-sm font-medium">Block</button>
                    )
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
