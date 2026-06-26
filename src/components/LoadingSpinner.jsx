const LoadingSpinner = ({ fullScreen = false, message = 'Loading...' }) => {
  const wrapper = fullScreen
    ? 'fixed inset-0 flex flex-col items-center justify-center bg-white/90 dark:bg-[#0a0f1a]/90 z-50'
    : 'flex flex-col items-center justify-center py-20';

  return (
    <div className={wrapper}>
      <div className="relative">
        <div className="w-16 h-16 border-4 border-orange-200 rounded-full animate-spin border-t-orange-500" />
      </div>
      <p className="mt-4 text-slate-600 dark:text-slate-400 font-medium">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
