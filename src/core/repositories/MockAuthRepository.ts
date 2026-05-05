import type { AuthAccount } from '@/core/models';
import type { AuthRepository, SignInResult } from './AuthRepository';
import authData from '@/core/data/auth.json';

const accounts = authData.accounts as AuthAccount[];

export class MockAuthRepository implements AuthRepository {
  async signIn(email: string, password: string): Promise<SignInResult> {
    await new Promise((r) => setTimeout(r, 400));
    const match = accounts.find(
      (a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password
    );
    if (!match) return { ok: false, reason: 'invalid-credentials' };
    return {
      ok: true,
      user: { email: match.email, fullName: match.fullName, avatarUrl: match.avatarUrl },
    };
  }
}
