import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signInWithGoogle } from '../lib/auth';
import { useAuth } from '../context/AuthContext';
import { checkApiHealth, formatAuthError } from '../lib/authErrors';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (() => {
    const target = location.state?.from;
    if (!target?.pathname) return '/';
    return `${target.pathname}${target.search || ''}`;
  })();

  useEffect(() => {
    if (location.state?.applyPrompt) {
      toast.error('Please log in to apply for this opportunity.');
    } else if (location.state?.from) {
      toast('Please log in to continue.', { icon: '🔐' });
    }
  }, [location.state?.applyPrompt, location.state?.from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/api/jwt/login', {
        email: form.email,
        password: form.password,
      });
      setUser(data.user);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(formatAuthError(err, 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      const online = await checkApiHealth();
      if (!online) {
        toast.error('Backend server is offline. Run: cd server && npm run dev');
        return;
      }
      await signInWithGoogle(from);
    } catch (err) {
      toast.error(formatAuthError(err, 'Google login failed. Restart the server after updating server/.env.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="section-eyebrow">Account</p>
          <h1 className="section-title text-3xl md:text-4xl">Welcome Back</h1>
          <p className="section-subtitle mt-2">Sign in to your StartUp Labs account</p>
        </div>
        <div className="premium-auth-card p-8 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
              <input type="email" required className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="input-field pr-11"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
            <div className="relative flex justify-center text-sm"><span className="px-2 bg-white dark:bg-slate-800 text-slate-500">Or continue with</span></div>
          </div>
          <button type="button" onClick={handleGoogle} disabled={loading} className="w-full flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-600 rounded-lg py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium text-slate-700 dark:text-slate-200 disabled:opacity-50">
            <FcGoogle size={20} /> {loading ? 'Connecting...' : 'Google'}
          </button>
          <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
            Don&apos;t have an account? <Link to="/register" className="text-orange-500 font-semibold hover:underline">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
