
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Heart, Camera, Grid3x3 } from 'lucide-react';
import './index.css'
import Love from './love';
import Aesthetic from './aesthetic';
import vandan from './assets/vandan.png'

const FirstPage = ({ onNavigate }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const samplePolaroids = [
        {
            id: 1,
            type: 'Love',
            caption: 'Our first date ❤️',
            timestamp: 'June 4, 2025',
            photo: 'https://www.allkpop.com/upload/2025/03/content/140930/1741959011-0001025361-005-20250314152417768.jpg',
            layout: 'single'
        },
        {
            id: 2,
            type: 'Multi',
            caption: 'Best Duo 📸',
            timestamp: 'Feb 10, 2025',
            photos: [
                'https://i.pinimg.com/236x/a1/1e/1c/a11e1c3ae4a655af10caf14c1599b3be.jpg',
                'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop'
            ],
            layout: 'couple'
        },
        {
            id: 3,
            type: 'Aesthetic',
            caption: 'Golden hour vibes ✨',
            timestamp: 'March 23, 2025',
            photo: vandan,
            layout: 'single'
        },
    ];

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % samplePolaroids.length);
    };
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % samplePolaroids.length);
        }, 3000); // 3 seconds

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
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-center mb-8 text-gray-800">
                    <span className="block text-4xl font-serif font-bold">📸 SnapSouls</span>
                    <span className="block text-2xl font-light font-medium italic">~by vandan</span>
                </h1>

                {/* Carousel Section */}
                <div className="relative mb-12">
                    <div className="flex items-center justify-center">
                        <button
                            onClick={prevSlide}
                            className="absolute left-0 z-10 p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <ChevronLeft className="w-6 h-6 text-gray-600" />
                        </button>

                        <div className="w-full max-w-md mx-12">
                            <div className="bg-white p-4 shadow-xl transform hover:scale-105 transition-transform duration-300 rounded-sm">
                                {renderPolaroidContent(samplePolaroids[currentSlide])}
                                <div className="text-center pb-4">
                                    <p className="text-gray-700 mb-2 text-lg italic">
                                        {samplePolaroids[currentSlide].caption}
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        {samplePolaroids[currentSlide].timestamp}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={nextSlide}
                            className="absolute right-0 z-10 p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <ChevronRight className="w-6 h-6 text-gray-600" />
                        </button>
                    </div>

                    {/* Carousel Indicators */}
                    <div className="flex justify-center mt-4 space-x-2">
                        {samplePolaroids.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`w-2 h-2 rounded-full transition-colors ${index === currentSlide ? 'bg-pink-500' : 'bg-gray-300'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Template Buttons */}
                <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                    <button
                        onClick={() => onNavigate('love')}
                        className="bg-gradient-to-br from-pink-400 to-red-400 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                        <Heart className="w-12 h-12 mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">Love SnapSoul</h3>
                        <p className="text-sm opacity-90">Perfect for couples & special moments</p>
                    </button>

                    <button
                        onClick={() => onNavigate('aesthetic')}
                        className="bg-gradient-to-br from-purple-400 to-pink-400 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                        <Camera className="w-12 h-12 mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">Aesthetic SnapSoul</h3>
                        <p className="text-sm opacity-90">Solo shots with vintage vibes</p>
                    </button>

                    <button
                        onClick={() => onNavigate('multiple')}
                        className="bg-gradient-to-br from-blue-400 to-purple-400 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                        <Grid3x3 className="w-12 h-12 mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">SnapSoul Photo Booth</h3>
                        <p className="text-sm opacity-90">Collage of your favorite memories</p>
                    </button>

                </div>
            </div>
        </div>
    );
};

export default FirstPage;