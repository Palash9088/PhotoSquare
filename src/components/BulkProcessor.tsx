import React from 'react';
import { ProcessedImage, FormatOptions } from '../types';
import SquareFormatter from './SquareFormatter';

interface BulkProcessorProps {
  images: ProcessedImage[];
  formatOptions: FormatOptions;
  onUpdateImage: (id: string, updates: Partial<ProcessedImage>) => void;
  onRemoveImage: (id: string) => void;
}

const BulkProcessor: React.FC<BulkProcessorProps> = ({
  images,
  formatOptions,
  onUpdateImage,
  onRemoveImage,
}) => {
  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Processing {images.length} image{images.length !== 1 ? 's' : ''}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Format: {formatOptions.preset.name} {formatOptions.preset.platform && `(${formatOptions.preset.platform})`}
        </p>
        <p className="text-xs text-blue-600 mt-1">
          ✨ Filters apply automatically in real-time
        </p>
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