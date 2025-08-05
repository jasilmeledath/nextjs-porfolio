import '../styles/globals.css';
// Emergency CSS import
import Head from 'next/head';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import AdminProtectedRoute from '../components/admin/AdminProtectedRoute';
import { Toaster } from 'react-hot-toast';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="stylesheet" href="/emergency-styles.css" />
      </Head>
      <ThemeProvider>
        <AuthProvider>
          {Component.requireAuth ? (
            <AdminProtectedRoute>
              <Component {...pageProps} />
            </AdminProtectedRoute>
          ) : (
            <Component {...pageProps} />
          )}
          
          {/* Professional theme-aware toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              className: 'toast-custom',
              style: {
                background: 'transparent',
                color: 'inherit',
                border: 'none',
                boxShadow: 'none',
                padding: '0'
              },
              success: {
                className: 'toast-success',
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#ffffff'
                }
              },
              error: {
                className: 'toast-error',
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#ffffff'
                }
              },
              loading: {
                className: 'toast-loading',
                iconTheme: {
                  primary: '#3b82f6',
                  secondary: '#ffffff'
                }
              }
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}