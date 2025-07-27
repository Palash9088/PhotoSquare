# PhotoSquare

A modern web application that converts images to perfect squares, similar to Instasize. Built with React, TypeScript, and Tailwind CSS.

## Features

### Core Functionality
- **Multiple Image Upload**: Upload one or multiple images at once with drag-and-drop support
- **Square Conversion**: Automatically converts images to squares by adding padding while maintaining aspect ratio
- **Customizable Background**: Choose background color with color picker and preset options
- **Image Centering**: Images are automatically centered within the square canvas
- **Real-time Preview**: See processed images in real-time as you make changes

### Image Processing
- **Canvas-based Processing**: Uses HTML5 Canvas for high-quality image processing
- **Multiple Output Sizes**: Choose from preset sizes (512px, 1080px, 1200px, 2048px)
- **Aspect Ratio Preservation**: Original image proportions are maintained
- **High-Quality Output**: PNG format with customizable resolution

### Filters & Effects
- **Grayscale Filter**: Convert images to black and white (0-100%)
- **Sepia Filter**: Apply vintage sepia tone effect (0-100%)
- **Brightness Control**: Adjust image brightness (0-200%)
- **Contrast Control**: Modify image contrast (0-200%)
- **Global Filter Application**: Apply filters to all images at once

### Download Options
- **Individual Downloads**: Download each processed image separately
- **Bulk ZIP Download**: Download all processed images in a single ZIP file
- **JSZip Integration**: Efficient client-side ZIP creation
- **Automatic Naming**: Files are automatically named with "square_" prefix

### User Experience
- **Mobile Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, intuitive interface built with Tailwind CSS
- **Error Handling**: Comprehensive error handling for file uploads and processing
- **Loading States**: Visual feedback during processing operations
- **File Size Display**: Shows original file sizes and processing status

## Technical Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS for responsive design
- **Build Tool**: Vite for fast development and building
- **Image Processing**: HTML5 Canvas API
- **File Handling**: JSZip for bulk downloads
- **State Management**: React hooks (useState, useCallback)

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd PhotoSquare
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

1. **Upload Images**: Click the upload area or drag and drop images onto it
2. **Choose Background Color**: Select from preset colors or use the color picker
3. **Set Output Size**: Choose your desired square dimensions
4. **Apply Filters**: Adjust global filters or individual image settings
5. **Preview Results**: See real-time previews of your squared images
6. **Download**: Download individual images or all images as a ZIP file

## Supported File Formats

- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)

## Browser Compatibility

PhotoSquare works on all modern browsers that support:
- HTML5 Canvas API
- File API
- ES6+ JavaScript features

## Component Architecture

```
src/
├── components/
│   ├── ImageUploader.tsx       # Drag & drop file upload
│   ├── SquareFormatter.tsx     # Individual image processing
│   ├── BulkProcessor.tsx       # Multiple image management
│   ├── FilterEditor.tsx        # Filter controls
│   ├── DownloadAllButton.tsx   # Bulk download functionality
│   └── BackgroundColorPicker.tsx # Color selection
├── utils/
│   └── imageProcessor.ts       # Canvas processing utilities
├── types/
│   └── index.ts               # TypeScript type definitions
└── App.tsx                    # Main application component
```

## Future Enhancements

The following features are planned for future releases:

- **Drag to Reposition**: Ability to drag images within the square frame
- **Preset Configurations**: Save settings for Instagram, YouTube Shorts, etc.
- **Advanced Filters**: Additional filter options (blur, saturation, hue)
- **Batch Operations**: More bulk processing options
- **Cloud Storage**: Integration with cloud storage services
- **Image Optimization**: Automatic compression and optimization
- **Custom Dimensions**: User-defined output dimensions
- **Undo/Redo**: History management for edits

## Performance Considerations

- **Efficient Processing**: Canvas operations are optimized for performance
- **Memory Management**: Proper cleanup of object URLs and canvas references
- **Lazy Loading**: Components render only when needed
- **Debounced Updates**: Filter changes are debounced to prevent excessive re-processing

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by Instasize and similar image processing applications
- Built with modern web technologies and best practices
- Icons from Heroicons
- UI components styled with Tailwind CSS
