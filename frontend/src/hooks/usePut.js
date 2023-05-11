import { useState, useCallback } from 'react';
import axios from 'axios';

export default function usePut(url, dependencies = [], options = {}) {
  const [isLoading, setLoading] = useState(false);

  const put = useCallback(
    async (data) => {
      setLoading(true);
      try {
        if (!dependencies[0] || !url || (Array.isArray(dependencies) && dependencies.slice(1).some(dep => !dep))) {
          return;
        }
        const response = await axios.put(url, data, options);
        setLoading(false);
        return response;
      } catch (error) {
        setLoading(false);
        throw error;
      }
    },
    [url, options].concat(dependencies)
  );

  return { put, isLoading };
}
