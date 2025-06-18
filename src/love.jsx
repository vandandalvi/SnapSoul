import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import Cropper from 'react-easy-crop';
import { ArrowLeft } from 'lucide-react';
import getCroppedImg from './utils/cropImage';

export default function Love({ onBack }) {
  const [type, setType] = useState('double');
  const [caption, setCaption] = useState("Together moments. Forever memories.");
  const [date, setDate] = useState("18.06.2025");
  const [captionTopRight, setCaptionTopRight] = useState("Love Side by Side");
  const [captionBottomLeft, setCaptionBottomLeft] = useState("Cherish Every Moment");
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [singleImage, setSingleImage] = useState(null);
  const [croppingFor, setCroppingFor] = useState(null);
  const [tempImage, setTempImage] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [showCropper, setShowCropper] = useState(false);
  const polaroidRef = useRef(null);

  const handleImageChange = (e, setter, cropTarget = null) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (cropTarget) {
          setTempImage(reader.result);
          setCroppingFor(cropTarget);
          setShowCropper(true);
        } else {
          setter(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = (_, croppedPixels) => setCroppedAreaPixels(croppedPixels);

  const applyCrop = async () => {
    try {
      const croppedImage = await getCroppedImg(tempImage, croppedAreaPixels);
      if (croppingFor === 'single') setSingleImage(croppedImage);
      else if (croppingFor === 'image1') setImage1(croppedImage);
      else if (croppingFor === 'image2') setImage2(croppedImage);
      setShowCropper(false);
      setTempImage(null);
      setCroppingFor(null);
    } catch (e) {
      console.error(e);
    }
  };

  const downloadImage = async () => {
    if (polaroidRef.current) {
      const canvas = await html2canvas(polaroidRef.current, { scale: 2 });
      const link = document.createElement('a');
      link.download = 'polaroid.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const renderImageSlot = (image, placeholder) => (
    image ? <img src={image} alt={placeholder} className="w-full h-full object-cover rounded-lg" /> :
    <div className="flex items-center justify-center text-pink-400 text-xs w-full h-full bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-dashed border-pink-200 rounded-lg">
      💕 {placeholder}
    </div>
  );

  const renderPolaroidContent = () => {
    if (type === 'single') {
      return (
        <div className="relative w-full h-[400px] bg-gradient-to-br from-pink-50 to-rose-100 overflow-hidden rounded-lg">
          {singleImage ? <img src={singleImage} alt="Polaroid" className="w-full h-full object-cover object-center rounded-lg" /> :
           <div className="flex flex-col items-center justify-center w-full h-full text-pink-400 text-sm">
             <span className="text-4xl mb-2">💖</span>
             Upload an image
           </div>}
        </div>
      );
    }
    
    if (type === 'double') {
      return (
        <div className="grid grid-cols-2 gap-2 w-full h-[220px] bg-gradient-to-br from-pink-50 to-rose-50 p-1 rounded-lg">
          <div className="w-full h-full overflow-hidden">{renderImageSlot(image1, "Upload 1")}</div>
          <div className="w-full h-full overflow-hidden">{renderImageSlot(image2, "Upload 2")}</div>
        </div>
      );
    }
    
    return (
      <div className="flex flex-col w-full bg-gradient-to-br from-pink-50 to-rose-50 gap-2 p-1 rounded-lg">
        <div className="flex w-full h-[140px]">
          <div className="w-[50%] h-full overflow-hidden">{renderImageSlot(image1, "Upload 1")}</div>
          <div className="w-[50%] p-2 flex items-center justify-end text-sm text-right text-pink-600 font-medium bg-white/50 rounded-lg m-1">
            {captionTopRight}
          </div>
        </div>
        <div className="flex w-full h-[140px]">
          <div className="w-[50%] p-2 flex items-center justify-start text-sm text-pink-600 font-medium bg-white/50 rounded-lg m-1">
            {captionBottomLeft}
          </div>
          <div className="w-[50%] h-full overflow-hidden">{renderImageSlot(image2, "Upload 2")}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-red-100 p-6 relative">
      {/* Floating Hearts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 text-pink-200 text-2xl animate-bounce">💕</div>
        <div className="absolute top-20 right-20 text-rose-200 text-xl animate-pulse">💖</div>
        <div className="absolute bottom-20 left-20 text-pink-300 text-lg animate-bounce delay-1000">💝</div>
        <div className="absolute bottom-10 right-10 text-rose-300 text-2xl animate-pulse delay-500">💗</div>
        <div className="absolute top-1/2 left-1/4 text-pink-200 text-sm animate-bounce delay-700">✨</div>
        <div className="absolute top-1/3 right-1/3 text-rose-200 text-sm animate-pulse delay-300">🌸</div>
      </div>

      <div className="max-w-md mx-auto relative z-10">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-4 px-4 py-2 bg-white/80 backdrop-blur-sm border-2 border-pink-200 rounded-full text-pink-600 hover:bg-pink-50 hover:border-pink-300 transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent mb-2">
            💖 Love Polaroids 💖
          </h1>
          <p className="text-pink-600 text-sm">Capture your precious moments</p>
        </div>

        <label className="block mb-2 text-sm font-medium text-pink-700 flex items-center gap-1">
          🌹 Select Polaroid Type:
        </label>
        <select value={type} onChange={(e) => setType(e.target.value)} 
                className="mb-6 w-full p-3 border-2 border-pink-200 rounded-xl text-sm bg-white/80 focus:border-pink-400 focus:outline-none transition-colors">
          <option value="single">💕 Single Image</option>
          <option value="double">💖 Double Image</option>
          <option value="split">🌸 Creative Layout</option>
        </select>

        {showCropper && tempImage && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50">
            <div className="relative w-80 h-80 rounded-2xl overflow-hidden shadow-2xl">
              <Cropper image={tempImage} crop={crop} zoom={zoom} aspect={type === 'single' ? 3 / 4 : 1}
                       onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onCropComplete} />
            </div>
            <button onClick={applyCrop} 
                    className="mt-4 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full font-medium hover:from-pink-600 hover:to-rose-600 transition-all shadow-lg">
              ✨ Apply Crop
            </button>
          </div>
        )}

        <div ref={polaroidRef} className="bg-white p-3 shadow-2xl w-[280px] border-2 border-pink-100 mx-auto rounded-2xl mb-6">
          {renderPolaroidContent()}
          <div className="px-2 pt-3 pb-1 text-center text-sm text-gray-700 font-medium">{caption}</div>
          <div className="text-right text-xs pr-2 font-mono pb-1 text-pink-500 font-semibold">{date}</div>
        </div>

        <div className="mt-4 w-[280px] space-y-3 mx-auto">
          {type === 'single' ? 
            <div className="relative">
              <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, null, 'single')} 
                     className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <div className="w-full p-4 border-2 border-dashed border-pink-300 rounded-xl text-center text-pink-600 bg-gradient-to-br from-pink-50 to-rose-50 hover:border-pink-400 hover:bg-pink-100 transition-all cursor-pointer">
                📸 Upload Your Love Story
              </div>
            </div> :
            <div className="grid grid-cols-2 gap-2">
              {[1, 2].map(num => (
                <div key={num} className="relative">
                  <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, null, `image${num}`)} 
                         className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <div className="w-full p-3 border-2 border-dashed border-pink-300 rounded-xl text-center text-pink-600 bg-gradient-to-br from-pink-50 to-rose-50 hover:border-pink-400 hover:bg-pink-100 transition-all cursor-pointer text-xs">
                    💕 Memory {num}
                  </div>
                </div>
              ))}
            </div>
          }
          <textarea rows={2} className="w-full p-3 border-2 border-pink-200 rounded-xl text-sm bg-white/80 focus:border-pink-400 focus:outline-none transition-colors resize-none"
                    placeholder="💌 Write your love story caption..." value={caption} onChange={(e) => setCaption(e.target.value)} />
          <input type="text" className="w-full p-3 border-2 border-pink-200 rounded-xl text-sm bg-white/80 focus:border-pink-400 focus:outline-none transition-colors"
                 placeholder="📅 Edit date..." value={date} onChange={(e) => setDate(e.target.value)} />
          {type === 'split' && (
            <>
              <input type="text" className="w-full p-3 border-2 border-pink-200 rounded-xl text-sm bg-white/80 focus:border-pink-400 focus:outline-none transition-colors"
                     placeholder="🌸 Top right text..." value={captionTopRight} onChange={(e) => setCaptionTopRight(e.target.value)} />
              <input type="text" className="w-full p-3 border-2 border-pink-200 rounded-xl text-sm bg-white/80 focus:border-pink-400 focus:outline-none transition-colors"
                     placeholder="💖 Bottom left text..." value={captionBottomLeft} onChange={(e) => setCaptionBottomLeft(e.target.value)} />
            </>
          )}
          <button onClick={downloadImage} 
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all font-medium shadow-lg">
            💕 Download Polaroid
          </button>
        </div>
      </div>
    </div>
  );
}