import type { Survey } from '@/core/models';

export interface SurveyRepository {
  listSurveys(): Promise<Survey[]>;
  getSurvey(id: string): Promise<Survey | null>;
}
