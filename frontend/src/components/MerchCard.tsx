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
                <img src={imageUrl} alt={title} className="mt-3 w-3/5 object-contain" />
                <div className="w-full p-4">
                    <h3 className="text-2xl font-semibold text-gray-800">{title}</h3>
                    <p className="text-md text-gray-600">{price} kr</p>
                </div>
            </Link>
        </div>
    );
};

export default MerchCard;