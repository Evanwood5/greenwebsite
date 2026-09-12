import { supabase } from '@/lib/db/supabase'
import {AuthUserInfo, AuthSessionInfo} from '@/lib/types/auth'


export type AuthResponse =
  | { ok: true; user: AuthUserInfo; session: AuthSessionInfo | null }
  | { ok: false; message: string }

export async function signIn(email: string, password: string): Promise<AuthResponse> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { ok: false, message: error.message }
  if (!data.user) return { ok: false, message: 'Something went wrong. Try again.' }
  return {
    ok: true,
    user: { id: data.user.id, metadata: (data.user.user_metadata ?? {}) as AuthUserInfo['metadata'] },
    session: data.session ? { access_token: data.session.access_token } : null,
  }
}

export type SignUpResponse =
  | { ok: true; requiresConfirmation: boolean; user: AuthUserInfo | null; session: AuthSessionInfo | null }
  | { ok: false; message: string }

export async function signUp(
  email: string,
  password: string,
  metadata: Record<string, string | number | null>,
  emailRedirectTo?: string,
): Promise<SignUpResponse> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo, data: metadata },
  })
  if (error) return { ok: false, message: error.message }

  const user = data.user
    ? { id: data.user.id, metadata: (data.user.user_metadata ?? {}) as AuthUserInfo['metadata'] }
    : null

  return {
    ok: true,
    requiresConfirmation: !!user && !data.session,
    user,
    session: data.session ? { access_token: data.session.access_token } : null,
  }
}