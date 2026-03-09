// app/api/classify-jobs/route.ts

import { supabaseAdmin } from '@/lib/supabase-admin';
import { getJobFieldId, classifyExperienceLevel } from '@/lib/jobClassifier';

export async function POST() {
    try {
        console.log('Starting job field categorization...');

        // Get jobs without job_field_id
        const { data: jobs, error } = await supabaseAdmin
            .from('job_postings_ingest_test')
            .select('job_id, job_title, job_type')
            .is('job_field_id', null)
            .limit(500);

        if (error) {
            console.error('Error fetching jobs:', error);
            throw error;
        }

        if (!jobs || jobs.length === 0) {
            return Response.json({
                success: true,
                message: 'No uncategorized jobs found',
                classified: 0,
                errors: 0,
                total: 0
            });
        }

        console.log(`Found ${jobs.length} uncategorized jobs`);

        let successCount = 0;
        let errorCount = 0;
        let skippedCount = 0;

        for (const job of jobs) {
            try {
                // Get job_field_id from Supabase
                const fieldId = await getJobFieldId(job.job_title || '');

                if (fieldId) {
                    // Update job with field_id
                    const { error: updateError } = await supabaseAdmin
                        .from('job_postings_ingest_test')
                        .update({ job_field_id: fieldId })
                        .eq('job_id', job.job_id);

                    if (updateError) {
                        console.error(`Error updating job ${job.job_id}:`, updateError);
                        errorCount++;
                    } else {
                        successCount++;
                        console.log(`✓ Categorized: ${job.job_title} → field_id: ${fieldId}`);
                    }
                } else {
                    // No matching category found - leave as null
                    skippedCount++;
                    console.log(`⊘ Skipped (no match): ${job.job_title}`);
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
            skipped: skippedCount,
            total: jobs.length,
            message: `Successfully categorized ${successCount} jobs (${skippedCount} had no match)`
        });

    } catch (error) {
        console.error('Categorization error:', error);
        return Response.json({
            success: false,
            error: 'Categorization failed',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// Also support GET for testing in browser
export async function GET() {
    return Response.json({
        message: 'Job field categorization endpoint. Use POST to trigger categorization.',
        status: 'ready'
    });
}