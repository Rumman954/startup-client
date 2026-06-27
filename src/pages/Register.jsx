import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUp, signIn } from '../lib/auth';
import { useAuth } from '../context/AuthContext';
import { uploadImageFile } from '../lib/uploadImage';
import toast from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';

const validatePassword = (password) => {
  if (password.length < 6) return 'Password must be at least 6 characters';
  if (!/[A-Z]/.test(password)) return 'Password must contain an uppercase letter';
  if (!/[a-z]/.test(password)) return 'Password must contain a lowercase letter';
  return null;
};

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', image: '', role: 'collaborator' });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
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

      if (imageFile) {
        setUploading(true);
        const imageUrl = await uploadImageFile(imageFile);
        await syncUser({ name: form.name, email: form.email, image: imageUrl, role: form.role });
        await issueJwt();
      }

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
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Profile Image</label>
              <input type="file" accept="image/*" className="input-field" onChange={handleImageChange} />
              {form.image && (
                <img src={form.image} alt="Preview" className="mt-2 w-16 h-16 rounded-full object-cover border border-slate-200 dark:border-slate-600" />
              )}
              <p className="text-xs text-slate-500 mt-1">Upload a photo (stored via ImgBB)</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
              <input type="password" required className="input-field" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              <p className="text-xs text-slate-500 mt-1">Min 6 chars, 1 uppercase, 1 lowercase</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Role</label>
              <div className="grid grid-cols-2 gap-3">
                {['founder', 'collaborator'].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setForm({ ...form, role })}
                    className={`py-2.5 rounded-lg border-2 font-medium capitalize transition-colors ${
                      form.role === role
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400'
                        : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" disabled={isBusy} className="btn-primary w-full disabled:opacity-50">
              {uploading ? 'Uploading image...' : loading ? 'Creating account...' : 'Register'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-600" /></div>
            <div className="relative flex justify-center text-sm"><span className="px-2 bg-white dark:bg-slate-800 text-slate-500">Or continue with</span></div>
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-600 rounded-lg py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium text-slate-700 dark:text-slate-200"
          >
            <FcGoogle size={20} /> Google
          </button>

          <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
            Already have an account? <Link to="/login" className="text-orange-500 font-semibold hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
