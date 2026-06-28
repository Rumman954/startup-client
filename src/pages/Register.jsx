import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUp, signIn } from '../lib/auth';
import { useAuth } from '../context/AuthContext';
import { fileToBase64 } from '../lib/uploadImage';
import { checkApiHealth, formatAuthError } from '../lib/authErrors';
import toast from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';
import { FiUser, FiMail, FiImage, FiLock, FiEye, FiEyeOff, FiCheck, FiCheckCircle } from 'react-icons/fi';

const PASSWORD_RULES = [
  { id: 'length', label: '6+ chars', test: (p) => p.length >= 6 },
  { id: 'upper', label: 'Uppercase', test: (p) => /[A-Z]/.test(p) },
  { id: 'lower', label: 'Lowercase', test: (p) => /[a-z]/.test(p) },
];

const validatePassword = (password) => {
  const failed = PASSWORD_RULES.find(({ test }) => !test(password));
  if (!failed) return null;
  if (failed.id === 'length') return 'Password must be at least 6 characters';
  if (failed.id === 'upper') return 'Password must contain an uppercase letter';
  return 'Password must contain a lowercase letter';
};

const IconField = ({ icon: Icon, className = '', ...props }) => (
  <div className="relative">
    <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none" size={18} />
    <input
      className={`w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all ${className}`}
      {...props}
    />
  </div>
);

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', image: '', role: 'collaborator' });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageError, setImageError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [createdAccount, setCreatedAccount] = useState(null);
  const fileInputRef = useRef(null);
  const { issueJwt, syncUser } = useAuth();
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImageError('');
    setForm((f) => ({ ...f, image: URL.createObjectURL(file) }));
  };

  const handleGoDashboard = () => {
    setSuccessOpen(false);
    navigate('/dashboard');
  };

  useEffect(() => {
    if (!successOpen) return undefined;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') handleGoDashboard();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [successOpen, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      setImageError('Profile image is required. Please upload a photo before creating your account.');
      toast.error('Profile image is required');
      return;
    }

    const pwdError = validatePassword(form.password);
    if (pwdError) return toast.error(pwdError);
    if (form.password !== confirmPassword) return toast.error('Passwords do not match');

    setImageError('');

    setLoading(true);
    try {
      const imageBase64 = await fileToBase64(imageFile);

      const result = await signUp.email({
        email: form.email,
        password: form.password,
        name: form.name,
      });
      if (result.error) throw new Error(result.error.message);

      await syncUser({
        name: form.name,
        email: form.email,
        role: form.role,
        imageBase64,
      });
      await issueJwt();

      setCreatedAccount({
        name: form.name,
        email: form.email,
        role: form.role,
        image: form.image,
      });
      setSuccessOpen(true);
    } catch (err) {
      toast.error(formatAuthError(err, 'Registration failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      const online = await checkApiHealth();
      if (!online) {
        toast.error('Backend server is offline. Run: cd server && npm run dev (and configure server/.env first).');
        return;
      }
      sessionStorage.setItem('pendingRole', form.role);
      await signIn.social({
        provider: 'google',
        callbackURL: `${window.location.origin}/dashboard`,
      });
    } catch (err) {
      toast.error(formatAuthError(err, 'Google registration failed. Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in server/.env.'));
    }
  };

  const isBusy = loading;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-50/80 dark:bg-transparent">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-8 sm:p-10">
          <button
            type="button"
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 border border-slate-200 dark:border-slate-600 rounded-xl py-3 px-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors font-medium text-slate-700 dark:text-slate-200"
          >
            <FcGoogle size={22} />
            Continue with Google
          </button>

          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white dark:bg-slate-800 text-slate-400">or</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2.5">I am a...</label>
              <div className="grid grid-cols-2 gap-3">
                {['founder', 'collaborator'].map((role) => {
                  const selected = form.role === role;
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setForm({ ...form, role })}
                      className={`relative py-3 rounded-xl border-2 font-semibold capitalize transition-all ${
                        selected
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300'
                          : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-500'
                      }`}
                    >
                      {role}
                      {selected && (
                        <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
                          <FiCheck className="text-white" size={12} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">Full Name</label>
              <IconField
                icon={FiUser}
                type="text"
                required
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">Email</label>
              <IconField
                icon={FiMail}
                type="email"
                required
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
                Profile Image <span className="text-orange-500">*</span>
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`w-full flex items-center gap-3 pl-4 pr-4 py-3 rounded-xl border font-medium transition-colors ${
                  imageError
                    ? 'border-red-400 dark:border-red-500/50 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300'
                    : imageFile
                    ? 'border-orange-200 dark:border-orange-500/30 bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-500/20'
                    : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-orange-300 dark:hover:border-orange-500/40'
                }`}
              >
                <FiImage size={18} className={imageError ? 'text-red-400 shrink-0' : 'text-orange-400 shrink-0'} />
                <span className="truncate">{imageFile ? imageFile.name : 'Upload Profile Image *'}</span>
              </button>
              {imageError ? (
                <p className="text-xs text-red-500 dark:text-red-400 mt-1.5 font-semibold">{imageError}</p>
              ) : !imageFile ? (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">A profile photo is required to create your account.</p>
              ) : null}
              {form.image && (
                <img
                  src={form.image}
                  alt="Preview"
                  className="mt-3 w-14 h-14 rounded-full object-cover border-2 border-orange-200 dark:border-orange-500/40"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2">
                {PASSWORD_RULES.map(({ id, label, test }) => {
                  const met = test(form.password);
                  return (
                    <span
                      key={id}
                      className={`text-xs font-semibold inline-flex items-center gap-1 transition-colors duration-200 ${
                        met ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {met && <FiCheck size={14} strokeWidth={3} aria-hidden />}
                      {label}
                    </span>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">Confirm Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none" size={18} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isBusy}
              className="w-full bg-orange-700 hover:bg-orange-800 dark:bg-orange-600 dark:hover:bg-orange-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-colors shadow-md shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create Account 🚀'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-7">
            Already have an account?{' '}
            <Link to="/login" className="text-orange-600 dark:text-orange-400 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {successOpen && createdAccount && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleGoDashboard}
            aria-label="Close"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="register-success-title"
            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl p-8 sm:p-10 text-center"
          >
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center ring-1 ring-emerald-100 dark:ring-emerald-500/20">
              <FiCheckCircle className="text-emerald-500" size={36} />
            </div>
            <h2 id="register-success-title" className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
              Account Created!
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              Welcome to <span className="font-semibold text-orange-500">StartUp Labs</span>,{' '}
              <span className="font-semibold text-slate-800 dark:text-slate-200">{createdAccount.name}</span>.
              Your <span className="capitalize font-medium">{createdAccount.role}</span> account is ready.
            </p>
            {createdAccount.image && (
              <img
                src={createdAccount.image}
                alt={createdAccount.name}
                className="w-20 h-20 rounded-full object-cover mx-auto mb-6 ring-4 ring-orange-500/20"
              />
            )}
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{createdAccount.email}</p>
            <button
              type="button"
              onClick={handleGoDashboard}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-colors shadow-md shadow-orange-500/20"
            >
              Go to Dashboard →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
