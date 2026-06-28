import { NavLink, Outlet, Link } from 'react-router-dom';
import { FiGrid, FiBriefcase, FiPlus, FiList, FiUsers, FiUser, FiDollarSign, FiHome } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../ThemeToggle';
import Logo from '../Logo';

const DashboardLayout = ({ type }) => {
  const { user } = useAuth();

  const founderLinks = [
    { to: '/founder/dashboard', label: 'Overview', icon: FiGrid },
    { to: '/founder/my-startup', label: 'My Startup', icon: FiBriefcase },
    { to: '/founder/add-opportunity', label: 'Add Opportunity', icon: FiPlus },
    { to: '/founder/opportunities', label: 'Manage Opportunities', icon: FiList },
    { to: '/founder/applications', label: 'Applications', icon: FiUsers },
    { to: '/profile', label: 'Profile', icon: FiUser },
  ];

  const collaboratorLinks = [
    { to: '/collaborator/dashboard', label: 'Overview', icon: FiGrid },
    { to: '/collaborator/applications', label: 'My Applications', icon: FiList },
    { to: '/profile', label: 'Profile', icon: FiUser },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Overview', icon: FiGrid },
    { to: '/admin/users', label: 'Manage Users', icon: FiUsers },
    { to: '/admin/startups', label: 'Manage Startups', icon: FiBriefcase },
    { to: '/admin/transactions', label: 'Transactions', icon: FiDollarSign },
  ];

  const links = type === 'founder' ? founderLinks : type === 'admin' ? adminLinks : collaboratorLinks;
  const useVioletTheme = type === 'founder' || type === 'admin';

  const violetNavClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
      isActive
        ? 'bg-violet-100 dark:bg-violet-500/15 text-violet-700 dark:text-violet-300'
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-violet-600 dark:hover:text-violet-400'
    }`;

  const defaultNavClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
      isActive
        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/25'
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-orange-500 dark:hover:text-orange-400'
    }`;

  const navClass = useVioletTheme ? violetNavClass : defaultNavClass;
  const userAvatar = user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=8b5cf6&color=fff`;

  return (
    <div className={`dashboard-shell ${useVioletTheme ? 'founder-dashboard-shell' : ''}`}>
      <aside className={useVioletTheme ? 'founder-sidebar' : 'premium-sidebar'}>
        {useVioletTheme ? (
          <>
            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
              <Link to="/" className="inline-flex">
                <Logo className="h-10 max-w-[180px]" />
              </Link>
            </div>
            <div className="p-5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <img
                  src={userAvatar}
                  alt=""
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-violet-200 dark:ring-violet-500/30"
                />
                <div className="min-w-0">
                  <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{user?.name}</p>
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-md text-xs font-semibold capitalize bg-violet-100 dark:bg-violet-500/15 text-violet-700 dark:text-violet-300">
                    {user?.role}
                  </span>
                </div>
              </div>
            </div>
            <nav className="p-4 space-y-1 flex-1">
              {links.map(({ to, label, icon: Icon }) => (
                <NavLink key={to} to={to} end={to.endsWith('dashboard')} className={navClass}>
                  <Icon size={18} /> {label}
                </NavLink>
              ))}
            </nav>
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <NavLink
                to="/"
                className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
              >
                <FiHome size={16} /> Site
              </NavLink>
              <ThemeToggle />
            </div>
          </>
        ) : (
          <>
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={userAvatar}
                  alt=""
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-orange-500/20"
                />
                <div className="min-w-0">
                  <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{user?.name}</p>
                  <p className="text-xs text-orange-500 capitalize font-medium">{user?.role}</p>
                </div>
              </div>
              <ThemeToggle />
            </div>
            <nav className="p-4 space-y-1.5">
              {links.map(({ to, label, icon: Icon }) => (
                <NavLink key={to} to={to} end={to.endsWith('dashboard')} className={navClass}>
                  <Icon size={18} /> {label}
                </NavLink>
              ))}
              <NavLink
                to="/"
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-orange-500 mt-4 transition-all"
              >
                <FiHome size={18} /> Back to Site
              </NavLink>
            </nav>
          </>
        )}
      </aside>

      <div className="flex-1 lg:ml-64 min-h-screen">
        <div className="lg:hidden bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 p-4 flex items-center gap-3 sticky top-0 z-30">
          <div className="flex-1 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {links.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to.endsWith('dashboard')}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? useVioletTheme
                          ? 'bg-violet-100 dark:bg-violet-500/15 text-violet-700 dark:text-violet-300'
                          : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
          <ThemeToggle />
        </div>
        <div className={`p-4 md:p-8 lg:p-10 text-slate-900 dark:text-slate-100 ${useVioletTheme ? 'founder-dashboard-main founder-dashboard-page' : ''}`}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
