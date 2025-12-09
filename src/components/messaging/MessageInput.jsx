import React from 'react';
    import { Input } from '@/components/ui/input';
    import { Button } from '@/components/ui/button';
    import { Paperclip, Send, Loader2 } from 'lucide-react';
    import { motion } from 'framer-motion';

    const MessageInput = ({ newMessage, setNewMessage, handleSendMessage, isSending }) => {
      return (
        <motion.form 
          onSubmit={handleSendMessage} 
          className="p-3 border-t border-slate-200 dark:border-slate-700 flex items-center space-x-2 bg-white dark:bg-slate-800 sticky bottom-0"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground dark:text-slate-400 hover:text-primary"
            asChild
          >
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Paperclip className="w-5 h-5" />
            </motion.div>
          </Button>
          <Input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow bg-slate-100 dark:bg-slate-700 border-transparent focus:border-primary focus:ring-primary"
            disabled={isSending}
          />
          <Button type="submit" size="icon" disabled={isSending || !newMessage.trim()} asChild>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </motion.div>
          </Button>
        </motion.form>
      );
    };

    export default MessageInput;