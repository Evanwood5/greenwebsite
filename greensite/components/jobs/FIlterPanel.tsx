'use client'

import { useState, useEffect } from 'react'

export interface FilterOptions {
  jobType: string
  isRemote: string
  state: string
  searchTerm: string
  jobField: string
  jobSubField: string
  city: string
}

interface FilterPanelProps {
  onFiltersChange: (filters: FilterOptions) => void
  loading?: boolean
}

const JOB_FIELDS: Record<string, string[]> = {
  'Tech': [
    'Software Engineering',
    'Data Science / AI',
    'IT / Sysadmin',
    'Cybersecurity',
    'Cloud / DevOps',
    'QA / Testing',
    'UI / UX',
    'Hardware / Embedded',
  ],
  'Engineering': [
    'Mechanical',
    'Electrical',
    'Civil / Structural',
    'Chemical',
    'Industrial',
    'Aerospace',
    'Materials',
    'Environmental',
    'Automotive',
    'Manufacturing',
    'Trades',
  ],
  'Business': [
    'Finance / Accounting',
    'Banking / Finance',
    'Marketing / Sales',
    'Operations / Logistics',
    'HR / Recruiting',
    'Business Analytics',
    'Consulting / Strategy',
    'Project Management',
  ],
  'Health': [
    'Clinical / Nursing',
    'Allied Health',
    'Pharmacy',
    'Healthcare Administration',
    'Research / Lab',
    'Public Health',
    'Medical Technology',
  ],
}

const JOB_TYPES = ['Full Time', 'Part Time', 'Internship']

const LOCATIONS = [
  'Ada', 'Allegan', 'Allen Park', 'Alpena', 'Ann Arbor', 'Auburn', 'Auburn Hills',
  'Bad Axe', 'Battle Creek', 'Bay City', 'Belleville', 'Benton Harbor', 'Bloomfield Hills', 'Brownstown Township',
  'Cadillac', 'Canton', 'Chelsea', 'Chesterfield', 'Comstock Park',
  'Dearborn', 'Dearborn Heights', 'Detroit', 'Dundee',
  'East Lansing', 'Eastpointe', 'Escanaba',
  'Farmington Hills', 'Farwell', 'Flint', 'Flushing',
  'Gaylord', 'Grand Rapids',
  'Holland', 'Houghton',
  'Iron Mountain',
  'Jackson',
  'Kalamazoo', 'Kalkaska', 'Kentwood',
  'Lansing', 'Leslie', 'Livonia', 'Ludington',
  'Macomb', 'Madison Heights', 'Marquette', 'Marshall', 'Menominee', 'Midland', 'Monroe', 'Mount Pleasant', 'Muskegon',
  'Newport', 'Novi',
  'Petoskey', 'Plymouth', 'Pontiac', 'Port Huron', 'Portage',
  'Rochester Hills', 'Rockford', 'Roscommon', 'Royal Oak',
  'Saginaw', 'Sault Ste. Marie', 'Southfield', 'St. Clair Shores', 'St. Joseph', 'Sterling Heights',
  'Taylor', 'Three Rivers', 'Traverse City', 'Troy',
  'Walker', 'Warren', 'Westland', 'White Lake', 'Wyoming',
  'Ypsilanti',
  'Zeeland',
]

