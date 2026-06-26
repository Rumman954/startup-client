import { NavLink, Outlet } from 'react-router-dom';
import { FiGrid, FiBriefcase, FiPlus, FiList, FiUsers, FiUser, FiDollarSign, FiHome } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../ThemeToggle';

const DashboardLayout = ({ type }) => {
  const { user } = useAuth();

  const founderLinks = [
    { to: '/founder/dashboard', label: 'Overview', icon: FiGrid },
    { to: '/founder/my-startup', label: 'My Startup', icon: FiBriefcase },
    { to: '/founder/add-opportunity', label: 'Add Opportunity', icon: FiPlus },
    { to: '/founder/opportunities', label: 'Manage Opportunities', icon: FiList },
    { to: '/founder/applications', label: 'Applications', icon: FiUsers },
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1a] flex transition-colors duration-300">
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden lg:block fixed h-full">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <img src={user?.image || `https://ui-avatars.com/api/?name=${user?.name}`} alt="" className="w-10 h-10 rounded-full object-cover" />
            <div className="min-w-0">
              <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.role}</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
        <nav className="p-4 space-y-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to.endsWith('dashboard')}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`
              }
            >
              <Icon size={18} /> {label}
            </NavLink>
          ))}
          <NavLink to="/" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 mt-4">
            <FiHome size={18} /> Back to Site
          </NavLink>
        </nav>
      </aside>

      <div className="flex-1 lg:ml-64">
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex items-center gap-3">
          <div className="flex-1 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {links.map(({ to, label }) => (
                <NavLink key={to} to={to} end={to.endsWith('dashboard')} className={({ isActive }) =>
                  `px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                    isActive
                      ? 'bg-orange-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`
                }>
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
          <ThemeToggle />
        </div>
        <div className="p-4 md:p-8 text-slate-900 dark:text-slate-100">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
