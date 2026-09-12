

export const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: '12px',
  border: '1px solid rgba(30,58,30,0.22)',
  background: '#fffdf8',
  color: '#1a2e1a',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
}

export const panelCardStyle: React.CSSProperties = {
  background: '#f7f3ea',
  border: '1px solid rgba(30,58,30,0.18)',
  borderRadius: '20px',
  boxShadow: '0 30px 70px rgba(30,58,30,0.08)',
}

export const labelStyle: React.CSSProperties = {
  display: 'block',
  color: '#1a2e1a',
  fontSize: '13px',
  fontWeight: 700,
  marginBottom: '8px',
  letterSpacing: '0.02em',
  textTransform: 'uppercase',
}

export function parseMetadataOrgId(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return null
}