// src/components/customers/Toast.jsx
// Success / error banner with auto-dismiss

import { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose, duration = 4000 }) => {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [message, onClose, duration]);

  if (!message) return null;

  return (
    <div className={`cm-toast cm-toast--${type}`} role="alert">
      <span>{type === 'success' ? '✅' : '❌'} {message}</span>
      <button className="cm-toast__close" onClick={onClose} aria-label="Dismiss">×</button>
    </div>
  );
};

export default Toast;
