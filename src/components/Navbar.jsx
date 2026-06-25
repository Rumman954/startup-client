import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

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
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive ? 'text-indigo-600 bg-indigo-50' : 'text-slate-700 hover:text-indigo-600 hover:bg-slate-100'
    }`;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">SF</span>
            </div>
            <span className="font-bold text-xl text-slate-900">StartupForge</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/" className={navLinkClass} end>Home</NavLink>
            <NavLink to="/startups" className={navLinkClass}>Browse Startups</NavLink>
            <NavLink to="/opportunities" className={navLinkClass}>Browse Opportunities</NavLink>
            {user ? (
              <>
                <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
                <NavLink to="/profile" className={navLinkClass}>Profile</NavLink>
                <button onClick={handleLogout} className="ml-2 flex items-center gap-1 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg">
                  <FiLogOut /> Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="ml-2 btn-primary text-sm py-2 px-4">Login</Link>
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
            {open ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1">
          <NavLink to="/" className={navLinkClass} end onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink to="/startups" className={navLinkClass} onClick={() => setOpen(false)}>Browse Startups</NavLink>
          <NavLink to="/opportunities" className={navLinkClass} onClick={() => setOpen(false)}>Browse Opportunities</NavLink>
          {user ? (
            <>
              <NavLink to="/dashboard" className={navLinkClass} onClick={() => setOpen(false)}>Dashboard</NavLink>
              <NavLink to="/profile" className={navLinkClass} onClick={() => setOpen(false)}>Profile</NavLink>
              <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-red-600 font-medium">Logout</button>
            </>
          ) : (
            <Link to="/login" className="block btn-primary text-center mt-2" onClick={() => setOpen(false)}>Login</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
