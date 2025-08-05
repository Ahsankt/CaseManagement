import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/Common/ProtectedRoute';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

// Dashboard Components
import ClientDashboard from './components/Dashboard/ClientDashboard';
import LawyerDashboard from './components/Dashboard/LawyerDashboard';
import JudgeDashboard from './components/Dashboard/JudgeDashboard';
import PlaintiffDashboard from './components/Dashboard/PlaintiffDashboard';

// Page Components
import CasesPage from './components/Cases/CasesPage';
import AllCasesPage from './components/Cases/AllCasesPage';
import RegisterCasePage from './components/Cases/RegisterCasePage';
import UsersPage from './components/Users/UsersPage';
import CalendarPage from './components/Calendar/CalendarPage';
import AssignmentsPage from './components/Assignments/AssignmentsPage';
import SettingsPage from './components/Settings/SettingsPage';
import ClientsPage from './components/Clients/ClientsPage';

import { USER_ROLES } from './utils/constants';
import './App.css';

const DashboardRouter = () => {
  const { user } = useAuth();

  const getDashboardComponent = () => {
    switch (user?.role) {
      case USER_ROLES.REGISTRAR:
        return <ClientDashboard />; // Registrar dashboard - manages users and assigns
      case USER_ROLES.LAWYER:
        return <LawyerDashboard />; // Lawyer dashboard - manages cases and documents
      case USER_ROLES.JUDGE:
        return <JudgeDashboard />; // Judge dashboard - manages hearings and schedules
      case USER_ROLES.USER:
        return <PlaintiffDashboard />; // User dashboard - views their cases
      default:
        return <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Court Management System</h1>
          <p className="text-gray-600">Please contact administrator to set up your role properly.</p>
        </div>;
    }
  };

  return getDashboardComponent();
};

const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="md:pl-64">
        <Header />
        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <DashboardRouter />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            {/* Cases Routes */}
            <Route
              path="/cases"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <CasesPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/cases/all"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <AllCasesPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/cases/register"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <RegisterCasePage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            {/* Users Routes */}
            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <UsersPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            {/* Calendar Route */}
            <Route
              path="/calendar"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <CalendarPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            {/* Assignments Route */}
            <Route
              path="/assignments"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <AssignmentsPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            {/* Clients Route */}
            <Route
              path="/clients"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <ClientsPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            {/* Settings Route */}
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <SettingsPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Unauthorized page */}
            <Route
              path="/unauthorized"
              element={
                <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                  <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                      <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                          Access Denied
                        </h2>
                        <p className="text-gray-600 mb-6">
                          You don't have permission to access this resource.
                        </p>
                        <Navigate to="/dashboard" />
                      </div>
                    </div>
                  </div>
                </div>
              }
            />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                theme: {
                  primary: 'green',
                  secondary: 'black',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
