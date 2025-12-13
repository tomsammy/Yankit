import React from 'react';
import { Link } from 'react-router-dom';

const YANKIT_LOGO_URL = "https://horizons-cdn.hostinger.com/d12faae7-6d4e-43e9-a404-0bda323ca6da/b45b7dddca7d4c0267c9efe2a42ca292.png";

const Logo = ({ onClick, isMobile = false, isFooter = false }) => {
  let className = "h-[88px] w-auto"; 
  if (isMobile) {
    className = "h-[59px] w-auto";
  } else if (isFooter) {
    className = "h-[74px] w-auto"; 
  }

  const handleLogoClick = (e) => {
    window.scrollTo(0, 0); 
    if (onClick) {
      onClick(e); 
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