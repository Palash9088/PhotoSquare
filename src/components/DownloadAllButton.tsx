import React, { useState } from 'react';
import JSZip from 'jszip';
import { ProcessedImage } from '../types';

interface DownloadAllButtonProps {
  images: ProcessedImage[];
  disabled?: boolean;
}

const DownloadAllButton: React.FC<DownloadAllButtonProps> = ({ images, disabled = false }) => {
  const [isCreatingZip, setIsCreatingZip] = useState(false);

  const processedImages = images.filter(img => img.canvas);

  const downloadAll = async () => {
    if (processedImages.length === 0) return;

    setIsCreatingZip(true);

    try {
      const zip = new JSZip();

      // Add each processed image to the zip
      for (const image of processedImages) {
        if (image.canvas) {
          const dataUrl = image.canvas.toDataURL('image/png');
          const base64Data = dataUrl.split(',')[1];
          const filename = `square_${image.original.name.replace(/\.[^/.]+$/, '')}.png`;
          zip.file(filename, base64Data, { base64: true });
        }
      }

      // Generate and download the zip file
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `photosquare_images_${new Date().toISOString().split('T')[0]}.zip`;
      link.click();
      
      // Clean up
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error creating zip file:', error);
      alert('Failed to create zip file. Please try again.');
    } finally {
      setIsCreatingZip(false);
    }
  };

  const downloadIndividually = () => {
    processedImages.forEach((image) => {
      if (image.canvas) {
        const filename = `square_${image.original.name.replace(/\.[^/.]+$/, '')}.png`;
        const link = document.createElement('a');
        link.download = filename;
        link.href = image.canvas.toDataURL('image/png');
        link.click();
      }
    });
  };

  if (processedImages.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Download Options</h3>
          <p className="text-sm text-gray-500">
            {processedImages.length} of {images.length} images ready for download
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={downloadAll}
          disabled={disabled || isCreatingZip || processedImages.length === 0}
          className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
        >
          {isCreatingZip ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Creating ZIP...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 12l2 2 4-4" />
              </svg>
              <span>Download ZIP</span>
            </>
          )}
        </button>

        <button
          onClick={downloadIndividually}
          disabled={disabled || processedImages.length === 0}
          className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Download Individual</span>
        </button>
      </div>

      {images.length > processedImages.length && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> {images.length - processedImages.length} image(s) are still processing and won't be included in the download.
          </p>
        </div>
      )}
    </div>
  );
};

export default DownloadAllButton; 