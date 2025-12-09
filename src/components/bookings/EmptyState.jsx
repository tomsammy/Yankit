import React from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Link } from 'react-router-dom';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { ExternalLink } from 'lucide-react';

    const EmptyState = ({ title, description, buttonText, buttonLink, Icon }) => (
         <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="text-center"
          >
            <Card className="max-w-md mx-auto p-8 shadow-lg glassmorphism border-slate-300/50 dark:border-slate-700/50 dark:bg-slate-800/40">
              <CardHeader className="p-0 mb-4">
                <Icon className="w-12 h-12 text-primary dark:text-secondary mx-auto mb-3" />
                <CardTitle className="text-2xl font-semibold text-foreground dark:text-white">{title}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <CardDescription className="text-muted-foreground dark:text-slate-300 mb-6">
                  {description}
                </CardDescription>
                {buttonLink && buttonText && (
                  <Link to={buttonLink}>
                    <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white dark:to-secondary">
                      <ExternalLink className="mr-2 h-5 w-5" /> {buttonText}
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </motion.div>
    );
    
    export default EmptyState;