import { MockAuthRepository } from './MockAuthRepository';
import { MockSurveyRepository } from './MockSurveyRepository';

export const authRepository = new MockAuthRepository();
export const surveyRepository = new MockSurveyRepository();

export type { AuthRepository, SignInResult } from './AuthRepository';
export type { SurveyRepository } from './SurveyRepository';
