import React from 'react';
import { FormatPreset, formatPresets } from '../types';

interface FormatPresetSelectorProps {
  selectedPreset: FormatPreset;
  onChange: (preset: FormatPreset) => void;
}

const FormatPresetSelector: React.FC<FormatPresetSelectorProps> = ({
  selectedPreset,
  onChange,
}) => {
  // Group presets by platform for desktop
  const groupedPresets = formatPresets.reduce((acc, preset) => {
    const platform = preset.platform || 'General';
    if (!acc[platform]) acc[platform] = [];
    acc[platform].push(preset);
    return acc;
  }, {} as Record<string, FormatPreset[]>);

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900">Format Presets</h3>
        <p className="text-sm text-gray-500 mt-1">Choose your target platform</p>
      </div>

      {/* Mobile: Horizontal Scroll */}
      <div className="lg:hidden p-4">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {formatPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onChange(preset)}
              className={`
                flex-shrink-0 w-28 p-3 rounded-lg border-2 transition-all duration-200
                ${selectedPreset.id === preset.id
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                }
              `}
            >
              <div className="text-center">
                <div className="text-2xl mb-1">{preset.icon}</div>
                <div className="text-xs font-medium text-gray-900 mb-1">
                  {preset.name}
                </div>
                {preset.platform && (
                  <div className="text-xs text-blue-600 font-medium mb-1">
                    {preset.platform}
                  </div>
                )}
                <div className="text-xs text-gray-500">
                  {preset.width && preset.height 
                    ? `${preset.width}×${preset.height}`
                    : preset.id === 'original' 
                      ? 'Original'
                      : `${Math.round(preset.aspectRatio * 100)/100}:1`
                  }
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Desktop: Grouped Layout */}
      <div className="hidden lg:block p-4">
        <div className="space-y-4">
          {Object.entries(groupedPresets).map(([platform, presets]) => (
            <div key={platform}>
              <h4 className="text-sm font-medium text-gray-700 mb-2">{platform}</h4>
              <div className="grid grid-cols-2 gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => onChange(preset)}
                    className={`
                      p-3 rounded-lg border text-left transition-all duration-200
                      ${selectedPreset.id === preset.id
                        ? 'border-blue-500 bg-blue-50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{preset.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900">
                          {preset.name}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {preset.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FormatPresetSelector; 