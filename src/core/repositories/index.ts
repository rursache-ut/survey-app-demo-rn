import { MockAuthRepository } from './MockAuthRepository';
import { MockSurveyRepository } from './MockSurveyRepository';

export const authRepository = new MockAuthRepository();
export const surveyRepository = new MockSurveyRepository();
