import { useState, useCallback } from 'react';

    const useOptimisticMessages = (initialMessages = []) => {
      const [messages, setMessages] = useState(initialMessages);

      const addOptimisticMessage = useCallback((messageData) => {
        const tempId = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const optimisticMessage = {
          ...messageData,
          id: tempId,
          created_at: new Date().toISOString(),
          status: 'sending', 
        };
        setMessages(prev => [...prev, optimisticMessage]);
        return tempId;
      }, []);

      const revertOptimisticMessage = useCallback((tempId) => {
        setMessages(prev => prev.filter(msg => msg.id !== tempId));
      }, []);

      const confirmOptimisticMessage = useCallback((tempId, confirmedMessage) => {
        setMessages(prev => prev.map(msg => (msg.id === tempId ? { ...confirmedMessage, status: 'sent' } : msg)));
      }, []);
      
      const setExternalMessages = useCallback((newMessages) => {
        setMessages(newMessages);
      }, []);


      return [messages, setExternalMessages, addOptimisticMessage, revertOptimisticMessage, confirmOptimisticMessage];
    };

    export default useOptimisticMessages;