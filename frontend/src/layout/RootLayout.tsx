import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Cart from "../components/Cart";
import FloatingCartButton from "../components/FloatingCartButton";
import NavigationBar from "../components/NavigationBar";
import Footer from "../components/Footer";


const RootLayout = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-linear-to-br from-gray-900 via-slate-800 to-gray-900 flex-col">
      {/* Floating Navigation for all pages except homepage */}
      {<NavigationBar showBranding={location.pathname !== "/" } />}
      
      <Outlet />
      <Footer />
      <FloatingCartButton onClick={() => setIsCartOpen(true)} currentPath={location.pathname} />
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default RootLayout;
