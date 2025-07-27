import React from 'react';
import { ProcessedImage, FormatOptions, ImageFilters } from '../types';
import SquareFormatter from './SquareFormatter';

interface BulkProcessorProps {
  images: ProcessedImage[];
  formatOptions: FormatOptions;
  globalFilters: ImageFilters;
  onUpdateImage: (id: string, updates: Partial<ProcessedImage>) => void;
  onRemoveImage: (id: string) => void;
  onApplyGlobalFilters: () => void;
}

const BulkProcessor: React.FC<BulkProcessorProps> = ({
  images,
  formatOptions,
  globalFilters,
  onUpdateImage,
  onRemoveImage,
  onApplyGlobalFilters,
}) => {
  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto text-gray-300 mb-4">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No images uploaded</h3>
        <p className="text-gray-500">Upload some images to get started</p>
      </div>
    );
  }

  return (
    <div>
      {/* Bulk Actions Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Processing {images.length} image{images.length !== 1 ? 's' : ''}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Format: {formatOptions.preset.name} {formatOptions.preset.platform && `(${formatOptions.preset.platform})`}
          </p>
        </div>
        
        <button
          onClick={onApplyGlobalFilters}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Apply Global Filters
        </button>
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {images.map((image) => (
          <SquareFormatter
            key={image.id}
            processedImage={image}
            formatOptions={formatOptions}
            onUpdate={onUpdateImage}
            onRemove={onRemoveImage}
          />
        ))}
      </div>
    </div>
  );
};

export default BulkProcessor; 