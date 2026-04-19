import { supabase } from '@/lib/supabase'
import { FilterOptions } from '@/components/jobs/FIlterPanel'

export interface Job {
    job_id: string
    created_at: string
    company_name: string | null
    job_title: string | null
    job_href: string | null
    job_type: string | null
    city: string | null
    state: string | null
    is_remote: boolean | null
    job_field_id: number | null
}

const JOBS_PER_PAGE = 20

export async function fetchJobsFromDB(
    filters: FilterOptions,
    page: number = 0
): Promise<{ data: Job[]; count: number; hasMore: boolean }> {
    let query = supabase
        .from('job_postings_ingest_test')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })

    if (filters.searchTerm) {
        query = query.or(`job_title.ilike.%${filters.searchTerm}%,company_name.ilike.%${filters.searchTerm}%`)
    }

    if (filters.city) {
        query = query.eq('city', filters.city)
    }

    if (filters.jobType) {
        query = query.eq('job_type', filters.jobType)
    }

    if (filters.state) {
        query = query.eq('state', filters.state)
    }

    if (filters.isRemote === 'remote') {
        query = query.eq('is_remote', true)
    } else if (filters.isRemote === 'onsite') {
        query = query.eq('is_remote', false)
    }

    if (filters.jobField || filters.jobSubField) {
        let fieldQuery = supabase
            .from('job_field_counts')
            .select('id')

        if (filters.jobField) {
            fieldQuery = fieldQuery.eq('category', filters.jobField)
        }

        if (filters.jobSubField) {
            fieldQuery = fieldQuery.eq('subcategory', filters.jobSubField)
        }

        const { data: fieldData, error: fieldError } = await fieldQuery

        if (!fieldError && fieldData && fieldData.length > 0) {
            const ids = fieldData.map((f: { id: number }) => f.id)
            query = query.in('job_field_id', ids)
        } else {
            query = query.eq('job_field_id', -1)
        }
    }

    const { data, error, count } = await query
        .range(page * JOBS_PER_PAGE, (page + 1) * JOBS_PER_PAGE - 1)

    if (error) throw error

    const totalLoaded = (page + 1) * JOBS_PER_PAGE
    const hasMore = count ? totalLoaded < count : false

    return {
        data: (data as Job[]) || [],
        count: count || 0,
        hasMore,
    }
}