/**
 * API: /api/saved-jobs/[id]
 *
 * PATCH  — update status and/or notes on a saved job
 * DELETE — remove a saved job
 *
 * Auth: caller must send `Authorization: Bearer <access_token>` header.
 * We verify the token via supabase.auth.getUser() and double-check ownership.
 */

import { createClient } from '@supabase/supabase-js'
import { supabaseAdmin } from '@/lib/db/supabase-admin'
import { NextRequest } from 'next/server'

const VALID_STATUSES = ['Saved', 'Applied', 'Interview', 'Offer'] as const

/** Extract and verify the Bearer token from the request. */
async function getUser(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return null

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data: { user } } = await supabase.auth.getUser(token)
  return user ?? null
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUser(request)
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { status, notes } = body

  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    return Response.json({ error: 'Invalid status' }, { status: 400 })
  }

  const updates: Record<string, string> = {}
  if (status !== undefined) updates.status = status
  if (notes !== undefined) updates.notes = notes

  const { error } = await supabaseAdmin
    .from('saved_jobs')
    .update(updates)
    .eq('id', params.id)
    .eq('user_id', user.id)

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ success: true })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUser(request)
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { error } = await supabaseAdmin
    .from('saved_jobs')
    .delete()
    .eq('id', params.id)
    .eq('user_id', user.id)

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ success: true })
}
