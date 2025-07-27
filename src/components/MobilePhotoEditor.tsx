import React, { useState, useCallback, useMemo } from 'react';
import JSZip from 'jszip';
import { ProcessedImage, FormatOptions, FormatPreset, formatPresets, ImageFilters } from '../types';
import { createFormattedImage, loadImageFromFile, downloadCanvas, generateFileName } from '../utils/imageProcessor';

interface MobilePhotoEditorProps {
  images: ProcessedImage[];
  formatOptions: FormatOptions;
  filters: ImageFilters;
  onFormatChange: (preset: FormatPreset) => void;
  onFilterChange: (filters: ImageFilters) => void;
  onUpdateImage: (id: string, updates: Partial<ProcessedImage>) => void;
  onRemoveImage: (id: string) => void;
}

const MobilePhotoEditor: React.FC<MobilePhotoEditorProps> = ({
  images,
  formatOptions,
  filters,
  onFormatChange,
  onFilterChange,
  onUpdateImage,
  onRemoveImage,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [isCreatingZip, setIsCreatingZip] = useState(false);

  const currentImage = images[currentImageIndex] || null;

  // Memoize static data to prevent unnecessary re-renders
  const platforms = useMemo(() => [
    { id: 'all', name: 'All', icon: '📱' },
    { id: 'instagram', name: 'Instagram', icon: '📷' },
    { id: 'facebook', name: 'Facebook', icon: '👥' },
    { id: 'youtube', name: 'YouTube', icon: '📺' },
    { id: 'twitter', name: 'X', icon: '🐦' },
  ], []);

  const formatPresetIcons = useMemo(() => ({
    'original': { icon: '🖼️', label: 'Original', platforms: ['All'] },
    'instagram-story': { icon: '📱', label: 'Story', platforms: ['All', 'Instagram'] },
    'instagram-square': { icon: '⬜', label: 'Square', platforms: ['All', 'Instagram'] },
    'instagram-reels': { icon: '🎬', label: 'Reels', platforms: ['All', 'Instagram'] },
    'instagram-portrait': { icon: '📷', label: 'Portrait', platforms: ['All', 'Instagram'] },
    'instagram-profile': { icon: '👤', label: 'Profile', platforms: ['All', 'Instagram'] },
    'facebook-story': { icon: '📱', label: 'FB Story', platforms: ['All', 'Facebook'] },
    'facebook-post': { icon: '📷', label: 'FB Post', platforms: ['All', 'Facebook'] },
    'youtube-thumbnail': { icon: '📺', label: 'Thumbnail', platforms: ['All', 'YouTube'] },
    'youtube-shorts': { icon: '🎬', label: 'Shorts', platforms: ['All', 'YouTube'] },
    'twitter-post': { icon: '🐦', label: 'Post', platforms: ['All', 'X'] },
    'twitter-header': { icon: '🖼️', label: 'Header', platforms: ['All', 'X'] },
  }), []);

  const quickFilters = useMemo(() => [
    { key: 'vintage', label: 'Vintage', emoji: '📸' },
    { key: 'drama', label: 'Drama', emoji: '🎭' },
    { key: 'lomo', label: 'Lomo', emoji: '📷' },
    { key: 'polaroid', label: 'Polaroid', emoji: '📸' },
  ], []);

  // Create stable keys for dependency comparison
  const formatKey = useMemo(() => 
    `${formatOptions.preset.id}-${formatOptions.backgroundColor}-${formatOptions.size}`, 
    [formatOptions.preset.id, formatOptions.backgroundColor, formatOptions.size]
  );

  const filtersKey = useMemo(() => 
    JSON.stringify(filters), 
    [filters]
  );

  // Cleanup previous preview URL when component unmounts or image changes
  React.useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Process current image only when necessary dependencies change
  React.useEffect(() => {
    if (currentImage) {
      processCurrentImage();
    }
  }, [currentImage?.id, formatKey, filtersKey]); // Only depend on stable keys

  const processCurrentImage = useCallback(async () => {
    if (!currentImage || isProcessing) return;
    
    setIsProcessing(true);
    try {
      // Cleanup previous preview URL
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }

      const img = await loadImageFromFile(currentImage.original);
      const canvas = createFormattedImage(img, formatOptions, filters);
      const url = canvas.toDataURL('image/png');
      setPreviewUrl(url);
      
      // Update the current image with the new filters and processed result
      onUpdateImage(currentImage.id, {
        processed: url,
        canvas: canvas,
        filters: filters // Update the image's filters to match global filters
      });
    } catch (error) {
      console.error('Error processing image:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [currentImage, formatOptions, filters, isProcessing, previewUrl, onUpdateImage]);

  const handleDownload = useCallback(() => {
    if (currentImage?.canvas) {
      const formatName = formatOptions.preset.name.toLowerCase().replace(/\s+/g, '_');
      const filename = generateFileName(currentImage.original.name, formatName);
      downloadCanvas(currentImage.canvas, filename);
      setShowDownloadMenu(false);
    }
  }, [currentImage, formatOptions.preset.name]);

  const handleDownloadAll = useCallback(async () => {
    const processedImages = images.filter(img => img.canvas);
    
    if (processedImages.length === 0) {
      alert('No processed images to download');
      return;
    }

    setIsCreatingZip(true);
    setShowDownloadMenu(false);

    try {
      const zip = new JSZip();
      const formatName = formatOptions.preset.name.toLowerCase().replace(/\s+/g, '_');

      // Add each processed image to the zip
      for (let i = 0; i < processedImages.length; i++) {
        const image = processedImages[i];
        if (image.canvas) {
          const dataUrl = image.canvas.toDataURL('image/png');
          const base64Data = dataUrl.split(',')[1];
          const filename = generateFileName(image.original.name, formatName);
          zip.file(filename, base64Data, { base64: true });
        }
      }

      // Generate and download the zip file
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      
      const now = new Date();
      const datetime = now.toISOString().replace(/[:.]/g, '-').slice(0, -5);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `PhotoSquare_${formatName}_${datetime}.zip`;
      link.click();
      
      // Clean up
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error creating zip file:', error);
      alert('Failed to create zip file. Please try again.');
    } finally {
      setIsCreatingZip(false);
    }
  }, [images, formatOptions.preset.name]);

  const handleRemoveImage = useCallback(() => {
    if (currentImage) {
      onRemoveImage(currentImage.id);
      // Adjust current index if needed
      if (currentImageIndex >= images.length - 1) {
        setCurrentImageIndex(Math.max(0, images.length - 2));
      }
    }
  }, [currentImage, onRemoveImage, currentImageIndex, images.length]);

  const applyQuickFilter = useCallback((filterKey: string) => {
    const newFilters = {
      ...filters,
      // Reset all preset filters
      vintage: 0,
      drama: 0,
      lomo: 0,
      cross: 0,
      pinhole: 0,
      kodachrome: 0,
      technicolor: 0,
      polaroid: 0,
      // Apply selected filter
      [filterKey]: 70,
    };
    onFilterChange(newFilters);
  }, [filters, onFilterChange]);

  // Cleanup blob URLs when images change
  React.useEffect(() => {
    return () => {
      images.forEach(image => {
        if (image.originalUrl && image.originalUrl.startsWith('blob:')) {
          URL.revokeObjectURL(image.originalUrl);
        }
        if (image.processed && image.processed.startsWith('blob:')) {
          URL.revokeObjectURL(image.processed);
        }
      });
    };
  }, [images]);

  // Close download menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showDownloadMenu && !target.closest('.download-menu')) {
        setShowDownloadMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDownloadMenu]);

  if (!currentImage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto text-gray-300 mb-4">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No images uploaded</h3>
          <p className="text-gray-500">Upload some images to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200 flex-shrink-0">
        <button className="flex items-center space-x-2 text-gray-700">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-medium">Home</span>
        </button>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg transition-colors ${showFilters ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
          </button>
          
          {images.length > 1 && (
            <button 
              onClick={handleRemoveImage}
              className="p-2 text-red-500 hover:text-red-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
          
          {/* Download Menu */}
          <div className="relative download-menu">
            <button 
              onClick={() => setShowDownloadMenu(!showDownloadMenu)}
              disabled={isCreatingZip}
              className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium flex items-center space-x-2 disabled:opacity-50"
            >
              {isCreatingZip ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating ZIP...</span>
                </>
              ) : (
                <>
                  <span>Download</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </button>

            {/* Download Dropdown */}
            {showDownloadMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="py-1">
                  <button
                    onClick={handleDownload}
                    disabled={!currentImage?.canvas}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>Download Current</span>
                  </button>
                  
                  {images.length > 1 && (
                    <button
                      onClick={handleDownloadAll}
                      disabled={images.filter(img => img.canvas).length === 0}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Download All ({images.filter(img => img.canvas).length}) as ZIP</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Image Preview */}
        <div className="flex-1 p-4 flex items-center justify-center overflow-hidden">
          <div className="relative w-full h-full flex items-center justify-center">
            <div 
              className="border-4 border-blue-400 rounded-lg overflow-hidden shadow-lg max-w-full max-h-full"
              style={{ 
                aspectRatio: formatOptions.preset.id === 'original' ? 'auto' : formatOptions.aspectRatio,
                width: 'auto',
                height: 'auto'
              }}
            >
              {isProcessing ? (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center min-h-[200px]">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={currentImage.originalUrl || URL.createObjectURL(currentImage.original)}
                  alt="Original"
                  className="w-full h-full object-contain"
                />
              )}
            </div>
            
            {/* Image counter */}
            {images.length > 1 && (
              <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                {currentImageIndex + 1} / {images.length}
              </div>
            )}
          </div>
        </div>

        {/* Quick Filters - Show when filters toggle is active */}
        {showFilters && (
          <div className="p-4 bg-gray-50 flex-shrink-0">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Filters</h4>
            
            {/* Quick Apply Buttons */}
            <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide mb-4">
              {quickFilters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => applyQuickFilter(filter.key)}
                  className={`
                    flex-shrink-0 flex flex-col items-center p-2 rounded-lg border transition-all min-w-[60px]
                    ${filters[filter.key as keyof ImageFilters] > 0
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                    }
                  `}
                >
                  <span className="text-lg mb-1">{filter.emoji}</span>
                  <span className="text-xs font-medium text-gray-700">{filter.label}</span>
                </button>
              ))}
            </div>

            {/* Filter Sliders */}
            <div className="space-y-3">
              {quickFilters.map((filter) => {
                const value = filters[filter.key as keyof ImageFilters] as number;
                return (
                  <div key={`slider-${filter.key}`} className="bg-white p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 flex items-center">
                        <span className="mr-2">{filter.emoji}</span>
                        {filter.label}
                      </span>
                      <span className="text-sm text-gray-500">{value}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={value}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value);
                        const newFilters = {
                          ...filters,
                          [filter.key]: newValue,
                        };
                        onFilterChange(newFilters);
                      }}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${value}%, #e5e7eb ${value}%, #e5e7eb 100%)`
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Platform Selection */}
        <div className="px-4 py-2 flex-shrink-0">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Choose Platform</h4>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => setSelectedPlatform(platform.name)}
                className={`
                  flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-full border transition-all
                  ${selectedPlatform === platform.name
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                  }
                `}
              >
                <span className="text-sm">{platform.icon}</span>
                <span className="text-sm font-medium">{platform.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Format Presets */}
        <div className="px-4 pb-2 flex-shrink-0">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Format Options</h4>
          <div className="flex justify-between gap-2">
            {Object.entries(formatPresetIcons).map(([presetId, config]) => {
              const preset = formatPresets.find(p => p.id === presetId);
              if (!preset || !config.platforms.includes(selectedPlatform)) return null;
              
              return (
                <button
                  key={presetId}
                  onClick={() => onFormatChange(preset)}
                  className={`
                    flex-1 flex flex-col items-center py-3 px-2 rounded-lg border transition-all
                    ${formatOptions.preset.id === presetId
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                    }
                  `}
                >
                  <div className="w-8 h-8 flex items-center justify-center mb-1">
                    <div className={`
                      w-6 h-6 border border-gray-400 rounded flex items-center justify-center text-xs
                      ${formatOptions.preset.id === presetId ? 'border-blue-500' : ''}
                    `}>
                      {config.icon}
                    </div>
                  </div>
                  <span className="text-xs text-gray-700 font-medium">{config.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Image Thumbnails */}
        {images.length > 1 && (
          <div className="px-4 pb-2 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-700">Switch Image</h4>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {images.filter(img => img.canvas).length} / {images.length} processed
              </span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`
                    flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden transition-all
                    ${index === currentImageIndex
                      ? 'border-blue-500 ring-2 ring-blue-300'
                      : 'border-gray-200 opacity-60 hover:opacity-100'
                    }
                  `}
                >
                  <img
                    src={image.originalUrl || URL.createObjectURL(image.original)}
                    alt={`Image ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (image.originalUrl) {
                        target.src = URL.createObjectURL(image.original);
                      }
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobilePhotoEditor; 