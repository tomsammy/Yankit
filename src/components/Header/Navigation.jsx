import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SheetClose } from '@/components/ui/sheet';

const DesktopNavItem = ({ path, name, icon: Icon }) => (
  <motion.div whileHover={{ y: -2 }}>
    <NavLink
      to={path}
      className={({ isActive }) =>
        `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out
             ${isActive 
               ? 'bg-white/20 text-white dark:bg-blue-500/30 dark:text-sky-300' 
               : 'text-blue-100 hover:bg-white/10 dark:text-sky-200 dark:hover:bg-blue-600/50'
             }`
      }
    >
      {Icon && <Icon className="w-5 h-5 mr-2" />}
      {name}
    </NavLink>
  </motion.div>
);
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
     onClick={onClick}
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

export { DesktopNavigation, MobileNavItem };