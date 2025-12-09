import React from 'react';
    import Header from '@/components/Header/Header';
    import Footer from '@/components/Footer';
    import Chatbot from '@/components/chatbot/Chatbot';

    const PageLayout = ({ children, session, showChatbot }) => {
      return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-sky-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-blue-950 dark:to-slate-800">
          <Header session={session} />
          <main className="flex-grow pb-16 md:pb-0">
            {children}
          </main>
          <Footer />
          {showChatbot && <Chatbot />}
        </div>
      );
    };

    export default PageLayout;