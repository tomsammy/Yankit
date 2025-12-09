import React from 'react';
    import { Navigate } from 'react-router-dom';
    import { CardContent } from '@/components/ui/card';
    import SignUpForm from '@/components/auth/SignUpForm';
    import { useAuth } from '@/contexts/SupabaseAuthContext';
    import AuthCard from '@/components/auth/AuthCard';
    import LoadingSpinner from '@/components/ui/LoadingSpinner';
    import { SignUpPageHeader, SignInLink } from '@/components/auth/pagecomponents/SignUpPageElements';
    import AuthErrorDisplay from '@/components/auth/AuthErrorDisplay';
    import { motion } from 'framer-motion';

    const SignUpPage = () => {
      const auth = useAuth();
      
      if (!auth || auth.loading) {
        return <LoadingSpinner fullScreen={true} />;
      }

      const { session, authError } = auth;
      
      if (authError && !session) {
        return <AuthErrorDisplay onRetry={() => window.location.reload()} />;
      }

      if (session) {
        return <Navigate to="/dashboard" replace />;
      }

      return (
        <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center p-4 bg-gradient-to-br from-sky-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-blue-950 dark:to-slate-800">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
        <AuthCard>
          <SignUpPageHeader />
          <CardContent className="p-6">
            <SignUpForm />
          </CardContent>
          <SignInLink />
        </AuthCard>
        </motion.div>
        </div>
      );
    };

    export default SignUpPage;