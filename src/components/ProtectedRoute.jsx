import React from 'react';
    import { Navigate, useLocation } from 'react-router-dom';
    import { useAuth } from '@/contexts/SupabaseAuthContext';
    import LoadingSpinner from '@/components/ui/LoadingSpinner';

    const ProtectedRoute = ({ children }) => {
      const { session, loading } = useAuth();
      const location = useLocation();

      if (loading) {
        return <LoadingSpinner fullScreen={true} />;
      }

      if (!session) {
        return <Navigate to="/signin" state={{ from: location.pathname, searchCriteria: location.state?.searchCriteria, formData: location.state?.formData }} replace />;
      }

      return React.cloneElement(children, { session });
    };

    export default ProtectedRoute;