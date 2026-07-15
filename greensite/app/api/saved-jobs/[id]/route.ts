/**
 * API: /api/saved-jobs/[id]
 *
 * PATCH  — update status and/or notes on a saved job
 * DELETE — remove a saved job
 *
 * Auth: user must own the saved_jobs row (enforced by RLS + explicit check)
 */

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies })

  // Verify session
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { status, notes } = body

  // Validate status if provided
  const validStatuses = ['Saved', 'Applied', 'Interview', 'Offer']
  if (status !== undefined && !validStatuses.includes(status)) {
    return Response.json({ error: 'Invalid status' }, { status: 400 })
  }

  const updates: Record<string, string> = {}
  if (status !== undefined) updates.status = status
  if (notes !== undefined) updates.notes = notes

  const { error } = await supabase
    .from('saved_jobs')
    .update(updates)
    .eq('id', params.id)
    .eq('user_id', session.user.id) // extra safety on top of RLS

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ success: true })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies })

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { error } = await supabase
    .from('saved_jobs')
    .delete()
    .eq('id', params.id)
    .eq('user_id', session.user.id)

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ success: true })
}
