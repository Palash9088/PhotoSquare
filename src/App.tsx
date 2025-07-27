import React, { useState, useCallback } from 'react';
import { ProcessedImage, ImageFilters, FormatOptions, defaultFilters, defaultFormatOptions } from './types';
import ImageUploader from './components/ImageUploader';
import FilterEditor from './components/FilterEditor';
import BulkProcessor from './components/BulkProcessor';
import DownloadAllButton from './components/DownloadAllButton';
import BackgroundColorPicker from './components/BackgroundColorPicker';
import FormatPresetSelector from './components/FormatPresetSelector';

function App() {
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [globalFilters, setGlobalFilters] = useState<ImageFilters>(defaultFilters);
  const [formatOptions, setFormatOptions] = useState<FormatOptions>(defaultFormatOptions);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImagesSelected = useCallback(async (files: File[]) => {
    setIsProcessing(true);
    
    const newImages: ProcessedImage[] = files.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      original: file,
      originalUrl: URL.createObjectURL(file),
      filters: { ...defaultFilters },
    }));

    setImages(prev => [...prev, ...newImages]);
    setIsProcessing(false);
  }, []);

  const handleUpdateImage = useCallback((id: string, updates: Partial<ProcessedImage>) => {
    setImages(prev => prev.map(img => 
      img.id === id ? { ...img, ...updates } : img
    ));
  }, []);

  const handleRemoveImage = useCallback((id: string) => {
    setImages(prev => {
      const image = prev.find(img => img.id === id);
      if (image) {
        URL.revokeObjectURL(image.originalUrl);
      }
      return prev.filter(img => img.id !== id);
    });
  }, []);

  const handleApplyGlobalFilters = useCallback(() => {
    setImages(prev => prev.map(img => ({
      ...img,
      filters: { ...globalFilters }
    })));
  }, [globalFilters]);

  const clearAllImages = useCallback(() => {
    images.forEach(image => {
      URL.revokeObjectURL(image.originalUrl);
    });
    setImages([]);
  }, [images]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">PhotoSquare</h1>
                <p className="text-sm text-gray-500">Convert images to perfect formats</p>
              </div>
            </div>
            
            {images.length > 0 && (
              <button
                onClick={clearAllImages}
                className="text-red-600 hover:text-red-700 text-sm font-medium px-3 py-1 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:flex lg:gap-8">
          {/* Sticky Sidebar - Desktop */}
          <aside className="hidden lg:block lg:w-80 lg:flex-shrink-0">
            <div className="sticky top-24 h-[calc(100vh-8rem)] overflow-y-auto">
              <div className="space-y-6 pb-8">
                {/* Upload Section */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Images</h2>
                  <ImageUploader 
                    onImagesSelected={handleImagesSelected} 
                    disabled={isProcessing}
                  />
                </div>

                {/* Format Presets */}
                <FormatPresetSelector
                  selectedPreset={formatOptions.preset}
                  onChange={(preset) => setFormatOptions(prev => ({ 
                    ...prev, 
                    preset,
                    aspectRatio: preset.aspectRatio 
                  }))}
                />

                {/* Background Color Picker - Only show for non-original formats */}
                {formatOptions.preset.id !== 'original' && (
                  <BackgroundColorPicker
                    backgroundColor={formatOptions.backgroundColor}
                    onChange={(color) => setFormatOptions(prev => ({ ...prev, backgroundColor: color }))}
                  />
                )}

                {/* Global Filters */}
                <FilterEditor
                  filters={globalFilters}
                  onChange={setGlobalFilters}
                />

                {/* Download Section */}
                <DownloadAllButton
                  images={images}
                  disabled={isProcessing}
                />
              </div>
            </div>
          </aside>

          {/* Main Processing Area */}
          <main className="lg:flex-1 lg:min-w-0">
            {/* Mobile Sidebar - Show on smaller screens */}
            <div className="lg:hidden mb-8 space-y-6">
              {/* Upload Section */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Images</h2>
                <ImageUploader 
                  onImagesSelected={handleImagesSelected} 
                  disabled={isProcessing}
                />
              </div>

              {/* Format Presets */}
              <FormatPresetSelector
                selectedPreset={formatOptions.preset}
                onChange={(preset) => setFormatOptions(prev => ({ 
                  ...prev, 
                  preset,
                  aspectRatio: preset.aspectRatio 
                }))}
              />

              {/* Background Color Picker - Only show for non-original formats */}
              {formatOptions.preset.id !== 'original' && (
                <BackgroundColorPicker
                  backgroundColor={formatOptions.backgroundColor}
                  onChange={(color) => setFormatOptions(prev => ({ ...prev, backgroundColor: color }))}
                />
              )}

              {/* Global Filters */}
              <FilterEditor
                filters={globalFilters}
                onChange={setGlobalFilters}
              />

              {/* Download Section */}
              <DownloadAllButton
                images={images}
                disabled={isProcessing}
              />
            </div>

            {/* Image Processing Area */}
            <BulkProcessor
              images={images}
              formatOptions={formatOptions}
              globalFilters={globalFilters}
              onUpdateImage={handleUpdateImage}
              onRemoveImage={handleRemoveImage}
              onApplyGlobalFilters={handleApplyGlobalFilters}
            />
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-500">
            <p>PhotoSquare - Convert your images to perfect formats with ease</p>
            <p className="mt-1">Built with React, TypeScript, and Tailwind CSS</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
