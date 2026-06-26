import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiLogOut, FiPhone } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 text-sm font-medium transition-colors ${
      isActive
        ? 'text-orange-500 dark:text-orange-400'
        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
    }`;

  return (
    <nav className="bg-white/95 dark:bg-[#0a0f1a]/95 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200 dark:border-white/5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <Logo className="h-10 max-w-[180px] md:max-w-[200px]" />
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            <NavLink to="/" className={navLinkClass} end>Home</NavLink>
            <NavLink to="/startups" className={navLinkClass}>Startups</NavLink>
            <NavLink to="/opportunities" className={navLinkClass}>Opportunities</NavLink>
            {user ? (
              <>
                <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
                <NavLink to="/profile" className={navLinkClass}>Profile</NavLink>
                <button onClick={handleLogout} className="ml-2 flex items-center gap-1 px-3 py-2 text-sm font-medium text-red-500 dark:text-red-400 hover:text-red-600">
                  <FiLogOut /> Logout
                </button>
              </>
            ) : (
              <NavLink to="/login" className={navLinkClass}>Login</NavLink>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <a href="tel:+8801605357646" className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
              <FiPhone className="text-orange-500" />
              <span className="hidden xl:inline">+8801605357646</span>
            </a>
            <Link
              to={user ? '/dashboard' : '/register'}
              className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold py-2.5 px-6 rounded-full transition-colors"
            >
              Let&apos;s Talk
            </Link>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button className="p-2 text-slate-700 dark:text-white" onClick={() => setOpen(!open)}>
              {open ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0f1a] px-4 py-3 space-y-1">
          <NavLink to="/" className={navLinkClass} end onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink to="/startups" className={navLinkClass} onClick={() => setOpen(false)}>Startups</NavLink>
          <NavLink to="/opportunities" className={navLinkClass} onClick={() => setOpen(false)}>Opportunities</NavLink>
          {user ? (
            <>
              <NavLink to="/dashboard" className={navLinkClass} onClick={() => setOpen(false)}>Dashboard</NavLink>
              <NavLink to="/profile" className={navLinkClass} onClick={() => setOpen(false)}>Profile</NavLink>
              <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-red-500 dark:text-red-400 font-medium">Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass} onClick={() => setOpen(false)}>Login</NavLink>
              <Link to="/register" className="block btn-primary text-center mt-2" onClick={() => setOpen(false)}>Let&apos;s Talk</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
