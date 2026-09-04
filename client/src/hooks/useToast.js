// src/hooks/useToast.js
// Tiny toast queue manager — returns [toasts, showToast, closeToast]

import { useState, useCallback } from 'react';

let _id = 0;

const useToast = (autoDismissMs = 4000) => {
  const [toasts, setToasts] = useState([]);

  const closeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = 'success') => {
      const id = ++_id;
      setToasts((prev) => [...prev, { id, message, type }]);
      if (autoDismissMs > 0) {
        setTimeout(() => closeToast(id), autoDismissMs);
      }
    },
    [autoDismissMs, closeToast]
  );

  return [toasts, showToast, closeToast];
};

export default useToast;
