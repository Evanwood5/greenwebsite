// lib/jobClassifier.ts
// Classifies jobs into categories and fetches the corresponding job_field_id from Supabase

import { supabase } from '@/lib/supabase';

// Job field mappings: (category, subcategory) - mirrors backend logic
const JOB_FIELD_MAPPINGS: Record<string, [string, string]> = {
    // TECH
    'software engineer': ['Tech', 'Software Engineering'],
    'software engineering': ['Tech', 'Software Engineering'],
    'software developer': ['Tech', 'Software Engineering'],
    'application developer': ['Tech', 'Software Engineering'],
    'full stack': ['Tech', 'Software Engineering'],
    'frontend': ['Tech', 'Software Engineering'],
    'backend': ['Tech', 'Software Engineering'],
    'web developer': ['Tech', 'Software Engineering'],
    'mobile engineer': ['Tech', 'Software Engineering'],
    'react native': ['Tech', 'Software Engineering'],
    '.net developer': ['Tech', 'Software Engineering'],
    'java developer': ['Tech', 'Software Engineering'],

    'data scientist': ['Tech', 'Data Science / AI'],
    'data science': ['Tech', 'Data Science / AI'],
    'machine learning': ['Tech', 'Data Science / AI'],
    'ml engineer': ['Tech', 'Data Science / AI'],
    'ai engineer': ['Tech', 'Data Science / AI'],
    'data engineer': ['Tech', 'Data Science / AI'],
    'business intelligence developer': ['Tech', 'Data Science / AI'],
    'artificial intelligence': ['Tech', 'Data Science / AI'],

    'it support': ['Tech', 'IT / Sysadmin'],
    'desktop support': ['Tech', 'IT / Sysadmin'],
    'systems administrator': ['Tech', 'IT / Sysadmin'],
    'sysadmin': ['Tech', 'IT / Sysadmin'],
    'network engineer': ['Tech', 'IT / Sysadmin'],
    'it specialist': ['Tech', 'IT / Sysadmin'],
    'technical support': ['Tech', 'IT / Sysadmin'],
    'help desk': ['Tech', 'IT / Sysadmin'],

    'cybersecurity': ['Tech', 'Cybersecurity'],
    'information security': ['Tech', 'Cybersecurity'],
    'security engineer': ['Tech', 'Cybersecurity'],
    'security analyst': ['Tech', 'Cybersecurity'],

    'cloud engineer': ['Tech', 'Cloud / DevOps'],
    'devops': ['Tech', 'Cloud / DevOps'],
    'site reliability': ['Tech', 'Cloud / DevOps'],
    'sre': ['Tech', 'Cloud / DevOps'],
    'platform engineer': ['Tech', 'Cloud / DevOps'],

    'qa engineer': ['Tech', 'QA / Testing'],
    'quality assurance': ['Tech', 'QA / Testing'],
    'test engineer': ['Tech', 'QA / Testing'],
    'sdet': ['Tech', 'QA / Testing'],

    'ux designer': ['Tech', 'UI / UX'],
    'ui designer': ['Tech', 'UI / UX'],
    'user experience': ['Tech', 'UI / UX'],
    'product designer': ['Tech', 'UI / UX'],

    'embedded software': ['Tech', 'Hardware / Embedded'],
    'firmware': ['Tech', 'Hardware / Embedded'],
    'hardware engineer': ['Tech', 'Hardware / Embedded'],

    // ENGINEERING
    'mechanical engineer': ['Engineering', 'Mechanical'],
    'hvac engineer': ['Engineering', 'Mechanical'],
    'thermal engineer': ['Engineering', 'Mechanical'],

    'electrical engineer': ['Engineering', 'Electrical'],
    'power engineer': ['Engineering', 'Electrical'],
    'controls engineer': ['Engineering', 'Electrical'],

    'civil engineer': ['Engineering', 'Civil / Structural'],
    'structural engineer': ['Engineering', 'Civil / Structural'],
    'construction engineer': ['Engineering', 'Civil / Structural'],

    'chemical engineer': ['Engineering', 'Chemical'],
    'process engineer': ['Engineering', 'Chemical'],

    'industrial engineer': ['Engineering', 'Industrial'],
    'manufacturing engineer': ['Engineering', 'Industrial'],
    'quality engineer': ['Engineering', 'Industrial'],

    'aerospace engineer': ['Engineering', 'Aerospace'],

    'materials engineer': ['Engineering', 'Materials'],
    'metallurgist': ['Engineering', 'Materials'],

    'environmental engineer': ['Engineering', 'Environmental'],
    'ehs': ['Engineering', 'Environmental'],
    'safety specialist': ['Engineering', 'Environmental'],

    // BUSINESS
    'accountant': ['Business', 'Finance / Accounting'],
    'financial analyst': ['Business', 'Finance / Accounting'],
    'controller': ['Business', 'Finance / Accounting'],
    'auditor': ['Business', 'Finance / Accounting'],

    'marketing': ['Business', 'Marketing / Sales'],
    'sales': ['Business', 'Marketing / Sales'],
    'account executive': ['Business', 'Marketing / Sales'],
    'business development': ['Business', 'Marketing / Sales'],

    'operations': ['Business', 'Operations / Logistics'],
    'logistics': ['Business', 'Operations / Logistics'],
    'supply chain': ['Business', 'Operations / Logistics'],
    'procurement': ['Business', 'Operations / Logistics'],

    'human resources': ['Business', 'HR / Recruiting'],
    'recruiter': ['Business', 'HR / Recruiting'],
    'talent acquisition': ['Business', 'HR / Recruiting'],

    'business analyst': ['Business', 'Business Analytics'],
    'business intelligence': ['Business', 'Business Analytics'],

    'consultant': ['Business', 'Consulting / Strategy'],
    'strategy': ['Business', 'Consulting / Strategy'],

    'project manager': ['Business', 'Project Management'],
    'program manager': ['Business', 'Project Management'],
    'scrum master': ['Business', 'Project Management'],
    'product manager': ['Business', 'Project Management'],

    // HEALTH
    'registered nurse': ['Health', 'Clinical / Nursing'],
    'nurse': ['Health', 'Clinical / Nursing'],
    'rn': ['Health', 'Clinical / Nursing'],
    'therapist': ['Health', 'Clinical / Nursing'],

    'pharmacist': ['Health', 'Pharmacy'],
    'pharmacy': ['Health', 'Pharmacy'],

    'healthcare administration': ['Health', 'Healthcare Administration'],
    'medical billing': ['Health', 'Healthcare Administration'],

    'research scientist': ['Health', 'Research / Lab'],
    'lab technician': ['Health', 'Research / Lab'],
    'clinical research': ['Health', 'Research / Lab'],

    'public health': ['Health', 'Public Health'],

    'medical technologist': ['Health', 'Medical Technology'],
    'radiology': ['Health', 'Medical Technology'],
    'ct tech': ['Health', 'Medical Technology'],
};

