import { ImageFilters, FormatOptions } from '../types';

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
  
  // Apply filters
  const filterString = createFilterString(filters);
  ctx.filter = filterString;
  
  // Draw image
  ctx.drawImage(image, x, y, scaledWidth, scaledHeight);
  
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
  
  return filterParts.length > 0 ? filterParts.join(' ') : 'none';
};

export const downloadCanvas = (canvas: HTMLCanvasElement, filename: string): void => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
};

export const loadImageFromFile = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}; 