import React, { useEffect, useRef } from 'react';
    import { useLocation } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
    import { BookOpen, MapPin } from 'lucide-react';
    import { africanAnecdotesData, customAnecdoteImages, defaultAnecdoteImage } from '@/data/anecdoteAssets'; 


    const AfricanAnecdotesPage = () => {
      const location = useLocation();
      const { currentAnecdoteId } = location.state || { currentAnecdoteId: africanAnecdotesData[0]?.id };
      const anecdotes = africanAnecdotesData;
      const currentAnecdoteRef = useRef(null);

      useEffect(() => {
        if (currentAnecdoteId && currentAnecdoteRef.current) {
          setTimeout(() => {
            currentAnecdoteRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 100);
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, [currentAnecdoteId]);
      
      const pageVariants = {
        initial: { opacity: 0 },
        in: { opacity: 1, transition: { staggerChildren: 0.1, duration: 0.5 } },
        out: { opacity: 0 }
      };

      const anecdoteVariants = {
        initial: { opacity: 0, y: 50, scale: 0.95 },
        in: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, duration: 0.8 } }
      };

      return (
        <motion.div
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          className="container mx-auto py-12 px-4 md:px-6 min-h-[calc(100vh-120px)]"
        >
          <motion.div 
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, type: "spring" }}
          >
            <BookOpen className="w-16 h-16 md:w-20 md:h-20 text-primary mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-secondary mb-3">
              African Anecdotes & Wisdom
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground dark:text-slate-300 max-w-3xl mx-auto">
              Discover timeless stories and profound wisdom passed down through generations across the African continent.
            </p>
          </motion.div>

          <div className="space-y-12 md:space-y-16">
            {anecdotes.map((item) => (
              <motion.div
                key={item.id}
                ref={item.id === currentAnecdoteId ? currentAnecdoteRef : null}
                variants={anecdoteVariants}
              >
                <Card className={`overflow-hidden shadow-2xl hover:shadow-2xl transition-all duration-300 glassmorphism ${item.bgColor || 'bg-card'} border ${item.borderColor || 'border-border'} dark:bg-slate-800/50 flex flex-col md:flex-row items-stretch`}>
                  <div className="w-full md:w-2/5 lg:w-1/3 h-72 md:h-auto overflow-hidden relative">
                    <img  
                      alt={item.title} 
                      className="absolute inset-0 w-full h-full object-cover md:rounded-l-lg md:rounded-r-none"
                      src={customAnecdoteImages[item.imageKey] || defaultAnecdoteImage} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 md:bg-gradient-to-r md:from-black/30 md:to-transparent"></div>
                  </div>
                  <div className="w-full md:w-3/5 lg:w-2/3 flex flex-col">
                    <CardHeader className="p-6 md:p-8">
                      <div className="flex items-start mb-3">
                          <div className="p-2.5 bg-primary/10 dark:bg-secondary/20 rounded-lg mr-4 mt-1 shrink-0">
                            <item.Icon size={28} className="text-primary dark:text-secondary" strokeWidth={2}/>
                          </div>
                          <div>
                              <CardTitle className="text-2xl md:text-3xl font-bold text-foreground dark:text-white leading-tight">{item.title}</CardTitle>
                              <CardDescription className="text-sm text-primary dark:text-secondary flex items-center mt-1 font-medium">
                                <MapPin size={14} className="mr-1.5"/> {item.region}
                              </CardDescription>
                          </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 md:p-8 pt-0 flex-grow">
                      <p className="text-base text-muted-foreground dark:text-gray-300 leading-relaxed whitespace-pre-line selection:bg-primary/20 dark:selection:bg-secondary/20">
                        {item.anecdote}
                      </p>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      );
    };

    export default AfricanAnecdotesPage;