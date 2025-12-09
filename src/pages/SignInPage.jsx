import React, { useEffect } from 'react';
    import { useNavigate, useLocation, Link } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { useAuth } from '@/contexts/SupabaseAuthContext';
    import { LogIn } from 'lucide-react';
    import AuthCard from '@/components/auth/AuthCard';
    import SignInForm from '@/components/auth/SignInForm';
    import { AuthPageHeader, AuthPageSubHeader, AuthPageFooterLink, AnimatedIcon } from '@/components/auth/pagecomponents/AuthPageHeaderElements';

    const SignInPage = () => {
      const { session } = useAuth();
      const navigate = useNavigate();
      const location = useLocation();

      useEffect(() => {
        if (session) {
          const from = location.state?.from || '/dashboard';
          navigate(from, { replace: true });
        }
      }, [session, navigate, location.state]);

      return (
        <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center p-4 bg-gradient-to-br from-sky-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-blue-950 dark:to-slate-800">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <AuthCard>
              <div className="p-6 sm:p-8">
                <div className="text-center mb-6">
                  <AnimatedIcon icon={LogIn} />
                  <AuthPageHeader>Welcome Back!</AuthPageHeader>
                  <AuthPageSubHeader>Sign in to continue your journey with Yankit.</AuthPageSubHeader>
                </div>

                <SignInForm />

                <AuthPageFooterLink>
                  Don't have an account? <Link to="/signup" className="font-semibold text-primary hover:underline dark:text-sky-400">Sign up</Link>
                </AuthPageFooterLink>
              </div>
            </AuthCard>
          </motion.div>
        </div>
      );
    };

    export default SignInPage;