import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import RootLayout from './layout/RootLayout.tsx';
import HomePage from './pages/HomePage/HomePage';
import ResultsPage from "./pages/ResultsPage/ResultsPage.tsx";
import MerchPage from "./pages/MerchPage/MerchPage.tsx";
import MerchProductPage from "./pages/MerchPage/MerchProductPage.tsx";
import CheckoutPage from "./pages/CheckoutPage/CheckoutPage.tsx";
import ContactPage from "./pages/ContactPage/ContactPage.tsx";
import TermsPage from "./pages/TermsPage/TermsPage.tsx";
import ComingSoonPage from "./pages/ComingSoonPage/ComingSoonPage.tsx";
import CalenderPage from './pages/CalenderPage/CalenderPage.tsx';

export const PublicPaths = {
  base: "/",
  calender: "/calender",
  results: "/results",
  about: "/about",
  comingSoon: "/coming-soon",
  merch: "/merch",
  merchProduct: "/merch/:id",
  checkout: "/checkout",
  contact: "/contact",
  terms: "/terms",
};

export function AppRoutes() {
  const location = useLocation();

  return (
    <Routes location={location}>
      <Route path={PublicPaths.base} element={<RootLayout />}>
        <Route path={PublicPaths.base} element={<HomePage />} />
        <Route path={PublicPaths.calender} element={<CalenderPage />} />
        <Route path={PublicPaths.results} element={<ResultsPage />} />
        <Route path={PublicPaths.about} element={<HomePage />} />
        <Route path={PublicPaths.comingSoon} element={<ComingSoonPage />} />
        <Route path={PublicPaths.merch} element={<MerchPage />} />
        <Route path={PublicPaths.merchProduct} element={<MerchProductPage />} />
        <Route path={PublicPaths.checkout} element={<CheckoutPage />} />
        <Route path={PublicPaths.contact} element={<ContactPage />} />
        <Route path={PublicPaths.terms} element={<TermsPage />} />
        <Route path="*" element={<Navigate to={PublicPaths.base} replace />} />
      </Route>
    </Routes>
  );
}
