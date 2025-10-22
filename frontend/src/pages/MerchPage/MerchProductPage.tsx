import React, { useState } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import './MerchProductPage.css';
import NavigationBar from "../../components/NavigationBar.tsx";


const products = [
    {
        id: '1',
        imageUrls: ['../../../public/images/tour-hoodie.png', '../../../public/images/tour-hoodie.png', '../../../public/images/tour-hoodie.png'],
        title: 'Stylish T-Shirt',
        price: '$29.99',
    },
    {
        id: '2',
        imageUrls: ['../../../public/images/tour-hoodie.png'],
        title: 'Cool Jacket',
        price: '$59.99',
    },
];

const MerchProductPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const product = products.find((p) => p.id === id);
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!product) {
        return <div>Product not found</div>;
    }

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % product.imageUrls.length);
    };

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + product.imageUrls.length) % product.imageUrls.length);
    };

    return (
        <div className="merch-product-page">
            <NavigationBar />
            <header className="merch-header">
                <button className="back-button" onClick={() => navigate('/merch')}>
                    &larr; Back
                </button>
                <h1 className="merch-title">{product.title}</h1>
            </header>
            <div className="carousel-container">
                <img
                    src={product.imageUrls[currentIndex]}
                    alt={`${product.title} - Image ${currentIndex + 1}`}
                    className="carousel-image"
                />
                <button className="carousel-button prev" onClick={prevImage}>
                    &lt;
                </button>
                <button className="carousel-button next" onClick={nextImage}>
                    &gt;
                </button>
                <div className="carousel-indicators">
                    {product.imageUrls.map((_, index) => (
                        <div
                            key={index}
                            className={`indicator ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => setCurrentIndex(index)}
                        />
                    ))}
                </div>
            </div>
            <div className="merch-details">
                <p className="merch-price">{product.price}</p>
            </div>
        </div>
    );
};

export default MerchProductPage;