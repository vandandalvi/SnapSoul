import React, { useState, useRef } from 'react';
import { Download, ArrowLeft, Camera, Upload, X } from 'lucide-react';

const Multiple = ({ onBack }) => {
  const [caption, setCaption] = useState("Collected memories 📸");
  const [date, setDate] = useState("June 18, 2025");
  const [layout, setLayout] = useState("grid");
  const [uploadedImages, setUploadedImages] = useState([]);
  const fileInputRef = useRef(null);
  const polaroidRef = useRef(null);

  const handleDownload = async () => {
    try {
      // Create a canvas to render the polaroid
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set canvas size (adjust as needed)
      canvas.width = 400;
      canvas.height = 500;
      
      // Fill white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add a border
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 2;
      ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
      
      // Draw photos based on layout
      await drawPhotosOnCanvas(ctx, canvas.width, canvas.height);
      
      // Add text
      ctx.fillStyle = '#374151';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(caption, canvas.width / 2, canvas.height - 60);
      
      ctx.fillStyle = '#6b7280';
      ctx.font = '12px Arial';
      ctx.fillText(date, canvas.width / 2, canvas.height - 30);
      
      // Download the canvas as image
      const link = document.createElement('a');
      link.download = `polaroid-collection-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      alert("Download feature needs additional setup. For now, you can screenshot the polaroid!");
    }
  };

  const drawPhotosOnCanvas = async (ctx, canvasWidth, canvasHeight) => {
    const photoArea = { x: 30, y: 30, width: canvasWidth - 60, height: canvasHeight - 140 };
    
    const promises = uploadedImages.slice(0, 4).map((img, index) => {
      return new Promise((resolve) => {
        const image = new Image();
        image.onload = () => {
          let x, y, width, height;
          
          if (layout === 'grid') {
            const cellWidth = photoArea.width / 2;
            const cellHeight = photoArea.height / 2;
            x = photoArea.x + (index % 2) * cellWidth + 5;
            y = photoArea.y + Math.floor(index / 2) * cellHeight + 5;
            width = cellWidth - 10;
            height = cellHeight - 10;
          } else if (layout === 'strip') {
            width = photoArea.width / 4 - 5;
            height = photoArea.height - 10;
            x = photoArea.x + index * (width + 5);
            y = photoArea.y + 5;
          } else {
            // For other layouts, use grid as fallback
            const cellWidth = photoArea.width / 2;
            const cellHeight = photoArea.height / 2;
            x = photoArea.x + (index % 2) * cellWidth + 5;
            y = photoArea.y + Math.floor(index / 2) * cellHeight + 5;
            width = cellWidth - 10;
            height = cellHeight - 10;
          }
          
          ctx.drawImage(image, x, y, width, height);
          resolve();
        };
        image.src = img;
      });
    });
    
    await Promise.all(promises);
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    
    files.forEach((file) => {
      if (file.type.startsWith('image/') && uploadedImages.length < 6) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedImages(prev => [...prev, e.target.result]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const layouts = [
    { id: 'grid', name: '2x2 Grid', description: 'Classic square grid layout' },
    { id: 'scattered', name: 'Scattered', description: 'Randomly positioned photos' },
    { id: 'strip', name: 'Photo Strip', description: 'Horizontal strip layout' },
    { id: 'cascade', name: 'Cascade', description: 'Overlapping cascade effect' },
    { id: 'circle', name: 'Circle', description: 'Arranged in a circular pattern' },
    { id: 'diagonal', name: 'Diagonal', description: 'Diagonal arrangement' }
  ];

  const renderPhotoLayout = () => {
    const photoSlots = layout === 'strip' ? 4 : layout === 'circle' ? 5 : 4;
    
    if (layout === 'grid') {
      return (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-gray-200 aspect-square flex items-center justify-center text-gray-500 text-xs border border-blue-200 overflow-hidden">
              {uploadedImages[index] ? (
                <img src={uploadedImages[index]} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <Camera className="w-6 h-6 mx-auto mb-1 text-blue-300" />
                  <p>Photo {index + 1}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    } else if (layout === 'scattered') {
      const positions = [
        { top: '8px', left: '8px', width: '64px', height: '64px', rotate: '3deg' },
        { top: '32px', right: '16px', width: '80px', height: '64px', rotate: '-2deg' },
        { bottom: '24px', left: '32px', width: '72px', height: '72px', rotate: '6deg' },
        { bottom: '8px', right: '8px', width: '64px', height: '80px', rotate: '-12deg' }
      ];
      
      return (
        <div className="relative mb-4 h-48 bg-gray-100 border border-blue-200">
          {positions.map((pos, index) => (
            <div
              key={index}
              className="absolute bg-gray-200 border border-blue-200 flex items-center justify-center text-xs overflow-hidden"
              style={{
                ...pos,
                transform: `rotate(${pos.rotate})`
              }}
            >
              {uploadedImages[index] ? (
                <img src={uploadedImages[index]} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
              ) : (
                <Camera className="w-4 h-4 text-blue-300" />
              )}
            </div>
          ))}
        </div>
      );
    } else if (layout === 'strip') {
      return (
        <div className="flex space-x-1 mb-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-gray-200 w-full aspect-[3/4] flex items-center justify-center text-gray-500 text-xs border border-blue-200 overflow-hidden">
              {uploadedImages[index] ? (
                <img src={uploadedImages[index]} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <Camera className="w-4 h-4 mx-auto mb-1 text-blue-300" />
                  <p>{index + 1}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    } else if (layout === 'cascade') {
      return (
        <div className="relative mb-4 h-48">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="absolute bg-gray-200 border border-blue-200 flex items-center justify-center text-xs overflow-hidden"
              style={{
                width: '120px',
                height: '90px',
                left: `${index * 15}px`,
                top: `${index * 12}px`,
                zIndex: 4 - index,
                transform: `rotate(${index * 2 - 3}deg)`
              }}
            >
              {uploadedImages[index] ? (
                <img src={uploadedImages[index]} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <Camera className="w-4 h-4 mx-auto mb-1 text-blue-300" />
                  <p>{index + 1}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    } else if (layout === 'circle') {
      const radius = 70;
      const centerX = 120;
      const centerY = 96;
      
      return (
        <div className="relative mb-4 h-48 bg-gray-50 border border-blue-200">
          {Array.from({ length: 5 }).map((_, index) => {
            const angle = (index * 2 * Math.PI) / 5 - Math.PI / 2;
            const x = centerX + radius * Math.cos(angle) - 30;
            const y = centerY + radius * Math.sin(angle) - 30;
            
            return (
              <div
                key={index}
                className="absolute bg-gray-200 border border-blue-200 flex items-center justify-center text-xs overflow-hidden"
                style={{
                  width: '60px',
                  height: '60px',
                  left: `${x}px`,
                  top: `${y}px`,
                  transform: `rotate(${index * 15}deg)`
                }}
              >
                {uploadedImages[index] ? (
                  <img src={uploadedImages[index]} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-3 h-3 text-blue-300" />
                )}
              </div>
            );
          })}
        </div>
      );
    } else if (layout === 'diagonal') {
      return (
        <div className="relative mb-4 h-48">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="absolute bg-gray-200 border border-blue-200 flex items-center justify-center text-xs overflow-hidden"
              style={{
                width: '80px',
                height: '60px',
                left: `${20 + index * 40}px`,
                top: `${20 + index * 25}px`,
                transform: `rotate(${-15 + index * 10}deg)`
              }}
            >
              {uploadedImages[index] ? (
                <img src={uploadedImages[index]} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <Camera className="w-4 h-4 mx-auto mb-1 text-blue-300" />
                  <p>{index + 1}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
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
          📸 Multi-Photo SnapSoul
        </h2>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Upload Photos</h3>
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  multiple
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex flex-col items-center space-y-2 text-blue-600 hover:text-blue-700"
                >
                  <Upload className="w-8 h-8" />
                  <span className="text-sm font-medium">Click to upload photos</span>
                  <span className="text-xs text-gray-500">Up to 6 images</span>
                </button>
              </div>
              
              {uploadedImages.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Uploaded Photos ({uploadedImages.length}/6)
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {uploadedImages.map((img, index) => (
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
            <div ref={polaroidRef} className="multi-polaroid-frame bg-white p-6 shadow-2xl rounded-sm max-w-sm w-full">
              {renderPhotoLayout()}
              <div className="text-center pb-4">
                <p className="text-gray-700 mb-2 text-base">
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
                Layout Style
              </label>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {layouts.map((layoutOption) => (
                  <button
                    key={layoutOption.id}
                    onClick={() => setLayout(layoutOption.id)}
                    className={`w-full p-3 rounded-lg border text-left transition-colors ${
                      layout === layoutOption.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    <div className="font-medium">{layoutOption.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{layoutOption.description}</div>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Collection Caption
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                placeholder="Describe your photo collection..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <button
              onClick={handleDownload}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors flex items-center justify-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Download Your Snap</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Multiple;