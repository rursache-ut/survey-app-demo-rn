/**
 * Claim guard utility to prevent double-claiming rewards.
 */

const CLAIM_STORAGE_KEY = "reward_claims";

interface ClaimRecord {
  claimId: string;
  timestamp: number;
  status: "pending" | "completed" | "failed";
}

export function getClaimHistory(): ClaimRecord[] {
  try {
    const raw = localStorage.getItem(CLAIM_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function hasAlreadyClaimed(claimId: string): boolean {
  return getClaimHistory().some(c => c.claimId === claimId && c.status === "completed");
}

export function recordClaim(claimId: string, status: ClaimRecord["status"]): void {
  const history = getClaimHistory();
  const existing = history.find(c => c.claimId === claimId);
  if (existing) { existing.status = status; }
  else { history.push({ claimId, timestamp: Date.now(), status }); }
  localStorage.setItem(CLAIM_STORAGE_KEY, JSON.stringify(history));
}

export function validateClaimState(claimId: string | null): { valid: boolean; reason?: string } {
  if (!claimId) return { valid: false, reason: "No claim ID provided" };
  if (hasAlreadyClaimed(claimId)) return { valid: false, reason: "Reward already claimed" };
  return { valid: true };
}
