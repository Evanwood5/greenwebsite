import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        // Get all business jobs
        const { data: jobs, error } = await supabase
            .from('job_postings_ingest_test')
            .select('*')
            .eq('category', 'business');

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

        // Month-over-month growth
        const thisMonth = jobs?.filter(job => {
            const created = new Date(job.created_at);
            const now = new Date();
            return created.getMonth() === now.getMonth();
        }).length || 0;

        return Response.json({
            category: 'business',
            totalJobs,
            topCompanies,
            experienceLevels,
            jobTypes,
            topCities,
            monthOverMonth: {
                current: thisMonth,
            }
        });

    } catch (error) {
        console.error('Analytics error:', error);
        return Response.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}