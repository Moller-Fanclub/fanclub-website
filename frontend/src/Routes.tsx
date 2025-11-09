import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import RootLayout from './layout/RootLayout.tsx';
import HomePage from './pages/HomePage/HomePage';
import MerchPage from "./pages/MerchPage/MerchPage.tsx";
import MerchProductPage from "./pages/MerchPage/MerchProductPage.tsx";
import CheckoutPage from "./pages/CheckoutPage/CheckoutPage.tsx";
import CheckoutSuccessPage from "./pages/CheckoutSuccessPage/CheckoutSuccessPage.tsx";
import CheckoutErrorPage from "./pages/CheckoutErrorPage/CheckoutErrorPage.tsx";
import ContactPage from "./pages/AboutPage/AboutPage.tsx";
import TermsPage from "./pages/TermsPage/TermsPage.tsx";
import ComingSoonPage from "./pages/ComingSoonPage/ComingSoonPage.tsx";
import CalenderPage from './pages/CalenderPage/CalenderPage.tsx';
import AboutPage from './pages/AboutPage/AboutPage.tsx';
import BlogPage from './pages/BlogPage/BlogPage.tsx';
import { PublicPaths } from './lib/routes';


export function AppRoutes() {
  const location = useLocation();

  return (
    <Routes location={location}>
      <Route path={PublicPaths.base} element={<RootLayout />}>
        <Route path={PublicPaths.base} element={<HomePage />} />
        <Route path={PublicPaths.calender} element={<CalenderPage />} />
        <Route path={PublicPaths.about} element={<AboutPage />} />
        <Route path={PublicPaths.comingSoon} element={<ComingSoonPage />} />
        <Route path={PublicPaths.merch} element={<MerchPage />} />
        <Route path={PublicPaths.merchProduct} element={<MerchProductPage />} />
        <Route path={PublicPaths.checkout} element={<CheckoutPage />} />
        <Route path={PublicPaths.checkoutSuccess} element={<CheckoutSuccessPage />} />
        <Route path={PublicPaths.checkoutError} element={<CheckoutErrorPage />} />
        <Route path={PublicPaths.contact} element={<ContactPage />} />
        <Route path={PublicPaths.terms} element={<TermsPage />} />
        <Route path={PublicPaths.blog.show} element={<BlogPage />} />
        <Route path="*" element={<Navigate to={PublicPaths.base} replace />} />
      </Route>
    </Routes>
  );
}
