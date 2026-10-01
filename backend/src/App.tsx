import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/components/ui/Toast';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

// =============================
// PÁGINAS DO CAIMENT
// =============================

import LoginPage from '@/pages/Login/LoginPage';
import RegisterPage from '@/pages/Register/RegisterPage';
import VerificationPage from '@/pages/Register/VerificationPage';

import OnboardingWelcomePage from '@/pages/Onboarding/OnboardingWelcomePage';
import OnboardingAdjustPage from '@/pages/Onboarding/OnboardingAdjustPage';

import DashboardPage from '@/pages/Dashboard/DashboardPage';

import AvatarCreationPage from '@/pages/AvatarCreation/AvatarCreationPage';
import AvatarProcessingPage from '@/pages/AvatarCreation/AvatarProcessingPage';

import AvatarPage from '@/pages/Avatar/AvatarPage';
import MeasurementsPage from '@/pages/Measurements/MeasurementsPage';
import FittingRoomPage from '@/pages/FittingRoom/FittingRoomPage';
import SettingsPage from '@/pages/Settings/SettingsPage';

// =============================
// PÁGINAS DA FITSENSE
// =============================

import FitsenseHomePage from '@/pages/Fitsense/FitsenseHomePage';
import FitsenseCatalogPage from '@/pages/Fitsense/FitsenseCatalogPage';
import FitsenseProductPage from '@/pages/Fitsense/FitsenseProductPage';
import FitsenseCartPage from '@/pages/Fitsense/FitsenseCartPage';

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>

              {/* ===================================== */}
              {/* FITSENSE — PÁGINA INICIAL */}
              {/* ===================================== */}

              <Route
                path="/"
                element={<FitsenseHomePage />}
              />

              <Route
                path="/fitsense"
                element={<FitsenseHomePage />}
              />

              <Route
                path="/fitsense/produtos"
                element={<FitsenseCatalogPage />}
              />

              <Route
                path="/fitsense/produtos/:id"
                element={<FitsenseProductPage />}
              />

              <Route
                path="/fitsense/carrinho"
                element={<FitsenseCartPage />}
              />

              {/* ===================================== */}
              {/* CAIMENT — CONTA E EXPERIÊNCIA */}
              {/* ===================================== */}

              <Route
                path="/login"
                element={<LoginPage />}
              />

              <Route
                path="/cadastro"
                element={<RegisterPage />}
              />

              <Route
                path="/verificacao"
                element={<VerificationPage />}
              />

              <Route
                path="/onboarding"
                element={<OnboardingWelcomePage />}
              />

              <Route
                path="/onboarding/ajuste"
                element={<OnboardingAdjustPage />}
              />

              <Route
                path="/dashboard"
                element={<DashboardPage />}
              />

              <Route
                path="/avatar-criacao"
                element={<AvatarCreationPage />}
              />

              <Route
                path="/avatar-criacao/processando"
                element={<AvatarProcessingPage />}
              />

              <Route
                path="/avatar"
                element={<AvatarPage />}
              />

              <Route
                path="/medidas"
                element={<MeasurementsPage />}
              />

              <Route
                path="/provador"
                element={<FittingRoomPage />}
              />

              <Route
                path="/configuracoes"
                element={<SettingsPage />}
              />

              {/* ===================================== */}
              {/* ROTA NÃO ENCONTRADA */}
              {/* ===================================== */}

              <Route
                path="*"
                element={<FitsenseHomePage />}
              />

            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}