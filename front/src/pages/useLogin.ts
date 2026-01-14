// useLogin.ts
import { useState } from 'react';
import { loginUser } from '../api';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (data: any) => {
    try {
      setLoading(true);
      await loginUser(data);
      setError('');
    } catch (err) {
      setError('Échec de connexion');
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, submit };
};
