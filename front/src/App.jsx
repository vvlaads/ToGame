import './App.css';
import HomePage from './pages/HomePage';
import ChatsPage from './pages/ChatsPage';
import AuthPage from './pages/AuthPage';
import ProfilePage from "./pages/ProfilePage";
import SearchPlayersPage from './pages/SearchPlayersPage';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
import { NavProvider } from './context/NavContext';
import { ChatsProvider } from './context/ChatsContext';
import { FriendsProvider } from './context/FriendsContext';
import { SearchPlayersProvider } from './context/SearchPlayersContext';
import { GameProvider } from './context/GameContext';

function App() {
  return (
    <AuthProvider>
      <FriendsProvider>
        <SearchPlayersProvider>
          <GameProvider>
            <ChatsProvider>
              <NavProvider>
                <Router>
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
            </ChatsProvider>
          </GameProvider>
        </SearchPlayersProvider>
      </FriendsProvider>
    </AuthProvider>
  );
}

export default App;