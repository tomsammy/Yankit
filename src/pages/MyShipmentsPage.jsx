import React, { useEffect } from 'react';
    import { motion } from 'framer-motion';
    import { Dialog, DialogContent } from '@/components/ui/dialog';
    import ChatInterface from '@/components/messaging/ChatInterface';
    import MyShipmentsHeader from '@/components/shipments/MyShipmentsHeader';
    import MyShipmentsTabs from '@/components/shipments/MyShipmentsTabs';
    import useUserContracts from '@/hooks/useUserContracts';
    import useChatManager from '@/hooks/useChatManager';
    import { useLocation, useNavigate } from 'react-router-dom';
    import { useToast } from '@/components/ui/use-toast';
    import { Button } from '@/components/ui/button';
    import { Loader2 } from 'lucide-react';
    import { useAuth } from '@/contexts/SupabaseAuthContext';

    const pageVariants = {
      initial: { opacity: 0, y: 20 },
      in: { opacity: 1, y: 0 },
      out: { opacity: 0, y: -20 }
    };
    
    const useAuthGuardMyShipments = (currentUserId, isLoading, navigate, location, toast) => {
      useEffect(() => {
        if (currentUserId === null && !isLoading) { 
            toast({
                title: "Authentication Required",
                description: "Please sign in to view your shipments.",
                variant: "destructive",
                action: <Button onClick={() => navigate('/signin', { state: { from: location.pathname }})}>Sign In</Button>
            });
            if (location.pathname !== '/signin') {
              navigate('/signin', { state: { from: location.pathname }});
            }
        }
      }, [currentUserId, isLoading, navigate, toast, location.pathname]);
    };

    const useChatRedirectHandler = (location, currentUserId, handleOpenChat, navigate) => {
        useEffect(() => {
            const searchParams = new URLSearchParams(location.search);
            if (searchParams.get('chatOpen') === 'true' && currentUserId) {
              const conversationId = searchParams.get('conversationId');
              const listingId = searchParams.get('listingId');
              const recipientId = searchParams.get('recipientId');
              const recipientName = searchParams.get('recipientName');
              const itemDescription = searchParams.get('itemDescription');
              
              if (conversationId && recipientId) {
                handleOpenChat(conversationId, recipientId, listingId, recipientName || "User", itemDescription || "");
                const newSearchParams = new URLSearchParams(location.search);
                newSearchParams.delete('chatOpen');
                newSearchParams.delete('conversationId');
                newSearchParams.delete('listingId');
                newSearchParams.delete('recipientId');
                newSearchParams.delete('recipientName');
                newSearchParams.delete('itemDescription');
                navigate(`${location.pathname}?${newSearchParams.toString()}`, { replace: true });
              }
            }
          }, [location.search, currentUserId, handleOpenChat, navigate, location.pathname]);
    };
    
    const LoadingState = ({ message = "Verifying user session..." }) => (
        <div className="container mx-auto py-12 px-4 md:px-6 min-h-[calc(100vh-180px)] flex flex-col items-center justify-center text-center">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground dark:text-slate-300">{message}</p>
            <p className="text-sm text-muted-foreground dark:text-slate-400">Please wait a moment.</p>
        </div>
    );

    const MyShipmentsPage = () => {
      const { session, loading: isLoadingUser } = useAuth();
      const currentUserId = session?.user?.id;
      
      const {
        sentContracts,
        carryingContracts,
        isLoading: isLoadingContracts,
      } = useUserContracts(currentUserId);

      const navigate = useNavigate();
      const location = useLocation();
      const { toast } = useToast();

      const {
        isChatOpen,
        currentChatInfo,
        handleOpenChat,
        setIsChatOpen,
      } = useChatManager(currentUserId);
      
      useAuthGuardMyShipments(currentUserId, isLoadingUser, navigate, location, toast);
      useChatRedirectHandler(location, currentUserId, handleOpenChat, navigate);
      
      if (isLoadingUser) {
        return <LoadingState message="Verifying user session..." />;
      }
      
      return (
        <>
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={{ duration: 0.5 }}
            className="container mx-auto py-12 px-4 md:px-6 min-h-[calc(100vh-180px)]"
          >
            <MyShipmentsHeader />
            <MyShipmentsTabs
              sentContracts={sentContracts}
              carryingContracts={carryingContracts}
              onOpenChat={handleOpenChat}
              isLoading={isLoadingContracts}
            />
          </motion.div>

          <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
            <DialogContent className="max-w-2xl h-[calc(100vh-4rem)] sm:h-[80vh] p-0 gap-0 flex flex-col">
              <div className="flex-grow overflow-y-auto">
                {currentChatInfo.conversationId && currentUserId && (
                  <ChatInterface
                    conversationId={currentChatInfo.conversationId}
                    currentUserId={currentUserId}
                    otherUserId={currentChatInfo.otherUserId}
                    listingId={currentChatInfo.listingId}
                    otherUserName={currentChatInfo.otherUserName}
                    initialItemDescription={currentChatInfo.itemDescription}
                  />
                )}
              </div>
            </DialogContent>
          </Dialog>
        </>
      );
    };

    export default MyShipmentsPage;