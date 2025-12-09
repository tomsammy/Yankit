import React, { useState, useEffect } from 'react';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
    import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
    import SignInForm from '@/components/auth/SignInForm';
    import SignUpForm from '@/components/auth/SignUpForm';
    import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
    import { LogIn, UserPlus, Info } from 'lucide-react';

    const AuthModal = ({ isOpen, onClose, onAuthSuccess, initialTab = "signin", searchCriteria, formData }) => {
      const [activeTab, setActiveTab] = useState(initialTab);

      useEffect(() => {
        setActiveTab(initialTab);
      }, [initialTab]);

      const handleSuccess = () => {
        if (onAuthSuccess) {
          onAuthSuccess();
        }
        onClose();
      };

      const showSenderNote = searchCriteria && (searchCriteria.origin || searchCriteria.destination || searchCriteria.travelDate || searchCriteria.numberOfBags);

      return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
          <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden glassmorphism-modal">
            <div className="p-6 md:p-8">
              <DialogHeader className="mb-6 text-center">
                <DialogTitle className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-secondary">
                  {activeTab === 'signin' ? 'Welcome Back!' : 'Create Your Account'}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground dark:text-slate-300">
                  {activeTab === 'signin' 
                    ? 'Sign in to continue your journey with Yankit.' 
                    : 'Join Yankit today to send and carry items globally.'}
                </DialogDescription>
              </DialogHeader>

              {showSenderNote && (
                <Alert variant="default" className="mb-6 bg-primary/10 dark:bg-blue-600/20 border-primary/30 dark:border-blue-500/40">
                  <Info className="h-4 w-4 text-primary dark:text-blue-300" />
                  <AlertTitle className="font-semibold text-primary dark:text-blue-200">Important Note for Senders</AlertTitle>
                  <AlertDescription className="text-primary/80 dark:text-blue-300/80 text-sm">
                    Ensure you comply with all airline regulations and customs laws regarding items you are sending for both the origin and destination countries. <span className="font-vernaccia-bold">Yankit</span> takes the safety of the public and safe and convenient peer-to-peer shipping seriously.
                  </AlertDescription>
                </Alert>
              )}

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-100 dark:bg-slate-700/50 p-1 rounded-lg">
                  <TabsTrigger 
                    value="signin" 
                    className="py-2.5 text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md transition-all"
                  >
                    <LogIn className="mr-2 h-4 w-4" /> Sign In
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup" 
                    className="py-2.5 text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md transition-all"
                  >
                    <UserPlus className="mr-2 h-4 w-4" /> Sign Up
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="signin">
                  <SignInForm 
                    onSuccess={handleSuccess} 
                    isModal={true} 
                    searchCriteria={searchCriteria}
                    formData={formData}
                  />
                </TabsContent>
                <TabsContent value="signup">
                  <SignUpForm 
                    onSuccess={handleSuccess} 
                    isModal={true}
                    searchCriteria={searchCriteria}
                    formData={formData}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </DialogContent>
        </Dialog>
      );
    };

    export default AuthModal;