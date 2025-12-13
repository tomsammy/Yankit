import React from 'react';
    import { Helmet } from 'react-helmet';
    import { useAuth } from '@/contexts/AuthContext';
    import AuthWall from '@/components/auth/AuthWall';
    import YankABagNowPageHeader from './YankABagNowPageHeader';
    import YankABagNowFormFields from './YankABagNowFormFields';
    import YankABagNowEstimatedEarningsCard from './YankABagNowEstimatedEarningsCard';
    import { useYankABagNowForm } from './useYankABagNowForm';
    import { supabase } from '@/lib/supabaseClient';
    import { useToast } from '@/components/ui/use-toast';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent } from '@/components/ui/card';
    import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
    import { AlertCircle } from "lucide-react";
    import { MAX_BAGGAGE_WEIGHT_PER_BAG } from '@/config/constants';
    import { useNavigate } from 'react-router-dom';

    const YankABagNowPage = () => {
        const { session } = useAuth();
        const navigate = useNavigate();
        const { toast } = useToast();
        const {
            formData,
            errors,
            isLoading: isSubmitting,
            isCalculating,
            estimatedDistance,
            estimatedEarnings,
            handleInputChange,
            handleDateChange,
            handleAirportChange,
            handleNumberOfBagsChange,
            validateForm,
            resetForm,
        } = useYankABagNowForm(session?.user?.id);
        
        const handleSubmit = async (e) => {
            e.preventDefault();
            if (!validateForm()) {
                toast({
                    title: "Form Incomplete",
                    description: "Please fill out all required fields correctly.",
                    variant: "destructive",
                });
                return;
            }

            try {
                const { error } = await supabase.from('listings').insert({
                    user_id: session.user.id,
                    origin: formData.origin.label,
                    destination: formData.destination.label,
                    departure_date: formData.departureDate,
                    available_space_kg: MAX_BAGGAGE_WEIGHT_PER_BAG * parseInt(formData.numberOfBags, 10),
                    number_of_bags: parseInt(formData.numberOfBags, 10),
                    total_potential_earnings: estimatedEarnings,
                    status: 'active',
                    listing_type: 'yanking',
                });

                if (error) {
                    throw error;
                }

                toast({
                    title: "Success!",
                    description: "Your baggage space has been listed.",
                });
                resetForm();
                navigate('/my-listings', { state: { activeTab: 'yanking' } });
            } catch (error) {
                console.error("Error creating listing:", error);
                toast({
                    title: "Error Creating Listing",
                    description: error.message || 'An unexpected error occurred.',
                    variant: "destructive",
                });
            }
        };

        const renderForm = () => (
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <Card className="lg:col-span-2 shadow-lg border-border/30">
                    <CardContent className="p-6 md:p-8">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <YankABagNowFormFields
                                formData={formData}
                                errors={errors}
                                handleInputChange={handleInputChange}
                                handleDateChange={handleDateChange}
                                handleAirportChange={handleAirportChange}
                                handleNumberOfBagsChange={handleNumberOfBagsChange}
                                isSubmitting={isSubmitting || isCalculating}
                            />
                            {errors.confirmation && (
                                <Alert variant="destructive" className="bg-red-50 dark:bg-red-900/30">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Calculation Error</AlertTitle>
                                    <AlertDescription>
                                        {errors.confirmation}
                                    </AlertDescription>
                                </Alert>
                            )}
                            <Button
                                type="submit"
                                className="w-full text-lg py-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-500/90 hover:to-emerald-600/90 text-white dark:from-green-600 dark:to-emerald-700 dark:hover:from-green-600/90 dark:hover:to-emerald-700/90 shadow-lg transition-transform transform hover:scale-105"
                                disabled={isSubmitting || isCalculating || !formData.termsAccepted || !!errors.confirmation}
                            >
                                {isSubmitting ? 'Submitting...' : isCalculating ? 'Calculating...' : 'List My Baggage Space'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="lg:col-span-1 sticky top-28">
                    <YankABagNowEstimatedEarningsCard
                        isCalculating={isCalculating}
                        estimatedDistance={estimatedDistance}
                        estimatedEarnings={estimatedEarnings}
                        numberOfBags={formData.numberOfBags}
                    />
                </div>
            </div>
        );

        return (
            <>
                <Helmet>
                    <title>Yank a Bag | Yankit</title>
                    <meta name="description" content="Offer your unused baggage allowance on Yankit and earn money while you travel. It's simple, secure, and rewarding." />
                </Helmet>
                <div className="container mx-auto px-4 py-8 md:py-12">
                    <YankABagNowPageHeader />
                    {session ? renderForm() : <AuthWall message="You need to be signed in to Yank a Bag. Please sign in or create an account to get started." />}
                </div>
            </>
        );
    };

    export default YankABagNowPage;