import { supabaseAdmin } from '@/lib/supabase-admin'

type SyncOrgRequestBody = {
  userId?: string
  orgId?: number | null
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.slice('Bearer '.length)
      : null

    if (!token) {
      return Response.json({ error: 'Missing auth token' }, { status: 401 })
    }

    const { data: authData, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !authData.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await request.json()) as SyncOrgRequestBody
    if (!body.userId || body.userId !== authData.user.id) {
      return Response.json({ error: 'Invalid user context' }, { status: 403 })
    }

    if (body.orgId !== null && typeof body.orgId !== 'number') {
      return Response.json({ error: 'orgId must be a number or null' }, { status: 400 })
    }

    const { error: upsertError } = await supabaseAdmin
      .from('profiles')
      .upsert(
        {
          user_id: body.userId,
          org_id: body.orgId,
        },
        { onConflict: 'user_id' },
      )

    if (upsertError) {
      return Response.json(
        { error: 'Failed to sync profile org_id', details: upsertError.message },
        { status: 500 },
      )
    }

    return Response.json({ success: true })
  } catch (error) {
    return Response.json(
      {
        error: 'Unexpected server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
