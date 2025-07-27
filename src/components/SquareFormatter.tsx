import React, { useEffect, useState, useMemo } from 'react';
import { ProcessedImage, FormatOptions } from '../types';
import { createFormattedImage, loadImageFromFile, downloadCanvas } from '../utils/imageProcessor';

interface SquareFormatterProps {
  processedImage: ProcessedImage;
  formatOptions: FormatOptions;
  onUpdate: (id: string, updates: Partial<ProcessedImage>) => void;
  onRemove: (id: string) => void;
}

const SquareFormatter: React.FC<SquareFormatterProps> = ({
  processedImage,
  formatOptions,
  onUpdate,
  onRemove,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  // Create serialized versions for proper dependency tracking
  const filtersKey = useMemo(() => JSON.stringify(processedImage.filters), [processedImage.filters]);
  const formatKey = useMemo(() => JSON.stringify(formatOptions), [formatOptions]);

  useEffect(() => {
    processImage();
  }, [filtersKey, formatKey]); // Use serialized keys for reliable dependency tracking

  const processImage = async () => {
    setIsProcessing(true);
    try {
      const img = await loadImageFromFile(processedImage.original);
      const canvas = createFormattedImage(img, formatOptions, processedImage.filters);
      
      // Create preview URL
      const url = canvas.toDataURL('image/png');
      setPreviewUrl(url);
      
      // Update the processed image
      onUpdate(processedImage.id, {
        processed: url,
        canvas: canvas,
      });
    } catch (error) {
      console.error('Error processing image:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (processedImage.canvas) {
      const formatName = formatOptions.preset.name.toLowerCase().replace(/\s+/g, '_');
      const filename = `${formatName}_${processedImage.original.name.replace(/\.[^/.]+$/, '')}.png`;
      downloadCanvas(processedImage.canvas, filename);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getAspectRatioDisplay = () => {
    const { preset } = formatOptions;
    if (preset.id === 'original') return 'Original';
    
    return preset.width && preset.height 
      ? `${preset.width}×${preset.height}`
      : `${Math.round(preset.aspectRatio * 100)/100}:1`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 truncate">
              {processedImage.original.name}
            </h4>
            <div className="flex items-center space-x-2 mt-1">
              <p className="text-xs text-gray-500">
                {formatFileSize(processedImage.original.size)}
              </p>
              <span className="text-xs text-gray-400">•</span>
              <p className="text-xs text-blue-600 font-medium">
                {getAspectRatioDisplay()}
              </p>
            </div>
          </div>
          <button
            onClick={() => onRemove(processedImage.id)}
            className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-gray-100 relative overflow-hidden" style={{ 
        aspectRatio: formatOptions.preset.id === 'original' ? 'auto' : formatOptions.aspectRatio 
      }}>
        {isProcessing ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : previewUrl ? (
          <img
            src={previewUrl}
            alt="Processed preview"
            className="w-full h-full object-contain"
          />
        ) : (
          <img
            src={processedImage.originalUrl}
            alt="Original"
            className="w-full h-full object-contain"
          />
        )}
      </div>

      {/* Actions */}
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <button
            onClick={handleDownload}
            disabled={!processedImage.canvas || isProcessing}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Download
          </button>
          <button
            onClick={processImage}
            disabled={isProcessing}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default SquareFormatter; 