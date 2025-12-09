import React, { useState, useEffect, useCallback, useMemo } from 'react';
    import { supabase } from '@/lib/customSupabaseClient';
    import { useToast } from '@/components/ui/use-toast';
    import { AlertTriangle } from 'lucide-react';
    import ChatHeader from './ChatHeader';
    import MessageList from './MessageList';
    import MessageInput from './MessageInput';
    import ContractControls from './ContractControls';
    import useOptimisticMessages from './hooks/useOptimisticMessages';
    import useContractHandler from './hooks/useContractHandler';
    import useSupabaseSubscription from './hooks/useSupabaseSubscription';

    const ChatInterface = ({ conversationId, currentUserId, otherUserId, listingId, otherUserName, isBaggageShippingChat }) => {
      const [messages, setMessages, addOptimisticMessage, revertOptimisticMessage, confirmOptimisticMessage] = useOptimisticMessages([]);
      const [newMessage, setNewMessage] = useState('');
      const [isLoadingMessages, setIsLoadingMessages] = useState(true);
      const [isSending, setIsSending] = useState(false);
      const { toast } = useToast();

      const {
        contract,
        setContract,
      } = useContractHandler({ 
        conversationId: isBaggageShippingChat ? conversationId : null,
        currentUserId, 
        otherUserId, 
        listingId, 
        toast 
      });

      const fetchMessages = useCallback(async () => {
        if (!conversationId) {
          setIsLoadingMessages(false);
          return;
        }
        setIsLoadingMessages(true);
        try {
          const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conversationId)
            .order('created_at', { ascending: true });
      
          if (error) throw error;
          setMessages(data || []);
        } catch (error) {
          console.error('Error fetching messages:', error);
          toast({ title: 'Error', description: 'Could not load messages.', variant: 'destructive' });
        } finally {
          setIsLoadingMessages(false);
        }
      }, [conversationId, toast, setMessages]);

      useEffect(() => {
        fetchMessages();
      }, [fetchMessages]);

      const handleNewMessagePayload = useCallback((payload) => {
        setMessages((prevMessages) => {
          if (!prevMessages.find(msg => msg.id === payload.new.id)) {
            return [...prevMessages, payload.new];
          }
          return prevMessages;
        });
      }, [setMessages]);

      const handleContractUpdatePayload = useCallback((payload) => {
        if (isBaggageShippingChat) {
          setContract(payload.new);
        }
      }, [setContract, isBaggageShippingChat]);

      const messageSubscriptionConfig = useMemo(() => ({
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
        callback: handleNewMessagePayload,
      }), [conversationId, handleNewMessagePayload]);

      const contractSubscriptionConfig = useMemo(() => (isBaggageShippingChat ? {
        table: 'contracts',
        filter: `conversation_id=eq.${conversationId}`,
        callback: handleContractUpdatePayload,
      } : null), [conversationId, handleContractUpdatePayload, isBaggageShippingChat]);
      
      const subscriptions = useMemo(() => {
        const subs = [messageSubscriptionConfig];
        if (contractSubscriptionConfig) {
          subs.push(contractSubscriptionConfig);
        }
        return subs;
      }, [messageSubscriptionConfig, contractSubscriptionConfig]);

      useSupabaseSubscription(conversationId ? subscriptions : []);

      const handleSendMessage = async (content, type = 'text') => {
        if (!content.trim() || !conversationId || !currentUserId || !otherUserId) return;
    
        setIsSending(true);
        const tempId = addOptimisticMessage({
          conversation_id: conversationId,
          sender_user_id: currentUserId,
          receiver_user_id: otherUserId,
          content: content.trim(),
        });
        
        if (type === 'text') setNewMessage('');

        try {
          const { data, error } = await supabase.from('messages').insert({
            conversation_id: conversationId,
            sender_user_id: currentUserId,
            receiver_user_id: otherUserId,
            content: content.trim(),
          }).select().single();
      
          if (error) throw error;
          confirmOptimisticMessage(tempId, data);
        } catch (error) {
          console.error('Error sending message:', error);
          toast({ title: 'Error', description: 'Could not send message.', variant: 'destructive' });
          revertOptimisticMessage(tempId);
        } finally {
          setIsSending(false);
        }
      };
      
      const handleTextSubmit = (e) => {
        e.preventDefault();
        handleSendMessage(newMessage, 'text');
      };
      
      const handleSystemMessage = (messageContent) => {
        handleSendMessage(messageContent, 'system');
      };

      if (!conversationId && !isLoadingMessages) {
        return (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <AlertTriangle className="w-12 h-12 text-yellow-500 mb-4" />
            <p className="text-lg font-medium text-muted-foreground">No conversation selected.</p>
            <p className="text-sm text-muted-foreground">Please select or start a conversation to view messages.</p>
          </div>
        );
      }
      
      return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-800 rounded-lg shadow-inner overflow-hidden">
          <ChatHeader otherUserName={otherUserName} />
          {isBaggageShippingChat && (
            <ContractControls
              contract={contract}
              currentUserId={currentUserId}
              onContractUpdate={setContract}
              onSendMessage={handleSystemMessage}
              conversationId={conversationId}
              listingId={listingId}
              travelerUserId={contract?.traveler_user_id || otherUserId}
              senderUserId={contract?.sender_user_id || currentUserId}
            />
          )}
          <MessageList 
            messages={messages} 
            currentUserId={currentUserId} 
            isLoading={isLoadingMessages} 
          />
          <MessageInput 
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            handleSendMessage={handleTextSubmit}
            isSending={isSending}
          />
        </div>
      );
    };
    
    ChatInterface.defaultProps = {
      isBaggageShippingChat: true,
    };

    export default ChatInterface;