import { useAuthStore } from '@/features/auth/store/authStore';
import { useState } from 'react';

export function useAuthViewModel() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const isSigningIn = useAuthStore((s) => s.isSigningIn);
  const signInError = useAuthStore((s) => s.signInError);
  const signInAction = useAuthStore((s) => s.signIn);

  const canSubmit = email.trim().length > 3 && password.length > 0 && !isSigningIn;

  return {
    email,
    password,
    setEmail,
    setPassword,
    isSigningIn,
    signInError,
    canSubmit,
    submit: () => signInAction(email, password),
  };
}
