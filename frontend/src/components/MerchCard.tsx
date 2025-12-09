import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';

interface MerchCardProps {
    id: string;
    imageUrls: string[];
    title: string;
    price: string;
    onNavigate?: () => void;
}

const MerchCard: React.FC<MerchCardProps> = ({ id, imageUrls, title, price, onNavigate }) => {
    const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    React.useEffect(() => {
        // Check if device supports touch
        setIsTouchDevice(() => {
            return (('ontouchstart' in window) ||
                    (navigator.maxTouchPoints > 0));
        });
    }, []);

    const handlePrev = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        swiperInstance?.slidePrev();
    };

    const handleNext = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        swiperInstance?.slideNext();
    };

    return (
        <div className="merch-card-container">
            <Link
                to={`/merch/${id}`}
                onClick={onNavigate}
                className="mx-auto flex max-w-sm cursor-pointer flex-col items-center rounded-xl border border-gray-200 bg-white text-center text-gray-900 no-underline shadow-md transition-transform duration-200 hover:scale-105"
            >
                <div className="w-full px-4 pt-4">
                    {imageUrls.length > 1 ? (
                        <Swiper
                            modules={[Pagination]}
                            pagination={{ clickable: true }}
                            loop={true}
                            allowTouchMove={!isTouchDevice}
                            simulateTouch={isTouchDevice}
                            className="merch-card-swiper w-full max-w-[300px] mx-auto"
                            onSwiper={setSwiperInstance}
                        >
                            {imageUrls.map((url, index) => (
                                <SwiperSlide key={index}>
                                    <div className="aspect-square rounded-lg overflow-hidden bg-white">
                                        <img
                                            src={url}
                                            alt={`${title} - Image ${index + 1}`}
                                            className="h-full w-full object-contain"
                                        />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        <div className="w-full max-w-[300px] mx-auto pb-6">
                            <div className="aspect-square rounded-lg overflow-hidden bg-white">
                                <img
                                    src={imageUrls[0]}
                                    alt={title}
                                    className="h-full w-full object-contain"
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="w-full p-4 pt-2">
                    {imageUrls.length > 1 ? (
                        <div className="flex items-center justify-center gap-2">
                            <button
                                onClick={handlePrev}
                                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                aria-label="Previous image"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <h3 className="text-2xl font-semibold text-gray-800">{title}</h3>
                            <button
                                onClick={handleNext}
                                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                aria-label="Next image"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <h3 className="text-2xl font-semibold text-gray-800">{title}</h3>
                    )}
                    <p className="text-md text-gray-600">{price} kr</p>
                </div>
            </Link>
        </div>
    );
};

export default MerchCard;