import React, { useState, useRef } from 'react';
import { Download, ArrowLeft, Heart, Upload, X } from 'lucide-react';

const Love = ({ onBack }) => {
  const [caption, setCaption] = useState("Our beautiful moment together ❤️");
  const [date, setDate] = useState("June 18, 2025");
  const [selectedImages, setSelectedImages] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [template, setTemplate] = useState("kissing");
  const [customText1, setCustomText1] = useState("Forever & Always");
  const [customText2, setCustomText2] = useState("Together in Love");
  const fileInputRef = useRef(null);
  const polaroidRef = useRef(null);

  const templates = [
    { id: 'kissing', name: 'Couple', description: 'Two photos side by side for couples' },
    { id: 'single', name: 'Single Couple Photo', description: 'One beautiful moment' },
    { id: 'quad', name: '4-Photo Layout', description: 'Photos with text in corners' }
  ];

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach((file) => {
      if (file.type.startsWith('image/') && selectedImages.length < getMaxImages()) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setSelectedImages(prev => [...prev, event.target.result]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const getMaxImages = () => {
    switch (template) {
      case 'kissing': return 2;
      case 'single': return 1;
      case 'quad': return 2;
      default: return 1;
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const useSamplePhoto = (type) => {
    if (selectedImages.length < getMaxImages()) {
      setSelectedImages(prev => [...prev, samplePhotos[type]]);
    }
  };

  const handleDownload = async () => {
    if (!polaroidRef.current) return;
    
    setIsDownloading(true);
    try {
      // Create a canvas to render the polaroid
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = 400;
      canvas.height = 500;
      
      // Fill white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add border
      ctx.strokeStyle = '#f3f4f6';
      ctx.lineWidth = 2;
      ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
      
      // Draw the template
      await drawTemplateOnCanvas(ctx, canvas.width, canvas.height);
      
      // Add caption and date
      ctx.fillStyle = '#374151';
      ctx.font = 'italic 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(caption, canvas.width / 2, canvas.height - 60);
      
      ctx.fillStyle = '#6b7280';
      ctx.font = '12px Arial';
      ctx.fillText(date, canvas.width / 2, canvas.height - 30);
      
      // Download
      const link = document.createElement('a');
      link.download = `love-polaroid-${template}-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Error generating image. Please try screenshot instead!');
    } finally {
      setIsDownloading(false);
    }
  };

  const drawTemplateOnCanvas = async (ctx, canvasWidth, canvasHeight) => {
    const photoArea = { x: 30, y: 30, width: canvasWidth - 60, height: canvasHeight - 140 };
    
    if (template === 'kissing' && selectedImages.length >= 2) {
      const promises = selectedImages.slice(0, 2).map((img, index) => {
        return new Promise((resolve) => {
          const image = new Image();
          image.onload = () => {
            const width = photoArea.width / 2 - 5;
            const height = photoArea.height;
            const x = photoArea.x + (index * (width + 10));
            const y = photoArea.y;
            
            ctx.drawImage(image, x, y, width, height);
            resolve();
          };
          image.src = img;
        });
      });
      await Promise.all(promises);
    } else if (template === 'single' && selectedImages.length >= 1) {
      const image = new Image();
      await new Promise((resolve) => {
        image.onload = () => {
          ctx.drawImage(image, photoArea.x, photoArea.y, photoArea.width, photoArea.height);
          resolve();
        };
        image.src = selectedImages[0];
      });
    }
  };

  const renderTemplate = () => {
    if (template === 'kissing') {
      return (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="bg-gray-200 aspect-square flex items-center justify-center overflow-hidden border-2 border-pink-200 cursor-pointer" onClick={handleUploadClick}>
              {selectedImages[index] ? (
                <img 
                  src={selectedImages[index]} 
                  alt={`Photo ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-pink-300" />
                  <p className="text-xs text-gray-500">Upload Photo {index + 1}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    } else if (template === 'single') {
      return (
        <div className="mb-4">
          <div className="bg-gray-200 aspect-square flex items-center justify-center overflow-hidden border-2 border-pink-200 cursor-pointer" onClick={handleUploadClick}>
            {selectedImages[0] ? (
              <img 
                src={selectedImages[0]} 
                alt="Love moment" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center">
                <Upload className="w-12 h-12 mx-auto mb-2 text-pink-300" />
                <p className="text-sm text-gray-500">Upload your moment</p>
              </div>
            )}
          </div>
        </div>
      );
    } else if (template === 'quad') {
      return (
        <div className="grid grid-cols-2 gap-1 mb-4 h-64">
          {/* Top Left - Photo 1 */}
          <div className="bg-gray-200 flex items-center justify-center overflow-hidden border border-pink-200 cursor-pointer" onClick={handleUploadClick}>
            {selectedImages[0] ? (
              <img 
                src={selectedImages[0]} 
                alt="Photo 1" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center">
                <Upload className="w-6 h-6 mx-auto mb-1 text-pink-300" />
                <p className="text-xs text-gray-500">Upload Photo 1</p>
              </div>
            )}
          </div>
          
          {/* Top Right - Custom Text */}
          <div className="bg-gradient-to-br from-pink-100 to-red-100 flex items-center justify-center border border-pink-200 p-2">
            <div className="text-center">
              <Heart className="w-6 h-6 mx-auto mb-2 text-pink-500" />
              <p className="text-xs font-medium text-gray-700">{customText1}</p>
            </div>
          </div>
          
          {/* Bottom Left - Custom Text */}
          <div className="bg-gradient-to-br from-red-100 to-pink-100 flex items-center justify-center border border-pink-200 p-2">
            <div className="text-center">
              <Heart className="w-6 h-6 mx-auto mb-2 text-red-500" />
              <p className="text-xs font-medium text-gray-700">{customText2}</p>
            </div>
          </div>
          
          {/* Bottom Right - Photo 2 */}
          <div className="bg-gray-200 flex items-center justify-center overflow-hidden border border-pink-200 cursor-pointer" onClick={handleUploadClick}>
            {selectedImages[1] ? (
              <img 
                src={selectedImages[1]} 
                alt="Photo 2" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center">
                <Upload className="w-6 h-6 mx-auto mb-1 text-pink-300" />
                <p className="text-xs text-gray-500">Upload Photo 2</p>
              </div>
            )}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Templates</span>
          </button>
        </div>
        
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          ❤️ Love SnapSoul
        </h2>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upload & Sample Photos Section */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Upload Photos</h3>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                multiple
                className="hidden"
              />
              
              <button
                onClick={handleUploadClick}
                className="w-full bg-gradient-to-r from-pink-400 to-red-400 text-white py-3 px-6 rounded-lg hover:from-pink-500 hover:to-red-500 transition-colors flex items-center justify-center space-x-2 mb-4"
              >
                <Upload className="w-5 h-5" />
                <span>Upload Photos ({selectedImages.length}/{getMaxImages()})</span>
              </button>
              
              {selectedImages.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Uploaded Photos:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedImages.map((img, index) => (
                      <div key={index} className="relative">
                        <img
                          src={img}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-16 object-cover rounded border"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
          </div>
          
          {/* Polaroid Preview */}
          <div className="flex justify-center">
            <div 
              ref={polaroidRef}
              className="love-polaroid-frame bg-white p-6 shadow-2xl rounded-sm max-w-sm w-full"
            >
              {renderTemplate()}
              <div className="text-center pb-4 border-pink-100 border-2 rounded p-3 bg-gradient-to-r from-pink-50 to-red-50">
                <p className="text-gray-700 mb-2 text-base italic font-medium">
                  {caption}
                </p>
                <p className="text-gray-500 text-sm">
                  {date}
                </p>
              </div>
            </div>
          </div>
          
          {/* Editor Controls */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Template Style
              </label>
              <div className="space-y-2">
                {templates.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => {
                      setTemplate(tmpl.id);
                      setSelectedImages([]);
                    }}
                    className={`w-full p-3 rounded-lg border text-left transition-colors ${
                      template === tmpl.id
                        ? 'border-pink-500 bg-pink-50 text-pink-700'
                        : 'border-gray-300 hover:border-pink-300'
                    }`}
                  >
                    <div className="font-medium">{tmpl.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{tmpl.description}</div>
                  </button>
                ))}
              </div>
            </div>
            
            
            {template === 'quad' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Top Right Text
                  </label>
                  <input
                    type="text"
                    value={customText1}
                    onChange={(e) => setCustomText1(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bottom Left Text
                  </label>
                  <input
                    type="text"
                    value={customText2}
                    onChange={(e) => setCustomText2(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Love Caption
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                rows="3"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Memory
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
            
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className={`w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                isDownloading ? 'opacity-50 cursor-not-allowed' : 'hover:from-pink-600 hover:to-red-600'
              }`}
            >
              {isDownloading ? (
                'Downloading...'
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Save Love Snap</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Love;