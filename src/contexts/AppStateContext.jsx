import React, { createContext, useState, useEffect, useContext } from 'react';

    const AppStateContext = createContext(null);

    export const AppStateProvider = ({ children }) => {
      const [showChatbot, setShowChatbot] = useState(false);

      useEffect(() => {
        const timer = setTimeout(() => setShowChatbot(true), 2000);
        return () => clearTimeout(timer);
      }, []);

      return (
        <AppStateContext.Provider value={{ showChatbot, setShowChatbot }}>
          {children}
        </AppStateContext.Provider>
      );
    };

    export const useAppState = () => {
      const context = useContext(AppStateContext);
      if (context === undefined) {
        throw new Error('useAppState must be used within an AppStateProvider');
      }
      return context;
    };