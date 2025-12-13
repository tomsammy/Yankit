import React, { useState } from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { useToast } from '@/components/ui/use-toast';
    import { useNavigate } from 'react-router-dom';
    import { UserPlus, Mail, Lock, Eye, EyeOff, User, AlertTriangle } from 'lucide-react';
     import { useAuth } from '../../contexts/AuthContext';
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

    const SignUpForm = ({ onSuccess, isModal = false }) => {
      const { toast } = useToast();
      const {signUp, checkEmailExists} = useAuth();
      const navigate = useNavigate();
      const [formData, setFormData] = useState({
        firstName: '',
        surname: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      const [isSubmitting, setIsSubmitting] = useState(false);
      const [showPassword, setShowPassword] = useState(false);
      const [showConfirmPassword, setShowConfirmPassword] = useState(false);

      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
      
      
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: 'Passwords Don’t Match',
            description: 'Please ensure your passwords match.',
            variant: 'destructive'
          });
          return;
        }
      
        setIsSubmitting(true);
      
        try {
          const fullName = `${formData.firstName} ${formData.surname}`.trim();
          console.log('fullName:', fullName);
      
          const { data, error } = await signUp(formData.email, formData.password, {
            data: {
              full_name: fullName,
              first_name: formData.firstName,
              surname: formData.surname
            }
          });
      
          console.log('signUp returned:', { data, error });
      
          if (error || !data) {
            console.log('signUp blocked signup');
            setIsSubmitting(false);
            return;
          }
      
          toast({
            title: 'Account Created!',
            description: 'Please check your email to confirm your account.',
            variant: 'default',
            className: 'bg-green-500 dark:bg-green-600 text-white'
          });
      
          localStorage.setItem('pendingEmail', formData.email);
          console.log('stored pendingEmail');
      
          navigate('/confirm-email');
          console.log('navigated to confirm-email');
        } catch (err) {
          console.log('catch', err);
          toast({
            title: 'Sign Up Failed',
            description: err.message || 'Could not create your account.',
            variant: 'destructive'
          });
        } finally {
          console.log('finally');
          setIsSubmitting(false);
        }
      };
      
      
      
      
      return (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              id="firstName"
              label="First Name"
              placeholder="John"
              value={formData.firstName}
              onChange={handleChange}
              required
              icon={<User className="w-4 h-4 mr-2 opacity-70 text-primary dark:text-secondary" />}
            />
            <FormField
              id="surname"
              label="Surname"
              placeholder="Doe"
              value={formData.surname}
              onChange={handleChange}
              required
              icon={<User className="w-4 h-4 mr-2 opacity-70 text-primary dark:text-secondary" />}
            />
          </div>
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
          <FormField
            id="confirmPassword"
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            icon={<Lock className="w-4 h-4 mr-2 opacity-70 text-primary dark:text-secondary" />}
          >
            <PasswordToggle
              show={showConfirmPassword}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              ariaLabel={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            />
          </FormField>
          
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
              <UserPlus className="w-5 h-5 mr-2" />
            )}
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </Button>
          <hr className='border-gray-300'/><div className='text-sm text-center text-gray-400'>or</div><hr className='border-gray-300'/>
          <GoogleLoginButton />

        </form>
      );
    };

    export default SignUpForm;