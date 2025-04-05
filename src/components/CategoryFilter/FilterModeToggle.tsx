import React from 'react';

interface FilterModeToggleProps {
  filterMode: 'AND' | 'OR';
  setFilterMode: (mode: 'AND' | 'OR') => void;
}

export default function FilterModeToggle({ filterMode, setFilterMode }: FilterModeToggleProps) {
  return (
    <div className="flex items-center justify-start py-2">
      <span className="text-sm font-medium mr-2">Filter mode:</span>
      <div className="flex border rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => setFilterMode('AND')}
          className={`px-3 py-1.5 text-sm ${
            filterMode === 'AND' 
              ? 'bg-blue-600 text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Match ALL (AND)
        </button>
        <button
          type="button"
          onClick={() => setFilterMode('OR')}
          className={`px-3 py-1.5 text-sm ${
            filterMode === 'OR' 
              ? 'bg-blue-600 text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Match ANY (OR)
        </button>
      </div>
    </div>
  );
}