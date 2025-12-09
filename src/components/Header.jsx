import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Menu, X, Sun, Moon, LogIn, UserPlus, Send, Briefcase, Home, Info, LayoutDashboard, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import Logo from '@/components/Header/Logo'; // Use the unified Logo component

const navLinks = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Yank a Bag', path: '/yank-a-bag-now', icon: Briefcase },
  { name: 'Send a Bag', path: '/send-a-bag', icon: Send },
  { name: 'Support', path: '/support', icon: Info },
];

const ThemeToggleButton = ({ isDarkMode, toggleTheme }) => (
  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme} 
      aria-label="Toggle theme" 
      className="text-blue-100 dark:text-sky-200 hover:bg-white/10 dark:hover:bg-blue-600/50"
    >
      {isDarkMode ? <Sun className="h-5 w-5 text-yellow-300" /> : <Moon className="h-5 w-5 text-white" />}
    </Button>
  </motion.div>
);
ThemeToggleButton.displayName = 'ThemeToggleButton';

const AuthButtonsDesktop = ({ session, handleSignOut }) => (
  <>
    {session ? (
      <>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant="outline" size="sm" asChild className="border-white/50 text-white hover:bg-white/20 dark:border-sky-300/50 dark:text-sky-200 dark:hover:bg-sky-400/30">
            <Link to="/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard</Link>
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button size="sm" onClick={handleSignOut} className="bg-gradient-to-r from-red-500 to-pink-500 hover:opacity-90 text-white">
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </motion.div>
      </>
    ) : (
      <>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant="ghost" size="sm" asChild className="text-white hover:bg-white/20 dark:text-sky-200 dark:hover:bg-sky-400/30">
            <Link to="/signin"><LogIn className="mr-2 h-4 w-4" /> Sign In</Link>
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button size="sm" asChild className="bg-gradient-to-r from-sky-400 to-cyan-400 hover:opacity-90 text-primary-foreground dark:from-sky-500 dark:to-cyan-500">
            <Link to="/signup"><UserPlus className="mr-2 h-4 w-4" /> Sign Up</Link>
          </Button>
        </motion.div>
      </>
    )}
  </>
);
AuthButtonsDesktop.displayName = 'AuthButtonsDesktop';

const AuthButtonsMobile = ({ session, handleSignOut }) => (
   <>
    {session ? (
      <>
        <SheetClose asChild>
          <Button variant="outline" className="w-full border-primary/50 text-primary hover:bg-primary/10 dark:border-blue-400/50 dark:text-blue-300 dark:hover:bg-blue-500/20 dark:hover:text-blue-200" asChild>
            <Link to="/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard</Link>
          </Button>
        </SheetClose>
        <SheetClose asChild>
          <Button onClick={handleSignOut} className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:opacity-90 text-white">
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </SheetClose>
      </>
    ) : (
      <>
        <SheetClose asChild>
         <Button variant="outline" className="w-full border-primary/50 text-primary hover:bg-primary/10 dark:border-blue-400/50 dark:text-blue-300 dark:hover:bg-blue-500/20 dark:hover:text-blue-200" asChild>
           <Link to="/signin"><LogIn className="mr-2 h-4 w-4" /> Sign In</Link>
         </Button>
        </SheetClose>
        <SheetClose asChild>
         <Button className="w-full bg-gradient-to-r from-primary to-blue-600 hover:opacity-90 text-white dark:from-blue-500 dark:to-sky-600" asChild>
           <Link to="/signup"><UserPlus className="mr-2 h-4 w-4" /> Sign Up</Link>
         </Button>
        </SheetClose>
      </>
    )}
   </>
);
AuthButtonsMobile.displayName = 'AuthButtonsMobile';

const DesktopNavItem = ({ path, name, icon: Icon }) => {
  const handleClick = () => {
    if (path === '/') {
      window.scrollTo(0, 0);
    }
  };
  return (
    <motion.div whileHover={{ y: -2 }}>
      <NavLink
        to={path}
        onClick={handleClick}
        className={({ isActive }) =>
          `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out
           ${isActive 
             ? 'bg-white/20 text-white dark:bg-blue-500/30 dark:text-sky-300' 
             : 'text-blue-100 hover:bg-white/10 dark:text-sky-200 dark:hover:bg-blue-600/50'
           }`
        }
      >
        <Icon className="w-5 h-5 mr-2" />
        {name}
      </NavLink>
    </motion.div>
  );
};
DesktopNavItem.displayName = 'DesktopNavItem';

