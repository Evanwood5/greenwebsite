import { supabase } from '@/lib/db/supabase'

// Returns subcategory names for a given category, sorted alphabetically.
// Pass an empty string to get all subcategories across all categories.
export async function fetchSubfields(category: string): Promise<string[]> {
  let query = supabase
    .from('job_field_counts')
    .select('subcategory')
    .order('subcategory', { ascending: true })

  if (category) {
    query = query.eq('category', category)
  }

  const { data, error } = await query
  if (error) throw error
  return data?.map(r => r.subcategory) ?? []
}

// Returns all categories (distinct), sorted alphabetically.
export async function fetchCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from('job_field_counts')
    .select('category')
    .order('category', { ascending: true })

  if (error) throw error
  const unique = [...new Set(data?.map(r => r.category) ?? [])]
  return unique
}
