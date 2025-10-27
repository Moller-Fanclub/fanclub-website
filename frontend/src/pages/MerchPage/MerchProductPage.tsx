import React, { useState, useEffect } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import './MerchProductPage.css';
import NavigationBar from "../../components/NavigationBar.tsx";
import { productService, type Product } from "../../services/productService.ts";
import { useCart } from '../../contexts/CartContext';
import { useShopConfig } from '../../hooks/useShopConfig.ts';

const MerchProductPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addItem } = useCart();
    const { config, isOpen: shopIsOpen } = useShopConfig();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [addedToCart, setAddedToCart] = useState(false);
    
    // Compute opening date from config
    const openingDate = config ? new Date(config.openingDate) : null;

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;
            
            try {
                setLoading(true);
                const data = await productService.getProductById(id);
                if (!data) {
                    setError('Product not found');
                } else {
                    setProduct(data);
                    // Set default size when product loads
                    if (data.sizes && data.sizes.length > 0) {
                        setSelectedSize(data.sizes[0]);
                    }
                }
            } catch (err) {
                setError('Failed to load product');
                console.error('Error loading product:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const nextImage = () => {
        if (!product) return;
        setCurrentIndex((prev) => (prev + 1) % product.imageUrls.length);
    };

    const prevImage = () => {
        if (!product) return;
        setCurrentIndex((prev) => (prev - 1 + product.imageUrls.length) % product.imageUrls.length);
    };

    const handleAddToCart = () => {
        if (!selectedSize || !product || !shopIsOpen) return;
        
        const priceNumber = parseFloat(product.price.replace(/[^0-9.]/g, '')) || 0;
        
        addItem({
            id: product.id,
            name: product.title,
            price: priceNumber,
            image: product.imageUrls[0],
            size: selectedSize
        });
        
        setAddedToCart(true);
        setTimeout(() => {
            setAddedToCart(false);
        }, 2000);
    };

    if (loading) {
        return (
            <div className="merch-product-page">
                <NavigationBar />
                <div className="text-center py-12">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                    <p className="mt-4 text-gray-600">Laster produkt...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="merch-product-page">
                <NavigationBar />
                <div className="text-center py-12">
                    <p className="text-red-600">{error || 'Product not found'}</p>
                    <button 
                        onClick={() => navigate('/merch')}
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Tilbake til Merch
                    </button>
                </div>
            </div>
        );
    }

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
                <p className="merch-price">{product.price} kr</p>
                
                {/* Size Selector */}
                {product.sizes && product.sizes.length > 0 && (
                    <div className="size-selector">
                        <label className="size-label">Størrelse:</label>
                        <div className="size-buttons">
                            {product.sizes.map(size => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`size-button ${selectedSize === size ? 'selected' : ''}`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* Add to Cart Button */}
                {shopIsOpen ? (
                    <button 
                        onClick={handleAddToCart}
                        disabled={!selectedSize}
                        className={`add-to-cart-button ${addedToCart ? 'added' : ''}`}
                    >
                        {addedToCart ? '✓ Lagt til i handlekurv!' : 'Legg i handlekurv'}
                    </button>
                ) : (
                    <div className="shop-closed-notice">
                        <div style={{
                            backgroundColor: '#FEE2E2',
                            border: '2px solid #EF4444',
                            borderRadius: '8px',
                            padding: '16px',
                            marginTop: '16px',
                            textAlign: 'center'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                                <svg style={{ width: '24px', height: '24px', color: '#DC2626' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#991B1B', margin: 0 }}>
                                    Butikken er stengt
                                </h3>
                            </div>
                            <p style={{ color: '#7F1D1D', marginBottom: '12px', fontSize: '14px' }}>
                                Forhåndsbestillingsperioden er ikke aktiv akkurat nå.
                            </p>
                            <p style={{ color: '#7F1D1D', fontSize: '14px', margin: 0 }}>
                                Neste periode: <strong>{openingDate?.toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MerchProductPage;