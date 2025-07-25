import '../styles/globals.css';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import AdminProtectedRoute from '../components/admin/AdminProtectedRoute';

export default function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {Component.requireAuth ? (
          <AdminProtectedRoute>
            <Component {...pageProps} />
          </AdminProtectedRoute>
        ) : (
          <Component {...pageProps} />
        )}
      </AuthProvider>
    </ThemeProvider>
  );
}