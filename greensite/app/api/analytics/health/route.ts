import { supabase } from '@/lib/db/supabase';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const location = searchParams.get('location') ?? '';
        const timeframe = searchParams.get('timeframe') ?? '1year';

        const timeframeDays: Record<string, number> = {
            '1month': 30,
            '6months': 180,
            '1year': 365,
        };
        const days = timeframeDays[timeframe] ?? 365;
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        let query = supabase
            .from('job_postings_ingest_test')
            .select(`
                *,
                job_field_counts!inner (
                    id,
                    category,
                    subcategory
                )
            `)
            .eq('job_field_counts.category', 'Health')
            .gte('created_at', cutoffDate.toISOString());

        if (location) {
            query = query.eq('city', location);
        }

        const { data: jobs, error } = await query;

        if (error) throw error;

        const totalJobs = jobs?.length || 0;

        const companyCounts = jobs?.reduce((acc: any, job) => {
            const company = job.company_name || 'Unknown';
            acc[company] = (acc[company] || 0) + 1;
            return acc;
        }, {});

        const allCompanies = Object.entries(companyCounts || {})
            .map(([company, jobCount]) => ({ company, jobCount }))
            .sort((a: any, b: any) => b.jobCount - a.jobCount);

        const totalCompanies = Object.keys(companyCounts || {}).length;

        const experienceLevels = jobs?.reduce((acc: any, job) => {
            const level = job.experience_level || 'N/A';
            acc[level] = (acc[level] || 0) + 1;
            return acc;
        }, {});

        const jobTypes = jobs?.reduce((acc: any, job) => {
            const type = job.job_type || 'Unknown';
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {});

        const cityCounts = jobs?.reduce((acc: any, job) => {
            const city = job.city || 'Unknown';
            acc[city] = (acc[city] || 0) + 1;
            return acc;
        }, {});

        const allCities = Object.entries(cityCounts || {})
            .map(([name, jobCount]) => ({ name, jobCount }))
            .sort((a: any, b: any) => b.jobCount - a.jobCount);

        const subcategoryCounts = jobs?.reduce((acc: any, job) => {
            const subcategory = job.job_field_counts?.subcategory || 'Unknown';
            acc[subcategory] = (acc[subcategory] || 0) + 1;
            return acc;
        }, {});

        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();
        const lastMonthDate = new Date(thisYear, thisMonth - 1, 1);
        const lastMonth = lastMonthDate.getMonth();
        const lastMonthYear = lastMonthDate.getFullYear();

        const thisMonthJobs = jobs?.filter(job => {
            const created = new Date(job.created_at);
            return created.getMonth() === thisMonth && created.getFullYear() === thisYear;
        }).length || 0;

        const lastMonthJobs = jobs?.filter(job => {
            const created = new Date(job.created_at);
            return created.getMonth() === lastMonth && created.getFullYear() === lastMonthYear;
        }).length || 0;

        const percentChange = lastMonthJobs > 0
            ? Math.round(((thisMonthJobs - lastMonthJobs) / lastMonthJobs) * 100)
            : 0;

        const recentJobs = jobs?.filter(job => {
            const created = new Date(job.created_at);
            return created >= cutoffDate;
        }) || [];

        const jobsByDate: { [date: string]: number } = {};
        recentJobs.forEach(job => {
            const date = new Date(job.created_at);
            const dateKey = `${date.getMonth() + 1}/${date.getDate()}`;
            jobsByDate[dateKey] = (jobsByDate[dateKey] || 0) + 1;
        });

        const trendDays = Math.min(days, 90);
        const trendData = [];
        for (let i = trendDays - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateKey = `${date.getMonth() + 1}/${date.getDate()}`;
            trendData.push({ date: dateKey, count: jobsByDate[dateKey] || 0 });
        }

        return Response.json({
            category: 'health',
            totalJobs,
            topCompanies: allCompanies.slice(0, 5),
            allCompanies,
            totalCompanies,
            experienceLevels,
            jobTypes,
            topCities: allCities.slice(0, 5),
            allCities,
            subcategoryCounts,
            monthlyStats: {
                totalJobs: thisMonthJobs,
                percentChange,
                previousMonth: lastMonthJobs,
            },
            trendData,
        });

    } catch (error) {
        console.error('Analytics error:', error);
        return Response.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}
