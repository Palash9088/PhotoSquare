import React, { useState } from 'react';
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (images.length === 0) {
    return null;
  }

  const currentImage = images[currentImageIndex];

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

      {/* Mobile: Fixed Image Carousel + Scrollable Content */}
      <div className="lg:hidden">
        {/* Fixed Image Carousel */}
        <div className="fixed top-16 left-0 right-0 z-20 bg-white border-b-2 border-blue-200 shadow-lg">
          {/* Carousel Header */}
          <div className="px-4 py-2 bg-blue-50 border-b border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-blue-900">📱 Live Preview</h3>
                <p className="text-xs text-blue-600">Swipe to switch images</p>
              </div>
              <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                {currentImageIndex + 1} of {images.length}
              </div>
            </div>
          </div>

          {/* Horizontal Image Thumbnails */}
          <div className="p-3 pb-2">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`
                    flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden transition-all duration-200
                    ${index === currentImageIndex
                      ? 'border-blue-500 ring-2 ring-blue-300 shadow-md'
                      : 'border-gray-200 opacity-60 hover:opacity-100 hover:border-gray-300'
                    }
                  `}
                >
                  <img
                    src={image.originalUrl}
                    alt={`Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Current Image Preview */}
          <div className="px-3 pb-3">
            <div className="bg-gray-100 rounded-lg overflow-hidden" style={{ 
              aspectRatio: formatOptions.preset.id === 'original' ? 'auto' : formatOptions.aspectRatio,
              maxHeight: '200px'
            }}>
              <SquareFormatter
                key={`preview-${currentImage.id}`}
                processedImage={currentImage}
                formatOptions={formatOptions}
                onUpdate={onUpdateImage}
                onRemove={onRemoveImage}
              />
            </div>
          </div>
        </div>

        {/* Spacer for fixed content */}
        <div style={{ height: '280px' }}></div>

        {/* Scrollable Content Area */}
        <div className="relative z-10">
          {/* All Images Grid (for management) */}
          <div className="mb-8 bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">All Images</h3>
              <button 
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View Preview ↑
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {images.map((image, index) => (
                <div 
                  key={image.id}
                  className={`
                    relative rounded-lg border-2 overflow-hidden transition-all duration-200
                    ${index === currentImageIndex
                      ? 'border-blue-500 ring-2 ring-blue-300'
                      : 'border-gray-200'
                    }
                  `}
                >
                  <button
                    onClick={() => setCurrentImageIndex(index)}
                    className="w-full"
                  >
                    <img
                      src={image.originalUrl}
                      alt={`Image ${index + 1}`}
                      className="w-full h-24 object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                      {index + 1}
                    </div>
                    {index === currentImageIndex && (
                      <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                        <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded font-medium">
                          Live Preview
                        </div>
                      </div>
                    )}
                  </button>
                  <button
                    onClick={() => onRemoveImage(image.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: Regular Grid Layout */}
      <div className="hidden lg:block">
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
    </div>
  );
};

export default BulkProcessor; 