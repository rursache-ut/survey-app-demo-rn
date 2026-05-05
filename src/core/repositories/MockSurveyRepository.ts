import type { Survey } from '@/core/models';
import { SurveyNotFoundError, type SurveyRepository } from './SurveyRepository';
import surveysData from '@/core/data/surveys.json';

const seed = surveysData.surveys as Survey[];

export class MockSurveyRepository implements SurveyRepository {
  async listSurveys(): Promise<Survey[]> {
    await fakeLatency();
    return seed.filter((s) => new Date(s.expiresAt).getTime() > Date.now());
  }

  async getSurvey(id: string): Promise<Survey> {
    await fakeLatency();
    const found = seed.find((s) => s.id === id);
    if (!found) throw new SurveyNotFoundError(id);
    return found;
  }
}

function fakeLatency(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 250));
}
