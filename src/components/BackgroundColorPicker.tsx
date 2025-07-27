import React from 'react';

interface BackgroundColorPickerProps {
  backgroundColor: string;
  onChange: (color: string) => void;
}

const BackgroundColorPicker: React.FC<BackgroundColorPickerProps> = ({
  backgroundColor,
  onChange,
}) => {
  const presetColors = [
    '#ffffff', // White
    '#000000', // Black
    '#f3f4f6', // Gray
    '#dbeafe', // Light Blue
    '#fef3c7', // Light Yellow
    '#fed7d7', // Light Red
    '#d1fae5', // Light Green
    '#e9d5ff', // Light Purple
    '#fce7f3', // Light Pink
    '#fef5e7', // Light Orange
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Background Color</h3>
      
      {/* Color Input */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="relative">
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) => onChange(e.target.value)}
            className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer overflow-hidden"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Custom Color
          </label>
          <input
            type="text"
            value={backgroundColor}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="#ffffff"
          />
        </div>
      </div>

      {/* Preset Colors */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preset Colors
        </label>
        <div className="grid grid-cols-5 gap-2">
          {presetColors.map((color) => (
            <button
              key={color}
              onClick={() => onChange(color)}
              className={`
                w-12 h-12 rounded-lg border-2 transition-all duration-200 hover:scale-110
                ${backgroundColor === color 
                  ? 'border-blue-500 shadow-lg' 
                  : 'border-gray-300 hover:border-gray-400'
                }
              `}
              style={{ backgroundColor: color }}
              title={color}
            >
              {color === '#ffffff' && (
                <div className="w-full h-full rounded-lg border border-gray-200" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preview
        </label>
        <div className="w-full h-16 rounded-lg border-2 border-gray-300 relative overflow-hidden">
          <div 
            className="w-full h-full"
            style={{ backgroundColor }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-medium px-2 py-1 bg-black bg-opacity-50 text-white rounded">
              Background
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackgroundColorPicker; 