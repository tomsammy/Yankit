import React from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const GoogleLoginButton = () => {
  const { signInWithGoogle } = useAuth();

  return (
    <Button
      variant="outline"
      className="w-full border-slate-300 dark:border-slate-600"
      onClick={signInWithGoogle}
    >
      <img
        src="/google.png"
        alt="Google"
        className="h-5 w-5 mr-2"
      />
      Continue with Google
    </Button>
  );
};

export default GoogleLoginButton;
