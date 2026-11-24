export const TERMS_UPDATED_AT = '2026-11-23'

export function needsTermsAcceptance(termsAcceptedAt: string | null): boolean {
  if (!termsAcceptedAt) return true
  return new Date(termsAcceptedAt) < new Date(TERMS_UPDATED_AT)
}
