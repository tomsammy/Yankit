import { useState } from 'react';
    import { supabase } from '@/lib/supabaseClient';
    import { useToast } from '@/components/ui/use-toast';

    const useChatManager = (currentUserId) => {
      const [isChatOpen, setIsChatOpen] = useState(false);
      const [currentChatInfo, setCurrentChatInfo] = useState({
        conversationId: null,
        otherUserId: null,
        listingId: null,
        otherUserName: null,
      });
      const { toast } = useToast();

      const handleOpenChat = async (conversationId, otherUserId, listingId, otherUserName) => {
        let convId = conversationId;

        if (!convId && listingId && otherUserId) {
          try {
            const { data: existingConv, error: findError } = await supabase
              .from('conversations')
              .select('id')
              .or(`(sender_user_id.eq.${currentUserId},traveler_user_id.eq.${otherUserId}),(sender_user_id.eq.${otherUserId},traveler_user_id.eq.${currentUserId})`)
              .eq('listing_id', listingId)
              .maybeSingle();

            if (findError) throw findError;

            if (existingConv) {
              convId = existingConv.id;
            } else {
              const { data: newConv, error: createError } = await supabase
                .from('conversations')
                .insert({
                  sender_user_id: currentUserId,
                  traveler_user_id: otherUserId,
                  listing_id: listingId,
                })
                .select('id')
                .single();

              if (createError) throw createError;
              convId = newConv.id;
            }
          } catch (error) {
            console.error("Error managing conversation:", error);
            toast({ title: "Error", description: `Could not ${conversationId ? 'open' : 'initiate'} chat. Please try again.`, variant: "destructive" });
            return;
          }
        } else if (!convId && (!listingId || !otherUserId)) {
           // This case might happen if onOpenChat is called with partial data from somewhere unexpected
           console.warn("Attempted to open chat without sufficient information (listingId or otherUserId missing and no conversationId).");
           toast({ title: "Chat Error", description: "Cannot open chat due to missing information.", variant: "destructive" });
           return;
        }


        setCurrentChatInfo({ conversationId: convId, otherUserId, listingId, otherUserName });
        setIsChatOpen(true);
      };
      
      const handleCloseChat = () => {
        setIsChatOpen(false);
        setCurrentChatInfo({ conversationId: null, otherUserId: null, listingId: null, otherUserName: null });
      };

      return {
        isChatOpen,
        currentChatInfo,
        handleOpenChat,
        handleCloseChat,
        setIsChatOpen, // Exposing this directly for more control if needed by Dialog
      };
    };

    export default useChatManager;