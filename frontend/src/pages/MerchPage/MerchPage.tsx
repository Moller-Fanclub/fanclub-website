import React, { useEffect, useState } from "react";
import NavigationBar from "../../components/NavigationBar.tsx";
import MerchCard from "../../components/MerchCard.tsx";
import { productService, type Product } from "../../services/productService.ts";


const MerchPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    return (
        <div className="min-h-screen flex justify-center items-center bg-[#FFFAF0] py-8">
            <NavigationBar />
            <div className="mx-auto max-w-5xl px-4">
                <h1 className="mt-20 mb-8 text-center text-3xl font-bold text-gray-800">Merch</h1>
                
                {loading && (
                    <div className="text-center py-12">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                        <p className="mt-4 text-gray-600">Laster produkter...</p>
                    </div>
                )}
                
                {error && (
                    <div className="text-center py-12">
                        <p className="text-red-600">{error}</p>
                    </div>
                )}
                
                {!loading && !error && (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
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
