import React from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import { useListBaggageForm } from './useListBaggageForm';
import AuthWall from '@/components/auth/AuthWall';
import ListBaggagePageHeader from './ListBaggagePageHeader';
import ListBaggageFormFields from './ListBaggageFormFields';
import EstimatedCostCard from './EstimatedCostCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { Form } from "@/components/ui/form";

const ListBaggagePage = () => {
  const { session } = useAuth();
  const {
    form,
    isCalculating,
    isSubmitting,
    estimatedDistance,
    estimatedCostPerBag,
    onSubmit,
  } = useListBaggageForm();

  const { formState: { errors } } = form;

  const renderForm = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <Card className="lg:col-span-2 shadow-lg border-border/30">
        <CardContent className="p-6 md:p-8">
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-8">
              <ListBaggageFormFields
                form={form}
                isLoading={isSubmitting || isCalculating}
              />

              {errors.root?.serverError && (
                <Alert variant="destructive" className="bg-red-50 dark:bg-red-900/30">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Submission Error</AlertTitle>
                  <AlertDescription>
                    {errors.root.serverError.message}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full text-lg py-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-500/90 hover:to-emerald-600/90 text-white dark:from-green-600 dark:to-emerald-700 dark:hover:from-green-600/90 dark:hover:to-emerald-700/90 shadow-lg transition-transform transform hover:scale-105"
                disabled={isSubmitting || isCalculating}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                  </>
                ) : isCalculating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Calculating...
                  </>
                ) : (
                  'List My Baggage'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="lg:col-span-1 sticky top-28">
        <EstimatedCostCard
          isCalculating={isCalculating}
          estimatedDistance={estimatedDistance}
          estimatedCostPerBag={estimatedCostPerBag}
          numberOfBags={form.watch('number_of_bags')}
        />
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>List Your Bag | Yankit</title>
        <meta
          name="description"
          content="List your available baggage space and earn money by carrying items for others. Join the Yankit community today."
        />
      </Helmet>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <ListBaggagePageHeader />
        {session ? renderForm() : (
          <AuthWall message="You need to be signed in to list your bag. Please sign in or create an account to get started." />
        )}
      </div>
    </>
  );
};

export default ListBaggagePage;
