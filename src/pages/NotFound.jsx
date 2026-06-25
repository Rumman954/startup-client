import { Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold text-indigo-100 mb-4">404</div>
        <div className="w-48 h-48 mx-auto mb-6 bg-indigo-50 rounded-full flex items-center justify-center">
          <svg className="w-32 h-32 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Page Not Found</h1>
        <p className="text-slate-600 mb-8">The page you are looking for does not exist or has been moved.</p>
        <Link to="/" className="btn-primary inline-flex items-center gap-2">
          <FiHome /> Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
