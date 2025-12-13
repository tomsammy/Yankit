import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import SendABagPageHeader from './SendABagPageHeader';
import SendABagFormFields from './SendABagFormFields';
import EstimatedCostCard from './EstimatedCostCard';
import AuthWall from '@/components/auth/AuthWall';
import useSendBaggageForm from './useSendBaggageForm';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormControl, FormMessage, FormLabel } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { Link } from 'react-router-dom';

const SendABagPage = () => {
    const { session } = useAuth();
    const { form, isLoading, onSubmit, estimatedCost } = useSendBaggageForm();
    const { formState: { errors } } = form;

    const renderForm = () => (
        <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <Card className="lg:col-span-2 shadow-lg border-border/30">
                        <CardContent className="p-6 md:p-8">
                            <div className="space-y-8">
                                <SendABagFormFields form={form} />

                                <FormField
                                    control={form.control}
                                    name="termsAccepted"
                                    rules={{ required: "You must accept the terms to proceed" }}
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm bg-background">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    disabled={isLoading}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>
                                                    Accept Terms and Conditions
                                                </FormLabel>
                                                <FormMessage />
                                                <p className="text-sm text-muted-foreground">
                                                    I agree to the Yankit <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
                                                </p>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                 {Object.keys(errors).length > 0 && !errors.termsAccepted && (
                                     <Alert variant="destructive">
                                         <AlertCircle className="h-4 w-4" />
                                         <AlertTitle>Error</AlertTitle>
                                         <AlertDescription>Please fill in all required fields before submitting.</AlertDescription>
                                     </Alert>
                                 )}

                                <Button
                                    type="submit"
                                    className="w-full text-lg py-6 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white dark:from-blue-500 dark:to-sky-500 dark:hover:from-blue-500/90 dark:hover:to-sky-500/90 shadow-lg transition-transform transform hover:scale-105"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        'Create Shipment & Proceed to Pay'
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="lg:col-span-1 sticky top-28">
                        <EstimatedCostCard
                            isLoading={isLoading}
                            estimatedCost={estimatedCost.totalCost}
                            yankerEarnings={estimatedCost.price}
                            serviceFee={estimatedCost.serviceFee}
                            numberOfBags={form.watch('number_of_bags')}
                        />
                    </div>
                </div>
            </form>
        </Form>
    );

    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <SendABagPageHeader />
            {session ? renderForm() : <AuthWall message="You need to be signed in to send a bag. Please sign in or create an account to continue." />}
        </div>
    );
};

export default SendABagPage;