import React from "react";
import SEO from "@/components/SEO";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AuthWall from "@/components/auth/AuthWall";
import YankABagPageHeader from "./YankABagPageHeader";
import YankABagFormFields from "./YankABagFormFields";
import YankABagEstimatedEarningsCard from "./YankABagEstimatedEarningsCard";
import { useYankABagForm } from "./useYankABagForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const YankABagPage = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  const {
    formData,
    errors,
    isSubmitting,
    isCalculating,
    estimatedDistance,
    estimatedEarnings,
    handleInputChange,
    handleDateChange,
    handleAirportChange,
    handleNumberOfBagsChange,
    submitYanking,
  } = useYankABagForm(session?.user?.id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const yanking = await submitYanking();
    if (yanking?.id) navigate(`/yankings/${yanking.id}/matches`);
  };

  if (!session) {
    return <AuthWall message="You need to be signed in to Yank a Bag." />;
  }

  return (
    <>
      <SEO
        title="Earn Money Delivering Luggage | Yankit"
        description="Monetize your baggage space while you travel. Pick up shipments, earn cash, offset flight costs. Join
Yankit's earning community."
        path="/"
        ogImageName="logo.png"
        // schema={schema}
      />

      <div className="container mx-auto px-4 py-8 md:py-12">
        <YankABagPageHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <Card className="lg:col-span-2">
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <YankABagFormFields
                  formData={formData}
                  errors={errors}
                  handleInputChange={handleInputChange}
                  handleDateChange={handleDateChange}
                  handleAirportChange={handleAirportChange}
                  handleNumberOfBagsChange={handleNumberOfBagsChange}
                  isLoading={isSubmitting || isCalculating}
                />

                {errors.confirmation && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Calculation Error</AlertTitle>
                    <AlertDescription>{errors.confirmation}</AlertDescription>
                  </Alert>
                )}

                <div className="mt-10 w-full text-end">
                  <p className="text-xs text-muted-foreground dark:text-slate-400">
                    Bags are stored at{" "}
                    <a
                      href="https://radicalstorage.com"
                      target="blank"
                      className="text-blue-500 underline"
                    >
                      radicalstorage.com
                    </a>
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full py-6 text-lg"
                  disabled={
                    isSubmitting ||
                    isCalculating ||
                    !formData.bagHandlingAccepted ||
                    !!errors.confirmation
                  }
                >
                  {isSubmitting
                    ? "Submitting..."
                    : isCalculating
                      ? "Calculating..."
                      : "List My Baggage Space"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="lg:col-span-1 sticky top-28">
            <YankABagEstimatedEarningsCard
              isCalculating={isCalculating}
              estimatedDistance={estimatedDistance}
              estimatedEarnings={estimatedEarnings}
              numberOfBags={formData.numberOfBags}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default YankABagPage;
