import React from "react";
import NavigationBar from "../../components/NavigationBar.tsx";
import "./MerchPage.css";
import MerchCard from "../../components/MerchCard.tsx";

const products = [
    {
        id: '1',
        imageUrl: '../../../public/images/tour-hoodie.png',
        title: 'Stylish T-Shirt',
        price: '$29.99',
    },
    {
        id: '2',
        imageUrl: '../../../public/images/tour-hoodie.png',
        title: 'Cool Jacket',
        price: '$59.99',
    },
];

const MerchPage: React.FC = () => {

    return (
        <div className="merch-page">
            <NavigationBar />
            <div className="container">
                <h1 className="page-title">Merch</h1>
                <div className="merch-grid">
                    {products.map((product) => (
                        <MerchCard
                            key={product.id}
                            id={product.id}
                            imageUrl={product.imageUrl}
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
