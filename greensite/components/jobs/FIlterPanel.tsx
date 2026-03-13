'use client'

import { useState, useEffect, useCallback } from 'react'

export interface FilterOptions {
  jobType: string
  isRemote: string
  state: string
  searchTerm: string
}

interface FilterPanelProps {
  onFiltersChange: (filters: FilterOptions) => void
  loading?: boolean
}

export default function FilterPanel({ onFiltersChange, loading }: FilterPanelProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    jobType: '',
    isRemote: '',
    state: '',
    searchTerm: ''
  })

  const sections = [
    { label: 'Location', key: 'state' },
    { label: 'Field', key: 'searchTerm' },
    { label: 'Type', key: 'jobType' },
    { label: 'level', key: 'isRemote' }
  ]

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  return (
    <div className="w-48 flex-shrink-0">
      <h2 className="text-4xl font-bold text-gray-800 mb-6">Filters</h2>
      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section.label} className="group">
            <div className="h-2 w-24 bg-black mb-4" />
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">{section.label}</h3>
            {/* Simple dummy input/select for now to match the "clean" mockup look */}
            <input
              type="text"
              placeholder="..."
              className="bg-transparent border-none focus:outline-none text-gray-500 w-full italic"
              disabled={loading}
              onChange={(e) => handleFilterChange(section.key as keyof FilterOptions, e.target.value)}
            />
          </div>
        ))}
        <div className="h-2 w-24 bg-black pt-4" />
      </div>
    </div>
  )
}