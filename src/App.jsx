import { Routes, Route, Navigate, Outlet } from 'react-router'; // Добавлен Outlet
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useAuthStore } from './store/AuthStoreContext.jsx';
import SignupPage from './pages/SignupPage.jsx';
import Header from './components/Header.jsx';

const PublicLayout = () => (
  <>
    <Header />
    <main style={{ maxWidth: 440, margin: '40px auto', padding: 16 }}>
      <Outlet />
    </main>
  </>
);

const App = ({ socket }) => {
  const token = useAuthStore((state) => state.token);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage socket={socket} />
          </ProtectedRoute>
        }
      />

      <Route element={<PublicLayout />}>
        <Route
          path="/login"
          element={token ? <Navigate to="/" replace /> : <LoginPage />}
        />
        <Route
          path="/signup"
          element={token ? <Navigate to="/" replace /> : <SignupPage />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  ); 
};

export default App;