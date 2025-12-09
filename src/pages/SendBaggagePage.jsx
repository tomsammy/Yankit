import React, { useState, useEffect, useCallback } from 'react';
    import { motion } from 'framer-motion';
    import { Send as SendIconLucide, Loader2, Info, AlertTriangle, Search, PlusCircle, ArrowRight } from 'lucide-react';
    import { useToast } from '@/components/ui/use-toast';
    import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
    import BaggageSearchForm from '@/components/BaggageSearchForm';
    import BaggageSearchResults from '@/components/BaggageSearchResults';
    import AuthModal from '@/components/auth/AuthModal';
    import { supabase } from '@/lib/customSupabaseClient';
    import { useNavigate, useLocation } from 'react-router-dom';
    import LoadingSpinner from '@/components/ui/LoadingSpinner';
    import { MAX_BAGGAGE_WEIGHT_PER_BAG, MAX_BAGS_PER_LISTING } from '@/config/constants';
    import { useAuth } from '@/contexts/SupabaseAuthContext';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

    const SendBaggagePageHeader = React.memo(() => (
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <SendIconLucide className="w-16 h-16 text-primary mx-auto mb-4" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 mb-4 leading-tight md:leading-snug">
          Send a Bag
        </h1>
        <p className="text-lg text-muted-foreground dark:text-slate-300 max-w-xl mx-auto">
          Find travellers (Yankers) heading your way who can carry your bags. Search for available bag yanking offers below.
        </p>
      </motion.div>
    ));
    SendBaggagePageHeader.displayName = "SendBaggagePageHeader";
    
    const LoadingIndicator = React.memo(({ message }) => (
      <div className="text-center py-10">
        <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
        <p className="text-lg text-muted-foreground dark:text-slate-300">{message}</p>
      </div>
    ));
    LoadingIndicator.displayName = "LoadingIndicator";

    const NoListingsMessage = React.memo(({ title, description, variant = "default", icon: Icon = Info }) => (
      <Alert variant={variant} className={`max-w-xl mx-auto mt-12 ${variant === 'default' ? 'bg-blue-500/10 dark:bg-blue-400/20 border-blue-500/30' : 'bg-yellow-500/10 dark:bg-yellow-400/20 border-yellow-500/30'}`}>
        <Icon className={`h-5 w-5 ${variant === 'default' ? 'text-blue-500 dark:text-blue-400' : 'text-yellow-600 dark:text-yellow-400'}`} />
        <AlertTitle className={`font-semibold ${variant === 'default' ? 'text-blue-600 dark:text-blue-300' : 'text-yellow-700 dark:text-yellow-300'}`}>{title}</AlertTitle>
        <AlertDescription className={`${variant === 'default' ? 'text-blue-600/80 dark:text-blue-300/80' : 'text-yellow-700/80 dark:text-yellow-300/80'}`}>
          {description}
        </AlertDescription>
      </Alert>
    ));
    NoListingsMessage.displayName = "NoListingsMessage";
    
    const InitialPromptMessage = React.memo(() => (
        <Alert variant="default" className="max-w-xl mx-auto mt-12 bg-sky-500/10 dark:bg-sky-400/20 border-sky-500/30">
            <Search className="h-5 w-5 text-sky-600 dark:text-sky-400" />
            <AlertTitle className="font-semibold text-sky-700 dark:text-sky-300">Ready to Send Your Bag?</AlertTitle>
            <AlertDescription className="text-sky-700/80 dark:text-sky-300/80">
                Use the search form above to find travellers (Yankers) heading to your destination. Enter your origin, destination, travel date, and number of bags to see available offers.
            </AlertDescription>
        </Alert>
    ));
    InitialPromptMessage.displayName = "InitialPromptMessage";

    const ListYourBagCallout = React.memo(() => {
        const navigate = useNavigate();
        return (
            <Card className="max-w-3xl mx-auto my-12 shadow-lg hover:shadow-xl transition-shadow duration-300 glassmorphism border-none dark:bg-slate-800/50 bg-gradient-to-tr from-blue-50 via-sky-50 to-white dark:from-slate-800 dark:to-slate-900">
                <CardHeader>
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                            <PlusCircle size={28} className="text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-lg md:text-xl font-bold text-foreground dark:text-white">Can't Find a Match?</CardTitle>
                            <CardDescription className="text-muted-foreground dark:text-slate-300">
                                Let Yankers find you! List your bag and get offers from travellers.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex justify-center items-center pt-4">
                    <Button 
                        onClick={() => navigate('/list-your-bag')} 
                        className="w-full sm:w-auto bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg py-3 px-8 text-white"
                    >
                        List Your Bag for Yankers <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </CardContent>
            </Card>
        );
    });
    ListYourBagCallout.displayName = "ListYourBagCallout";

    const useSendBaggageLogic = (session, authLoading) => {
      const [filteredListings, setFilteredListings] = useState([]);
      const [isLoading, setIsLoading] = useState(false); 
      const [pageLoading, setPageLoading] = useState(true);
      const [isSearching, setIsSearching] = useState(false);
      const [searchedOnce, setSearchedOnce] = useState(false);
      const [currentUserId, setCurrentUserId] = useState(null);
      const [showAuthModal, setShowAuthModal] = useState(false);
      const [stagedSearchCriteria, setStagedSearchCriteria] = useState(null);
      const [authModalInitialTab, setAuthModalInitialTab] = useState('signin');
      
      const { toast } = useToast();
      const navigate = useNavigate(); 
      const location = useLocation(); 

      useEffect(() => {
        setCurrentUserId(session?.user?.id || null);
        if (!authLoading) {
          setPageLoading(false);
        }
      }, [session, authLoading]);

      const performSearchFilter = useCallback((searchCriteria, allFetchedListings) => {
        let results = allFetchedListings;
        if (searchCriteria.origin) results = results.filter(l => l.origin === searchCriteria.origin);
        if (searchCriteria.destination) results = results.filter(l => l.destination === searchCriteria.destination);
        if (searchCriteria.travelDate) {
          const searchDate = new Date(searchCriteria.travelDate).toISOString().split('T')[0];
          results = results.filter(l => l.departure_date && new Date(l.departure_date).toISOString().split('T')[0] === searchDate);
        }
        if (searchCriteria.numberOfBags) {
          const neededBags = parseInt(searchCriteria.numberOfBags, 10);
          if (!isNaN(neededBags) && neededBags > 0) results = results.filter(l => l.number_of_bags >= neededBags);
        }
        
        results = results.filter(l => l.available_space_kg === MAX_BAGGAGE_WEIGHT_PER_BAG);
        return results;
      }, []);

      const fetchAndFilterListings = useCallback(async (searchCriteria = null) => {
        if (!searchCriteria) {
            setFilteredListings([]);
            setSearchedOnce(false); 
            setIsLoading(false);
            setIsSearching(false);
            return;
        }
        
        setIsLoading(true);
        setIsSearching(true);
        setSearchedOnce(true);

        try {
          const { data, error } = await supabase
            .from('listings')
            .select(`
              id, user_id, origin, destination, departure_date, available_space_kg,
              number_of_bags, total_potential_earnings, status, created_at,
              profiles!inner(full_name, avatar_url)
            `)
            .eq('status', 'active')
            .eq('available_space_kg', MAX_BAGGAGE_WEIGHT_PER_BAG) 
            .gte('number_of_bags', searchCriteria.numberOfBags ? parseInt(searchCriteria.numberOfBags, 10) : 1)
            .lte('number_of_bags', MAX_BAGS_PER_LISTING)
            .order('created_at', { ascending: false });

          if (error) throw error;
          
          const fetchedData = data || [];
          const results = performSearchFilter(searchCriteria, fetchedData);
          setFilteredListings(results);
          
          if (results.length === 0) {
            toast({ variant: "default", title: "No Matches Found", description: "Try broadening your search criteria." });
          }

        } catch (error) {
          console.error("Error fetching yanking offers:", error);
          toast({ title: "Error Fetching Offers", description: error.message || "Could not load offers.", variant: "destructive" });
          setFilteredListings([]);
        } finally {
          setIsLoading(false);
          setIsSearching(false); 
        }
      }, [toast, performSearchFilter]);

      useEffect(() => {
          const criteriaFromState = location.state?.searchCriteria || stagedSearchCriteria;
          if (criteriaFromState && !authLoading) {
            fetchAndFilterListings(criteriaFromState); 
            if (location.state?.searchCriteria) {
                navigate(location.pathname, { replace: true, state: {} });
            }
            setStagedSearchCriteria(null); 
          } else if (!authLoading) {
            setPageLoading(false);
          }
      }, [authLoading, session, fetchAndFilterListings, location.state, stagedSearchCriteria, navigate, location.pathname]);


      const handleSearchSubmit = (searchCriteria) => {
        setStagedSearchCriteria(null);
        fetchAndFilterListings(searchCriteria);
      };
      
      const handleAuthenticationSuccess = () => {
        setShowAuthModal(false);
        if (stagedSearchCriteria) {
          handleSearchSubmit(stagedSearchCriteria);
        }
        setStagedSearchCriteria(null);
      };

      const triggerAuthModal = (criteria, tab = 'signin') => {
        setStagedSearchCriteria(criteria);
        setAuthModalInitialTab(tab);
        setShowAuthModal(true);
      };

      return {
        filteredListings, isLoading, pageLoading, isSearching, searchedOnce, currentUserId,
        showAuthModal, stagedSearchCriteria, authModalInitialTab,
        setShowAuthModal, setStagedSearchCriteria, 
        handleSearchSubmit, handleAuthenticationSuccess, triggerAuthModal,
      };
    };

    const SendBaggagePage = () => {
      const auth = useAuth();
      const location = useLocation(); 
      
      const {
        filteredListings, isLoading, pageLoading, isSearching, searchedOnce, currentUserId,
        showAuthModal, stagedSearchCriteria, authModalInitialTab,
        setShowAuthModal, setStagedSearchCriteria,
        handleSearchSubmit, handleAuthenticationSuccess, triggerAuthModal,
      } = useSendBaggageLogic(auth?.session, auth?.loading);
      
      const renderPageContent = () => {
        if (isLoading || isSearching) return <LoadingIndicator message={isSearching ? "Searching for Yankers..." : "Loading available bag yanking offers..."} />;
        
        if (searchedOnce) {
          if (filteredListings.length > 0) return <BaggageSearchResults listings={filteredListings} currentUserId={currentUserId} pageType="send-a-bag" onAuthRequired={triggerAuthModal} />;
          return <NoListingsMessage title="No Yanking Offers Match Your Search" description="We couldn't find any bag yanking offers matching your criteria. Try adjusting your search or check back later." variant="destructive" icon={AlertTriangle} />;
        }
        
        return <InitialPromptMessage />;
      };

      if (pageLoading || auth?.loading || !auth) return <LoadingSpinner fullScreen={true} />;

      return (
        <>
          <div
            className="container mx-auto py-12 px-4 md:px-6 min-h-[calc(100vh-180px)]"
          >
            <SendBaggagePageHeader />
            <BaggageSearchForm 
              onSearch={handleSearchSubmit} 
              isLoading={isSearching || isLoading} 
              initialCriteria={location.state?.searchCriteria || stagedSearchCriteria}
              pageType="send-a-bag"
            />
            {renderPageContent()}
            <ListYourBagCallout />
          </div>
          <AuthModal 
            isOpen={showAuthModal} 
            onClose={() => { setShowAuthModal(false); if (!auth?.session) setStagedSearchCriteria(null); }}
            onAuthSuccess={handleAuthenticationSuccess}
            initialTab={authModalInitialTab}
            searchCriteria={stagedSearchCriteria}
          />
        </>
      );
    };

    export default SendBaggagePage;