import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

const PasswordToggle = ({ show, onClick, ariaLabel }) => (
  <Button
    type="button"
    variant="ghost"
    size="icon"
    className="absolute inset-y-0 right-0 h-full px-3 text-muted-foreground hover:bg-transparent focus:outline-none"
    onClick={onClick}
    aria-label={ariaLabel}
  >
    {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
  </Button>
);
PasswordToggle.displayName = 'PasswordToggle';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        // The user is in the password recovery flow.
        // The form is already displayed, so no extra action needed here.
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    if (password.length < 6) {
      toast({
        title: "Password is too short",
        description: "Password should be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });
    
    setLoading(false);
    if (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to reset password. The link may have expired.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Password Updated",
        description: "Your password has been successfully reset. Please sign in.",
        variant: "default",
        className: "bg-green-500 dark:bg-green-600 text-white"
      });
      navigate('/signin');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-indigo-50 to-sky-50 dark:from-slate-900 dark:to-purple-900 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md shadow-2xl glassmorphism-card">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600 dark:from-secondary dark:to-orange-400">
              Reset Your Password
            </CardTitle>
            <CardDescription className="text-muted-foreground pt-2">
              Enter and confirm your new password below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center text-foreground dark:text-slate-200">
                  <Lock className="w-4 h-4 mr-2" />
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-background/60 dark:bg-slate-700/40 pr-10"
                  />
                  <PasswordToggle
                    show={showPassword}
                    onClick={() => setShowPassword(!showPassword)}
                    ariaLabel={showPassword ? "Hide password" : "Show password"}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword"  className="flex items-center text-foreground dark:text-slate-200">
                  <Lock className="w-4 h-4 mr-2" />
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="bg-background/60 dark:bg-slate-700/40 pr-10"
                  />
                  <PasswordToggle
                    show={showConfirmPassword}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    ariaLabel={showConfirmPassword ? "Hide password" : "Show password"}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;