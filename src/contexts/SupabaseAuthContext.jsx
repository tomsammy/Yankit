import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient'; 
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const { toast } = useToast();

  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleSession = useCallback(async (session) => {
    setSession(session);
    setUser(session?.user ?? null);
    setLoading(false);
  }, []);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      handleSession(session);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        handleSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, [handleSession]);
  
  const signUp = useCallback(async (email, password, options) => {
    console.log("signUp called:", { email, options });
  
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options,
    });
  
    console.log("supabase signUp response:", { data, error });
  
    if (error) {
      console.log("supabase error:", error);
      toast({
        variant: "destructive",
        title: "Sign Up Failed",
        description: error.message,
      });
      return { data: null, error };
    }
  
    if (data?.user && data.user.identities.length === 0) {
      console.log("duplicate email");
      const err = new Error("Email already exists or is already registered.");
  
      toast({
        variant: "destructive",
        title: "Email Already Registered",
        description: "This email is already in use. Please sign in instead.",
      });
  
      return { data: null, error: err };
    }
  
    console.log("signup success returning");
    return { data, error: null };
  }, [toast]);
  

  const signIn = useCallback(async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign in Failed",
        description: error.message || "Something went wrong",
      });
    }

    return { error };
  }, [toast]);

  const sendPasswordResetEmail = useCallback(async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://yankit.com.au/reset-password"
    });
  
    if (error) {
      toast({
        variant: "destructive",
        title: "Reset Failed",
        description: error.message || "Could not send reset email.",
      });
    }
  
    return { error };
  }, [toast]);

  const resendConfirmationEmail = useCallback(async (email) => {
    const { data, error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: "https://yankit.com.au/verify-email"
      }
    });
  
    if (error) {
      toast({
        variant: "destructive",
        title: "Resend Failed",
        description: error.message || "Could not resend confirmation email.",
      });
    } else {
      toast({
        title: "Email Sent",
        description: "A new confirmation link has been sent to your email.",
        className: "bg-green-500 dark:bg-green-600 text-white"
      });
    }
  
    return { error };
  }, [toast]);

  const signOut = useCallback(async () => {
    setUser(null);
    setSession(null);
  
    const { error } = await supabase.auth.signOut();
  
    localStorage.removeItem("supabase.auth.token");
    localStorage.removeItem("supabase.auth.refresh_token");
    localStorage.removeItem("supabase.auth.expires_at");
  
    Object.keys(localStorage)
      .filter((k) => k.startsWith("sb-"))
      .forEach((k) => localStorage.removeItem(k));
  
    if (error) {
      toast({
        variant: "destructive",
        title: "Sign out Failed",
        description: error.message || "Something went wrong",
      });
    }
  
    return { error };
  }, [toast]);

  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Google Sign-In Failed",
        description: error.message,
      });
    }

    return { error };
  }, [toast]);
  

  const value = useMemo(() => ({
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    sendPasswordResetEmail,
    resendConfirmationEmail,
    signInWithGoogle,
  }), [
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    sendPasswordResetEmail,
    resendConfirmationEmail,
    signInWithGoogle,
  ]);
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};