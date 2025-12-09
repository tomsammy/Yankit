import React from 'react';
    import BaggageListingCard from '@/components/BaggageListingCard';
    import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
    import { Info } from 'lucide-react';

    const BaggageSearchResults = ({ listings, currentUserId, pageType = "send-a-bag" }) => {
      const noResultsTitle = pageType === "send-a-bag" ? "No Yanking Offers Found" : "No Listings Found";
      const noResultsDescription = pageType === "send-a-bag" 
        ? "No bag yanking offers matched your criteria. Try adjusting your search or check back later as new offers are added frequently."
        : "No baggage space matched your criteria. Try adjusting your search or check back later as new listings are added frequently.";
      const resultsFoundTitle = pageType === "send-a-bag" 
        ? `Found ${listings.length} Matching Yanking Offer${listings.length > 1 ? 's' : ''}`
        : `Found ${listings.length} Matching Listing${listings.length > 1 ? 's' : ''}`;

      if (listings.length === 0) {
        return (
          <Alert variant="default" className="max-w-xl mx-auto mt-12 bg-secondary/10 dark:bg-secondary/20 border-secondary/30">
            <Info className="h-5 w-5 text-secondary" />
            <AlertTitle className="font-semibold text-secondary">{noResultsTitle}</AlertTitle>
            <AlertDescription className="text-secondary/80">
              {noResultsDescription}
            </AlertDescription>
          </Alert>
        );
      }

      return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-center text-foreground dark:text-white">
                {resultsFoundTitle}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map(listing => <BaggageListingCard key={listing.id} listing={listing} currentUserId={currentUserId} />)}
            </div>
        </div>
      );
    };

    export default BaggageSearchResults;