import React from 'react';
import { Link } from 'react-router-dom';
import './styles/MerchCard.css';

interface MerchCardProps {
    id: string;
    imageUrl: string;
    title: string;
    price: string;
}

const MerchCard: React.FC<MerchCardProps> = ({ id, imageUrl, title, price }) => {
    return (
        <Link to={`/merch/${id}`} className="merch-card">
            <img src={imageUrl} alt={title} className="merch-image" />
            <div className="merch-details">
                <h3 className="merch-title">{title}</h3>
                <p className="merch-price">{price}</p>
            </div>
        </Link>
    );
};

export default MerchCard;