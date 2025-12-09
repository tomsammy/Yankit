import React, { useEffect, useRef } from 'react';
    import { ScrollArea } from '@/components/ui/scroll-area';
    import { motion, AnimatePresence } from 'framer-motion';
    import { Smile, Loader2 } from 'lucide-react';

    const MessageBubble = React.memo(({ message, isCurrentUser }) => {
      const bubbleClasses = isCurrentUser
        ? 'bg-primary text-primary-foreground self-end rounded-l-xl rounded-tr-xl'
        : 'bg-slate-200 dark:bg-slate-700 text-foreground dark:text-slate-100 self-start rounded-r-xl rounded-tl-xl';
      const textAlign = isCurrentUser ? 'text-right' : 'text-left';

      return (
        <motion.div
          layout
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className={`max-w-[70%] p-3 my-1 shadow ${bubbleClasses}`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          <p className={`text-xs mt-1 opacity-70 ${textAlign}`}>
            {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </motion.div>
      );
    });
    MessageBubble.displayName = 'MessageBubble';

    const MessageList = ({ messages, currentUserId, isLoading }) => {
      const scrollAreaRef = useRef(null);
      const messagesEndRef = useRef(null);

      const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      };

      useEffect(() => {
        scrollToBottom();
      }, [messages]);
      
      if (isLoading) {
        return (
          <div className="flex-grow flex justify-center items-center p-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        );
      }

      return (
        <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
          <div className="flex flex-col space-y-2">
            <AnimatePresence>
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} isCurrentUser={msg.sender_user_id === currentUserId} />
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
            {messages.length === 0 && !isLoading && (
              <div className="text-center text-muted-foreground dark:text-slate-400 py-10">
                <Smile className="w-10 h-10 mx-auto mb-2 opacity-50" />
                No messages yet. Start the conversation!
              </div>
            )}
          </div>
        </ScrollArea>
      );
    };

    export default MessageList;