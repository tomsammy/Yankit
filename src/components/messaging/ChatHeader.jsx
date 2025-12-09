import React from 'react';
    import { motion } from 'framer-motion';

    const ChatHeader = ({ otherUserName }) => {
      return (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-slate-50 dark:bg-slate-800 z-10"
        >
          <h3 className="font-semibold text-lg text-foreground dark:text-slate-100">
            Chat {otherUserName ? `with ${otherUserName}` : ''}
          </h3>
          {/* Placeholder for other user's online status or more info */}
        </motion.div>
      );
    };

    export default ChatHeader;