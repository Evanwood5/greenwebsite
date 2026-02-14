// app/api/classify-jobs/route.ts

import { supabaseAdmin } from '@/lib/supabase';
import { classifyJobCategory, classifyExperienceLevel } from '@/lib/jobClassifier';

export async function POST() {
    try {
        console.log('Starting job classification...');

        // Get unclassified jobs (where category is NULL)
        const { data: jobs, error } = await supabaseAdmin
            .from('job_postings_ingest_test')
            .select('job_id, job_title, job_posting_text, job_type')
            .is('category', null)
            .limit(100); // Process in batches of 100

        if (error) {
            console.error('Error fetching jobs:', error);
            throw error;
        }

        if (!jobs || jobs.length === 0) {
            return Response.json({
                success: true,
                message: 'No unclassified jobs found',
                classified: 0
            });
        }

        console.log(`Found ${jobs.length} unclassified jobs`);

        // Classify each job
        let successCount = 0;
        let errorCount = 0;

        for (const job of jobs) {
            try {
                const category = classifyJobCategory(
                    job.job_title || '',
                    job.job_posting_text || ''
                );

                const experienceLevel = classifyExperienceLevel(
                    job.job_title || '',
                    job.job_posting_text || '',
                    job.job_type || ''
                );

                // Update Supabase
                const { error: updateError } = await supabaseAdmin
                    .from('job_postings_ingest_test')
                    .update({
                        category: category,
                        experience_level: experienceLevel
                    })
                    .eq('job_id', job.job_id);

                if (updateError) {
                    console.error(`Error updating job ${job.job_id}:`, updateError);
                    errorCount++;
                } else {
                    successCount++;
                    console.log(` Classified: ${job.job_title} → ${category} (${experienceLevel})`);
                }
            } catch (err) {
                console.error(`Error processing job ${job.job_id}:`, err);
                errorCount++;
            }
        }

        return Response.json({
            success: true,
            classified: successCount,
            errors: errorCount,
            total: jobs.length,
            message: `Successfully classified ${successCount} jobs`
        });

    } catch (error) {
        console.error('Classification error:', error);
        return Response.json({
            success: false,
            error: 'Classification failed',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// Also support GET for testing in browser
export async function GET() {
    return Response.json({
        message: 'Job classification endpoint. Use POST to trigger classification.',
        status: 'ready'
    });
}