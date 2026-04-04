import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Home, Briefcase, Send, LifeBuoy } from "lucide-react";
import { DesktopNavigation } from "./Navigation";
import AuthButtons from "./AuthButtons";
import ThemeToggleButton from "./ThemeToggleButton";
import MobileMenuSheet from "./MobileMenuSheet";

const navLinks = [
  { path: "/", name: "Home", icon: Home },
  { path: "/yank-a-bag", name: "Yank a Bag", icon: Briefcase },
  { path: "/list-baggage", name: "List Bagggage", icon: Send },
  { path: "/support", name: "Support", icon: LifeBuoy },
];

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-gradient-to-r from-blue-700 via-blue-800 to-slate-900 dark:from-slate-900 dark:via-blue-900 dark:to-black shadow-md text-white">
      <div className="container flex h-24 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center">
            <img src="./logo.png" alt="Baggit Logo" className="w-1/3" />
          </Link>
          <DesktopNavigation links={navLinks} />
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            <AuthButtons />
            {/* <ThemeToggleButton /> */}
          </div>
          <div className="md:hidden">
            <MobileMenuSheet
              isOpen={isMobileMenuOpen}
              onOpenChange={setIsMobileMenuOpen}
              links={navLinks}
              closeMobileMenu={closeMobileMenu}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
