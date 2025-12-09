import React from 'react';
import { Link } from 'react-router-dom';

// Unified Logo URL
const YANKIT_LOGO_URL = "https://horizons-cdn.hostinger.com/d12faae7-6d4e-43e9-a404-0bda323ca6da/b45b7dddca7d4c0267c9efe2a42ca292.png";

const Logo = ({ onClick, isMobile = false, isFooter = false }) => {
  let className = "h-[88px] w-auto"; // Default for Desktop Header
  if (isMobile) {
    className = "h-[59px] w-auto"; // For Mobile Header/Sheet
  } else if (isFooter) {
    className = "h-[74px] w-auto"; // For Footer
  }

  const handleLogoClick = (e) => {
    window.scrollTo(0, 0); // Scroll to top
    if (onClick) {
      onClick(e); // Call original onClick if provided
    }
  };

  return (
    <Link to="/" className="flex items-center" onClick={handleLogoClick}>
      <img 
        src={YANKIT_LOGO_URL} 
        alt={`Yankit Logo${isMobile ? ' Mobile' : ''}${isFooter ? ' Footer' : ''}`} 
        className={className} 
      />
    </Link>
  );
};
Logo.displayName = 'Logo';

export default Logo;