import { Database } from '@/lib/supabase'

export type Mode = 'signin' | 'signup'
export type SignUpPath = 'school' | 'none'


export interface AuthUserInfo {
  id: string
  metadata: {
    sign_up_path?: string | null
    org_id?: string | number | null
  }
}

export interface AuthSessionInfo {
  access_token: string
}

export type Org = Pick<Database['public']['Tables']['orgs']['Row'], 'id' | 'org_name' | 'email_domain'>