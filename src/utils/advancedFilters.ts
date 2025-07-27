import { ImageFilters } from '../types';

// Advanced filter processing utilities
export class AdvancedFilterProcessor {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private imageData: ImageData;
  private originalData: Uint8ClampedArray;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.imageData = this.ctx.getImageData(0, 0, canvas.width, canvas.height);
    this.originalData = new Uint8ClampedArray(this.imageData.data);
  }

  // Apply all filters in sequence
  applyAdvancedFilters(filters: ImageFilters): void {
    // Reset to original
    this.imageData.data.set(this.originalData);
    
    const data = this.imageData.data;
    const width = this.canvas.width;
    const height = this.canvas.height;

    // Apply preset filters first (they modify the base image)
    this.applyPresetFilters(data, width, height, filters);
    
    // Apply basic adjustments
    this.applyBasicFilters(data, filters);
    
    // Apply advanced effects
    this.applyAdvancedEffects(data, width, height, filters);
    
    // Put processed image back to canvas
    this.ctx.putImageData(this.imageData, 0, 0);
  }

  private applyPresetFilters(data: Uint8ClampedArray, width: number, height: number, filters: ImageFilters): void {
    if (filters.vintage > 0) this.applyVintage(data, filters.vintage / 100);
    if (filters.drama > 0) this.applyDrama(data, filters.drama / 100);
    if (filters.lomo > 0) this.applyLomo(data, width, height, filters.lomo / 100);
    if (filters.cross > 0) this.applyCrossProcess(data, filters.cross / 100);
    if (filters.pinhole > 0) this.applyPinhole(data, width, height, filters.pinhole / 100);
    if (filters.kodachrome > 0) this.applyKodachrome(data, filters.kodachrome / 100);
    if (filters.technicolor > 0) this.applyTechnicolor(data, filters.technicolor / 100);
    if (filters.polaroid > 0) this.applyPolaroid(data, filters.polaroid / 100);
  }

  private applyBasicFilters(data: Uint8ClampedArray, filters: ImageFilters): void {
    for (let i = 0; i < data.length; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];

      // Brightness
      if (filters.brightness !== 100) {
        const factor = filters.brightness / 100;
        r *= factor;
        g *= factor;
        b *= factor;
      }

      // Contrast
      if (filters.contrast !== 100) {
        const factor = (259 * (filters.contrast + 255)) / (255 * (259 - filters.contrast));
        r = factor * (r - 128) + 128;
        g = factor * (g - 128) + 128;
        b = factor * (b - 128) + 128;
      }

      // Saturation
      if (filters.saturation !== 100) {
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        const factor = filters.saturation / 100;
        r = gray + factor * (r - gray);
        g = gray + factor * (g - gray);
        b = gray + factor * (b - gray);
      }

      // Temperature
      if (filters.temperature !== 0) {
        const temp = filters.temperature / 100;
        r += temp * 30;
        b -= temp * 30;
      }

      // Hue shift
      if (filters.hue !== 0) {
        const [newR, newG, newB] = this.hueShift([r, g, b], filters.hue);
        r = newR;
        g = newG;
        b = newB;
      }

      // Grayscale
      if (filters.grayscale > 0) {
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        const factor = filters.grayscale / 100;
        r = r * (1 - factor) + gray * factor;
        g = g * (1 - factor) + gray * factor;
        b = b * (1 - factor) + gray * factor;
      }

      // Sepia
      if (filters.sepia > 0) {
        const factor = filters.sepia / 100;
        const tr = 0.393 * r + 0.769 * g + 0.189 * b;
        const tg = 0.349 * r + 0.686 * g + 0.168 * b;
        const tb = 0.272 * r + 0.534 * g + 0.131 * b;
        r = r * (1 - factor) + tr * factor;
        g = g * (1 - factor) + tg * factor;
        b = b * (1 - factor) + tb * factor;
      }

      // Clamp values
      data[i] = Math.max(0, Math.min(255, r));
      data[i + 1] = Math.max(0, Math.min(255, g));
      data[i + 2] = Math.max(0, Math.min(255, b));
    }
  }

  private applyAdvancedEffects(data: Uint8ClampedArray, width: number, height: number, filters: ImageFilters): void {
    // Vignette
    if (filters.vignette > 0) {
      this.applyVignetteEffect(data, width, height, filters.vignette / 100);
    }

    // HDR effect
    if (filters.hdr > 0) {
      this.applyHDR(data, filters.hdr / 100);
    }

    // Clarify (sharpening effect)
    if (filters.clarify > 0) {
      this.applyClarify(data, width, height, filters.clarify / 100);
    }
  }

  // Preset filter implementations
  private applyVintage(data: Uint8ClampedArray, intensity: number): void {
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Vintage color grading
      const newR = r * (1 + 0.3 * intensity) - g * 0.1 * intensity;
      const newG = g * (1 + 0.1 * intensity) - b * 0.05 * intensity;
      const newB = b * (1 - 0.2 * intensity) + r * 0.1 * intensity;

      data[i] = Math.max(0, Math.min(255, newR));
      data[i + 1] = Math.max(0, Math.min(255, newG));
      data[i + 2] = Math.max(0, Math.min(255, newB));
    }
  }

  private applyDrama(data: Uint8ClampedArray, intensity: number): void {
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // High contrast with color enhancement
      const factor = 1 + intensity * 0.5;
      const contrast = 1 + intensity * 0.3;
      
      data[i] = Math.max(0, Math.min(255, ((r - 128) * contrast + 128) * factor));
      data[i + 1] = Math.max(0, Math.min(255, ((g - 128) * contrast + 128) * factor));
      data[i + 2] = Math.max(0, Math.min(255, ((b - 128) * contrast + 128) * factor));
    }
  }

  private applyLomo(data: Uint8ClampedArray, width: number, height: number, intensity: number): void {
    const centerX = width / 2;
    const centerY = height / 2;
    const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        const vignette = 1 - (distance / maxDistance) * intensity * 0.7;

        // Lomo color shift
        data[i] = Math.max(0, Math.min(255, data[i] * (1 + intensity * 0.2) * vignette));
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] * (1 - intensity * 0.1) * vignette));
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] * (1 - intensity * 0.3) * vignette));
      }
    }
  }

  private applyCrossProcess(data: Uint8ClampedArray, intensity: number): void {
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Cross processing color shifts
      const newR = r * (1 + intensity * 0.4) - g * intensity * 0.2;
      const newG = g * (1 - intensity * 0.1) + r * intensity * 0.1;
      const newB = b * (1 + intensity * 0.3) - r * intensity * 0.1;

      data[i] = Math.max(0, Math.min(255, newR));
      data[i + 1] = Math.max(0, Math.min(255, newG));
      data[i + 2] = Math.max(0, Math.min(255, newB));
    }
  }

  private applyPinhole(data: Uint8ClampedArray, width: number, height: number, intensity: number): void {
    const centerX = width / 2;
    const centerY = height / 2;
    const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        const darkening = Math.pow(distance / maxDistance, 2) * intensity;

        data[i] = Math.max(0, data[i] * (1 - darkening));
        data[i + 1] = Math.max(0, data[i + 1] * (1 - darkening));
        data[i + 2] = Math.max(0, data[i + 2] * (1 - darkening));
      }
    }
  }

  private applyKodachrome(data: Uint8ClampedArray, intensity: number): void {
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Kodachrome look - warm highlights, cool shadows
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
      const factor = luminance / 255;
      
      data[i] = Math.max(0, Math.min(255, r + intensity * 20 * factor));
      data[i + 1] = Math.max(0, Math.min(255, g + intensity * 10 * factor));
      data[i + 2] = Math.max(0, Math.min(255, b - intensity * 15 * (1 - factor)));
    }
  }

  private applyTechnicolor(data: Uint8ClampedArray, intensity: number): void {
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Technicolor look - enhanced saturation and contrast
      const newR = r * (1 + intensity * 0.3) + g * intensity * 0.1;
      const newG = g * (1 + intensity * 0.2) - r * intensity * 0.05;
      const newB = b * (1 + intensity * 0.4) - g * intensity * 0.1;

      data[i] = Math.max(0, Math.min(255, newR));
      data[i + 1] = Math.max(0, Math.min(255, newG));
      data[i + 2] = Math.max(0, Math.min(255, newB));
    }
  }

  private applyPolaroid(data: Uint8ClampedArray, intensity: number): void {
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Polaroid look - slight cyan/yellow cast
      data[i] = Math.max(0, Math.min(255, r + intensity * 15));
      data[i + 1] = Math.max(0, Math.min(255, g + intensity * 10));
      data[i + 2] = Math.max(0, Math.min(255, b - intensity * 10));
    }
  }

  private applyVignetteEffect(data: Uint8ClampedArray, width: number, height: number, intensity: number): void {
    const centerX = width / 2;
    const centerY = height / 2;
    const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        const vignette = 1 - (distance / maxDistance) * intensity;

        data[i] *= vignette;
        data[i + 1] *= vignette;
        data[i + 2] *= vignette;
      }
    }
  }

  private applyHDR(data: Uint8ClampedArray, intensity: number): void {
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // HDR tone mapping
      const factor = 1 + intensity * 0.5;
      data[i] = Math.max(0, Math.min(255, Math.pow(r / 255, factor) * 255));
      data[i + 1] = Math.max(0, Math.min(255, Math.pow(g / 255, factor) * 255));
      data[i + 2] = Math.max(0, Math.min(255, Math.pow(b / 255, factor) * 255));
    }
  }

  private applyClarify(data: Uint8ClampedArray, width: number, height: number, intensity: number): void {
    // Simple unsharp mask implementation
    const tempData = new Uint8ClampedArray(data);
    
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const i = (y * width + x) * 4;
        
        for (let c = 0; c < 3; c++) {
          const center = tempData[i + c];
          const surrounding = (
            tempData[((y - 1) * width + (x - 1)) * 4 + c] +
            tempData[((y - 1) * width + x) * 4 + c] +
            tempData[((y - 1) * width + (x + 1)) * 4 + c] +
            tempData[(y * width + (x - 1)) * 4 + c] +
            tempData[(y * width + (x + 1)) * 4 + c] +
            tempData[((y + 1) * width + (x - 1)) * 4 + c] +
            tempData[((y + 1) * width + x) * 4 + c] +
            tempData[((y + 1) * width + (x + 1)) * 4 + c]
          ) / 8;
          
          const sharpened = center + (center - surrounding) * intensity;
          data[i + c] = Math.max(0, Math.min(255, sharpened));
        }
      }
    }
  }

  private hueShift([r, g, b]: [number, number, number], angle: number): [number, number, number] {
    // RGB to HSV and back with hue shift
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    
    if (delta === 0) return [r, g, b];
    
    const saturation = max === 0 ? 0 : delta / max;
    const value = max;
    
    let hue = 0;
    if (max === r) hue = ((g - b) / delta) % 6;
    else if (max === g) hue = (b - r) / delta + 2;
    else hue = (r - g) / delta + 4;
    
    hue = (hue * 60 + angle) % 360;
    if (hue < 0) hue += 360;
    
    const c = value * saturation;
    const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
    const m = value - c;
    
    let nr = 0, ng = 0, nb = 0;
    
    if (hue < 60) [nr, ng, nb] = [c, x, 0];
    else if (hue < 120) [nr, ng, nb] = [x, c, 0];
    else if (hue < 180) [nr, ng, nb] = [0, c, x];
    else if (hue < 240) [nr, ng, nb] = [0, x, c];
    else if (hue < 300) [nr, ng, nb] = [x, 0, c];
    else [nr, ng, nb] = [c, 0, x];
    
    return [(nr + m) * 255, (ng + m) * 255, (nb + m) * 255];
  }
} 