import { Link } from 'react-router-dom';
import { FiSearch, FiFileText } from 'react-icons/fi';

const CollaboratorOverview = () => {
  return (
    <div>
      <h1 className="dashboard-title mb-2">Collaborator Dashboard</h1>
      <p className="dashboard-subtitle mb-8">Discover roles and track your applications in one place.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/opportunities" className="dashboard-action-card group">
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-500/15 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <FiSearch className="text-orange-600 dark:text-orange-400" size={22} />
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors">Browse Opportunities</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Find startup roles that match your skills</p>
        </Link>
        <Link to="/collaborator/applications" className="dashboard-action-card group">
          <div className="w-12 h-12 bg-sky-100 dark:bg-sky-500/15 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <FiFileText className="text-sky-600 dark:text-sky-400" size={22} />
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors">My Applications</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Track your application status</p>
        </Link>
      </div>
    </div>
  );
};

export default CollaboratorOverview;
