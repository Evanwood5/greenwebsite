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

  const [searchInput, setSearchInput] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)

  // Debounce search input
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (filters.searchTerm !== searchInput) {
        const newFilters = { ...filters, searchTerm: searchInput }
        setFilters(newFilters)
        onFiltersChange(newFilters)
      }
    }, 300) // Wait 300ms after user stops typing

    return () => clearTimeout(debounceTimer)
  }, [searchInput, filters, onFiltersChange])

  // Common job types and states for filters
  const jobTypes = [
    'Full Time',
    'Part Time'
  ]

  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ]

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {
      jobType: '',
      isRemote: '',
      state: '',
      searchTerm: ''
    }
    setFilters(clearedFilters)
    setSearchInput('') // Clear search input as well
    onFiltersChange(clearedFilters)
  }

  const hasActiveFilters = Object.values({...filters, searchTerm: searchInput}).some(value => value !== '')

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Filter Jobs</h2>
        <div className="flex items-center gap-3">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              disabled={loading}
              className="text-sm text-blue-600 hover:text-blue-800 disabled:text-blue-400"
            >
              Clear All
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            {isExpanded ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
      </div>

      {/* Filter Content */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Search */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Jobs
            </label>
            <input
              id="search"
              type="text"
              placeholder="Job title, company, keywords..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Job Type Filter */}
            <div>
              <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-1">
                Job Type
              </label>
              <select
                id="jobType"
                value={filters.jobType}
                onChange={(e) => handleFilterChange('jobType', e.target.value)}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">All Types</option>
                {jobTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Remote Filter */}
            <div>
              <label htmlFor="isRemote" className="block text-sm font-medium text-gray-700 mb-1">
                Work Location
              </label>
              <select
                id="isRemote"
                value={filters.isRemote}
                onChange={(e) => handleFilterChange('isRemote', e.target.value)}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">All Locations</option>
                <option value="remote">Remote Only</option>
                <option value="onsite">On-site Only</option>
              </select>
            </div>

            {/* State Filter */}
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <select
                id="state"
                value={filters.state}
                onChange={(e) => handleFilterChange('state', e.target.value)}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">All States</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="pt-3 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-600">Active filters:</span>
                {searchInput && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Search: {searchInput}
                  </span>
                )}
                {filters.jobType && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Type: {filters.jobType}
                  </span>
                )}
                {filters.isRemote && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Location: {filters.isRemote === 'remote' ? 'Remote' : 'On-site'}
                  </span>
                )}
                {filters.state && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    State: {filters.state}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}