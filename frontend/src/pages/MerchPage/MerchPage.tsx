import React from "react";
import NavigationBar from "../../components/NavigationBar.tsx";
import "./MerchPage.css";
import MerchCard from "../../components/MerchCard.tsx";
import {merchProducts} from "../../merch.ts";


const MerchPage: React.FC = () => {

    return (
        <div className="merch-page">
            <NavigationBar />
            <div className="container">
                <h1 className="page-title">Merch</h1>
                <div className="merch-grid">
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
