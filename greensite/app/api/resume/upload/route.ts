import { supabaseAdmin } from '@/lib/db/supabase-admin';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
    try {
        // Verify the caller's JWT — userId must come from the token, not the request body
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

        if (!token) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const anonClient = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            { global: { headers: { Authorization: `Bearer ${token}` } } }
        );

        const { data: { user }, error: authError } = await anonClient.auth.getUser(token);
        if (authError || !user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('resume') as File;
        // userId comes from the verified token, NOT the request body
        const userId = user.id;

        if (!file) {
            return Response.json({ error: 'Missing file' }, { status: 400 });
        }

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

        // Try update first (handles accounts created manually via Supabase dashboard)
        // Falls back to insert if no row exists yet
        const { error: updateError } = await supabaseAdmin
            .from('profiles')
            .update({ resume: cleaned_text })
            .eq('user_id', userId);

        if (updateError) {
            // Row doesn't exist yet — insert it
            const { error: insertError } = await supabaseAdmin
                .from('profiles')
                .insert({ user_id: userId, resume: cleaned_text });

            if (insertError) throw insertError;
        }

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
