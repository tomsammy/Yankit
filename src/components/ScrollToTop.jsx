import React, { useEffect } from 'react';
    import { useLocation } from 'react-router-dom';

    const ScrollToTop = () => {
      const { pathname, state } = useLocation();

      useEffect(() => {
        if (state?.preventScrollToTop) {
          return;
        }
        
        try {
          window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth' 
          });
        } catch (error) {
          window.scrollTo(0, 0);
        }
      }, [pathname, state]); 

      return null; 
    };

    export default ScrollToTop;