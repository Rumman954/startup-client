import { NavLink, Outlet } from 'react-router-dom';
import { FiGrid, FiBriefcase, FiPlus, FiList, FiUsers, FiUser, FiDollarSign, FiHome } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

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
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:block fixed h-full">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <img src={user?.image || `https://ui-avatars.com/api/?name=${user?.name}`} alt="" className="w-10 h-10 rounded-full object-cover" />
            <div>
              <p className="font-semibold text-sm text-slate-900 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
        <nav className="p-4 space-y-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to.endsWith('dashboard')}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              <Icon size={18} /> {label}
            </NavLink>
          ))}
          <NavLink to="/" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 mt-4">
            <FiHome size={18} /> Back to Site
          </NavLink>
        </nav>
      </aside>

      <div className="flex-1 lg:ml-64">
        <div className="lg:hidden bg-white border-b border-slate-200 p-4 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {links.map(({ to, label }) => (
              <NavLink key={to} to={to} end={to.endsWith('dashboard')} className={({ isActive }) =>
                `px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`
              }>
                {label}
              </NavLink>
            ))}
          </div>
        </div>
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
