import { Link } from 'react-router-dom';
import { FiSearch, FiFileText } from 'react-icons/fi';

const CollaboratorOverview = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Collaborator Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/opportunities" className="card p-8 hover:shadow-xl transition-shadow group">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
            <FiSearch className="text-indigo-600" size={22} />
          </div>
          <h3 className="font-bold text-lg">Browse Opportunities</h3>
          <p className="text-slate-500 text-sm mt-2">Find startup roles that match your skills</p>
        </Link>
        <Link to="/collaborator/applications" className="card p-8 hover:shadow-xl transition-shadow group">
          <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-sky-200 transition-colors">
            <FiFileText className="text-sky-600" size={22} />
          </div>
          <h3 className="font-bold text-lg">My Applications</h3>
          <p className="text-slate-500 text-sm mt-2">Track your application status</p>
        </Link>
      </div>
    </div>
  );
};

export default CollaboratorOverview;
