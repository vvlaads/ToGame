import './App.css';
import HomePage from './pages/HomePage';
import ChatsPage from './pages/ChatsPage';
import AuthPage from './pages/AuthPage';
import ProfilePage from "./pages/ProfilePage";
import SearchPlayersPage from './pages/SearchPlayersPage';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
import { NavProvider } from './context/NavContext';
import { ChatsProvider } from './context/ChatsContext';
import { GameProvider } from './context/GameContext';
import { UserProvider } from './context/UserContext';

function App() {
  return (
    <UserProvider>
      <ChatsProvider>
        <GameProvider>
          <NavProvider>
            <Router basename='/ToGame-back-1.0-SNAPSHOT'>
              <Routes>
                <Route path="/auth" element={
                  <PublicRoute>
                    <AuthPage />
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
                    <ChatsPage />
                  </ProtectedRoute>
                } />

                <Route path="/chats/:chatId" element={
                  <ProtectedRoute>
                    <ChatsPage />
                  </ProtectedRoute>
                } />

                <Route path="/profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />

                <Route path="/profile/:userId" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />

                {/* Редирект с несуществующих путей */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </NavProvider>
        </GameProvider>
      </ChatsProvider>
    </UserProvider>
  );
}

export default App;