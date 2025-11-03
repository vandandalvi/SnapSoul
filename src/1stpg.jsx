
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Heart, Camera, Grid3x3 } from 'lucide-react';
import './index.css'
import Love from './love';
import Aesthetic from './aesthetic';
import vandan from './assets/lovq.jpg'

const FirstPage = ({ onNavigate }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const samplePolaroids = [
        {
            id: 1,
            type: 'Aesthetic',
            caption: 'My LOVE 💕',
            timestamp: 'April 22, 2025',
            photo: vandan,
            layout: 'single'
        }, 
        {
            id: 2,
            type: 'Love',
            caption: 'Our first date ❤️',
            timestamp: 'June 4, 2025',
            photo: 'https://www.allkpop.com/upload/2025/03/content/140930/1741959011-0001025361-005-20250314152417768.jpg',
            layout: 'single'
        },
        {
            id: 3,
            type: 'Multi',
            caption: 'Best Duo 📸',
            timestamp: 'Feb 10, 2025',
            photos: [
                'https://i.pinimg.com/236x/a1/1e/1c/a11e1c3ae4a655af10caf14c1599b3be.jpg',
                'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop'
            ],
            layout: 'couple'
        }, 
    ];

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % samplePolaroids.length);
    };
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % samplePolaroids.length);
        }, 5000); // 5 seconds

        return () => clearInterval(interval);
    }, [samplePolaroids.length]);

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + samplePolaroids.length) % samplePolaroids.length);
    };

    const renderPolaroidContent = (polaroid) => {
        if (polaroid.layout === 'single') {
            return (
                <div className="bg-gray-200 aspect-square mb-4 overflow-hidden">
                    <img
                        src={polaroid.photo}
                        alt={polaroid.caption}
                        className="w-full h-full object-cover"
                    />
                </div>
            );
        } else if (polaroid.layout === 'couple') {
            return (
                <div className="grid grid-cols-2 gap-2 mb-4 aspect-square">
                    {polaroid.photos.map((photo, index) => (
                        <div key={index} className="bg-gray-200 overflow-hidden">
                            <img
                                src={photo}
                                alt={`${polaroid.caption} ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>
            );
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4 sm:p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-center mb-12 text-gray-800 animate-fade-in">
                    <span className="block text-5xl sm:text-6xl font-serif font-bold tracking-tight mb-2 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent drop-shadow-sm">
                        📸 SnapSouls
                    </span>
                    <span className="block text-2xl sm:text-3xl font-light italic text-gray-600 tracking-wide">
                        ~by vandan'x
                    </span>
                </h1>

                {/* Carousel Section */}
                <div className="relative mb-16 px-4">
                    <div className="flex items-center justify-center">
                        <button
                            onClick={prevSlide}
                            className="absolute left-0 z-10 p-3 rounded-full bg-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 border-2 border-pink-100 hover:border-pink-300"
                        >
                            <ChevronLeft className="w-6 h-6 text-gray-600" />
                        </button>

                        <div className="w-full max-w-md mx-12">
                            <div className="bg-white p-6 shadow-2xl transform hover:scale-105 transition-all duration-500 rounded-lg hover:rotate-1 border-4 border-white relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-pink-100/20 to-purple-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                <div className="relative">
                                    {renderPolaroidContent(samplePolaroids[currentSlide])}
                                    <div className="text-center pb-2">
                                        <p className="text-gray-700 mb-2 text-lg font-medium italic tracking-wide">
                                            {samplePolaroids[currentSlide].caption}
                                        </p>
                                        <p className="text-gray-500 text-sm font-light tracking-wider">
                                            {samplePolaroids[currentSlide].timestamp}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={nextSlide}
                            className="absolute right-0 z-10 p-3 rounded-full bg-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 border-2 border-pink-100 hover:border-pink-300"
                        >
                            <ChevronRight className="w-6 h-6 text-gray-600" />
                        </button>
                    </div>

                    {/* Carousel Indicators */}
                    <div className="flex justify-center mt-6 space-x-3">
                        {samplePolaroids.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`h-2 rounded-full transition-all duration-300 ${
                                    index === currentSlide 
                                        ? 'bg-pink-500 w-8 shadow-lg' 
                                        : 'bg-gray-300 w-2 hover:bg-gray-400'
                                }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Template Buttons */}
                <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto px-4">
                    <button
                        onClick={() => onNavigate('love')}
                        className="bg-gradient-to-br from-pink-400 to-red-400 text-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-110 hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                        <Heart className="w-14 h-14 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg" />
                        <h3 className="text-xl font-bold mb-3 tracking-wide">Love SnapSoul</h3>
                        <p className="text-sm opacity-90 leading-relaxed">Perfect for couples & special moments</p>
                        <div className="mt-4 w-12 h-1 bg-white/50 mx-auto rounded-full group-hover:w-20 transition-all duration-300"></div>
                    </button>

                    <button
                        onClick={() => onNavigate('aesthetic')}
                        className="bg-gradient-to-br from-purple-400 to-pink-400 text-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-110 hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                        <Camera className="w-14 h-14 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg" />
                        <h3 className="text-xl font-bold mb-3 tracking-wide">Aesthetic SnapSoul</h3>
                        <p className="text-sm opacity-90 leading-relaxed">Solo shots with vintage vibes</p>
                        <div className="mt-4 w-12 h-1 bg-white/50 mx-auto rounded-full group-hover:w-20 transition-all duration-300"></div>
                    </button>

                    <button
                        onClick={() => onNavigate('multiple')}
                        className="bg-gradient-to-br from-blue-400 to-purple-400 text-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-110 hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                        <Grid3x3 className="w-14 h-14 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg" />
                        <h3 className="text-xl font-bold mb-3 tracking-wide">SnapSoul Photo Booth</h3>
                        <p className="text-sm opacity-90 leading-relaxed">Collage of your favorite memories</p>
                        <div className="mt-4 w-12 h-1 bg-white/50 mx-auto rounded-full group-hover:w-20 transition-all duration-300"></div>
                    </button>

                </div>
            </div>
        </div>
    );
};

export default FirstPage;
