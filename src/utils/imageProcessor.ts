import { ImageFilters, FormatOptions } from '../types';
import { AdvancedFilterProcessor } from './advancedFilters';
// @ts-ignore - heic2any doesn't have TypeScript types
import heic2any from 'heic2any';

export const createFormattedImage = (
  image: HTMLImageElement,
  options: FormatOptions,
  filters: ImageFilters
): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  let canvasWidth: number;
  let canvasHeight: number;
  
  // Handle original aspect ratio (no padding)
  if (options.preset.id === 'original') {
    canvasWidth = image.width;
    canvasHeight = image.height;
  } else {
    // Use preset dimensions or calculate from aspect ratio
    if (options.preset.width && options.preset.height) {
      canvasWidth = options.preset.width;
      canvasHeight = options.preset.height;
    } else {
      // Fallback: use size with aspect ratio
      if (options.aspectRatio >= 1) {
        canvasWidth = options.size;
        canvasHeight = options.size / options.aspectRatio;
      } else {
        canvasWidth = options.size * options.aspectRatio;
        canvasHeight = options.size;
      }
    }
  }
  
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  
  // Fill background (only if not original)
  if (options.preset.id !== 'original') {
    ctx.fillStyle = options.backgroundColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  }
  
  // Calculate dimensions to maintain aspect ratio
  const { width: imgWidth, height: imgHeight } = image;
  let scale: number;
  let scaledWidth: number;
  let scaledHeight: number;
  let x: number;
  let y: number;
  
  if (options.preset.id === 'original') {
    // For original, just use the image as-is
    scaledWidth = imgWidth;
    scaledHeight = imgHeight;
    x = 0;
    y = 0;
    scale = 1;
  } else {
    // Calculate scale to fit image within canvas while maintaining aspect ratio
    scale = Math.min(canvasWidth / imgWidth, canvasHeight / imgHeight);
    scaledWidth = imgWidth * scale;
    scaledHeight = imgHeight * scale;
    
    // Center the image
    x = (canvasWidth - scaledWidth) / 2;
    y = (canvasHeight - scaledHeight) / 2;
  }
  
  // Draw image first
  ctx.drawImage(image, x, y, scaledWidth, scaledHeight);
  
  // Apply advanced filters using the new filter processor
  const processor = new AdvancedFilterProcessor(canvas);
  processor.applyAdvancedFilters(filters);
  
  // Apply additional blur effect if needed
  if (filters.blur > 0) {
    ctx.filter = `blur(${filters.blur}px)`;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d')!;
    tempCtx.drawImage(canvas, 0, 0);
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (options.preset.id !== 'original') {
      ctx.fillStyle = options.backgroundColor;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    }
    ctx.drawImage(tempCanvas, 0, 0);
    ctx.filter = 'none';
  }
  
  return canvas;
};

export const createFilterString = (filters: ImageFilters): string => {
  const filterParts = [];
  
  if (filters.grayscale > 0) {
    filterParts.push(`grayscale(${filters.grayscale}%)`);
  }
  
  if (filters.sepia > 0) {
    filterParts.push(`sepia(${filters.sepia}%)`);
  }
  
  if (filters.brightness !== 100) {
    filterParts.push(`brightness(${filters.brightness}%)`);
  }
  
  if (filters.contrast !== 100) {
    filterParts.push(`contrast(${filters.contrast}%)`);
  }
  
  if (filters.saturation !== 100) {
    filterParts.push(`saturate(${filters.saturation}%)`);
  }
  
  if (filters.hue !== 0) {
    filterParts.push(`hue-rotate(${filters.hue}deg)`);
  }
  
  if (filters.blur > 0) {
    filterParts.push(`blur(${filters.blur}px)`);
  }
  
  return filterParts.length > 0 ? filterParts.join(' ') : 'none';
};

export const downloadCanvas = (canvas: HTMLCanvasElement, filename: string): void => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
};

export const convertHeicToJpeg = async (file: File): Promise<Blob> => {
  try {
    const result = await heic2any({
      blob: file,
      toType: 'image/jpeg',
      quality: 0.9
    });
    
    // heic2any can return Blob or Blob[], we need a single Blob
    return Array.isArray(result) ? result[0] : result;
  } catch (error) {
    console.error('Error converting HEIC file:', error);
    throw new Error('Failed to convert HEIC file. Please try a different format.');
  }
};

export const isHeicFile = (file: File): boolean => {
  const heicMimeTypes = [
    'image/heic',
    'image/heif',
    'image/heic-sequence',
    'image/heif-sequence'
  ];
  
  const heicExtensions = ['.heic', '.heif', '.hif'];
  const fileName = file.name.toLowerCase();
  
  return heicMimeTypes.includes(file.type) || 
         heicExtensions.some(ext => fileName.endsWith(ext));
};

export const loadImageFromFile = async (file: File): Promise<HTMLImageElement> => {
  return new Promise(async (resolve, reject) => {
    try {
      let imageFile: File | Blob = file;
      
      // Convert HEIC files to JPEG
      if (isHeicFile(file)) {
        console.log('Converting HEIC file to JPEG...');
        imageFile = await convertHeicToJpeg(file);
      }
      
      const img = new Image();
      img.onload = () => {
        // Clean up the object URL
        URL.revokeObjectURL(img.src);
        resolve(img);
      };
      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        reject(new Error('Failed to load image'));
      };
      
      img.src = URL.createObjectURL(imageFile);
    } catch (error) {
      reject(error);
    }
  });
}; 