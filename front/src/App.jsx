import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from "./pages/ProfilePage";
import './App.css';
import { NavProvider } from './context/NavContext';
import SearchPlayersPage from './pages/SearchPlayersPage';

function App() {
  return (
    <AuthProvider>
      <NavProvider>
        <Router>
          <Routes>
            <Route path="/login" element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } />

            <Route path="/" element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } />

            <Route path="/search" element={
              <ProtectedRoute>
                <SearchPlayersPage />
              </ProtectedRoute>
            } />

            <Route path="/chats" element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            } />

            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />

            {/* Редирект с несуществующих путей */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </NavProvider>
    </AuthProvider>
  );
}

export default App;