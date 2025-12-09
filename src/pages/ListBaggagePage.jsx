import React, { useState, useEffect } from 'react';
    import { motion } from 'framer-motion';
    import { DollarSign, Loader2, AlertTriangle } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
    import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { format } from "date-fns";
    import { supabase } from '@/lib/customSupabaseClient';
    import { useToast } from '@/components/ui/use-toast';
    import { useNavigate } from 'react-router-dom';
    import LoadingSpinner from '@/components/ui/LoadingSpinner';
    import { useAuth } from '@/contexts/SupabaseAuthContext';
    import { MAX_BAGGAGE_WEIGHT_PER_BAG } from '@/config/constants';
    import { useListBaggageForm } from '@/pages/list-baggage/useListBaggageForm';
    import ListBaggageFormFields from '@/pages/list-baggage/ListBaggageFormFields';
    import ListBaggagePageHeader from '@/pages/list-baggage/ListBaggagePageHeader';

    const ListBaggagePage = () => {
      const { session, loading: authLoading } = useAuth(); 
      const { toast } = useToast();
      const navigate = useNavigate();
      const [isLoading, setIsLoading] = useState(false);
      
      const initialFormState = {
        origin: '',
        destination: '',
        departureDate: null,
        numberOfBags: '',
      };

      const { formData, errors, estimatedDistance, estimatedEarnings, handleInputChange, handleDateChange, handleAirportChange, handleNumberOfBagsChange, validateForm, setFormData } = useListBaggageForm(initialFormState);
      
      const isCalculationPending = formData.origin && formData.destination && (estimatedDistance === null || estimatedEarnings === null) && formData.origin !== formData.destination;

      const handleSubmit = async (e) => {
        e.preventDefault();
        if (!session) {
          toast({ 
            title: "Authentication Required", 
            description: "Please sign in or create an account to list your baggage allocation.",
          });
          navigate('/signin', { state: { from: '/list-your-bag' } });
          return;
        }

        if (!validateForm()) {
          toast({
            title: "Validation Error",
            description: errors.confirmation || "Please correct the errors in the form.",
            variant: "destructive",
          });
          return;
        }

         if (isCalculationPending) {
            toast({
                title: "Calculation In Progress",
                description: "Please wait for distance and earnings to be calculated or verify airport selections.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        try {
          const listingPayload = {
            user_id: session.user.id,
            origin: formData.origin,
            destination: formData.destination,
            departure_date: formData.departureDate ? format(formData.departureDate, "yyyy-MM-dd HH:mm:ssXXX") : null,
            available_space_kg: MAX_BAGGAGE_WEIGHT_PER_BAG, 
            number_of_bags: parseInt(formData.numberOfBags, 10),
            status: 'active',
            total_potential_earnings: estimatedEarnings,
            listing_type: 'yanking',
          };

          const { error } = await supabase
            .from('listings')
            .insert([listingPayload]);

          if (error) throw error;

          toast({
            title: "Baggage Offer Listed!",
            description: "You can now earn money on your baggage allocation.",
            variant: "default",
            className: "bg-green-500 dark:bg-green-700 text-white"
          });
          setFormData(initialFormState);
          navigate('/my-listings', { state: { activeTab: 'yanking' } });

        } catch (error) {
          console.error("Error creating listing:", error);
          toast({
            title: "Error Listing Offer",
            description: error.message || "Could not list your offer. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      };

      if (authLoading) {
        return <LoadingSpinner fullScreen={true} />;
      }

      return (
        <div className="container mx-auto py-12 px-4 md:px-6 min-h-[calc(100vh-180px)]">
          <ListBaggagePageHeader />
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="max-w-3xl mx-auto shadow-xl glassmorphism border-none dark:bg-slate-800/50">
              <CardHeader>
                <CardTitle className="text-xl text-foreground dark:text-white">Enter Your Trip and Bag Details</CardTitle>
                <CardDescription className="dark:text-slate-300">
                  Provide accurate information to connect with those who want to send bags. You'll be charged a small service fee by <span className="font-vernaccia-bold">Yankit</span> from your earnings.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent>
                  <ListBaggageFormFields 
                    formData={formData} 
                    handleDateChange={handleDateChange}
                    handleAirportChange={handleAirportChange}
                    handleNumberOfBagsChange={handleNumberOfBagsChange}
                    errors={errors}
                    isLoading={isLoading || authLoading} 
                    estimatedDistance={estimatedDistance}
                    estimatedEarnings={estimatedEarnings}
                  />
                  <div className="min-h-[60px] mt-4">
                    {errors.confirmation && (
                      <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{duration:0.2}}>
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
                      disabled={isLoading || authLoading || isCalculationPending}
                  >
                    {isLoading || authLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <DollarSign className="mr-2 h-5 w-5" />}
                    {isLoading || authLoading ? 'Processing...' : (isCalculationPending ? 'Calculating Earnings...' : 'Earn Money on Your Baggage Allocation')}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </motion.div>
        </div>
      );
    };

    export default ListBaggagePage;