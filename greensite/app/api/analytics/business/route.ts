import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        // Get all business jobs using the new JOIN structure
        const { data: jobs, error } = await supabase
            .from('job_postings_ingest_test')
            .select(`
                *,
                job_field_counts!inner (
                    id,
                    category,
                    subcategory
                )
            `)
            .eq('job_field_counts.category', 'Business');

        if (error) throw error;

        // Calculate metrics
        const totalJobs = jobs?.length || 0;

        // Top companies
        const companyCounts = jobs?.reduce((acc: any, job) => {
            const company = job.company_name || 'Unknown';
            acc[company] = (acc[company] || 0) + 1;
            return acc;
        }, {});

        const topCompanies = Object.entries(companyCounts || {})
            .map(([company, jobCount]) => ({ company, jobCount }))
            .sort((a: any, b: any) => b.jobCount - a.jobCount)
            .slice(0, 5);
            const totalCompanies = Object.keys(companyCounts || {}).length;

        // Jobs by experience level
        const experienceLevels = jobs?.reduce((acc: any, job) => {
            const level = job.experience_level || 'N/A';
            acc[level] = (acc[level] || 0) + 1;
            return acc;
        }, {});

        // Jobs by type
        const jobTypes = jobs?.reduce((acc: any, job) => {
            const type = job.job_type || 'Unknown';
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {});

        // Top cities
        const cityCounts = jobs?.reduce((acc: any, job) => {
            const city = job.city || 'Unknown';
            acc[city] = (acc[city] || 0) + 1;
            return acc;
        }, {});

        const topCities = Object.entries(cityCounts || {})
            .map(([name, jobCount]) => ({ name, jobCount }))
            .sort((a: any, b: any) => b.jobCount - a.jobCount)
            .slice(0, 5);

        // Jobs by subcategory
        const subcategoryCounts = jobs?.reduce((acc: any, job) => {
            const subcategory = job.job_field_counts?.subcategory || 'Unknown';
            acc[subcategory] = (acc[subcategory] || 0) + 1;
            return acc;
        }, {});

        // Month-over-month growth calculation
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

        // Job posting trends over last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentJobs = jobs?.filter(job => {
            const created = new Date(job.created_at);
            return created >= thirtyDaysAgo;
        }) || [];

        // Group by date
        const jobsByDate: { [date: string]: number } = {};
        recentJobs.forEach(job => {
            const date = new Date(job.created_at);
            const dateKey = `${date.getMonth() + 1}/${date.getDate()}`;
            jobsByDate[dateKey] = (jobsByDate[dateKey] || 0) + 1;
        });

        // Create array of last 30 days with counts
        const trendData = [];
        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateKey = `${date.getMonth() + 1}/${date.getDate()}`;
            trendData.push({
                date: dateKey,
                count: jobsByDate[dateKey] || 0,
            });
        }

        return Response.json({
            category: 'business',
            totalJobs,
            topCompanies,
            totalCompanies,
            experienceLevels,
            jobTypes,
            topCities,
            subcategoryCounts,
            monthlyStats: {
                totalJobs: thisMonthJobs,
                percentChange: percentChange,
                previousMonth: lastMonthJobs,
            },
            trendData,
        });

    } catch (error) {
        console.error('Analytics error:', error);
        return Response.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}