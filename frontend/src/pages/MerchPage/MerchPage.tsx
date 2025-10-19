import React from "react";
import NavigationBar from "../../components/NavigationBar.tsx";
import "./MerchPage.css";


const MerchPage: React.FC = () => {

    return (
        <div className="merch-page">
            <NavigationBar />
            <div className="container">
                <h1 className="page-title">Merch</h1>
                <p className="page-subtitle">Kommer Snart!</p>
            </div>
        </div>
    );
};

export default MerchPage;
