import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUp, signIn } from '../lib/auth';
import { useAuth } from '../context/AuthContext';
import { uploadImageFile } from '../lib/uploadImage';
import toast from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';
import { FiUser, FiMail, FiImage, FiLock, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi';

const validatePassword = (password) => {
  if (password.length < 6) return 'Password must be at least 6 characters';
  if (!/[A-Z]/.test(password)) return 'Password must contain an uppercase letter';
  if (!/[a-z]/.test(password)) return 'Password must contain a lowercase letter';
  return null;
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { issueJwt, syncUser } = useAuth();
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setForm((f) => ({ ...f, image: URL.createObjectURL(file) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const pwdError = validatePassword(form.password);
    if (pwdError) return toast.error(pwdError);
    if (form.password !== confirmPassword) return toast.error('Passwords do not match');
    if (!imageFile) return toast.error('Profile image is required');

    setLoading(true);
    try {
      const result = await signUp.email({
        email: form.email,
        password: form.password,
        name: form.name,
      });
      if (result.error) throw new Error(result.error.message);

      await syncUser({ name: form.name, email: form.email, role: form.role });
      await issueJwt();

      setUploading(true);
      const imageUrl = await uploadImageFile(imageFile);
      await syncUser({ name: form.name, email: form.email, image: imageUrl, role: form.role });
      await issueJwt();

      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      sessionStorage.setItem('pendingRole', form.role);
      await signIn.social({
        provider: 'google',
        callbackURL: `${window.location.origin}/dashboard`,
      });
    } catch (err) {
      toast.error(err.message || 'Google registration failed');
    }
  };

  const isBusy = loading || uploading;

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
                required
                className="hidden"
                onChange={handleImageChange}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`w-full flex items-center gap-3 pl-4 pr-4 py-3 rounded-xl border font-medium transition-colors ${
                  imageFile
                    ? 'border-orange-200 dark:border-orange-500/30 bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-500/20'
                    : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-orange-300 dark:hover:border-orange-500/40'
                }`}
              >
                <FiImage size={18} className="text-orange-400 shrink-0" />
                <span className="truncate">{imageFile ? imageFile.name : 'Upload Profile Image *'}</span>
              </button>
              {!imageFile && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">A profile photo is required to create your account.</p>
              )}
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
              <p className="text-xs text-slate-400 mt-1.5">Min 6 chars, 1 uppercase, 1 lowercase</p>
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
              {uploading ? 'Uploading image...' : loading ? 'Creating account...' : 'Create Account 🚀'}
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
    </div>
  );
};

export default Register;
