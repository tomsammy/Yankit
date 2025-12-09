import React from 'react';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer';
import Chatbot from '@/components/chatbot/Chatbot';

const PageLayout = ({ children, showChatbot = false }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <Footer />
      {showChatbot && <Chatbot />}
    </div>
  );
};
PageLayout.displayName = 'PageLayout';

export default PageLayout;