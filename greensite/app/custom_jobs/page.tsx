'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import CustomJobsClient from './CustomJobsClient';

export default function CustomJobsPage() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a' }}>
                <p style={{ color: '#52525b', fontSize: '13px' }}>Loading...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a' }}>
                <div style={{ maxWidth: '400px', width: '100%', background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', padding: '32px', textAlign: 'center' }}>
                    <svg style={{ margin: '0 auto 20px', display: 'block', color: '#3f3f46' }} width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <h2 style={{ color: '#e4e4e7', fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>Sign in required</h2>
                    <p style={{ color: '#52525b', fontSize: '12px', marginBottom: '20px' }}>
                        Please sign in to access custom job matching features.
                    </p>
                    <Link
                        href="/auth"
                        style={{ display: 'block', width: '100%', background: 'rgba(255,255,255,0.08)', color: '#e4e4e7', fontWeight: 600, padding: '9px 16px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.14)', textDecoration: 'none', fontSize: '13px', boxSizing: 'border-box' }}
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        );
    }

    return <CustomJobsClient />;
}
