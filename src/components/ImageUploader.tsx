import React, { useCallback, useState } from 'react';

interface ImageUploaderProps {
  onImagesSelected: (files: File[]) => void;
  disabled?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesSelected, disabled = false }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;

    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (files.length > 0) {
      onImagesSelected(files);
    }
  }, [onImagesSelected, disabled]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onImagesSelected(Array.from(files));
    }
  }, [onImagesSelected]);

  return (
    <div
      className={`
        border-2 border-dashed rounded-lg p-12 text-center transition-all duration-200
        ${isDragOver && !disabled 
          ? 'border-blue-400 bg-blue-50 scale-105' 
          : 'border-gray-300 hover:border-gray-400'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !disabled && document.getElementById('file-input')?.click()}
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 text-gray-400">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        
        <div>
          <p className="text-lg font-medium text-gray-900">
            {isDragOver ? 'Drop your images here' : 'Upload Images'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Drag and drop images or click to browse
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Supports: JPG, PNG, GIF, WebP
          </p>
        </div>
      </div>
      
      <input
        id="file-input"
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
};

export default ImageUploader; 