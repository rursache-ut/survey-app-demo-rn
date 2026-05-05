import type { User } from '@/core/models';

export type SignInResult =
  | { ok: true; user: User }
  | { ok: false; reason: 'invalid-credentials' | 'unknown' };

export interface AuthRepository {
  signIn(email: string, password: string): Promise<SignInResult>;
}
