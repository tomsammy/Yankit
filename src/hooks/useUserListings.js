import { useState, useEffect, useCallback, useMemo } from 'react';
    import { supabase } from '@/lib/supabaseClient';
    import { useToast } from '@/components/ui/use-toast';
    import { useAuth } from '@/contexts/SupabaseAuthContext';

    const useUserListings = () => {
        const { session } = useAuth();
        const [listings, setListings] = useState([]);
        const [isLoading, setIsLoading] = useState(true);
        const { toast } = useToast();
        const currentUserId = session?.user?.id;

        const fetchUserListings = useCallback(async (userId) => {
            if (!userId) {
                setListings([]);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const { data, error } = await supabase
                    .from('listings')
                    .select('*')
                    .eq('user_id', userId)
                    .order('created_at', { ascending: false });

                if (error) {
                    throw new Error(error.message || "Failed to fetch user listings");
                }
                setListings(data || []);
            } catch (error) {
                console.error("Error fetching user listings:", error);
                toast({
                    title: "Error Fetching Listings",
                    description: error.message,
                    variant: "destructive",
                });
                setListings([]);
            } finally {
                setIsLoading(false);
            }
        }, [toast]);
        
        const yankingListings = useMemo(() => listings.filter(l => l.listing_type === 'yanking'), [listings]);
        const shippingListings = useMemo(() => listings.filter(l => l.listing_type === 'shipping'), [listings]);

        const deleteListing = async (listingId) => {
            try {
                const { error } = await supabase
                    .from('listings')
                    .delete()
                    .eq('id', listingId);
                
                if (error) throw error;

                toast({
                    title: "Success!",
                    description: "Your listing has been deleted.",
                });
                
                fetchUserListings(currentUserId);
                return true;

            } catch (error) {
                console.error("Error deleting listing:", error);
                toast({
                    title: "Error",
                    description: `Failed to delete listing: ${error.message}`,
                    variant: "destructive",
                });
                return false;
            }
        };

        useEffect(() => {
            if (currentUserId) {
                fetchUserListings(currentUserId);
            } else {
                fetchUserListings(null);
            }
        }, [currentUserId, fetchUserListings]);

        return {
            listings,
            yankingListings,
            shippingListings,
            isLoading,
            currentUserId,
            deleteListing,
            refetchListings: () => {
                if (currentUserId) {
                    fetchUserListings(currentUserId);
                }
            },
        };
    };

    export default useUserListings;