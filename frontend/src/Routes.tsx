import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './components/pages/HomePage/HomePage';

export const PublicPaths = {
  base: '/',
};

export function AppRoutes() {
  const location = useLocation();

  return (
    <Routes location={location}>
        <Route
          path={PublicPaths.base}
          element={<HomePage />}
        />
    </Routes>
  );
}
