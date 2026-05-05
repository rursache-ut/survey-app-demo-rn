import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createJSONStorage } from '@/core/storage/zustandStorage';
import { useAuthStore } from '@/features/auth/store/authStore';
import { formatCents } from '@/core/utils/currency';

type Prefs = { pushNotifications: boolean };

const usePrefsStore = create<Prefs & { setPushNotifications: (v: boolean) => void }>()(
  persist(
    (set) => ({
      pushNotifications: true,
      setPushNotifications: (v) => set({ pushNotifications: v }),
    }),
    { name: 'sayso/prefs', storage: createJSONStorage() }
  )
);

export function useSettingsViewModel() {
  const user = useAuthStore((s) => s.user);
  const balanceCents = useAuthStore((s) => s.balanceCents);
  const pushNotifications = usePrefsStore((s) => s.pushNotifications);
  const setPushNotifications = usePrefsStore((s) => s.setPushNotifications);

  return {
    user,
    balanceFormatted: formatCents(balanceCents),
    pushNotifications,
    setPushNotifications,
  };
}
