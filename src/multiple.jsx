import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Camera, Upload, Download, Trash2, RotateCcw, Heart, Smile, Star, Music, ArrowLeft } from 'lucide-react';

// Updated crop utility function
function getCroppedImg(imageSrc, pixelCrop) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';

    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Canvas is empty'));
            return;
          }
          const fileUrl = URL.createObjectURL(blob);
          resolve(fileUrl);
        },
        'image/jpeg',
        0.9
      );
    };

    image.onerror = () => reject(new Error('Failed to load image'));
    image.src = imageSrc;
  });
}

const PolaroidPhotoBooth = ({ onBack }) => {
  const [images, setImages] = useState([]);
  const [currentImage, setCurrentImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [customText, setCustomText] = useState('LOVE');
  const [selectedIcon, setSelectedIcon] = useState('heart');
  const [isGenerating, setIsGenerating] = useState(false);

  const icons = {
    heart: <Heart className="w-3 h-3" />,
    smile: <Smile className="w-3 h-3" />,
    star: <Star className="w-3 h-3" />,
    music: <Music className="w-3 h-3" />
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCurrentImage(e.target.result);
        setShowCropper(true);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropImage = async () => {
    if (!croppedAreaPixels || !currentImage) return;

    try {
      const croppedImage = await getCroppedImg(currentImage, croppedAreaPixels);
      setImages(prev => [...prev, croppedImage]);
      setShowCropper(false);
      setCurrentImage(null);
    } catch (e) {
      console.error('Error cropping image:', e);
    }
  };

  const cancelCrop = () => {
    setShowCropper(false);
    setCurrentImage(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setImages([]);
  };
  const downloadPolaroid = async () => {
    if (images.length === 0) return;

    setIsGenerating(true);

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const polaroidWidth = 200;
      const polaroidHeight = 520;
      const imageBoxSize = 120;
      const spacing = 10;
      const bottomTextArea = 100;
      const topPadding = 20;
      const icon = '📸'; // Fallback for selectedIcon

      canvas.width = polaroidWidth;
      canvas.height = polaroidHeight;

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, polaroidWidth, polaroidHeight);

      const imagePromises = images.slice(0, 3).map((imageSrc, index) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            const x = (polaroidWidth - imageBoxSize) / 2;
            const y = topPadding + index * (imageBoxSize + spacing);

            ctx.fillStyle = '#f8f8f8';
            ctx.fillRect(x, y, imageBoxSize, imageBoxSize);

            ctx.drawImage(img, x, y, imageBoxSize, imageBoxSize);

            ctx.strokeStyle = '#ddd';
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, imageBoxSize, imageBoxSize);

            resolve();
          };
          img.onerror = () => resolve();
          img.src = imageSrc;
        });
      });

      await Promise.all(imagePromises);

      const textY = polaroidHeight - bottomTextArea + 30;

      ctx.fillStyle = '#333';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${icon} ${customText} ${icon}`, polaroidWidth / 2, textY);

      ctx.fillStyle = '#888';
      ctx.font = '12px Arial';
      ctx.fillText('● ● ● ● ● ● ● ● ● ●', polaroidWidth / 2, textY + 25);

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `polaroid-strip-${Date.now()}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
        setIsGenerating(false);
      }, 'image/png');

    } catch (error) {
      console.error('Error generating polaroid:', error);
      setIsGenerating(false);
    }
  };


  return (

    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 relative">
          <button
            onClick={onBack}
            className="absolute left-0 top-0 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">SnapSoul Photo Booth</h1>
          <p className="text-gray-600">Create beautiful SnapSoul strips with your photos</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Controls */}
          <div className="space-y-6">
            {/* Upload Section */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Add Photos
              </h2>
              <label className="block w-full p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-pink-400 transition-colors cursor-pointer bg-gray-50 hover:bg-pink-50">
                <div className="text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <span className="text-gray-600">Click to upload an image</span>
                  <div className="text-sm text-gray-500 mt-1">JPG, PNG up to 10MB</div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Customization */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Customize Strip</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Bottom Text</label>
                  <input
                    type="text"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Enter custom text"
                    maxLength="20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Decoration</label>
                  <div className="flex gap-2">
                    {Object.entries(icons).map(([key, icon]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedIcon(key)}
                        className={`p-3 rounded-lg border-2 transition-colors ${selectedIcon === key
                            ? 'border-pink-500 bg-pink-50'
                            : 'border-gray-200 hover:border-pink-300'
                          }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            {images.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Actions</h2>
                <div className="flex gap-3">
                  <button
                    onClick={downloadPolaroid}
                    disabled={isGenerating}
                    className="flex-1 bg-pink-500 text-white py-3 px-4 rounded-lg hover:bg-pink-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" />
                    {isGenerating ? 'Generating...' : 'Download SnapSoul'}
                  </button>
                  <button
                    onClick={clearAll}
                    className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Clear All
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Preview */}
          <div className="space-y-6">
            {/* Cropper Modal */}
            {showCropper && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Crop Your Photo</h2>
                <div className="relative w-full h-80 bg-gray-100 rounded-lg overflow-hidden">
                  <Cropper
                    image={currentImage}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                    showGrid={false}
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">Zoom: {zoom.toFixed(1)}x</label>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleCropImage}
                    className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors font-medium"
                  >
                    Add to Strip
                  </button>
                  <button
                    onClick={cancelCrop}
                    className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Enhanced Polaroid Preview */}
            <div className="bg-pink rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Polaroid Strip Preview</h2>
              <div className="flex justify-center">
                <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-200" style={{ width: '200px', height: '520px' }}>
                  <div className="h-full flex flex-col bg-white">
                    <div className="flex-1 space-y-3">
                      {[...Array(3)].map((_, index) => (
                        <div
                          key={index}
                          className="relative bg-gray-50 rounded border border-gray-200 overflow-hidden"
                          style={{ height: '120px', width: '120px', margin: '0 auto' }}
                        >
                          {images[index] ? (
                            <>
                              <img
                                src={images[index]}
                                alt={`Photo ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <button
                                onClick={() => removeImage(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors opacity-80 hover:opacity-100"
                                style={{ width: '18px', height: '18px' }}
                              >
                                <Trash2 className="w-2 h-2" />
                              </button>
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <Camera className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 text-center">
                      <div className="flex items-center justify-center gap-1 text-base font-bold text-gray-800">
                        {icons[selectedIcon]}
                        <span className="mx-2">{customText}</span>
                        {icons[selectedIcon]}
                      </div>
                      <div className="mt-3 text-sm text-gray-400">
                        {'● ● ● ● ● ● ● ● ● ●'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center mt-4 text-sm text-gray-500">
                Add {Math.max(0, 3 - images.length)} more photo{Math.max(0, 3 - images.length) !== 1 ? 's' : ''}
              </div>
            </div>

            {/* Photo Grid */}
            {images.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-semibold mb-4">
                  Your Photos ({images.length}/3)
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border-2 border-gray-200 group-hover:border-pink-300 transition-colors aspect-square"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 shadow-lg"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                      <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolaroidPhotoBooth;