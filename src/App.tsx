/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/dashboard/Dashboard';
import { TrendsExplorer } from './pages/dashboard/TrendsExplorer';
import { GenerateWizard } from './pages/dashboard/GenerateWizard';
import { Library } from './pages/dashboard/Library';
import { Schedule } from './pages/dashboard/Schedule';
import { Settings } from './pages/dashboard/Settings';
import { AuthProvider } from '@/lib/supabase/AuthProvider';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Dashboard Layout */}
          <Route path="/dashboard" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="trends" element={<TrendsExplorer />} />
            <Route path="generate" element={<GenerateWizard />} />
            <Route path="library" element={<Library />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        <Toaster position="bottom-right" />
      </BrowserRouter>
    </AuthProvider>
  );
}
