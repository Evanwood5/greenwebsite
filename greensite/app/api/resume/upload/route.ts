import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('resume') as File;
        const userId = formData.get('userId') as string;

        if (!file || !userId) {
            return Response.json({ error: 'Missing file or user ID' }, { status: 400 });
        }

        // Validate file
        if (file.type !== 'application/pdf') {
            return Response.json({ error: 'Only PDF files allowed' }, { status: 400 });
        }

        if (file.size > 2 * 1024 * 1024) {
            return Response.json({ error: 'File must be less than 2MB' }, { status: 400 });
        }

        // Send to Python service for PII stripping
        const pythonFormData = new FormData();
        pythonFormData.append('file', file);

        console.log('Sending to Python PII service...');
        const pythonResponse = await fetch('https://greenify-pii-service.onrender.com/strip-pii', {
            method: 'POST',
            body: pythonFormData,
        });

        if (!pythonResponse.ok) {
            throw new Error('PII stripping failed');
        }

        const result = await pythonResponse.json();
        const cleaned_text = result.text;

        console.log('PII stripped successfully, text length:', cleaned_text.length);

        // Save to Supabase
        const { error } = await supabase
            .from('profiles')
            .upsert({
                user_id: userId,
                resume: cleaned_text,
            });

        if (error) throw error;

        console.log('✅ Resume saved to Supabase');
        return Response.json({
            success: true,
            message: 'Resume uploaded and processed successfully'
        });

    } catch (error) {
        console.error('Resume upload error:', error);
        return Response.json({
            error: 'Failed to process resume',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}