import React from 'react';
import { useLocation } from 'react-router-dom';
import SendABagPage from '@/pages/send-a-bag/SendABagPage';
import YankABagNowPage from '@/pages/yank-a-bag-now/YankABagNowPage';

const BaggageActionsPage = () => {
    const location = useLocation();

    if (location.pathname === '/send-a-bag') {
        return <SendABagPage />;
    }

    if (location.pathname === '/yank-a-bag-now') {
        return <YankABagNowPage />;
    }

    // Fallback or loading state if needed
    return <div>Loading page...</div>;
};

export default BaggageActionsPage;