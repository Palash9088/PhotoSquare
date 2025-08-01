import { useState, useCallback, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { ProcessedImage, ImageFilters, FormatOptions, defaultFilters, defaultFormatOptions } from './types';
import ImageUploader from './components/ImageUploader';
import FilterEditor from './components/FilterEditor';
import BulkProcessor from './components/BulkProcessor';
import DownloadAllButton from './components/DownloadAllButton';
import BackgroundColorPicker from './components/BackgroundColorPicker';
import FormatPresetSelector from './components/FormatPresetSelector';
import MobilePhotoEditor from './components/MobilePhotoEditor';

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
        // Cleanup blob URLs
        if (image.originalUrl && image.originalUrl.startsWith('blob:')) {
          URL.revokeObjectURL(image.originalUrl);
        }
        if (image.processed && image.processed.startsWith('blob:')) {
          URL.revokeObjectURL(image.processed);
        }
      }
      return prev.filter(img => img.id !== id);
    });
  }, []);

  // Auto-apply global filters to all images when global filters change
  useEffect(() => {
    if (images.length > 0) {
      setImages(prev => prev.map(img => ({
        ...img,
        filters: { ...globalFilters }
      })));
    }
  }, [globalFilters]);

  const clearAllImages = useCallback(() => {
    images.forEach(image => {
      // Cleanup blob URLs
      if (image.originalUrl && image.originalUrl.startsWith('blob:')) {
        URL.revokeObjectURL(image.originalUrl);
      }
      if (image.processed && image.processed.startsWith('blob:')) {
        URL.revokeObjectURL(image.processed);
      }
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
        {/* Mobile Layout - New Clean Interface */}
        <div className="lg:hidden">
          {images.length > 0 ? (
            <MobilePhotoEditor
              images={images}
              formatOptions={formatOptions}
              filters={globalFilters}
              onFormatChange={(preset) => setFormatOptions(prev => ({ 
                ...prev, 
                preset,
                aspectRatio: preset.aspectRatio 
              }))}
              onFilterChange={setGlobalFilters}
              onUpdateImage={handleUpdateImage}
              onRemoveImage={handleRemoveImage}
            />
          ) : (
            <div className="space-y-6">
              {/* Upload Section */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Images</h2>
                <ImageUploader 
                  onImagesSelected={handleImagesSelected} 
                  disabled={isProcessing}
                />
              </div>

              {/* Empty state */}
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto text-gray-300 mb-4">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No images uploaded</h3>
                <p className="text-gray-500">Upload some images above to get started</p>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Layout - Sidebar + Main Content */}
        <div className="hidden lg:flex lg:gap-8">
          {/* Sticky Sidebar - Desktop */}
          <aside className="lg:w-80 lg:flex-shrink-0">
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

          {/* Main Content Area - Desktop */}
          <main className="lg:flex-1 lg:min-w-0">
            {images.length > 0 ? (
              <BulkProcessor
                images={images}
                formatOptions={formatOptions}
                onUpdateImage={handleUpdateImage}
                onRemoveImage={handleRemoveImage}
              />
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto text-gray-300 mb-4">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No images uploaded</h3>
                <p className="text-gray-500">Upload some images using the sidebar to get started</p>
              </div>
            )}
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
      
      {/* Vercel Analytics */}
      <Analytics />
    </div>
  );
}

export default App;
