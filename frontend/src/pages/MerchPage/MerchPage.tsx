import React, { useEffect, useState } from "react";
import NavigationBar from "../../components/NavigationBar.tsx";
import MerchCard from "../../components/MerchCard.tsx";
import Countdown from "../../components/Countdown.tsx";
import { productService, type Product } from "../../services/productService.ts";
import { useShopConfig } from "../../hooks/useShopConfig.ts";


const MerchPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { config, isOpen, isBeforeOpening } = useShopConfig();
    
    // Compute shop status
    const shopStatus = isBeforeOpening ? 'before' : isOpen ? 'open' : 'closed';
    
    // Compute date values from config
    const openingDate = config ? new Date(config.openingDate) : null;
    const closingDate = config ? new Date(config.closingDate) : null;
    
    // Format date range
    const dateRange = openingDate && closingDate 
        ? `${openingDate.getDate()}. november - ${closingDate.getDate()}. november`
        : '';
    
    // Estimated delivery
    const estimatedDeliveryWeeks = '3-4 uker';

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await productService.getAllProducts();
                setProducts(data);
                setError(null);
            } catch (err) {
                setError('Failed to load products. Please try again later.');
                console.error('Error loading products:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (!config) {
        return (
            <div className="min-h-screen bg-[#FFFAF0] py-8">
                <NavigationBar />
                <div className="text-center py-12 pt-24">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                    <p className="mt-4 text-gray-600">Laster butikkinformasjon...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FFFAF0] py-8">
            <NavigationBar />
            <div className="mx-auto max-w-6xl px-4 pt-20">
                {/* Header Section */}
                <div className="mb-12 text-center">


                    {/* Countdown - Before Opening */}
                    {shopStatus === 'before' && openingDate && (
                        <Countdown
                            targetDate={openingDate}
                            label="🎉 Butikken åpner om"
                            type="opening"
                        />
                    )}

                    {/* Countdown - Shop Open */}
                    {shopStatus === 'open' && closingDate && (
                        <Countdown
                            targetDate={closingDate}
                            label="⏰ Butikken stenger om"
                            type="closing"
                        />
                    )}

                    {/* Shop Closed Message */}
                    {shopStatus === 'closed' && (
                        <div className="mx-auto max-w-3xl mb-8 rounded-xl bg-linear-to-r from-gray-100 to-gray-200 border-2 border-gray-300 p-6 shadow-md">
                            <div className="flex items-center justify-center mb-3">
                                <svg className="h-6 w-6 text-gray-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Forhåndsbestillingsperioden er stengt
                                </h2>
                            </div>
                            <p className="text-gray-700">
                                Denne forhåndsbestillingsrunden er nå over. 
                                Følg oss på Instagram for å få beskjed når neste periode åpner!
                            </p>
                        </div>
                    )}
                    
                    {/* Info Banner */}
                    <div className="mx-auto max-w-3xl mb-8 rounded-xl bg-linear-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 p-6 shadow-md">
                        <div className="flex items-center justify-center mb-3">
                            <svg className="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h2 className="text-xl font-semibold text-blue-900">
                                Forhåndsbestillingsperiode
                            </h2>
                        </div>
                        <p className="text-2xl font-bold text-blue-700 mb-4">
                            {dateRange}
                        </p>
                        <div className="text-left space-y-2 text-gray-700">
                            <p className="flex items-start">
                                <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Bestill nå - produktene produseres basert på antall bestillinger</span>
                            </p>
                            <p className="flex items-start">
                                <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Alle produkter produseres og sendes ut samtidig i batch</span>
                            </p>
                            <p className="flex items-start">
                                <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Estimert leveringstid: <strong>{estimatedDeliveryWeeks}</strong> etter {closingDate?.getDate()}. november</span>
                            </p>
                            <p className="flex items-start">
                                <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Du får e-postoppdateringer når varene er produsert og sent</span>
                            </p>
                        </div>
                    </div>

                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                        <p className="mt-4 text-gray-600">Laster produkter...</p>
                    </div>
                )}
                
                {/* Error State */}
                {error && (
                    <div className="text-center py-12">
                        <p className="text-red-600">{error}</p>
                    </div>
                )}
                
                {/* Products Grid */}
                {!loading && !error && (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 pb-12">
                        {products.map((product) => {
                            if (product.price) {
                                return (
                                    <MerchCard
                                        key={product.id}
                                        id={product.id}
                                        imageUrl={product.imageUrls[0]}
                                        title={product.title}
                                        price={product.price}
                                    />
                                );
                            }
                            return null;
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MerchPage;
