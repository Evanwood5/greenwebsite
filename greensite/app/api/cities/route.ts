<<<<<<< HEAD
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('michigan_cities')
      .select('city_name')
      .eq('active', true)
      .order('city_name', { ascending: true })

    if (error) throw error

    return NextResponse.json({ cities: data?.map((r: any) => r.city_name) ?? [] })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
=======
aW1wb3J0IHsgY3JlYXRlQ2xpZW50IH0gZnJvbSAnQHN1cGFiYXNlL3N1cGFiYXNlLWpzJwppbXBvcnQgeyBOZXh0UmVzcG9uc2UgfSBmcm9tICduZXh0L3NlcnZlcicKCmNvbnN0IHN1cGFiYXNlID0gY3JlYXRlQ2xpZW50KAogIHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX1NVUEFCQVNFX1VSTCEsCiAgcHJvY2Vzcy5lbnYuU1VQQUJBU0VfU0VSVklDRV9ST0xFX0tFWSEKKQoKZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEdFVCgpIHsKICBjb25zdCB7IGRhdGEsIGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZQogICAgLmZyb20oJ21pY2hpZ2FuX2NpdGllcycpCiAgICAuc2VsZWN0KCdjaXR5JykKICAgIC5lcSgnYWN0aXZlJywgdHJ1ZSkKICAgIC5vcmRlcignY2l0eScsIHsgYXNjZW5kaW5nOiB0cnVlIH0pCgogIGlmIChlcnJvcikgewogICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgY2l0aWVzOiBbXSB9LCB7IHN0YXR1czogNTAwIH0pCiAgfQoKICBjb25zdCBjaXRpZXMgPSAoZGF0YSA/PyBbXSkubWFwKChyOiBhbnkpID0+IHIuY2l0eSBhcyBzdHJpbmcpCiAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgY2l0aWVzIH0pCn0K
>>>>>>> 77d07ef1ffbb2b17264b89309ee6b8458eef7766
