import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { sendPasswordResetEmail } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await sendPasswordResetEmail(email);

    setLoading(false);
    if (error) {
      toast({
        title: "Error",
        description: error.message || "Could not send password reset email. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Check your email",
        description: "A password reset link has been sent to your email address.",
        variant: "default",
        className: "bg-green-500 dark:bg-green-600 text-white"
      });
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-indigo-50 to-sky-50 dark:from-slate-900 dark:to-purple-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md shadow-2xl glassmorphism-card">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600 dark:from-secondary dark:to-orange-400">
              {submitted ? "Email Sent!" : "Forgot Password"}
            </CardTitle>
            <CardDescription className="text-muted-foreground pt-2">
              {submitted 
                ? "Please check your inbox (and spam folder) for the reset link."
                : "Enter your email and we'll send you a link to reset your password."
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center text-foreground dark:text-slate-200">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-background/60 dark:bg-slate-700/40"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </form>
            ) : (
              <div className="text-center">
                 <p className="text-muted-foreground">You can now close this page.</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="ghost" asChild>
              <Link to="/signin" className="flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign In
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;