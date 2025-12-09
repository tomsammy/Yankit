import React, { useEffect } from 'react';
    import { useLocation } from 'react-router-dom';

    const ScrollToTop = () => {
      const { pathname, state } = useLocation();

      useEffect(() => {
        // Only scroll to top if it's a new page navigation,
        // not just a state change on the same page (e.g., modal opening)
        // or if explicitly told not to scroll (though not implemented here, could be a state prop)
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
          // Fallback for older browsers
          window.scrollTo(0, 0);
        }
      }, [pathname, state]); // Rerun effect when pathname or state changes

      return null; 
    };

    export default ScrollToTop;