import toast from 'react-hot-toast';
import { FiCheckCircle } from 'react-icons/fi';

const toastBase = {
  position: 'top-right',
  duration: 4000,
};

export const showSuccessToast = (title, message) => {
  toast.custom(
    (t) => (
      <div
        className={`premium-toast ${t.visible ? 'premium-toast-visible' : 'premium-toast-hidden'}`}
        role="status"
      >
        <div className="premium-toast-icon-wrap">
          <FiCheckCircle size={16} className="text-white" />
        </div>
        <div className="min-w-0 pr-1">
          <p className="font-semibold text-white text-sm leading-snug">{title}</p>
          {message && (
            <p className="text-slate-300 text-xs mt-0.5 leading-snug">{message}</p>
          )}
        </div>
      </div>
    ),
    toastBase
  );
};

export const showErrorToast = (title, message) => {
  toast.error(message || title, {
    ...toastBase,
    style: {
      background: '#0f172a',
      color: '#f8fafc',
      borderRadius: '12px',
      padding: '14px 18px',
      boxShadow: '0 12px 40px rgba(15, 23, 42, 0.35)',
    },
  });
};
