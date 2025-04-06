import React, { useState } from 'react';
import { Filter, SortAsc, SortDesc } from 'lucide-react';
import { PropertyFilters as FiltersType } from '../types';

interface PropertyFiltersProps {
  onFilterChange: (filters: FiltersType) => void;
}

const PropertyFilters: React.FC<PropertyFiltersProps> = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FiltersType>({});

  const handleFilterChange = (newFilters: Partial<FiltersType>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow-sm hover:bg-gray-50"
      >
        <Filter className="h-5 w-5" />
        <span>Filters</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-lg p-4 z-10">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Type
              </label>
              <select
                className="w-full rounded-lg border-gray-300"
                onChange={(e) => handleFilterChange({ type: e.target.value as any })}
                value={filters.type || ''}
              >
                <option value="">All Types</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="land">Land</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                className="w-full rounded-lg border-gray-300"
                onChange={(e) => handleFilterChange({ status: e.target.value as any })}
                value={filters.status || ''}
              >
                <option value="">All Status</option>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Range
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-1/2 rounded-lg border-gray-300"
                  onChange={(e) => handleFilterChange({ minPrice: Number(e.target.value) || undefined })}
                  value={filters.minPrice || ''}
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="w-1/2 rounded-lg border-gray-300"
                  onChange={(e) => handleFilterChange({ maxPrice: Number(e.target.value) || undefined })}
                  value={filters.maxPrice || ''}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <div className="flex gap-2">
                <select
                  className="w-2/3 rounded-lg border-gray-300"
                  onChange={(e) => handleFilterChange({ sortBy: e.target.value as any })}
                  value={filters.sortBy || ''}
                >
                  <option value="created_at">Date Listed</option>
                  <option value="price">Price</option>
                  <option value="views">Views</option>
                </select>
                <button
                  className="w-1/3 flex items-center justify-center gap-1 border rounded-lg hover:bg-gray-50"
                  onClick={() => handleFilterChange({ 
                    sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' 
                  })}
                >
                  {filters.sortOrder === 'asc' ? (
                    <SortAsc className="h-5 w-5" />
                  ) : (
                    <SortDesc className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyFilters;