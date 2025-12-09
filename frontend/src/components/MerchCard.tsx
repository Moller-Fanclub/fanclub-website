import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface MerchCardProps {
    id: string;
    imageUrls: string[];
    title: string;
    price: string;
    onNavigate?: () => void;
}

const MerchCard: React.FC<MerchCardProps> = ({ id, imageUrls, title, price, onNavigate }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = (e: React.TouchEvent) => {
        if (!touchStart || !touchEnd || imageUrls.length <= 1) return;
        
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
        
        if (isLeftSwipe || isRightSwipe) {
            e.preventDefault();
            if (isLeftSwipe) {
                setCurrentIndex((prev) => (prev + 1) % imageUrls.length);
            } else {
                setCurrentIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
            }
        }
    };

    const currentImage = imageUrls[currentIndex] || imageUrls[0];

    return (
        <div className="merch-card-container">
            <Link
                to={`/merch/${id}`}
                onClick={onNavigate}
                className="mx-auto flex max-w-sm cursor-pointer flex-col items-center rounded-xl border border-gray-200 bg-white text-center text-gray-900 no-underline shadow-md transition-transform duration-200 hover:scale-105"
            >
                <div className="w-full px-4 pt-4">
                    <div 
                        className="aspect-square w-full max-w-[300px] mx-auto relative"
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                    >
                        <img
                            src={currentImage}
                            alt={title}
                            className="h-full w-full rounded-lg object-cover"
                        />
                    </div>
                </div>

                {imageUrls.length > 1 && (
                    <div className="flex gap-1.5 py-2 md:hidden">
                        {imageUrls.map((_, index) => (
                            <div
                                key={index}
                                className={`w-2 h-2 rounded-full ${index === currentIndex ? 'bg-gray-800' : 'bg-gray-300'}`}
                            />
                        ))}
                    </div>
                )}

                <div className="w-full p-4 pt-2">
                    <h3 className="text-2xl font-semibold text-gray-800">{title}</h3>
                    <p className="text-md text-gray-600">{price} kr</p>
                </div>
            </Link>
        </div>
    );
};

export default MerchCard;