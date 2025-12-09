import React from 'react';
    import { CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Link } from 'react-router-dom';
    import { LogIn, UserPlus, ExternalLink } from 'lucide-react';
    import { AnimatedIcon } from './AuthPageHeaderElements';

    export const SignUpPageHeader = () => (
      <CardHeader className="text-center p-6 pb-4">
        <AnimatedIcon 
          icon={UserPlus} 
          containerClassName="inline-block p-3 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mb-4 shadow-xl" 
        />
        <CardTitle className="text-3xl font-bold text-foreground dark:text-white">Create Your Account</CardTitle>
        <CardDescription className="text-muted-foreground dark:text-slate-300">
          Join <span className="font-vernaccia-bold">Yankit</span> and unlock a new way to ship & travel!
        </CardDescription>
      </CardHeader>
    );
    SignUpPageHeader.displayName = 'SignUpPageHeader';
    
    export const SignInLink = () => (
      <CardFooter className="p-6 pt-4 text-center flex flex-col items-center">
        <p className="text-sm text-muted-foreground dark:text-slate-400">
          Already have an account?
        </p>
        <Button variant="link" asChild className="font-medium text-primary hover:underline dark:text-secondary flex items-center justify-center mt-1 group p-0 h-auto">
          <Link to="/signin">
            <LogIn className="w-4 h-4 mr-1 transition-transform duration-300 group-hover:translate-x-1" /> Sign In Instead <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity"/>
          </Link>
        </Button>
      </CardFooter>
    );
    SignInLink.displayName = 'SignInLink';