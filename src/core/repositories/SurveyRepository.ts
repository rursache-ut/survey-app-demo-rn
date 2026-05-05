import type { Survey } from '@/core/models';

export interface SurveyRepository {
  listSurveys(): Promise<Survey[]>;
  getSurvey(id: string): Promise<Survey>;
}

export class SurveyNotFoundError extends Error {
  constructor(public readonly surveyId: string) {
    super(`Survey not found: ${surveyId}`);
    this.name = 'SurveyNotFoundError';
  }
}
