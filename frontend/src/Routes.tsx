import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import RootLayout from './layout/RootLayout.tsx';
import HomePage from './pages/HomePage/HomePage';
import RacePage from "./pages/RacePage/RacePage.tsx";
import ResultsPage from "./pages/ResultsPage/ResultsPage.tsx";
import MerchPage from "./pages/MerchPage/MerchPage.tsx";
import MerchProductPage from "./pages/MerchPage/MerchProductPage.tsx";
import CheckoutPage from "./pages/CheckoutPage/CheckoutPage.tsx";
import ContactPage from "./pages/ContactPage/ContactPage.tsx";
import TermsPage from "./pages/TermsPage/TermsPage.tsx";
import ComingSoonPage from "./pages/ComingSoonPage/ComingSoonPage.tsx";

// eslint-disable-next-line react-refresh/only-export-components
export const PublicPaths = {
  base: "/",
  races: "/races",
  results: "/resultater",
  about: "/about",
  comingSoon: "/kommer-snart",
  merch: "/merch",
  merchProduct: "/merch/:id",
  checkout: "/checkout",
  contact: "/kontakt",
  terms: "/salgsvilkar",
};

export function AppRoutes() {
  const location = useLocation();

  return (
    <Routes location={location}>
      <Route path={PublicPaths.base} element={<RootLayout />}>
        <Route path={PublicPaths.base} element={<HomePage />} />
        <Route path={PublicPaths.races} element={<RacePage />} />
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
