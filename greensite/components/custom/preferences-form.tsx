'use client';

import { useState, useEffect } from 'react';

interface PreferencesFormProps {
    formData: {
        jobTypes: string[];
        experienceLevel: 'moderate' | 'advanced' | 'any';
        location: string;
        includeRemote: boolean;
    };
    updateFormData: (field: string, value: any) => void;
}

const sectionLabel: React.CSSProperties = {
    color: '#52525b',
    fontSize: '9px',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    marginBottom: '8px',
};

export default function PreferencesForm({ formData, updateFormData }: PreferencesFormProps) {
    const [michiganCities, setMichiganCities] = useState<string[]>([]);

    useEffect(() => {
        fetch('/api/cities')
            .then(r => r.json())
            .then(data => setMichiganCities(data.cities ?? []))
            .catch(() => {});
    }, []);

    const jobTypeOptions = [
        { value: 'full-time', label: 'Full-time' },
        { value: 'internship', label: 'Internship' },
        { value: 'part-time', label: 'Part-time' },
    ];

    const selectedCities = formData.location ? formData.location.split(',').filter(Boolean) : [];

    const handleJobTypeToggle = (type: string) => {
        const current = formData.jobTypes;
        if (current.includes(type)) {
            updateFormData('jobTypes', current.filter(t => t !== type));
        } else {
            if (current.length < 2) {
                updateFormData('jobTypes', [...current, type]);
            } else {
                alert('You can select up to 2 job types');
            }
        }
    };

    const handleCityToggle = (cityValue: string) => {
        let newSelected: string[];
        if (cityValue === '') {
            // "All Michigan" — clear all city selections (empty = all Michigan)
            newSelected = [];
        } else if (selectedCities.includes(cityValue)) {
            newSelected = selectedCities.filter(c => c !== cityValue);
        } else {
            newSelected = [...selectedCities, cityValue];
        }
        updateFormData('location', newSelected.join(','));
    };

    const allMichiganChecked = selectedCities.length === 0;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Job Types */}
            <div>
                <p style={sectionLabel}>Job Type <span style={{ color: '#3f3f46', fontWeight: 400, letterSpacing: 0, textTransform: 'none' }}>— select up to 2</span></p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                    {jobTypeOptions.map((option) => {
                        const selected = formData.jobTypes.includes(option.value);
                        return (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => handleJobTypeToggle(option.value)}
                                style={{
                                    padding: '9px 12px',
                                    borderRadius: '4px',
                                    border: `1px solid ${selected ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)'}`,
                                    background: selected ? 'rgba(255,255,255,0.08)' : 'transparent',
                                    color: selected ? '#e4e4e7' : '#52525b',
                                    fontSize: '12px',
                                    fontWeight: selected ? 600 : 400,
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    transition: 'all 120ms',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '5px',
                                }}
                            >
                                {selected && (
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                )}
                                {option.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Experience Level */}
            {formData.jobTypes.includes('full-time') && (
                <div>
                    <p style={sectionLabel}>Experience Level <span style={{ color: '#3f3f46', fontWeight: 400, letterSpacing: 0, textTransform: 'none' }}>— full-time only</span></p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {[
                            { value: 'moderate', label: 'Moderate (0–2 years)' },
                            { value: 'advanced', label: 'Advanced (2+ years)' },
                            { value: 'any', label: 'Any level' },
                        ].map((option) => {
                            const selected = formData.experienceLevel === option.value;
                            return (
                                <label
                                    key={option.value}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        padding: '8px 10px',
                                        borderRadius: '4px',
                                        border: `1px solid ${selected ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.06)'}`,
                                        background: selected ? 'rgba(255,255,255,0.06)' : 'transparent',
                                        cursor: 'pointer',
                                        transition: 'all 120ms',
                                    }}
                                >
                                    <input
                                        type="radio"
                                        name="experienceLevel"
                                        value={option.value}
                                        checked={selected}
                                        onChange={(e) => updateFormData('experienceLevel', e.target.value)}
                                        style={{ accentColor: '#e4e4e7', width: '14px', height: '14px' }}
                                    />
                                    <span style={{ color: selected ? '#e4e4e7' : '#71717a', fontSize: '12px', fontWeight: selected ? 500 : 400 }}>
                                        {option.label}
                                    </span>
                                </label>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Location */}
            <div>
                <p style={sectionLabel}>Location <span style={{ color: '#3f3f46', fontWeight: 400, letterSpacing: 0, textTransform: 'none' }}>— 30-mile radius per city</span></p>
                <div style={{
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '4px',
                    maxHeight: '220px',
                    overflowY: 'auto',
                    background: '#141414',
                }}>
                    {/* All Michigan row */}
                    <label
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '7px 10px',
                            cursor: 'pointer',
                            background: allMichiganChecked ? 'rgba(255,255,255,0.05)' : 'transparent',
                            borderBottom: '1px solid rgba(255,255,255,0.06)',
                            transition: 'background 80ms',
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={allMichiganChecked}
                            onChange={() => handleCityToggle('')}
                            style={{ accentColor: '#e4e4e7', width: '13px', height: '13px', flexShrink: 0 }}
                        />
                        <span style={{ color: allMichiganChecked ? '#e4e4e7' : '#71717a', fontSize: '12px', fontWeight: 600 }}>
                            All Michigan (statewide)
                        </span>
                    </label>
                    {michiganCities.map((city, i) => {
                        const checked = selectedCities.includes(city);
                        return (
                            <label
                                key={city}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '7px 10px',
                                    cursor: 'pointer',
                                    background: checked ? 'rgba(255,255,255,0.05)' : 'transparent',
                                    borderBottom: i < michiganCities.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
                                    transition: 'background 80ms',
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => handleCityToggle(city)}
                                    style={{ accentColor: '#e4e4e7', width: '13px', height: '13px', flexShrink: 0 }}
                                />
                                <span style={{ color: checked ? '#e4e4e7' : '#71717a', fontSize: '12px', fontWeight: 400 }}>
                                    {city}
                                </span>
                            </label>
                        );
                    })}
                </div>
                {selectedCities.length > 0 && (
                    <p style={{ color: '#52525b', fontSize: '10px', marginTop: '6px' }}>
                        {`${selectedCities.length} ${selectedCities.length === 1 ? 'city' : 'cities'} selected`}
                    </p>
                )}
            </div>

            {/* Include Remote */}
            <div>
                <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    borderRadius: '4px',
                    border: `1px solid ${formData.includeRemote ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.06)'}`,
                    background: formData.includeRemote ? 'rgba(255,255,255,0.05)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 120ms',
                }}>
                    <input
                        type="checkbox"
                        checked={formData.includeRemote}
                        onChange={(e) => updateFormData('includeRemote', e.target.checked)}
                        style={{ accentColor: '#e4e4e7', width: '14px', height: '14px', flexShrink: 0 }}
                    />
                    <div>
                        <p style={{ color: formData.includeRemote ? '#e4e4e7' : '#71717a', fontSize: '12px', fontWeight: 500 }}>Include remote jobs</p>
                        <p style={{ color: '#52525b', fontSize: '11px' }}>Get matched with remote opportunities</p>
                    </div>
                </label>
            </div>
        </div>
    );
}