const DesktopNavigation = ({ links }) => (
  <nav className="hidden md:flex space-x-2 items-center">
    {links.map(link => (
      <DesktopNavItem key={link.name} path={link.path} name={link.name} icon={link.icon} />
    ))}
  </nav>
);
DesktopNavigation.displayName = 'DesktopNavigation';

const MobileNavItem = ({ path, name, icon: Icon, onClick }) => (
  <SheetClose asChild>
   <NavLink
     to={path}
     onClick={() => {
       onClick();
       if (path === '/') {
         window.scrollTo(0, 0);
       }
     }}
     className={({ isActive }) => 
       `flex items-center px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ease-in-out group ${isActive 
          ? 'bg-gradient-to-r from-primary/10 to-blue-500/10 text-primary dark:from-blue-600/20 dark:to-sky-600/20 dark:text-blue-300 shadow-inner' 
          : 'text-slate-700 hover:bg-slate-100/70 dark:text-slate-200 dark:hover:bg-slate-700/60 transform hover:translate-x-1'
        }`
     }
   >
     {({ isActive }) => ( 
       <>
         <Icon className={`w-6 h-6 mr-3 transition-colors duration-200 ${isActive ? 'text-primary dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 group-hover:text-primary dark:group-hover:text-blue-400'}`} />
         <span className="flex-grow">{name}</span>
         {isActive && <motion.div layoutId="activeMobileLinkIndicator" className="w-1 h-6 bg-primary dark:bg-blue-500 rounded-full" />}
       </>
     )}
   </NavLink>
  </SheetClose>
);
MobileNavItem.displayName = 'MobileNavItem';

const MobileMenuSheet = ({ isOpen, onOpenChange, links, session, handleSignOut, closeMobileMenu }) => (
  <Sheet open={isOpen} onOpenChange={onOpenChange}>
    <SheetTrigger asChild>
      <Button variant="ghost" size="icon" aria-label="Open menu" className="text-blue-100 dark:text-sky-200 hover:bg-white/10 dark:hover:bg-blue-600/50">
        <Menu className="h-6 w-6" />
      </Button>
    </SheetTrigger>
    <SheetContent side="right" className="w-[300px] sm:w-[340px] bg-white dark:bg-slate-800 p-0 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
         <Logo isMobile={true} onClick={closeMobileMenu} /> {/* Use unified Logo with isMobile prop */}
        <SheetClose asChild>
          <Button variant="ghost" size="icon" className="text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
            <X className="h-6 w-6" />
          </Button>
        </SheetClose>
      </div>
      
      <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
        {links.map(link => (
          <MobileNavItem key={link.name} path={link.path} name={link.name} icon={link.icon} onClick={closeMobileMenu} />
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
         <AuthButtonsMobile session={session} handleSignOut={handleSignOut} />
      </div>
    </SheetContent>
  </Sheet>
);
MobileMenuSheet.displayName = 'MobileMenuSheet';

const Header = ({ session }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const location = useLocation(); 
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  
  const handleSignOut = async () => {
    closeMobileMenu();
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: 'Error Signing Out',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Signed Out',
        description: 'You have been successfully signed out.',
      });
      navigate('/signin'); 
    }
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      className="sticky top-0 z-50 bg-primary dark:bg-blue-700 backdrop-blur-md shadow-lg"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-24 md:h-28">
          <Logo onClick={() => { closeMobileMenu(); window.scrollTo(0, 0); }} /> {/* Use unified Logo */}
          <DesktopNavigation links={navLinks} />

          <div className="hidden md:flex items-center space-x-3">
            <ThemeToggleButton isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            <AuthButtonsDesktop session={session} handleSignOut={handleSignOut} />
          </div>

          <div className="md:hidden flex items-center">
            <ThemeToggleButton isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            <MobileMenuSheet 
                isOpen={isMobileMenuOpen} 
                onOpenChange={setIsMobileMenuOpen}
                links={navLinks}
                session={session}
                handleSignOut={handleSignOut}
                closeMobileMenu={closeMobileMenu}
            />
          </div>
        </div>
      </div>
      <AnimatePresence>
        {location.pathname !== "/" && ( 
          <motion.div
            layoutId="activeLinkIndicator" 
            className="h-0.5 bg-gradient-to-r from-sky-300 via-cyan-300 to-teal-300 dark:from-sky-400 dark:via-cyan-400 dark:to-teal-400"
            initial={false} 
            animate={{
              width: navLinks.some(link => link.path === location.pathname && link.path !== "/") ? '100%' : '0%',
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;