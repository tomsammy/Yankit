import React from 'react';
import { motion } from 'framer-motion';
import { Globe, ShieldCheck, Tag, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'Access thousands of destinations worldwide with our extensive network of airline partners.',
  },
  {
    icon: Tag,
    title: 'Best Price Guarantee',
    description: 'We search millions of fares to find you the most competitive prices for your trip.',
  },
  {
    icon: Zap,
    title: 'Instant Booking',
    description: 'A fast, seamless, and secure booking process gets you on your way in minutes.',
  },
  {
    icon: ShieldCheck,
    title: 'Yankit Integrated',
    description: 'Easily coordinate your flight with baggage listings to earn money while you travel.',
  },
];

const WhyBookWithYankit = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary dark:text-white">
            Why Book with <span className="font-vernaccia-bold">Yankit</span>?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            We're more than just a flight search engine. We're your partner in smarter travel.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full text-center bg-white dark:bg-slate-800/50 border-transparent shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground dark:text-white">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyBookWithYankit;