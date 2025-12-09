import React from 'react';
    import { motion } from 'framer-motion';
    import { DollarSign, Globe, Lock, Users, Zap, ShieldCheck } from 'lucide-react';

    const features = [
      {
        icon: <DollarSign className="w-10 h-10 text-primary mb-4" />,
        title: "Cost-Effective Shipping",
        description: "Save significantly on international shipping costs by utilizing unused baggage space.",
      },
      {
        icon: <Globe className="w-10 h-10 text-primary mb-4" />,
        title: "Global Reach",
        description: "Connect with a vast network of travelers going to numerous destinations worldwide.",
      },
      {
        icon: <ShieldCheck className="w-10 h-10 text-primary mb-4" />,
        title: "Secure & Trusted",
        description: "Verified users and transparent processes ensure peace of mind for both shippers and travelers.",
      },
      {
        icon: <Users className="w-10 h-10 text-primary mb-4" />,
        title: "Community Driven",
        description: "Be part of a growing community that supports peer-to-peer exchange and sharing.",
      },
      {
        icon: <Zap className="w-10 h-10 text-primary mb-4" />,
        title: "Faster Deliveries",
        description: "Often get your items delivered faster than traditional shipping methods.",
      },
      {
        icon: <Lock className="w-10 h-10 text-primary mb-4" />,
        title: "Earn While You Travel",
        description: "Monetize your extra baggage allowance and offset your travel expenses.",
      },
    ];

    const WhyChooseUsSection = () => {
      const cardVariants = {
        offscreen: {
          y: 50,
          opacity: 0
        },
        onscreen: (i) => ({
          y: 0,
          opacity: 1,
          transition: {
            type: "spring",
            bounce: 0.4,
            duration: 0.8,
            delay: i * 0.1
          }
        })
      };

      return (
        <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-800/50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12 md:mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-foreground dark:text-white mb-3">
                Why Choose <span className="font-vernaccia-bold">Yankit</span>?
              </h2>
              <p className="text-lg text-muted-foreground dark:text-slate-300 max-w-2xl mx-auto">
                Discover the unique advantages of using <span className="font-vernaccia-bold">Yankit</span> for your shipping and travel needs.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  custom={index}
                  variants={cardVariants}
                  initial="offscreen"
                  whileInView="onscreen"
                  viewport={{ once: true, amount: 0.2 }}
                  className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center"
                >
                  <div className="p-3 bg-primary/10 dark:bg-blue-600/20 rounded-full mb-4">
                     {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground dark:text-slate-300 text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      );
    };

    export default WhyChooseUsSection;