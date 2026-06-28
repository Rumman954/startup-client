import { Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 page-shell">
      <div className="text-center max-w-md">
        <div className="text-8xl sm:text-9xl font-extrabold bg-gradient-to-br from-orange-200 to-orange-400 dark:from-orange-500/30 dark:to-orange-600/20 bg-clip-text text-transparent mb-4">404</div>
        <div className="w-48 h-48 mx-auto mb-6 bg-orange-50 dark:bg-orange-500/10 rounded-full flex items-center justify-center ring-1 ring-orange-100 dark:ring-orange-500/20">
          <svg className="w-32 h-32 text-orange-300 dark:text-orange-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-3">Page Not Found</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">The page you are looking for does not exist or has been moved.</p>
        <Link to="/" className="btn-primary inline-flex items-center gap-2">
          <FiHome /> Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
