import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PersistStorage } from 'zustand/middleware';

export function createJSONStorage<T>(): PersistStorage<T> {
  return {
    getItem: async (name) => {
      const raw = await AsyncStorage.getItem(name);
      if (!raw) return null;
      try {
        return JSON.parse(raw);
      } catch (err) {
        console.warn(`[zustandStorage] Corrupt entry for "${name}", clearing.`, err);
        try {
          await AsyncStorage.removeItem(name);
        } catch (removeErr) {
          console.warn(`[zustandStorage] Failed to clear corrupt entry "${name}".`, removeErr);
        }
        return null;
      }
    },
    setItem: async (name, value) => {
      try {
        await AsyncStorage.setItem(name, JSON.stringify(value));
      } catch (err) {
        console.warn(`[zustandStorage] Failed to persist "${name}".`, err);
      }
    },
    removeItem: async (name) => {
      try {
        await AsyncStorage.removeItem(name);
      } catch (err) {
        console.warn(`[zustandStorage] Failed to remove "${name}".`, err);
      }
    },
  };
}
