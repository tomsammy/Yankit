import React from 'react';
    import { motion } from 'framer-motion';
    import { ArrowLeft } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { useNavigate } from 'react-router-dom';

    const StaticPageLayout = ({ title, children, icon: Icon }) => {
      const navigate = useNavigate();
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 py-8 md:py-16 min-h-[calc(100vh-var(--header-height,100px)-var(--footer-height,80px))]"
        >
          <div className="max-w-4xl mx-auto">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)} 
              className="mb-6 text-primary hover:text-primary/80 dark:text-secondary dark:hover:text-secondary/80"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back
            </Button>
            <header className="mb-8 md:mb-12 text-center border-b pb-6 border-slate-200 dark:border-slate-700">
              {Icon && (
                <Icon className="w-16 h-16 text-primary dark:text-secondary mx-auto mb-4" />
              )}
              <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-secondary">
                {title}
              </h1>
            </header>
            <article className="prose prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
              {children}
            </article>
          </div>
        </motion.div>
      );
    };

    export default StaticPageLayout;