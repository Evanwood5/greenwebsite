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
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Filters</h2>
      <div className="space-y-10">
        {sections.map((section) => (
          <div key={section.label} className="group">
            <div className="h-1.5 w-12 bg-green-600 mb-4 rounded-full" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">{section.label}</h3>
            {/* Simple input/select to match the clean look */}
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-b border-gray-200 focus:border-green-600 focus:outline-none text-gray-600 w-full py-2 transition-colors"
              disabled={loading}
              onChange={(e) => handleFilterChange(section.key as keyof FilterOptions, e.target.value)}
            />
          </div>
        ))}
        <div className="h-1.5 w-12 bg-green-600 pt-4 rounded-full" />
      </div>
    </div>
  )
}