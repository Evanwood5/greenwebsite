/**
 * API: /api/saved-jobs/[id]
 *
 * PATCH  — update status and/or notes on a saved job
 * DELETE — remove a saved job
 *
 * Auth: caller must send `Authorization: Bearer <access_token>` header.
 * We verify the token and pass it to the anon client so RLS enforces ownership.
 */

import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

const VALID_STATUSES = ['Saved', 'Applied', 'Interview', 'Offer'] as const

/** Build an anon client scoped to the user's JWT — RLS will enforce user_id ownership. */
function getAuthenticatedClient(token: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  )
}

async function getUser(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return { user: null, client: null }
  const supabase = getAuthenticatedClient(token)
  const { data: { user } } = await supabase.auth.getUser(token)
  return { user: user ?? null, client: supabase }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { user, client } = await getUser(request)
  if (!user || !client) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { status, notes } = body

  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    return Response.json({ error: 'Invalid status' }, { status: 400 })
  }

  const updates: Record<string, string> = {}
  if (status !== undefined) updates.status = status
  if (notes !== undefined) updates.notes = notes

  const { error } = await client
    .from('saved_jobs')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ success: true })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { user, client } = await getUser(request)
  if (!user || !client) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { error } = await client
    .from('saved_jobs')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ success: true })
}
