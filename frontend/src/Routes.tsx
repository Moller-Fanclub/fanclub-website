import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import RacePage from "./pages/RacePage/RacePage.tsx";
import MerchPage from "./pages/MerchPage/MerchPage.tsx";

export const PublicPaths = {
    base: '/',
    races: '/races',
    about: '/about',
    merch: '/merch',
};

export function AppRoutes() {
  const location = useLocation();

  return (
      <Routes location={location}>
          <Route path={PublicPaths.base} element={<HomePage />} />
          <Route path={PublicPaths.races} element={<RacePage />} />
          <Route path={PublicPaths.about} element={<HomePage />} />
          <Route path={PublicPaths.merch} element={<MerchPage />} />
          <Route path="*" element={<Navigate to={PublicPaths.base} replace />} />
      </Routes>
  );
}
