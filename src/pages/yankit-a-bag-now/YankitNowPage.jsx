import React, { useState, useEffect, useCallback } from 'react';
    import { motion } from 'framer-motion';
    import { DollarSign, Loader2, AlertTriangle, Anchor } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
    import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
    import { useToast } from '@/components/ui/use-toast';
    import { supabase } from '@/lib/supabaseClient';
    import { useAuth } from '@/contexts/AuthContext';
    import { useNavigate, useLocation } from 'react-router-dom';
    import YankitNowPageHeader from '@/pages/yankit-a-bag-now/YankitNowPageHeader';
    import YankitNowFormFields from '@/pages/yankit-a-bag-now/YankitNowFormFields';
    import { useYankitNowForm } from '@/pages/yankit-a-bag-now/useYankitNowForm';
    import LoadingSpinner from '@/components/ui/LoadingSpinner';
    import AuthModal from '@/components/auth/AuthModal';

    const YankitNowPage = () => {
      const { session, loading: authLoading } = useAuth();
      const { toast } = useToast();
      const navigate = useNavigate();
      const location = useLocation();

      const [pageLoading, setPageLoading] = useState(true);
      const [showAuthModal, setShowAuthModal] = useState(false);
      const [authModalInitialTab, setAuthModalInitialTab] = useState('signin');
      const [stagedFormData, setStagedFormData] = useState(null);


      const {
        formData,
        errors,
        isLoading,
        isCalculatingDistance,
        isCalculatingEarnings,
        estimatedDistance,
        estimatedEarnings,
        handleInputChange,
        handleDateChange,
        handleAirportChange,
        handleNumberOfBagsChange,
        validateForm,
        resetForm,
        isCalculationPending,
      } = useYankitNowForm(session?.user?.id);

      useEffect(() => {
        if (!authLoading) {
            setPageLoading(false);
            if (location.state?.formData) {
                const { origin, destination, departureDate, numberOfBags, availableWeight } = location.state.formData;
                if (origin) handleAirportChange('origin', origin);
                if (destination) handleAirportChange('destination', destination);
                if (departureDate) handleDateChange(new Date(departureDate));
                if (numberOfBags) handleNumberOfBagsChange(numberOfBags.toString());
                
                navigate(location.pathname, { replace: true, state: {} }); 
            }
        }
      }, [authLoading, location.state, handleAirportChange, handleDateChange, handleNumberOfBagsChange, navigate, location.pathname]);
      
      const handleFormSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) {
          toast({ variant: "destructive", title: "Validation Error", description: "Please correct the errors in the form." });
          return;
        }

        if (!session?.user) {
          setStagedFormData(formData);
          setShowAuthModal(true);
          return;
        }
        
        submitListing(formData);
      };

      const submitListing = async (dataToSubmit) => {
        if (!session?.user?.id) {
          toast({ variant: "destructive", title: "Authentication Error", description: "User not found. Please sign in again." });
          return;
        }

        try {
          const { error } = await supabase.from('listings').insert({
            user_id: session.user.id,
            origin: dataToSubmit.origin,
            destination: dataToSubmit.destination,
            departure_date: dataToSubmit.departureDate,
            available_space_kg: dataToSubmit.availableWeight,
            number_of_bags: parseInt(dataToSubmit.numberOfBags, 10),
            total_potential_earnings: estimatedEarnings, 
            status: 'active',
          });

          if (error) {
            throw error;
          }

          toast({
            title: 'Yanking Offer Listed!',
            description: 'Your baggage yanking offer has been successfully listed.',
            variant: 'default',
            className: "bg-green-500 dark:bg-green-600 text-white",
          });
          resetForm();
          navigate('/my-activity'); 
        } catch (error) {
          console.error('Error listing baggage:', error);
          toast({
            variant: 'destructive',
            title: 'Error Listing Offer',
            description: error.message || 'An unexpected error occurred. Please try again.',
          });
        }
      };
      
      const handleSignInRedirect = (tab = 'signin') => {
        setStagedFormData(formData);
        setAuthModalInitialTab(tab);
        setShowAuthModal(true);
      };

      const handleAuthenticationSuccess = () => {
        setShowAuthModal(false);
        if (stagedFormData) {
          submitListing(stagedFormData);
        }
        setStagedFormData(null);
      };


      if (pageLoading && authLoading) {
        return <LoadingSpinner fullScreen={true} />;
      }
      
      return (
        <>
          <div className="container mx-auto py-12 px-4 md:px-6 min-h-[calc(100vh-180px)]">
            <YankitNowPageHeader />
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.35 }}
            >
              <Card className="max-w-3xl mx-auto shadow-xl glassmorphism border-none dark:bg-slate-800/50">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground dark:text-white flex items-center">
                    <Anchor size={20} className="mr-3 text-primary"/>
                    Enter Your Trip & Bag Details for "Yank a Bag Now"
                  </CardTitle>
                  <CardDescription className="dark:text-slate-300">
                    Provide accurate information for the "Yank a Bag Now" service. A small fee applies.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleFormSubmit}>
                  <CardContent>
                    <YankitNowFormFields 
                      formData={formData} 
                      handleInputChange={handleInputChange} 
                      handleDateChange={handleDateChange}
                      handleAirportChange={handleAirportChange}
                      handleNumberOfBagsChange={handleNumberOfBagsChange}
                      errors={errors}
                      isLoading={isLoading || pageLoading} 
                      estimatedDistance={estimatedDistance}
                      estimatedEarnings={estimatedEarnings}
                    />
                    <div className="min-h-[60px] mt-4">
                      {errors.confirmation && (
                        <motion.div initial={{opacity:0 }} animate={{opacity:1}} transition={{duration:0.2, delay: 0.45 }}>
                          <Alert variant="destructive" className="mt-4">
                              <AlertTriangle className="h-4 w-4" />
                              <AlertTitle>Error</AlertTitle>
                              <AlertDescription>{errors.confirmation}</AlertDescription>
                          </Alert>
                        </motion.div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col items-stretch gap-4">
                    <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg py-3" 
                        disabled={isLoading || pageLoading || isCalculationPending}
                    >
                      {isLoading || pageLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <DollarSign className="mr-2 h-5 w-5" />}
                      {isLoading || pageLoading ? 'Processing...' : (isCalculationPending ? 'Calculating...' : 'Yankit My Bag Now!')}
                    </Button>
                    {!session && !pageLoading && (
                        <p className="text-xs text-center text-muted-foreground dark:text-slate-400 mt-2">
                          You will be asked to <Button variant="link" size="sm" className="p-0 h-auto text-xs text-primary hover:underline dark:text-secondary" onClick={() => handleSignInRedirect('signin')}>sign in</Button> or <Button variant="link" size="sm" className="p-0 h-auto text-xs text-primary hover:underline dark:text-secondary" onClick={() => handleSignInRedirect('signup')}>sign up</Button> to complete your offer.
                        </p>
                      )}
                  </CardFooter>
                </form>
              </Card>
            </motion.div>
          </div>
          <AuthModal 
            isOpen={showAuthModal} 
            onClose={() => { setShowAuthModal(false); if (!session) setStagedFormData(null);}}
            onAuthSuccess={handleAuthenticationSuccess}
            initialTab={authModalInitialTab}
            formData={stagedFormData} 
          />
        </>
      );
    };

    export default YankitNowPage;