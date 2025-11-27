import React from 'react';
import { Link } from 'react-router-dom';

interface MerchCardProps {
    id: string;
    imageUrl: string;
    title: string;
    price: string;
}

const MerchCard: React.FC<MerchCardProps> = ({ id, imageUrl, title, price }) => {
    return (
        <div className="merch-card-container">
            <Link
                to={`/merch/${id}`}
                className="mx-auto flex max-w-sm cursor-pointer flex-col items-center rounded-xl border border-gray-200 bg-white text-center text-gray-900 no-underline shadow-md transition-transform duration-200 hover:scale-105"
            >
                <div className="w-full px-4 pt-4">
                    <div className="aspect-square w-full max-w-[300px] mx-auto">
                        <img
                            src={imageUrl}
                            alt={title}
                            className="h-full w-full rounded-lg object-cover"
                        />
                    </div>
                </div>

                <div className="w-full p-4">
                    <h3 className="text-2xl font-semibold text-gray-800">{title}</h3>
                    <p className="text-md text-gray-600">{price} kr</p>
                </div>
            </Link>
        </div>
    );
};

export default MerchCard;