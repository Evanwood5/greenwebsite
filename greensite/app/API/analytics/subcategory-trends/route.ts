import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
    try {
        // Get category from query params
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');

        console.log('📊 Subcategory trends API called with category:', category);

        // Build query - IMPORTANT: Filter happens here
        const { data: jobs, error } = await supabase
            .from('job_postings_ingest_test')
            .select(`
                created_at,
                job_field_counts!inner (
                    category,
                    subcategory
                )
            `)
            .eq('job_field_counts.category', category); // Filter by category

        if (error) {
            console.error('❌ Supabase error:', error);
            throw error;
        }

        console.log('✅ Jobs fetched:', jobs?.length, 'for category:', category);
        console.log('📋 Sample job:', jobs?.[0]);

        // Get last 30 days of data
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentJobs = jobs?.filter(job => {
            const created = new Date(job.created_at);
            return created >= thirtyDaysAgo;
        }) || [];

        console.log('📅 Recent jobs (last 30 days):', recentJobs.length);

        // Group by date and subcategory
        const trendsBySubcategory: { [subcategory: string]: { [date: string]: number } } = {};

        recentJobs.forEach(job => {
            const subcategory = (job as any).job_field_counts?.subcategory || 'Unknown';
            const date = new Date(job.created_at);
            const dateKey = `${date.getMonth() + 1}/${date.getDate()}`;

            if (!trendsBySubcategory[subcategory]) {
                trendsBySubcategory[subcategory] = {};
            }

            trendsBySubcategory[subcategory][dateKey] = 
                (trendsBySubcategory[subcategory][dateKey] || 0) + 1;
        });

        console.log('🏷️ Subcategories found:', Object.keys(trendsBySubcategory));

        // Create array of last 30 days with all subcategories
        const allDates = [];
        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateKey = `${date.getMonth() + 1}/${date.getDate()}`;
            
            const dataPoint: any = { date: dateKey };
            
            Object.keys(trendsBySubcategory).forEach(subcategory => {
                dataPoint[subcategory] = trendsBySubcategory[subcategory][dateKey] || 0;
            });
            
            allDates.push(dataPoint);
        }

        // Get list of all subcategories sorted by total count
        const subcategoryCounts = Object.entries(trendsBySubcategory).map(([subcategory, dates]) => ({
            subcategory,
            totalCount: Object.values(dates).reduce((sum, count) => sum + count, 0),
        })).sort((a, b) => b.totalCount - a.totalCount);

        return Response.json({
            category: category || 'All',
            trendData: allDates,
            subcategories: subcategoryCounts.map(s => s.subcategory),
            topSubcategories: subcategoryCounts.slice(0, 10),
            debug: {
                totalJobs: jobs?.length || 0,
                recentJobs: recentJobs.length,
                subcategoriesFound: Object.keys(trendsBySubcategory),
            }
        });

    } catch (error) {
        console.error('❌ Subcategory trends error:', error);
        return Response.json({ error: 'Failed to fetch subcategory trends' }, { status: 500 });
    }
}