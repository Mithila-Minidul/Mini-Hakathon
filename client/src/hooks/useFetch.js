// src/hooks/useFetch.js
// Generic data-fetching hook with loading / error / data states

import { useState, useEffect, useCallback } from 'react';

/**
 * @param {Function} fetchFn  - An async function that returns data (e.g. from api.js)
 * @param {Array}    deps     - Re-run when these dependencies change
 * @returns {{ data, loading, error, refetch }}
 */
const useFetch = (fetchFn, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    execute();
  }, [execute]);

  return { data, loading, error, refetch: execute };
};

export default useFetch;
