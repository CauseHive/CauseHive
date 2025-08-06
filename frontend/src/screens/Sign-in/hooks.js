// Placeholder for Signup screen custom hooks

import { useState } from 'react';
import { signIn } from './api';

export const useSignIn = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const signInUser = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const data = await signIn(credentials);
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message || 'Sign-in failed');
      setLoading(false);
      throw err;
    }
  };

  return { signInUser, loading, error };
};
