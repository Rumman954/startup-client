import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUp } from '../lib/auth';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const validatePassword = (password) => {
  if (password.length < 6) return 'Password must be at least 6 characters';
  if (!/[A-Z]/.test(password)) return 'Password must contain an uppercase letter';
  if (!/[a-z]/.test(password)) return 'Password must contain a lowercase letter';
  return null;
};

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', image: '', role: 'collaborator' });
  const [loading, setLoading] = useState(false);
  const { issueJwt, syncUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const pwdError = validatePassword(form.password);
    if (pwdError) return toast.error(pwdError);

    setLoading(true);
    try {
      const result = await signUp.email({
        email: form.email,
        password: form.password,
        name: form.name,
        image: form.image || undefined,
      });
      if (result.error) throw new Error(result.error.message);

      await syncUser({ name: form.name, email: form.email, image: form.image, role: form.role });
      await issueJwt();
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Create Account</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Join StartUp Labs today</p>
        </div>
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
              <input type="text" required className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
              <input type="email" required className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Image URL</label>
              <input type="url" className="input-field" placeholder="https://..." value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
              <input type="password" required className="input-field" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              <p className="text-xs text-slate-500 mt-1">Min 6 chars, 1 uppercase, 1 lowercase</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
              <div className="grid grid-cols-2 gap-3">
                {['founder', 'collaborator'].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setForm({ ...form, role })}
                    className={`py-2.5 rounded-lg border-2 font-medium capitalize transition-colors ${
                      form.role === role ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
              {loading ? 'Creating account...' : 'Register'}
            </button>
          </form>
          <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
            Already have an account? <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
