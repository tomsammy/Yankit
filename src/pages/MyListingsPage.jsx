import React, { useState, useEffect } from 'react';
    import { motion } from 'framer-motion';
    import { useNavigate, useLocation } from 'react-router-dom';
    import { List, ClipboardList, PlusCircle, Edit, Trash2, Package, PlaneTakeoff } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
    import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
    import useUserListings from '@/hooks/useUserListings';
    import { useAuth } from '@/contexts/AuthContext';
    import LoadingSpinner from '@/components/ui/LoadingSpinner';
    import {
        AlertDialog,
        AlertDialogAction,
        AlertDialogCancel,
        AlertDialogContent,
        AlertDialogDescription,
        AlertDialogFooter,
        AlertDialogHeader,
        AlertDialogTitle,
    } from "@/components/ui/alert-dialog";

    const pageVariants = {
        initial: { opacity: 0, y: 20 },
        in: { opacity: 1, y: 0 },
        out: { opacity: 0, y: -20 },
    };

    const MyListingsPageHeader = () => (
        <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <List className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-secondary mb-5">
                My Listings
            </h1>
            <p className="text-lg text-muted-foreground dark:text-slate-300 max-w-xl mx-auto">
                Manage your yanking and sending listings. Edit, view, or remove them as needed.
            </p>
        </motion.div>
    );

    const ListingCard = ({ listing, onEdit, onDelete, type, isDeleting }) => {
        const {
            id,
            origin,
            destination,
            departure_date,
            available_space_kg,
            number_of_bags,
            estimated_earnings,
            agreed_price,
            agreed_weight_kg,
            status,
        } = listing;

        const statusDisplay = status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown';
        const statusColorClass = status === 'active' ? 'text-green-500' : 'text-yellow-500';
        const navigate = useNavigate();
        const cannotDelete =
        (type === 'shipping' &&
          (status !== 'pending_payment' || listing.traveler_user_id)) ||
        (type === 'yanking' && listing.is_matched); 
        return (
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 glassmorphism dark:bg-slate-800/50 dark:border-slate-700/50">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <CardTitle className="text-lg font-semibold text-foreground dark:text-slate-100">
                            {origin} &rarr; {destination}
                        </CardTitle>
                        <span className={`text-sm font-semibold ${statusColorClass}`}>{statusDisplay}</span>
                    </div>
                    <CardDescription className="text-sm text-muted-foreground dark:text-slate-400 pt-1">
                        Departure: {new Date(departure_date).toLocaleDateString()}
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div className="font-medium"><span className="text-muted-foreground dark:text-slate-400 block text-xs">Space</span> {available_space_kg || agreed_weight_kg} kg</div>
                    <div className="font-medium"><span className="text-muted-foreground dark:text-slate-400 block text-xs">Bags</span> {number_of_bags}</div>
                    <div className="font-medium"><span className="text-muted-foreground dark:text-slate-400 block text-xs">Earnings</span> ${estimated_earnings || agreed_price.toFixed(2)}</div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" size="sm" onClick={() => onEdit(id)}><Edit className="w-4 h-4 mr-2" /> Edit</Button>
                    <Button variant="destructive" size="sm" disabled={cannotDelete} onClick={() => onDelete(listing)}>
                    
                    {isDeleting ? <><LoadingSpinner size="sm" /> Deleting...</> : <><Trash2 className="w-4 h-4 mr-2" /> Delete</>}
                    </Button>
                    <Button
            onClick={() => navigate(`/shipment-tracking/${id}`)}
            className="mr-2 bg-blue-500" 
          >
            Track Shipment
          </Button>

                </CardFooter>
            </Card>
        );
    };

    const NoListingsState = ({ title, description, buttonText, buttonLink, icon: Icon }) => {
        const navigate = useNavigate();
        return (
            <Card className="text-center p-8 shadow-lg glassmorphism border-none dark:bg-slate-800/40 mt-8">
                <Icon size={48} className="mx-auto mb-4 text-primary" />
                <CardTitle className="text-xl font-semibold text-foreground dark:text-white">
                    {title}
                </CardTitle>
                <CardDescription className="text-muted-foreground dark:text-slate-300 mt-2 mb-4">
                    {description}
                </CardDescription>
                <Button onClick={() => navigate(buttonLink)}>
                    <PlusCircle className="w-4 h-4 mr-2" /> {buttonText}
                </Button>
            </Card>
        );
    }

    const MyListingsPage = () => {
        const { isLoading: isLoadingUser } = useAuth();
        const { yankingListings, shippingListings, isLoading: isLoadingListings, deleteYanking, deleteShipment } = useUserListings();
        const navigate = useNavigate();
        const location = useLocation();
        const [isDeleting, setIsDeleting] = useState(false);
        const [listingToDelete, setListingToDelete] = useState(null);
        const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'yanking');
        
        useEffect(() => {
            if (location.state?.activeTab) {
                setActiveTab(location.state.activeTab);
                navigate(location.pathname, { replace: true, state: {} });
            }
        }, [location.state, navigate, location.pathname]);


        const handleEdit = (id) => {
            activeTab === 'yanking' ? navigate(`/edit-yanking/${id}`) : navigate(`/edit-shipment/${id}`);
        };

        const confirmDelete = (listing) => {
            setListingToDelete(listing);
          };

          const handleDelete = async () => {
            if (!listingToDelete) return;
          
            setIsDeleting(true);
          
            try {
              if (activeTab === 'yanking') {
                await deleteYanking(listingToDelete);
              } else {
                await deleteShipment(listingToDelete);
              }
            } catch (err) {
              alert(
                err.message ||
                'This item cannot be deleted due to its current state.'
              );
            } finally {
              setIsDeleting(false);
              setListingToDelete(null);
            }
          };

        if (isLoadingUser || isLoadingListings) {
            return <div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>;
        }

        return (
            <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={{ duration: 0.5 }}
                className="container mx-auto py-12 px-4 md:px-6 min-h-[calc(100vh-180px)]"
            >
                <MyListingsPageHeader />

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="yanking"><PlaneTakeoff className="w-4 h-4 mr-2" /> Yankings</TabsTrigger>
                        <TabsTrigger value="shipping"><Package className="w-4 h-4 mr-2" /> Shippings</TabsTrigger>
                    </TabsList>
                    <TabsContent value="yanking">
                        {yankingListings.length === 0 ? (
                            <NoListingsState 
                                title="You have no yanking listings."
                                description="List your available baggage space to start earning."
                                buttonText="Create Yanking Listing"
                                buttonLink="/list-your-bag"
                                icon={ClipboardList}
                            />
                        ) : (
                            <div className="space-y-4 mt-8">
                                {yankingListings.map((listing) => (
                                    <ListingCard
                                        key={listing.id}
                                        listing={listing}
                                        onEdit={handleEdit}
                                        onDelete={confirmDelete}
                                        type = {activeTab}
                                    />
                                ))}
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent value="shipping">
                        {shippingListings.length === 0 ? (
                             <NoListingsState 
                                title="You have no shipping listings."
                                description="Request to send a bag with a traveler."
                                buttonText="Create Shipping Listing"
                                buttonLink="/list-baggage"
                                icon={ClipboardList}
                            />
                        ) : (
                            <div className="space-y-4 mt-8">
                                {shippingListings.map((listing) => (
                                    <ListingCard
                                        key={listing.id}
                                        listing={listing}
                                        onEdit={handleEdit}
                                        onDelete={confirmDelete}
                                        isDeleting={isDeleting}
                                    />
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
                
                <AlertDialog open={!!listingToDelete} onOpenChange={() => setListingToDelete(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your listing. {activeTab === 'yankings' ? "" : "Only a partial refund will be made to your account. 20% fees is deducted on deletion. Are you sure you want to continue?"}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                                {isDeleting ? <><LoadingSpinner size="sm" /> Deleting...</> : "Delete"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

            </motion.div>
        );
    };

    export default MyListingsPage;