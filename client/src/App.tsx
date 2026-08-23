import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.js';
import { ToastProvider } from './context/ToastContext.js';
import { ProtectedRoute } from './components/common/ProtectedRoute.js';
import { AppLayout } from './components/layout/AppLayout.js';

// Pages
import { LoginPage } from './pages/LoginPage.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { RegistryPage } from './pages/RegistryPage.js';
import { SoftwareDetailsPage } from './pages/SoftwareDetailsPage.js';
import { AddSoftwarePage } from './pages/AddSoftwarePage.js';
import { EditSoftwarePage } from './pages/EditSoftwarePage.js';
import { ReportsPage } from './pages/ReportsPage.js';
import { SettingsPage } from './pages/SettingsPage.js';
import { NotFoundPage } from './pages/NotFoundPage.js';

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Login Route */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Enterprise Workspace Routes */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/registry" element={<RegistryPage />} />
              <Route path="/registry/new" element={<AddSoftwarePage />} />
              <Route path="/registry/:id" element={<SoftwareDetailsPage />} />
              <Route path="/registry/:id/edit" element={<EditSoftwarePage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* 404 Fallback */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
