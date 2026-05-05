import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createJSONStorage } from '@/core/storage/zustandStorage';

type PrefsState = {
  pushNotifications: boolean;
  setPushNotifications: (v: boolean) => void;
};

export const usePrefsStore = create<PrefsState>()(
  persist(
    (set) => ({
      pushNotifications: true,
      setPushNotifications: (v) => set({ pushNotifications: v }),
    }),
    { name: 'sayso/prefs', storage: createJSONStorage() }
  )
);
