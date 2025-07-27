import React, { useState } from 'react';
import { ImageFilters } from '../types';

interface FilterEditorProps {
  filters: ImageFilters;
  onChange: (filters: ImageFilters) => void;
}

interface FilterConfig {
  key: keyof ImageFilters;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
}

interface PresetFilterConfig {
  key: keyof ImageFilters;
  label: string;
  emoji: string;
  description: string;
}

const FilterEditor: React.FC<FilterEditorProps> = ({ filters, onChange }) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced' | 'presets'>('basic');

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
      saturation: 100,
      hue: 0,
      blur: 0,
      sharpen: 0,
      vignette: 0,
      temperature: 0,
      vintage: 0,
      drama: 0,
      clarify: 0,
      hdr: 0,
      lomo: 0,
      cross: 0,
      pinhole: 0,
      kodachrome: 0,
      technicolor: 0,
      polaroid: 0,
    });
  };

  const basicFilters: FilterConfig[] = [
    { key: 'brightness', label: 'Brightness', min: 0, max: 200, step: 1, unit: '%' },
    { key: 'contrast', label: 'Contrast', min: 0, max: 200, step: 1, unit: '%' },
    { key: 'saturation', label: 'Saturation', min: 0, max: 200, step: 1, unit: '%' },
    { key: 'grayscale', label: 'Grayscale', min: 0, max: 100, step: 1, unit: '%' },
    { key: 'sepia', label: 'Sepia', min: 0, max: 100, step: 1, unit: '%' },
  ];

  const advancedFilters: FilterConfig[] = [
    { key: 'hue', label: 'Hue', min: -180, max: 180, step: 1, unit: '°' },
    { key: 'temperature', label: 'Temperature', min: -100, max: 100, step: 1, unit: '' },
    { key: 'blur', label: 'Blur', min: 0, max: 10, step: 0.1, unit: 'px' },
    { key: 'sharpen', label: 'Sharpen', min: 0, max: 100, step: 1, unit: '%' },
    { key: 'vignette', label: 'Vignette', min: 0, max: 100, step: 1, unit: '%' },
    { key: 'clarify', label: 'Clarify', min: 0, max: 100, step: 1, unit: '%' },
    { key: 'hdr', label: 'HDR', min: 0, max: 100, step: 1, unit: '%' },
  ];

  const presetFilters: PresetFilterConfig[] = [
    { key: 'vintage', label: 'Vintage', emoji: '📸', description: 'Classic film look' },
    { key: 'drama', label: 'Drama', emoji: '🎭', description: 'High contrast drama' },
    { key: 'lomo', label: 'Lomo', emoji: '📷', description: 'Lomography style' },
    { key: 'cross', label: 'Cross Process', emoji: '🌈', description: 'Color cross processing' },
    { key: 'pinhole', label: 'Pinhole', emoji: '🕳️', description: 'Pinhole camera effect' },
    { key: 'kodachrome', label: 'Kodachrome', emoji: '🎞️', description: 'Warm film emulation' },
    { key: 'technicolor', label: 'Technicolor', emoji: '🎨', description: 'Enhanced color saturation' },
    { key: 'polaroid', label: 'Polaroid', emoji: '📸', description: 'Instant photo look' },
  ];

  const applyPreset = (presetKey: keyof ImageFilters) => {
    // Reset all preset filters first
    const resetPresets = {
      vintage: 0,
      drama: 0,
      lomo: 0,
      cross: 0,
      pinhole: 0,
      kodachrome: 0,
      technicolor: 0,
      polaroid: 0,
    };
    
    // Apply the selected preset with default intensity
    const newFilters = {
      ...filters,
      ...resetPresets,
      [presetKey]: 70, // Default intensity of 70%
    };
    
    onChange(newFilters);
  };

  const isPresetActive = (presetKey: keyof ImageFilters) => {
    return filters[presetKey] > 0;
  };

  const tabs = [
    { id: 'basic' as const, label: 'Basic', icon: '⚡' },
    { id: 'advanced' as const, label: 'Advanced', icon: '🔧' },
    { id: 'presets' as const, label: 'Presets', icon: '🎨' },
  ];

  const renderSlider = (config: FilterConfig) => (
    <div key={config.key} className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          {config.label}
        </label>
        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded text-center min-w-[60px]">
          {filters[config.key]}{config.unit}
        </span>
      </div>
      <input
        type="range"
        min={config.min}
        max={config.max}
        step={config.step}
        value={filters[config.key]}
        onChange={(e) => handleFilterChange(config.key, Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer 
          [&::-webkit-slider-thumb]:appearance-none 
          [&::-webkit-slider-thumb]:h-4 
          [&::-webkit-slider-thumb]:w-4 
          [&::-webkit-slider-thumb]:rounded-full 
          [&::-webkit-slider-thumb]:bg-blue-600 
          [&::-webkit-slider-thumb]:cursor-pointer 
          [&::-webkit-slider-thumb]:shadow-sm
          [&::-webkit-slider-thumb]:hover:bg-blue-700
          [&::-webkit-slider-thumb]:transition-colors
          [&::-moz-range-thumb]:h-4 
          [&::-moz-range-thumb]:w-4 
          [&::-moz-range-thumb]:rounded-full 
          [&::-moz-range-thumb]:bg-blue-600 
          [&::-moz-range-thumb]:cursor-pointer 
          [&::-moz-range-thumb]:border-none"
      />
    </div>
  );

  const renderPresetFilter = (config: PresetFilterConfig) => (
    <div key={config.key} className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-lg">{config.emoji}</span>
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700">
              {config.label}
            </label>
            <p className="text-xs text-gray-500">{config.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => applyPreset(config.key)}
            className={`
              px-3 py-1 text-xs font-medium rounded-lg transition-colors
              ${isPresetActive(config.key)
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-purple-100'
              }
            `}
          >
            {isPresetActive(config.key) ? 'Applied' : 'Apply'}
          </button>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded text-center min-w-[50px]">
            {filters[config.key]}%
          </span>
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={filters[config.key]}
        onChange={(e) => handleFilterChange(config.key, Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer 
          [&::-webkit-slider-thumb]:appearance-none 
          [&::-webkit-slider-thumb]:h-4 
          [&::-webkit-slider-thumb]:w-4 
          [&::-webkit-slider-thumb]:rounded-full 
          [&::-webkit-slider-thumb]:bg-purple-600 
          [&::-webkit-slider-thumb]:cursor-pointer 
          [&::-webkit-slider-thumb]:shadow-sm
          [&::-webkit-slider-thumb]:hover:bg-purple-700
          [&::-webkit-slider-thumb]:transition-colors
          [&::-moz-range-thumb]:h-4 
          [&::-moz-range-thumb]:w-4 
          [&::-moz-range-thumb]:rounded-full 
          [&::-moz-range-thumb]:bg-purple-600 
          [&::-moz-range-thumb]:cursor-pointer 
          [&::-moz-range-thumb]:border-none"
      />
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={resetFilters}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium px-3 py-1 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
        >
          Reset All
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 flex items-center justify-center space-x-2 py-3 px-4 text-sm font-medium transition-colors
              ${activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }
            `}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 'basic' && (
          <div className="space-y-6">
            <p className="text-sm text-gray-600 mb-4">Fundamental adjustments for your image</p>
            {basicFilters.map(renderSlider)}
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="space-y-6">
            <p className="text-sm text-gray-600 mb-4">Professional-grade image enhancement</p>
            {advancedFilters.map(renderSlider)}
          </div>
        )}

        {activeTab === 'presets' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Instagram & film-inspired effects</p>
              <p className="text-xs text-blue-600">💡 Click "Apply" for instant effect, or use sliders for custom intensity</p>
            </div>
            {presetFilters.map(renderPresetFilter)}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterEditor; 