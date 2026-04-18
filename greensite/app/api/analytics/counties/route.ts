import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        // Fetch all Michigan counties with their job counts
        const { data: counties, error } = await supabase
            .from('mi_counties')
            .select('*')
            .order('count_value', { ascending: false });

        if (error) throw error;

        // Format for the map component
        const countyData = counties?.map(county => ({
            county: county.name,
            jobCount: county.count_value,
            lat: county.lat,
            lng: county.lng,
        })) || [];

        // Calculate max for color scaling
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
