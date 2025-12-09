import React from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Link } from 'react-router-dom';
    import { Sparkles } from 'lucide-react';

    const CallToActionSection = () => {
      return (
        <section className="py-16 md:py-24 bg-gradient-to-tr from-primary via-blue-600 to-purple-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
            >
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
                Ready to Experience Smarter Shipping with <span className="font-vernaccia-bold">Yankit</span>?
              </h2>
              <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                Join our community today! Whether you're looking to send a package affordably or earn by utilizing your travel space, <span className="font-vernaccia-bold">Yankit</span> makes it easy.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" asChild className="w-full sm:w-auto bg-white text-primary hover:bg-slate-100 shadow-lg px-8 py-3 text-base font-semibold">
                    <Link to="/signup">
                      Sign Up Now
                    </Link>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="lg" asChild className="w-full sm:w-auto bg-transparent border-2 border-white/80 text-white hover:bg-white/10 hover:text-white shadow-lg px-8 py-3 text-base">
                    <Link to="/how-it-works">
                      Learn More
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      );
    };

    export default CallToActionSection;