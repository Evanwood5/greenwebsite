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

// Michigan cities from city_coordinates.py
const MICHIGAN_CITIES = [
    { value: 'MI:all', label: '🌟 All Michigan (statewide)' },

    // Southeast / Metro Detroit
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

    // West Michigan
    { value: 'MI:Grand Rapids', label: 'Grand Rapids' },
    { value: 'MI:Holland', label: 'Holland' },
    { value: 'MI:Muskegon', label: 'Muskegon' },
    { value: 'MI:Ludington', label: 'Ludington' },
    { value: 'MI:Wyoming', label: 'Wyoming' },
    { value: 'MI:Benton Harbor', label: 'Benton Harbor' },
    { value: 'MI:St. Joseph', label: 'St. Joseph' },

    // Southwest / South Central
    { value: 'MI:Kalamazoo', label: 'Kalamazoo' },
    { value: 'MI:Three Rivers', label: 'Three Rivers' },

    // Mid-Michigan / Central
    { value: 'MI:Midland', label: 'Midland' },
    { value: 'MI:Saginaw', label: 'Saginaw' },
    { value: 'MI:Mount Pleasant', label: 'Mount Pleasant' },

    // Northern Lower Peninsula
    { value: 'MI:Traverse City', label: 'Traverse City' },
    { value: 'MI:Petoskey', label: 'Petoskey' },
    { value: 'MI:Gaylord', label: 'Gaylord' },
    { value: 'MI:Cadillac', label: 'Cadillac' },
    { value: 'MI:Alpena', label: 'Alpena' },
    { value: 'MI:Bad Axe', label: 'Bad Axe' },

    // Upper Peninsula
    { value: 'MI:Marquette', label: 'Marquette' },
    { value: 'MI:Escanaba', label: 'Escanaba' },
    { value: 'MI:Houghton', label: 'Houghton' },
    { value: 'MI:Sault Ste. Marie', label: 'Sault Ste. Marie' },
    { value: 'MI:Menominee', label: 'Menominee' }
];

export default function PreferencesForm({ formData, updateFormData }: PreferencesFormProps) {
    const jobTypeOptions = [
        { value: 'full-time', label: 'Full-time' },
        { value: 'internship', label: 'Internship' },
        { value: 'part-time', label: 'Part-time' },
    ];

    // Parse location from string to array for multi-select
    // formData.location could be "MI:Detroit" or "MI:Detroit,MI:Lansing"
    const selectedCities = formData.location ? formData.location.split(',').filter(Boolean) : [];

    const handleJobTypeToggle = (type: string) => {
        const current = formData.jobTypes;

        if (current.includes(type)) {
            // Remove if already selected
            updateFormData('jobTypes', current.filter(t => t !== type));
        } else {
            // Add if not at limit (max 2)
            if (current.length < 2) {
                updateFormData('jobTypes', [...current, type]);
            } else {
                alert('You can select up to 2 job types');
            }
        }
    };

    const handleCityToggle = (cityValue: string) => {
        let newSelected: string[];

        // If "All Michigan" is clicked
        if (cityValue === 'MI:all') {
            if (selectedCities.includes('MI:all')) {
                // Unselect all
                newSelected = [];
            } else {
                // Select only "All Michigan" (clear individual cities)
                newSelected = ['MI:all'];
            }
        } else {
            // Individual city clicked
            if (selectedCities.includes('MI:all')) {
                // If "All Michigan" was selected, replace it with this city
                newSelected = [cityValue];
            } else if (selectedCities.includes(cityValue)) {
                // Unselect this city
                newSelected = selectedCities.filter(c => c !== cityValue);
            } else {
                // Add this city
                newSelected = [...selectedCities, cityValue];
            }
        }

        // Convert array back to comma-separated string
        updateFormData('location', newSelected.join(','));
    };

    return (
        <div>
            {/* Job Types */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Job Type (select up to 2)
                </label>
                <div className="grid grid-cols-2 gap-3">
                    {jobTypeOptions.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => handleJobTypeToggle(option.value)}
                            className={`p-4 rounded-lg border-2 font-semibold transition-all ${formData.jobTypes.includes(option.value)
                                ? 'border-green-600 bg-green-50 text-green-700'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            {formData.jobTypes.includes(option.value) && '✓ '}
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Experience Level (only for full-time) */}
            {formData.jobTypes.includes('full-time') && (
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Experience Level (for full-time jobs)
                    </label>
                    <div className="space-y-2">
                        {[
                            { value: 'moderate', label: 'Moderate (0-2 years)' },
                            { value: 'advanced', label: 'Advanced (2+ years)' },
                            { value: 'any', label: 'Any level' },
                        ].map((option) => (
                            <label
                                key={option.value}
                                className="flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer hover:bg-gray-50 transition-colors"
                            >
                                <input
                                    type="radio"
                                    name="experienceLevel"
                                    value={option.value}
                                    checked={formData.experienceLevel === option.value}
                                    onChange={(e) => updateFormData('experienceLevel', e.target.value)}
                                    className="w-4 h-4 text-green-600"
                                />
                                <span className="font-medium text-gray-700">{option.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Location - MULTI-SELECT WITH CHECKBOXES */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                    📍 Location (select one or more cities)
                </label>
                <p className="text-sm text-blue-600 mb-3 bg-blue-50 p-3 rounded-lg border border-blue-200">
                    ℹ️ Each location will have a 30-mile radius for job matching
                </p>
                <div className="border-2 border-gray-200 rounded-lg p-4 max-h-64 overflow-y-auto bg-white">
                    <div className="space-y-2">
                        {MICHIGAN_CITIES.map((city) => (
                            <label
                                key={city.value}
                                className={`flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-50 transition-colors ${city.value === 'MI:all' ? 'bg-green-50 border-b-2 border-green-200 mb-2 pb-3' : ''
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedCities.includes(city.value)}
                                    onChange={() => handleCityToggle(city.value)}
                                    className="w-4 h-4 text-green-600 rounded"
                                />
                                <span className={`text-sm ${city.value === 'MI:all' ? 'font-bold text-green-700' : 'text-gray-700'}`}>
                                    {city.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
                {selectedCities.length > 0 && (
                    <p className="text-xs text-gray-500 mt-2">
                        {selectedCities.includes('MI:all')
                            ? 'Matching jobs across all of Michigan'
                            : `Selected ${selectedCities.length} ${selectedCities.length === 1 ? 'city' : 'cities'}`
                        }
                    </p>
                )}
            </div>

            {/* Include Remote */}
            <div className="mb-6">
                <label className="flex items-center gap-3 p-4 rounded-lg border-2 border-gray-200 cursor-pointer hover:bg-gray-50">
                    <input
                        type="checkbox"
                        checked={formData.includeRemote}
                        onChange={(e) => updateFormData('includeRemote', e.target.checked)}
                        className="w-5 h-5 text-green-600 rounded"
                    />
                    <div>
                        <p className="font-semibold text-gray-700">Include remote jobs</p>
                        <p className="text-sm text-gray-500">Get matched with remote opportunities</p>
                    </div>
                </label>
            </div>
        </div>
    );
}