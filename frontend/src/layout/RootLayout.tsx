import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import Footer from "../components/Footer";
import Cart from "../components/Cart";
import FloatingCartButton from "../components/FloatingCartButton";


const RootLayout = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-[#FFFAF0] flex-col">
      <NavigationBar />
      <Outlet />
      <Footer />
      <FloatingCartButton onClick={() => setIsCartOpen(true)} currentPath={location.pathname} />
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default RootLayout;
