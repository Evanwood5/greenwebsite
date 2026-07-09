import { supabase } from '@/lib/db/supabase';

export async function GET() {
    try {
        const { data: counties, error } = await supabase
            .from('mi_counties')
            .select('*')
            .order('count_value', { ascending: false });

        if (error) throw error;

        const countyData = counties?.map(county => ({
            county: county.name,
            jobCount: county.count_value,
            lat: county.lat,
            lng: county.lng,
        })) || [];

        const maxJobs = Math.max(...countyData.map(c => c.jobCount), 1);

        return Response.json({
            counties: countyData,
            maxJobs,
            totalCounties: countyData.length,
        });

    } catch (error) {
        console.error('County analytics error:', error);
        return Response.json({ error: 'Failed to fetch county data' }, { status: 500 });
    }
}
