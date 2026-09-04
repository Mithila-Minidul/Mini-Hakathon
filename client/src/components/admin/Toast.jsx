// src/components/admin/Toast.jsx
// Reusable toast notification — success or error

const Toast = ({ toasts, onClose }) => {
  if (!toasts || toasts.length === 0) return null;
  return (
    <div className="ab-toast-wrap" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`ab-toast ab-toast--${t.type}`}>
          <span className="ab-toast__icon">{t.type === 'success' ? '✅' : '❌'}</span>
          <span className="ab-toast__msg">{t.message}</span>
          <button
            className="ab-toast__close"
            onClick={() => onClose(t.id)}
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
