import '../styles/globals.css';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import AdminProtectedRoute from '../components/admin/AdminProtectedRoute';
import { Toaster } from 'react-hot-toast';

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
        
        {/* Global toast notifications with theme support */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--toast-bg, #1a1a1a)',
              color: 'var(--toast-text, #00ff41)',
              border: '1px solid var(--toast-border, #00ff41)',
              fontFamily: 'monospace',
              fontSize: '14px'
            },
            success: {
              iconTheme: {
                primary: '#00ff41',
                secondary: '#000000'
              }
            },
            error: {
              iconTheme: {
                primary: '#ff4444',
                secondary: '#000000'
              }
            }
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}