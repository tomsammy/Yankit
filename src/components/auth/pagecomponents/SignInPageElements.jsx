import React from 'react';
    import { Link } from 'react-router-dom';
    import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { LogIn } from 'lucide-react';
    import { AnimatedIcon } from '@/components/auth/pagecomponents/AuthPageHeaderElements.jsx';

    export const SignInPageHeader = () => (
      <CardHeader className="text-center p-6">
        <AnimatedIcon icon={LogIn} />
        <CardTitle className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-secondary">
          Welcome Back!
        </CardTitle>
        <CardDescription className="text-muted-foreground dark:text-slate-300">
          Sign in to access your <span className="font-vernaccia-bold">Yankit</span> account.
        </CardDescription>
      </CardHeader>
    );
    SignInPageHeader.displayName = 'SignInPageHeader';

    export const SignUpLink = () => (
      <div className="p-6 pt-0 text-center">
        <p className="text-sm text-muted-foreground dark:text-slate-400">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-primary hover:underline dark:text-secondary">
            Sign Up
          </Link>
        </p>
      </div>
    );
    SignUpLink.displayName = 'SignUpLink';