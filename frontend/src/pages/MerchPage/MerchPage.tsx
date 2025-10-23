import React from "react";
import NavigationBar from "../../components/NavigationBar.tsx";
import MerchCard from "../../components/MerchCard.tsx";
import { merchProducts } from "../../merch.ts";


const MerchPage: React.FC = () => {

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100 py-8">
            <NavigationBar />
            <div className="mx-auto max-w-5xl px-4">
                <h1 className="mt-20 mb-8 text-center text-3xl font-bold text-gray-800">Merch</h1>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {merchProducts.map((product) => (
                        <MerchCard
                            key={product.id}
                            id={product.id}
                            imageUrl={product.imageUrls[0]}
                            title={product.title}
                            price={product.price}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MerchPage;
