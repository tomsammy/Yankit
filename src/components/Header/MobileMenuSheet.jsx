import React from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';
import AuthButtons from './AuthButtons'; 
import { MobileNavItem } from './Navigation';

const MobileMenuSheet = ({ isOpen, onOpenChange, links, closeMobileMenu }) => (
  <Sheet open={isOpen} onOpenChange={onOpenChange}>
    <SheetTrigger asChild>
      <Button variant="ghost" size="icon" aria-label="Open menu" className="text-blue-100 dark:text-sky-200 hover:bg-white/10 dark:hover:bg-blue-600/50">
        <Menu className="h-6 w-6" />
      </Button>
    </SheetTrigger>
    <SheetContent side="right" className="w-[300px] sm:w-[340px] bg-white dark:bg-slate-800 p-0 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
         <Logo onClick={closeMobileMenu} isMobile={true} />
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
         <AuthButtons />
      </div>
    </SheetContent>
  </Sheet>
);
MobileMenuSheet.displayName = 'MobileMenuSheet';

export default MobileMenuSheet;