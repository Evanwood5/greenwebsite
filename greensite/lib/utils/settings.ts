export const cardStyle: React.CSSProperties = {
  background: 'var(--surface-raised)',
  borderRadius: '4px',
  padding: '16px',
  border: '1px solid var(--border-subtle)',
  marginBottom: '10px',
}

export const sectionHeadingStyle: React.CSSProperties = {
  color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600,
  marginBottom: '2px', marginTop: '22px', letterSpacing: '-0.01em',
}

export const sectionSubStyle: React.CSSProperties = {
  color: 'var(--text-muted)', fontSize: '11px', marginBottom: '10px',
}

export function displayLocation(loc: string): string {
  const parts = loc.split(',').filter(Boolean)
  if (parts.length === 0) return 'All Michigan'
  if (parts.length === 1) return parts[0]
  return `${parts.length} cities`
}

export function getUniversityFromDomain(domain: string | null | undefined): string {
  if (!domain) return 'None'
  if (domain.includes('msu.edu')) return 'Michigan State'
  if (domain.includes('umich.edu')) return 'University of Michigan'
  if (domain.includes('wayne.edu')) return 'Wayne State'
  return domain
}