/**
 * Get job field category and subcategory from job title
 */
export function getJobField(jobTitle: string): [string, string] | null {
    if (!jobTitle) return null;

    const normalized = jobTitle.toLowerCase().trim().replace(/\s+/g, ' ');

    // Check for matches (prioritize longer matches first)
    const sortedMappings = Object.entries(JOB_FIELD_MAPPINGS).sort(
        (a, b) => b[0].length - a[0].length
    );

    for (const [keyword, [category, subcategory]] of sortedMappings) {
        if (normalized.includes(keyword)) {
            return [category, subcategory];
        }
    }

    return null; // No match
}

/**
 * Get job_field_id from Supabase for a given job title
 */
export async function getJobFieldId(
    jobTitle: string
): Promise<number | null> {
    const field = getJobField(jobTitle);
    if (!field) return null;

    const [category, subcategory] = field;

    try {
        const { data, error } = await supabase
            .from('job_field_counts')
            .select('id')
            .eq('category', category)
            .eq('subcategory', subcategory)
            .single();

        if (error) {
            console.error('Error fetching job_field_id:', error);
            return null;
        }

        return data?.id || null;
    } catch (error) {
        console.error('Error in getJobFieldId:', error);
        return null;
    }
}

/**
 * Classify experience level (keep existing logic)
 */
export function classifyExperienceLevel(
    jobTitle: string,
    jobDescription: string,
    jobType: string
): string {
    const text = `${jobTitle} ${jobDescription}`.toLowerCase();

    // Check for advanced indicators
    if (
        /(senior|sr\.|lead|principal|staff|architect|manager|director|vp|vice president|head of|chief|expert|\d+\+?\s*years?|5\s*years|6\s*years|7\s*years|8\s*years|9\s*years|10\s*years|experienced|advanced|\bii\b|\biii\b|\biv\b)/i.test(
            text
        )
    ) {
        return 'advanced';
    }

    return 'moderate';
}

/**
 * Bulk categorize jobs and update Supabase
 * For use in admin page
 */
export async function bulkCategorizeJobs(): Promise<{
    success: number;
    failed: number;
}> {
    // Get all jobs without job_field_id
    const { data: jobs, error: fetchError } = await supabase
        .from('job_postings_ingest_test')
        .select('job_id, job_title')
        .is('job_field_id', null);

    if (fetchError || !jobs) {
        console.error('Error fetching jobs:', fetchError);
        return { success: 0, failed: 0 };
    }

    let success = 0;
    let failed = 0;

    for (const job of jobs) {
        const fieldId = await getJobFieldId(job.job_title);

        if (fieldId) {
            const { error: updateError } = await supabase
                .from('job_postings_ingest_test')
                .update({ job_field_id: fieldId })
                .eq('job_id', job.job_id);

            if (updateError) {
                console.error(`Failed to update ${job.job_id}:`, updateError);
                failed++;
            } else {
                success++;
            }
        } else {
            // No match found - leave as null
            failed++;
        }
    }

    return { success, failed };
}

/**
 * Legacy classification function for backward compatibility
 */
export function classifyJobCategory(
    jobTitle: string,
    jobDescription: string
): string {
    const field = getJobField(jobTitle);
    if (field) return field[0].toLowerCase();

    // Fallback if title search fails?
    // For now, return N/A as expected by existing code
    return 'N/A';
}