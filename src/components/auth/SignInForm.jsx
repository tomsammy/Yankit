import React, { useState } from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { useToast } from '@/components/ui/use-toast';
    import { useNavigate, Link, useLocation } from 'react-router-dom';
    import { LogIn, Mail, Lock, Eye, EyeOff, AlertTriangle } from 'lucide-react';
    import { supabase } from '@/lib/supabaseClient';
import GoogleLoginButton from './GoogleLoginButton';

    const FormField = ({ id, label, type = "text", placeholder, value, onChange, required = false, icon, children }) => (
      <div className="space-y-2">
        <Label htmlFor={id} className="text-foreground dark:text-slate-200 flex items-center">
          {icon} {label}
        </Label>
        <div className="relative">
          <Input
            id={id}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
            className="bg-background/60 dark:bg-slate-700/40 border-slate-300/50 dark:border-slate-600/50 focus:border-primary dark:focus:border-secondary focus:ring-primary dark:focus:ring-secondary pr-10"
          />
          {children}
        </div>
      </div>
    );
    FormField.displayName = 'FormField';
    
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

    const SignInForm = ({ onSuccess, isModal = false, searchCriteria, formData: initialFormData }) => {
      const { toast } = useToast();
      const navigate = useNavigate();
      const location = useLocation();
      const [formData, setFormData] = useState({ email: '', password: '' });
      const [isSubmitting, setIsSubmitting] = useState(false);
      const [showPassword, setShowPassword] = useState(false);

      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
          const { data: signInData, error } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
          });

          if (error) {
            if (error.message === "Email not confirmed") {
               toast({
                title: "Email Not Confirmed",
                description: "Please check your email and click the confirmation link before signing in.",
                variant: "default",
                className: "bg-yellow-500 dark:bg-yellow-600 text-white border-yellow-500 dark:border-yellow-600"
              });
              if (!isModal) navigate('/confirm-email');
            } else if (error.message.toLowerCase().includes('failed to fetch') || error.message.toLowerCase().includes('network error')) {
              toast({
                title: "Network Error",
                description: "Could not sign in. Please check your internet connection and try again.",
                variant: "destructive",
                icon: <AlertTriangle className="h-5 w-5 text-destructive-foreground" />,
              });
            } else {
              throw error;
            }
          } else if (signInData.user) {
            if (onSuccess) {
              onSuccess();
            } else {
              let fromPath = location.state?.from || '/dashboard';
              if (fromPath === '/offer-space') fromPath = '/yank-a-bag';
              if (fromPath === '/find-space') fromPath = '/send-a-bag';
              
              const navState = { 
                searchCriteria: searchCriteria || location.state?.searchCriteria,
                formData: initialFormData || location.state?.formData
              };
              navigate(fromPath, { replace: true, state: navState });
            }
          }
        } catch (error) {
          toast({
            title: "Sign In Failed",
            description: error.message || "Invalid login credentials. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsSubmitting(false);
        }
      };

      return (
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField
            id="email"
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            icon={<Mail className="w-4 h-4 mr-2 opacity-70 text-primary dark:text-secondary" />}
          />
          <FormField
            id="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
            icon={<Lock className="w-4 h-4 mr-2 opacity-70 text-primary dark:text-secondary" />}
          >
            <PasswordToggle
              show={showPassword}
              onClick={() => setShowPassword(!showPassword)}
              ariaLabel={showPassword ? "Hide password" : "Show password"}
            />
          </FormField>
          
          {!isModal && (
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-primary hover:underline dark:text-secondary">
                  Forgot your password?
                </Link>
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full text-lg py-3 bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-white dark:from-secondary dark:to-orange-400 transition-all duration-300 ease-in-out transform hover:scale-105" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
              />
            ) : (
              <LogIn className="w-5 h-5 mr-2" />
            )}
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </Button>
          <hr className='border-gray-300'/><div className='text-sm text-center text-gray-400'>or</div><hr className='border-gray-300'/>
          <GoogleLoginButton />

        </form>
      );
    };

    export default SignInForm;