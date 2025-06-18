import React, { useState, useRef } from 'react';
import { Download, ArrowLeft, Camera, Upload } from 'lucide-react';
import { toPng } from 'html-to-image';
import './index.css';

const Aesthetic = ({ onBack }) => {
  const [caption, setCaption] = useState("Living my aesthetic dreams ✨");
  const [date, setDate] = useState("June 18, 2025");
  const [filter, setFilter] = useState("vintage");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const fileInputRef = useRef(null);
  const polaroidRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleDownload = async () => {
    if (!polaroidRef.current || !selectedImage) return;
    
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(polaroidRef.current, {
        quality: 1,
        pixelRatio: 2, 
        backgroundColor: '#ffffff',
      });

      const link = document.createElement('a');
      link.download = `aesthetic-polaroid-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Error generating image. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const filters = [
    { id: 'vintage', name: 'Vintage', class: 'sepia-[0.3] contrast-110' },
    { id: 'pastel', name: 'Pastel', class: 'saturate-75 brightness-110' },
    { id: 'film', name: 'Film', class: 'contrast-125 saturate-90' },
    { id: 'dreamy', name: 'Dreamy', class: 'blur-[0.5px] brightness-105' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
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
          🎨 Aesthetic SnapSoul
        </h2>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Polaroid Preview */}
          <div className="flex justify-center">
            <div 
              ref={polaroidRef}
              className="aesthetic-polaroid-frame bg-white p-6 shadow-2xl rounded-sm max-w-sm w-full"
            >
              <div 
                className={`aspect-square mb-4 flex items-center justify-center overflow-hidden ${selectedImage ? '' : 'bg-gray-200 border border-purple-200'} ${filters.find(f => f.id === filter)?.class}`}
                onClick={handleUploadClick}
              >
                {selectedImage ? (
                  <img 
                    src={selectedImage} 
                    alt="Uploaded preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center cursor-pointer">
                    <Upload className="w-16 h-16 mx-auto mb-2 text-purple-300" />
                    <p>Click to upload Aesthetic</p>
                  </div>
                )}
              </div>
              <div className="text-center pb-4">
                <p className="text-gray-700 mb-2 text-lg font-serif italic">
                  {caption}
                </p>
                <p className="text-gray-500 text-sm font-mono">
                  {date}
                </p>
              </div>
            </div>
          </div>
          
          {/* Editor Controls */}
          <div className="space-y-6">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            
            <button
              onClick={handleUploadClick}
              className="w-full bg-gradient-to-r from-purple-400 to-pink-400 text-white py-3 px-6 rounded-lg hover:from-purple-500 hover:to-pink-500 transition-colors flex items-center justify-center space-x-2"
            >
              <Upload className="w-5 h-5" />
              <span>{selectedImage ? 'Change Photo' : 'Upload Photo'}</span>
            </button>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aesthetic Caption
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-serif"
                rows="3"
                placeholder="Express your aesthetic vibe..."
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
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                {filters.map((filterOption) => (
                  <button
                    key={filterOption.id}
                    onClick={() => setFilter(filterOption.id)}
                    className={`p-3 rounded-lg border transition-colors ${
                      filter === filterOption.id
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-300 hover:border-purple-300'
                    }`}
                  >
                    {filterOption.name}
                  </button>
                ))}
              </div>
            </div>
            
            <button
              onClick={handleDownload}
              disabled={!selectedImage || isDownloading}
              className={`w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                !selectedImage || isDownloading ? 'opacity-50 cursor-not-allowed' : 'hover:from-purple-600 hover:to-pink-600'
              }`}
            >
              {isDownloading ? (
                'Downloading...'
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Save Aesthetic Snap</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Aesthetic;