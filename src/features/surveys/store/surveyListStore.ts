import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Survey } from '@/core/models';
import { surveyRepository } from '@/core/repositories';
import { createJSONStorage } from '@/core/storage/zustandStorage';

type SurveyListState = {
  surveys: Survey[];
  completedIds: string[];
  isLoading: boolean;
  error: string | null;
};

type SurveyListActions = {
  load: () => Promise<void>;
  markCompleted: (id: string) => void;
};

export const useSurveyListStore = create<SurveyListState & SurveyListActions>()(
  persist(
    (set, get) => ({
      surveys: [],
      completedIds: [],
      isLoading: false,
      error: null,

      load: async () => {
        set({ isLoading: true, error: null });
        try {
          const surveys = await surveyRepository.listSurveys();
          set({ surveys, isLoading: false });
        } catch {
          set({ isLoading: false, error: 'Failed to load surveys' });
        }
      },

      markCompleted: (id) => {
        if (get().completedIds.includes(id)) return;
        set({ completedIds: [...get().completedIds, id] });
      },
    }),
    {
      name: 'sayso/survey-list',
      storage: createJSONStorage(),
      partialize: (s) => ({ completedIds: s.completedIds }),
    }
  )
);
