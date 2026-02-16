import { stripResumePII } from '@/lib/stripResumePII';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('resume') as File;
        const userId = formData.get('userId') as string;

        if (!file || !userId) {
            return Response.json({ error: 'Missing file or user ID' }, { status: 400 });
        }

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Strip PII from resume
        console.log('Stripping PII from resume...');
        const cleanedText = await stripResumePII(buffer);

        // Save to Supabase profiles table
        const { error } = await supabase
            .from('profiles')
            .upsert({
                user_id: userId,
                resume: cleanedText,
            });

        if (error) throw error;

        console.log('✅ Resume saved successfully');
        return Response.json({
            success: true,
            message: 'Resume uploaded and processed successfully'
        });

    } catch (error) {
        console.error('Resume upload error:', error);
        return Response.json({
            error: 'Failed to process resume'
        }, { status: 500 });
    }
}