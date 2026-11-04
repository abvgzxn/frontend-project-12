import { Routes, Route, Navigate } from 'react-router';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useAuthStore } from './store/authStore.js';

const App = () => {
  const token = useAuthStore((state) => state.token);
  return (
    <Routes>
          <Route
      path="/"
      element={
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      }
    />
      <Route 
      path="/login" 
      element={token ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;