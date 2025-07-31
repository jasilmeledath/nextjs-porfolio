/**
 * @fileoverview Admin Route Protection Component
 * @author jasilmeledath@gmail.com <jasil.portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';

/**
 * Higher-order component for protecting admin routes
 * @function withAdminAuth
 * @param {React.Component} WrappedComponent - Component to protect
 * @returns {React.Component} Protected component
 */
export function withAdminAuth(WrappedComponent) {
  const AdminProtectedComponent = (props) => {
    const { isAuthenticated, loading, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
      // Redirect to login if not authenticated
      if (!loading && !isAuthenticated) {
        router.push('/admin/login');
        return;
      }

      // Check if user has admin privileges
      if (!loading && isAuthenticated && user && !user.isAdmin) {
        router.push('/'); // Redirect to home if not admin
        return;
      }
    }, [isAuthenticated, loading, user, router]);

    // Show loading spinner while checking authentication
    if (loading) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">Verifying access...</span>
        </div>
      );
    }

    // Don't render if not authenticated (redirect in progress)
    if (!isAuthenticated || (user && !user.isAdmin)) {
      return null;
    }

    // Render the protected component
    return <WrappedComponent {...props} />;
  };

  // Copy static properties
  if (WrappedComponent.getInitialProps) {
    AdminProtectedComponent.getInitialProps = WrappedComponent.getInitialProps;
  }

  AdminProtectedComponent.displayName = `withAdminAuth(${WrappedComponent.displayName || WrappedComponent.name})`;

  return AdminProtectedComponent;
}

/**
 * Admin Layout Component
 * @function AdminLayout
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Admin layout component
 */
export function AdminLayout({ children }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        {children}
      </div>
    </div>
  );
}

/**
 * Admin Protected Route Wrapper Component
 * @function AdminProtectedRoute
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to protect
 * @returns {JSX.Element} Protected route wrapper
 */
export function AdminProtectedRoute({ children }) {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!loading && !isAuthenticated) {
      router.push('/admin/login');
      return;
    }

    // Check if user has admin privileges
    if (!loading && isAuthenticated && user && !user.isAdmin) {
      router.push('/'); // Redirect to home if not admin
      return;
    }
  }, [isAuthenticated, loading, user, router]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">Verifying access...</span>
      </div>
    );
  }

  // Don't render if not authenticated (redirect in progress)
  if (!isAuthenticated || (user && !user.isAdmin)) {
    return null;
  }

  // Render the protected children
  return <>{children}</>;
}

export default AdminProtectedRoute;