export default function FilterPanel({ onFiltersChange, loading }: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([])
  const [selectedField, setSelectedField] = useState('')
  const [selectedSubFields, setSelectedSubFields] = useState<string[]>([])
  const [searchInput, setSearchInput] = useState('')
  const [isRemote, setIsRemote] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [citySearch, setCitySearch] = useState('')

  const filteredLocations = citySearch
    ? LOCATIONS.filter(c => c.toLowerCase().includes(citySearch.toLowerCase()))
    : LOCATIONS

  useEffect(() => {
    const timer = setTimeout(() => {
      onFiltersChange({
        jobType: selectedJobTypes[0] || '',
        isRemote,
        state: '',
        searchTerm: searchInput,
        jobField: selectedField,
        jobSubField: selectedSubFields[0] || '',
        city: selectedCity,
      })
    }, 300)
    return () => clearTimeout(timer)
  }, [searchInput])

  const buildFilters = (overrides: Partial<FilterOptions> = {}): FilterOptions => ({
    jobType: selectedJobTypes[0] || '',
    isRemote,
    state: '',
    searchTerm: searchInput,
    jobField: selectedField,
    jobSubField: selectedSubFields[0] || '',
    city: selectedCity,
    ...overrides,
  })

  const toggleJobType = (type: string) => {
    const updated = selectedJobTypes.includes(type)
      ? selectedJobTypes.filter(t => t !== type)
      : [...selectedJobTypes, type]
    setSelectedJobTypes(updated)
    onFiltersChange(buildFilters({ jobType: updated[0] || '' }))
  }

  const handleFieldSelect = (field: string) => {
    const newField = selectedField === field ? '' : field
    setSelectedField(newField)
    setSelectedSubFields([])
    onFiltersChange(buildFilters({ jobField: newField, jobSubField: '' }))
  }

  const toggleSubField = (sub: string) => {
    const updated = selectedSubFields.includes(sub)
      ? selectedSubFields.filter(s => s !== sub)
      : [...selectedSubFields, sub]
    setSelectedSubFields(updated)
    onFiltersChange(buildFilters({ jobSubField: updated[0] || '' }))
  }

  const handleLocationChange = (val: string) => {
    setIsRemote(val)
    onFiltersChange(buildFilters({ isRemote: val }))
  }

  const handleCitySelect = (city: string) => {
    const val = selectedCity === city ? '' : city
    setSelectedCity(val)
    onFiltersChange(buildFilters({ city: val }))
  }

  const clearAll = () => {
    setSelectedJobTypes([])
    setSelectedField('')
    setSelectedSubFields([])
    setSearchInput('')
    setIsRemote('')
    setSelectedCity('')
    setCitySearch('')
    onFiltersChange({
      jobType: '',
      isRemote: '',
      state: '',
      searchTerm: '',
      jobField: '',
      jobSubField: '',
      city: '',
    })
  }

  const activeCount =
    selectedJobTypes.length +
    (selectedField ? 1 : 0) +
    selectedSubFields.length +
    (isRemote ? 1 : 0) +
    (searchInput ? 1 : 0) +
    (selectedCity ? 1 : 0)

  return (
    <div className="mb-6">

      <div className="mb-3">
        <input
          type="text"
          placeholder="Search job title, company, keywords..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          disabled={loading}
          className="w-full px-4 py-2.5 rounded-lg text-sm text-white placeholder-gray-500 border border-gray-800/50 focus:outline-none focus:border-gray-600 disabled:opacity-50"
          style={{ backgroundColor: '#1e1e1e' }}
        />
      </div>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-gray-800/50 hover:border-gray-700/50 transition-colors"
        style={{ backgroundColor: '#1e1e1e' }}
      >
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"
            />
          </svg>
          <span className="text-sm font-medium text-white">Filters</span>
          {activeCount > 0 && (
            <span
              className="text-[10px] px-2 py-0.5 rounded-full border font-medium"
              style={{
                backgroundColor: 'rgba(41, 193, 21, 0.1)',
                color: '#29C115',
                borderColor: 'rgba(41, 193, 21, 0.2)',
              }}
            >
              {activeCount} active
            </span>
          )}
        </div>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div
          className="border border-t-0 border-gray-800/50 rounded-b-lg p-4"
          style={{ backgroundColor: '#1e1e1e' }}
        >
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">

            {/* Job Type */}
            <div>
              <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-3">Job Type</p>
              <div className="space-y-2">
                {JOB_TYPES.map(type => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedJobTypes.includes(type)}
                      onChange={() => toggleJobType(type)}
                      className="w-3.5 h-3.5 rounded border-gray-700"
                      style={{ accentColor: '#29C115' }}
                    />
                    <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                      {type}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Job Field */}
            <div>
              <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-3">Job Field</p>
              <div className="space-y-2">
                {Object.keys(JOB_FIELDS).map(field => (
                  <label key={field} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedField === field}
                      onChange={() => handleFieldSelect(field)}
                      className="w-3.5 h-3.5 rounded border-gray-700"
                      style={{ accentColor: '#29C115' }}
                    />
                    <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                      {field}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Job Sub-Field */}
            <div>
              <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-3">Job Sub-Field</p>
              {selectedField ? (
                <div className="space-y-2">
                  {JOB_FIELDS[selectedField].map(sub => (
                    <label key={sub} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedSubFields.includes(sub)}
                        onChange={() => toggleSubField(sub)}
                        className="w-3.5 h-3.5 rounded border-gray-700"
                        style={{ accentColor: '#29C115' }}
                      />
                      <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                        {sub}
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-600 italic">Select a field first</p>
              )}
            </div>

            {/* Work Location */}
            <div>
              <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-3">Work Location</p>
              <div className="space-y-2">
                {[
                  { label: 'All Locations', value: '' },
                  { label: 'Remote Only', value: 'remote' },
                  { label: 'On-site Only', value: 'onsite' },
                ].map(opt => (
                  <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="workLocation"
                      checked={isRemote === opt.value}
                      onChange={() => handleLocationChange(opt.value)}
                      className="w-3.5 h-3.5 border-gray-700"
                      style={{ accentColor: '#29C115' }}
                    />
                    <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* City */}
            <div>
              <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-2">City</p>
              <input
                type="text"
                placeholder="Search city..."
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
                className="w-full px-2 py-1 mb-2 rounded text-xs text-white placeholder-gray-600 border border-gray-700/50 focus:outline-none focus:border-gray-500"
                style={{ backgroundColor: '#2a2a2a' }}
              />
              {selectedCity && (
                <div className="mb-2 text-xs" style={{ color: '#29C115' }}>
                  ✓ {selectedCity}
                </div>
              )}
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {filteredLocations.map(city => (
                  <label key={city} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="city"
                      checked={selectedCity === city}
                      onChange={() => handleCitySelect(city)}
                      className="w-3.5 h-3.5 border-gray-700"
                      style={{ accentColor: '#29C115' }}
                    />
                    <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                      {city}
                    </span>
                  </label>
                ))}
                {filteredLocations.length === 0 && (
                  <p className="text-xs text-gray-600 italic">No cities found</p>
                )}
              </div>
            </div>

          </div>

          {activeCount > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-800/50">
              <button
                onClick={clearAll}
                className="text-xs text-white px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
