import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Crew from './pages/Crew';
import Events from './pages/Events';
import Assets from './pages/Assets';
import Companies from './pages/Companies';
import Finance from './pages/Finance';
import Profile from './pages/Profile';
import Account from './pages/Account';
import Settings from './pages/Settings';
import Support from './pages/Support';
import OpportunitiesHub from './pages/OpportunitiesHub';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ResetPassword from './pages/auth/ResetPassword';
import AuthCallback from './components/auth/AuthCallback';
import UnauthorizedPage from './components/auth/UnauthorizedPage';
import { AuthProvider } from './components/auth/AuthProvider';
import ProtectedRoute from './components/auth/ProtectedRoute';
import CookieConsent from './components/CookieConsent';
import PrivacyBanner from './components/PrivacyBanner';
import AccessibilityWidget from './components/AccessibilityWidget';
import { ErrorBoundary } from '@sentry/react';
import ErrorPage from './components/ErrorPage';
import LoadingSpinner from './components/LoadingSpinner';

const queryClient = new QueryClient();

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter basename="/">
          <AuthProvider>
            <ErrorBoundary fallback={<ErrorPage />}>
              <Suspense fallback={<LoadingSpinner />}>
            <PrivacyBanner />
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="projects/*" element={<Projects />} />
                <Route path="crew/*" element={<Crew />} />
                <Route path="events/*" element={<Events />} />
                <Route path="assets/*" element={<Assets />} />
                <Route path="companies/*" element={<Companies />} />
                <Route path="finance/*" element={<Finance />} />
                <Route path="opportunities" element={<OpportunitiesHub />} />
                <Route path="profile" element={<Profile />} />
                <Route path="account" element={<Account />} />
                <Route path="settings" element={<Settings />} />
                <Route path="support" element={<Support />} />
              </Route>

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <CookieConsent />
            <AccessibilityWidget />
            </Suspense>
            </ErrorBoundary>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;