// signup/hooks.js
import { useState } from 'react';
import { registerUser } from './api';

export const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const signup = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await registerUser(formData);
      return result;
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { signup, loading, error };
};
