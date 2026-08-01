'use client';

interface PreferencesFormProps {
    formData: {
        jobTypes: string[];
        experienceLevel: 'moderate' | 'advanced' | 'any';
        location: string;
        includeRemote: boolean;
    };
    updateFormData: (field: string, value: any) => void;
}

const MICHIGAN_CITIES = [
    { value: 'MI:all', label: 'All Michigan (statewide)' },
    { value: 'MI:Ann Arbor', label: 'Ann Arbor' },
    { value: 'MI:Battle Creek', label: 'Battle Creek' },
    { value: 'MI:Bay City', label: 'Bay City' },
    { value: 'MI:Dearborn', label: 'Dearborn' },
    { value: 'MI:Detroit', label: 'Detroit' },
    { value: 'MI:East Lansing', label: 'East Lansing' },
    { value: 'MI:Farmington Hills', label: 'Farmington Hills' },
    { value: 'MI:Flint', label: 'Flint' },
    { value: 'MI:Jackson', label: 'Jackson' },
    { value: 'MI:Lansing', label: 'Lansing' },
    { value: 'MI:Livonia', label: 'Livonia' },
    { value: 'MI:Monroe', label: 'Monroe' },
    { value: 'MI:Novi', label: 'Novi' },
    { value: 'MI:Pontiac', label: 'Pontiac' },
    { value: 'MI:Port Huron', label: 'Port Huron' },
    { value: 'MI:Rochester Hills', label: 'Rochester Hills' },
    { value: 'MI:Southfield', label: 'Southfield' },
    { value: 'MI:Sterling Heights', label: 'Sterling Heights' },
    { value: 'MI:Taylor', label: 'Taylor' },
    { value: 'MI:Troy', label: 'Troy' },
    { value: 'MI:Warren', label: 'Warren' },
    { value: 'MI:Westland', label: 'Westland' },
    { value: 'MI:Grand Rapids', label: 'Grand Rapids' },
    { value: 'MI:Holland', label: 'Holland' },
    { value: 'MI:Muskegon', label: 'Muskegon' },
    { value: 'MI:Ludington', label: 'Ludington' },
    { value: 'MI:Wyoming', label: 'Wyoming' },
    { value: 'MI:Benton Harbor', label: 'Benton Harbor' },
    { value: 'MI:St. Joseph', label: 'St. Joseph' },
    { value: 'MI:Kalamazoo', label: 'Kalamazoo' },
    { value: 'MI:Three Rivers', label: 'Three Rivers' },
    { value: 'MI:Midland', label: 'Midland' },
    { value: 'MI:Saginaw', label: 'Saginaw' },
    { value: 'MI:Mount Pleasant', label: 'Mount Pleasant' },
    { value: 'MI:Traverse City', label: 'Traverse City' },
    { value: 'MI:Petoskey', label: 'Petoskey' },
    { value: 'MI:Gaylord', label: 'Gaylord' },
    { value: 'MI:Cadillac', label: 'Cadillac' },
    { value: 'MI:Alpena', label: 'Alpena' },
    { value: 'MI:Bad Axe', label: 'Bad Axe' },
    { value: 'MI:Marquette', label: 'Marquette' },
    { value: 'MI:Escanaba', label: 'Escanaba' },
    { value: 'MI:Houghton', label: 'Houghton' },
    { value: 'MI:Sault Ste. Marie', label: 'Sault Ste. Marie' },
    { value: 'MI:Menominee', label: 'Menominee' },
];

const sectionLabel: React.CSSProperties = {
    color: '#52525b',
    fontSize: '9px',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    marginBottom: '8px',
};

export default function PreferencesForm({ formData, updateFormData }: PreferencesFormProps) {
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
        if (cityValue === 'MI:all') {
            newSelected = selectedCities.includes('MI:all') ? [] : ['MI:all'];
        } else {
            if (selectedCities.includes('MI:all')) {
                newSelected = [cityValue];
            } else if (selectedCities.includes(cityValue)) {
                newSelected = selectedCities.filter(c => c !== cityValue);
            } else {
                newSelected = [...selectedCities, cityValue];
            }
        }
        updateFormData('location', newSelected.join(','));
    };

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
                    {MICHIGAN_CITIES.map((city, i) => {
                        const checked = selectedCities.includes(city.value);
                        const isAll = city.value === 'MI:all';
                        return (
                            <label
                                key={city.value}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '7px 10px',
                                    cursor: 'pointer',
                                    background: checked ? 'rgba(255,255,255,0.05)' : 'transparent',
                                    borderBottom: isAll ? '1px solid rgba(255,255,255,0.06)' : i < MICHIGAN_CITIES.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
                                    transition: 'background 80ms',
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => handleCityToggle(city.value)}
                                    style={{ accentColor: '#e4e4e7', width: '13px', height: '13px', flexShrink: 0 }}
                                />
                                <span style={{
                                    color: checked ? '#e4e4e7' : '#71717a',
                                    fontSize: '12px',
                                    fontWeight: isAll ? 600 : 400,
                                }}>
                                    {city.label}
                                </span>
                            </label>
                        );
                    })}
                </div>
                {selectedCities.length > 0 && (
                    <p style={{ color: '#52525b', fontSize: '10px', marginTop: '6px' }}>
                        {selectedCities.includes('MI:all')
                            ? 'Matching jobs across all of Michigan'
                            : `${selectedCities.length} ${selectedCities.length === 1 ? 'city' : 'cities'} selected`}
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
