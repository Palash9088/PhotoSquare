export interface ProcessedImage {
  id: string;
  original: File;
  originalUrl: string;
  processed?: string;
  canvas?: HTMLCanvasElement;
  filters: ImageFilters;
}

export interface ImageFilters {
  // Basic filters
  grayscale: number;
  sepia: number;
  brightness: number;
  contrast: number;
  
  // Advanced filters
  saturation: number;
  hue: number;
  blur: number;
  sharpen: number;
  vignette: number;
  temperature: number;
  
  // Preset filters (0-100 intensity)
  vintage: number;
  drama: number;
  clarify: number;
  hdr: number;
  lomo: number;
  cross: number;
  pinhole: number;
  kodachrome: number;
  technicolor: number;
  polaroid: number;
}

export interface FormatOptions {
  backgroundColor: string;
  size: number;
  aspectRatio: number; // width/height
  preset: FormatPreset;
}

export interface FormatPreset {
  id: string;
  name: string;
  platform?: string;
  aspectRatio: number;
  icon: string;
  description: string;
  width: number;
  height: number;
}

export const formatPresets: FormatPreset[] = [
  {
    id: 'original',
    name: 'Original',
    aspectRatio: 0, // Special case for original aspect ratio
    icon: '🖼️',
    description: 'Keep original dimensions',
    width: 0,
    height: 0,
  },
  {
    id: 'instagram-square',
    name: 'Square',
    platform: 'Instagram',
    aspectRatio: 1,
    icon: '⬜',
    description: '1:1 - Perfect for Instagram posts',
    width: 1080,
    height: 1080,
  },
  {
    id: 'instagram-story',
    name: 'Story',
    platform: 'Instagram',
    aspectRatio: 9/16,
    icon: '📱',
    description: '9:16 - Instagram & Facebook Stories',
    width: 1080,
    height: 1920,
  },
  {
    id: 'instagram-reels',
    name: 'Reels',
    platform: 'Instagram',
    aspectRatio: 9/16,
    icon: '🎬',
    description: '9:16 - Instagram Reels & TikTok',
    width: 1080,
    height: 1920,
  },
  {
    id: 'instagram-portrait',
    name: 'Portrait',
    platform: 'Instagram',
    aspectRatio: 4/5,
    icon: '📷',
    description: '4:5 - Instagram portrait posts',
    width: 1080,
    height: 1350,
  },
  {
    id: 'instagram-profile',
    name: 'Profile',
    platform: 'Instagram',
    aspectRatio: 1,
    icon: '👤',
    description: '1:1 - Profile pictures',
    width: 400,
    height: 400,
  },
  {
    id: 'instagram-landscape',
    name: 'Landscape',
    platform: 'Instagram',
    aspectRatio: 16/9,
    icon: '🏞️',
    description: '16:9 - Landscape posts',
    width: 1920,
    height: 1080,
  },
  {
    id: 'youtube-thumbnail',
    name: 'Thumbnail',
    platform: 'YouTube',
    aspectRatio: 16/9,
    icon: '📺',
    description: '16:9 - YouTube thumbnails',
    width: 1280,
    height: 720,
  },
  {
    id: 'twitter-post',
    name: 'Post',
    platform: 'Twitter',
    aspectRatio: 16/9,
    icon: '🐦',
    description: '16:9 - Twitter posts',
    width: 1200,
    height: 675,
  },
  {
    id: 'linkedin-post',
    name: 'Post',
    platform: 'LinkedIn',
    aspectRatio: 1.91,
    icon: '💼',
    description: '1.91:1 - LinkedIn posts',
    width: 1200,
    height: 628,
  },
];

export const defaultFilters: ImageFilters = {
  // Basic filters
  grayscale: 0,
  sepia: 0,
  brightness: 100,
  contrast: 100,
  
  // Advanced filters
  saturation: 100,
  hue: 0,
  blur: 0,
  sharpen: 0,
  vignette: 0,
  temperature: 0,
  
  // Preset filters
  vintage: 0,
  drama: 0,
  clarify: 0,
  hdr: 0,
  lomo: 0,
  cross: 0,
  pinhole: 0,
  kodachrome: 0,
  technicolor: 0,
  polaroid: 0,
};

export const defaultFormatOptions: FormatOptions = {
  backgroundColor: '#ffffff',
  size: 1080,
  aspectRatio: 1,
  preset: formatPresets[1], // Instagram Square as default
}; 