import React from 'react';
    import { motion } from 'framer-motion';
    import { ShieldCheck, UserCheck, MessageCircle, Star } from 'lucide-react';

    const safetyFeatures = [
      {
        icon: <UserCheck className="w-10 h-10 text-primary" />,
        title: "Verified Users",
        description: "All users undergo a verification process to enhance platform security."
      },
      {
        icon: <ShieldCheck className="w-10 h-10 text-primary" />,
        title: "Secure Payments",
        description: "Payments are handled securely through our platform, protecting both parties."
      },
      {
        icon: <MessageCircle className="w-10 h-10 text-primary" />,
        title: "Transparent Communication",
        description: "In-app messaging allows for clear and documented communication."
      },
      {
        icon: <Star className="w-10 h-10 text-primary" />,
        title: "Review System",
        description: "Rate and review users to build trust and maintain community standards."
      }
    ];

    const SafetyTrustSection = () => {
      return (
        <section className="py-16 md:py-24 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12 md:mb-16"
            >
              <ShieldCheck className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-extrabold text-foreground dark:text-white mb-3">
                Your Safety is Our Priority at <span className="font-vernaccia-bold">Yankit</span>
              </h2>
              <p className="text-lg text-muted-foreground dark:text-slate-300 max-w-2xl mx-auto">
                We're committed to creating a secure and trustworthy environment for all our users.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {safetyFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center"
                >
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground dark:text-slate-300 text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      );
    };

    export default SafetyTrustSection;