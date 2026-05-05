import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/core/models';
import { authRepository } from '@/core/repositories';
import { createJSONStorage } from '@/core/storage/zustandStorage';

type AuthState = {
  user: User | null;
  balanceCents: number;
  hydrated: boolean;
  isSigningIn: boolean;
  signInError: string | null;
};

type AuthActions = {
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
  awardCents: (cents: number) => void;
  setHydrated: () => void;
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      user: null,
      balanceCents: 0,
      hydrated: false,
      isSigningIn: false,
      signInError: null,

      signIn: async (email, password) => {
        set({ isSigningIn: true, signInError: null });
        const result = await authRepository.signIn(email, password);
        if (!result.ok) {
          set({
            isSigningIn: false,
            signInError:
              result.reason === 'invalid-credentials'
                ? 'Invalid email or password'
                : 'Something went wrong',
          });
          return false;
        }
        set({ user: result.user, isSigningIn: false, signInError: null });
        return true;
      },

      signOut: () => {
        set({ user: null, balanceCents: 0, signInError: null });
      },

      awardCents: (cents) => {
        set({ balanceCents: get().balanceCents + cents });
      },

      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: 'sayso/auth',
      storage: createJSONStorage(),
      partialize: (s) => ({ user: s.user, balanceCents: s.balanceCents }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
