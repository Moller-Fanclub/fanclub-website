import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';

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
          <Route path={PublicPaths.races} element={<HomePage />} />
          <Route path={PublicPaths.about} element={<HomePage />} />
          <Route path={PublicPaths.merch} element={<HomePage />} />
          <Route path="*" element={<Navigate to={PublicPaths.base} replace />} />
      </Routes>
  );
}
