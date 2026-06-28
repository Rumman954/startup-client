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
      <h1 className="dashboard-title mb-8">Manage Users</h1>
      <div className="premium-table-wrap">
        <table className="premium-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className="font-semibold text-slate-900 dark:text-white">{user.name}</td>
                <td className="text-slate-600 dark:text-slate-400">{user.email}</td>
                <td className="capitalize text-slate-700 dark:text-slate-300">{user.role}</td>
                <td>
                  <span className={user.isBlocked ? 'status-rejected' : 'status-accepted'}>
                    {user.isBlocked ? 'Blocked' : 'Active'}
                  </span>
                </td>
                <td>
                  {user.role !== 'admin' && (
                    user.isBlocked ? (
                      <button onClick={() => toggleBlock(user._id, false)} className="text-emerald-600 dark:text-emerald-400 text-sm font-semibold hover:underline">Unblock</button>
                    ) : (
                      <button onClick={() => toggleBlock(user._id, true)} className="text-red-500 text-sm font-semibold hover:underline">Block</button>
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
