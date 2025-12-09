import React from 'react';
    import { motion } from 'framer-motion';
    import { DollarSign, Loader2, AlertTriangle } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
    import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import LoadingSpinner from '@/components/ui/LoadingSpinner';
    import { useAuth } from '@/contexts/SupabaseAuthContext';
    import { useListBaggageForm } from '@/pages/list-your-bag/useListBaggageForm';
    import ListBaggageFormFields from '@/pages/list-your-bag/ListBaggageFormFields';
    import ListBaggagePageHeader from '@/pages/list-your-bag/ListBaggagePageHeader';

    const ListBaggagePage = () => {
      const { loading: authLoading } = useAuth(); 
      const { form, isLoading, estimatedDistance, estimatedEarnings, onSubmit } = useListBaggageForm();
      const { watch, formState: { errors } } = form;
      
      const origin = watch('origin');
      const destination = watch('destination');
      const numberOfBags = watch('number_of_bags');

      const isCalculationPending = origin && destination && (estimatedDistance === null || estimatedEarnings === null) && origin?.value !== destination?.value;

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
              <form onSubmit={onSubmit}>
                <CardContent>
                  <ListBaggageFormFields 
                    form={form}
                    isLoading={isLoading || authLoading} 
                    estimatedDistance={estimatedDistance}
                    estimatedEarnings={estimatedEarnings}
                    numberOfBags={numberOfBags}
                  />
                  <div className="min-h-[60px] mt-4">
                    {Object.keys(errors).length > 0 && (
                      <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{duration:0.2}}>
                        <Alert variant="destructive" className="mt-4">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                              {Object.values(errors).map(err => err.message).join(' ')}
                            </AlertDescription>
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