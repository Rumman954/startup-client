import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`p-2.5 rounded-full transition-colors ${
        isDark
          ? 'text-slate-200 hover:text-white hover:bg-white/10'
          : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
      } ${className}`}
    >
      {isDark ? <FiSun size={22} /> : <FiMoon size={22} />}
    </button>
  );
};

export default ThemeToggle;
