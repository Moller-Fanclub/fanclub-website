import React, { useEffect, useLayoutEffect, useState } from "react";
import MerchCard from "../../components/MerchCard.tsx";
import Countdown from "../../components/Countdown.tsx";
import { productService, type Product } from "../../services/productService.ts";
import { useShopConfig } from "../../hooks/useShopConfig.ts";
import PageContainer from "../../components/PageContainer.tsx";
import FadeInnAnimation from "@/components/FadeInnAnimation.tsx";

const SCROLL_KEY = 'merchPageScrollPosition';

const MerchPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { config, isOpen, isBeforeOpening } = useShopConfig();
    
    // Track if we need to restore scroll
    const [pendingScrollRestore, setPendingScrollRestore] = useState<number | null>(() => {
        const saved = sessionStorage.getItem(SCROLL_KEY);
        if (saved) {
            sessionStorage.removeItem(SCROLL_KEY);
            return parseInt(saved, 10);
        }
        return null;
    });

    // Restore scroll position after products load
    useLayoutEffect(() => {
        if (!loading && products.length > 0 && pendingScrollRestore !== null) {
            window.scrollTo(0, pendingScrollRestore);
            setPendingScrollRestore(null);
        }
    }, [loading, products, pendingScrollRestore]);
    
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
            <PageContainer>
                <div className="text-center py-12">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-yellow-400 border-r-transparent"></div>
                    <p className="mt-4 text-white text-xl">Laster butikkinformasjon...</p>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer maxWidth="6xl">
                {/* Header Section */}
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold text-white mb-8 drop-shadow-lg">
                        Møller Fanclub Merch
                    </h1>

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
                        <div className="mx-auto max-w-3xl mb-8 rounded-xl bg-white/10 backdrop-blur-md border-2 border-white/20 p-6 shadow-xl">
                            <div className="flex items-center justify-center mb-3">
                                <svg className="h-6 w-6 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h2 className="text-xl font-semibold text-white">
                                    Forhåndsbestillingsperioden er stengt
                                </h2>
                            </div>
                            <p className="text-white/90">
                                Denne forhåndsbestillingsrunden er nå over. 
                                Følg oss på Instagram for å få beskjed når neste periode åpner!
                            </p>
                        </div>
                    )}
                    
                    {/* Info Banner */}
                    <div className="mx-auto max-w-3xl mb-8 rounded-xl bg-white/10 backdrop-blur-md border-2 border-yellow-400/50 p-6 shadow-xl">
                        <div className="flex items-center justify-center mb-3">
                            <svg className="h-6 w-6 text-yellow-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h2 className="text-xl font-semibold text-white">
                                Forhåndsbestillingsperiode
                            </h2>
                        </div>
                        <p className="text-2xl font-bold text-yellow-400 mb-4">
                            {dateRange}
                        </p>
                        <div className="text-left space-y-2 text-white/90">
                            <p className="flex items-start">
                                <svg className="h-5 w-5 text-green-400 mr-2 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Bestill nå - produktene produseres basert på antall bestillinger</span>
                            </p>
                            <p className="flex items-start">
                                <svg className="h-5 w-5 text-green-400 mr-2 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Alle produkter produseres og sendes ut samtidig i batch</span>
                            </p>
                            <p className="flex items-start">
                                <svg className="h-5 w-5 text-green-400 mr-2 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Estimert leveringstid: <strong>{estimatedDeliveryWeeks}</strong> etter {closingDate?.getDate()}. november</span>
                            </p>
                            <p className="flex items-start">
                                <svg className="h-5 w-5 text-green-400 mr-2 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-yellow-400 border-r-transparent"></div>
                        <p className="mt-4 text-white text-xl">Laster produkter...</p>
                    </div>
                )}
                
                {/* Error State */}
                {error && (
                    <div className="text-center py-12">
                        <p className="text-red-400 text-xl">{error}</p>
                    </div>
                )}
                
            {/* Products Grid */}
            {!loading && !error && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 pb-12">
                    {products.map((product) => {
                        if (product.price) {
                            return (
                                <FadeInnAnimation key={product.id}>
                                    <MerchCard
                                        id={product.id}
                                        imageUrl={product.imageUrls[0]}
                                        title={product.title}
                                        price={product.price}
                                        onNavigate={() => {
                                            sessionStorage.setItem(SCROLL_KEY, window.scrollY.toString());
                                        }}
                                    />
                                </FadeInnAnimation>
                            );
                        }
                        return null;
                    })}
                </div>
            )}
        </PageContainer>
    );
};

export default MerchPage;
