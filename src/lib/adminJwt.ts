/** Decode JWT payload (middle segment) for client-side role checks only — not signature verification. */
export type StaffJwtPayload = {
  sub?: string
  typ?: string
  is_admin?: boolean
  is_super_admin?: boolean
  exp?: number
}

export function decodeJwtPayload(accessToken: string): StaffJwtPayload | null {
  const parts = accessToken.split('.')
  if (parts.length < 2 || !parts[1]) {
    return null
  }
  try {
    const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const pad = b64.length % 4 === 0 ? '' : '='.repeat(4 - (b64.length % 4))
    const json = atob(b64 + pad)
    return JSON.parse(json) as StaffJwtPayload
  } catch {
    return null
  }
}

export function isSuperAdminStaffPayload(p: StaffJwtPayload | null): boolean {
  if (!p) {
    return false
  }
  return p.typ === 'user' && p.is_admin === true && p.is_super_admin === true
}
