import React, { useState } from 'react';
    import { motion } from 'framer-motion';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { MailCheck, LogIn } from 'lucide-react';
    import { Link } from 'react-router-dom';
    import { useAuth } from '../contexts/SupabaseAuthContext';

    const EmailConfirmationPage = () => {
      const { resendConfirmationEmail, user } = useAuth();
      const [resending, setResending] = useState(false);
      
      const handleResend = async () => {
        const email = user?.email || localStorage.getItem("pendingEmail");
      
        if (!email) {
          console.error("No email found to resend confirmation");
          return;
        }
      
        setResending(true);
        await resendConfirmationEmail(email);
        setResending(false);
      };
      
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center min-h-[calc(100vh-180px)] py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-sky-100 via-indigo-100 to-purple-100 dark:from-slate-900 dark:via-purple-950 dark:to-slate-800"
        >
          <Card className="w-full max-w-lg shadow-2xl glassmorphism border-slate-300/30 dark:border-slate-700/30 dark:bg-slate-800/50 backdrop-blur-lg text-center">
            <CardHeader className="p-6 pb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
                className="inline-block p-4 bg-gradient-to-r from-green-500 to-teal-500 rounded-full mx-auto mb-6 shadow-lg"
              >
                <MailCheck className="w-12 h-12 text-white" />
              </motion.div>
              <CardTitle className="text-3xl font-bold text-foreground dark:text-white">Confirm Your Email</CardTitle>
              <CardDescription className="text-muted-foreground dark:text-slate-300 mt-2 text-lg">
                We've sent a confirmation link to your email address.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-foreground dark:text-slate-200 mb-6">
                Please check your inbox (and spam folder, just in case!) and click the link to complete your registration.
              </p>
              <p className="text-sm text-muted-foreground dark:text-slate-400 mb-2">
                Didn't receive the email?
              </p>
              <Button 
                    variant="link"
                    className="text-primary dark:text-secondary px-0 mb-6"
                    onClick={handleResend}
                    disabled={resending}
                  >
                    {resending ? "Sending..." : "Resend Confirmation Email"}
                  </Button>
              
              <div className="mt-8">
                <p className="text-sm text-muted-foreground dark:text-slate-400 mb-2">
                  Already confirmed?
                </p>
                <Button asChild className="w-full sm:w-auto bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-white dark:from-secondary dark:to-orange-400">
                  <Link to="/signin">
                    <LogIn className="w-4 h-4 mr-2" />
                    Proceed to Sign In
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      );
    };

    export default EmailConfirmationPage;