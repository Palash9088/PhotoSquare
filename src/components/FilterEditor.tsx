import React from 'react';
import { ImageFilters } from '../types';

interface FilterEditorProps {
  filters: ImageFilters;
  onChange: (filters: ImageFilters) => void;
}

const FilterEditor: React.FC<FilterEditorProps> = ({ filters, onChange }) => {
  const handleFilterChange = (key: keyof ImageFilters, value: number) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  const resetFilters = () => {
    onChange({
      grayscale: 0,
      sepia: 0,
      brightness: 100,
      contrast: 100,
    });
  };

  const filterConfigs = [
    { key: 'grayscale' as const, label: 'Grayscale', min: 0, max: 100, step: 1, unit: '%' },
    { key: 'sepia' as const, label: 'Sepia', min: 0, max: 100, step: 1, unit: '%' },
    { key: 'brightness' as const, label: 'Brightness', min: 0, max: 200, step: 1, unit: '%' },
    { key: 'contrast' as const, label: 'Contrast', min: 0, max: 200, step: 1, unit: '%' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={resetFilters}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Reset All
        </button>
      </div>
      
      <div className="space-y-6">
        {filterConfigs.map(({ key, label, min, max, step, unit }) => (
          <div key={key}>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                {label}
              </label>
              <span className="text-sm text-gray-500">
                {filters[key]}{unit}
              </span>
            </div>
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={filters[key]}
              onChange={(e) => handleFilterChange(key, Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer 
                [&::-webkit-slider-thumb]:appearance-none 
                [&::-webkit-slider-thumb]:h-5 
                [&::-webkit-slider-thumb]:w-5 
                [&::-webkit-slider-thumb]:rounded-full 
                [&::-webkit-slider-thumb]:bg-blue-600 
                [&::-webkit-slider-thumb]:cursor-pointer 
                [&::-webkit-slider-thumb]:shadow-sm
                [&::-webkit-slider-thumb]:hover:bg-blue-700
                [&::-moz-range-thumb]:h-5 
                [&::-moz-range-thumb]:w-5 
                [&::-moz-range-thumb]:rounded-full 
                [&::-moz-range-thumb]:bg-blue-600 
                [&::-moz-range-thumb]:cursor-pointer 
                [&::-moz-range-thumb]:border-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterEditor; 