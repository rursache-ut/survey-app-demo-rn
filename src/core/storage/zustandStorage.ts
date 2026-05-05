import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PersistStorage } from 'zustand/middleware';

export function createJSONStorage<T>(): PersistStorage<T> {
  return {
    getItem: async (name) => {
      const raw = await AsyncStorage.getItem(name);
      return raw ? JSON.parse(raw) : null;
    },
    setItem: async (name, value) => {
      await AsyncStorage.setItem(name, JSON.stringify(value));
    },
    removeItem: async (name) => {
      await AsyncStorage.removeItem(name);
    },
  };
}
