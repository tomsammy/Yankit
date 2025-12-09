import React from 'react';
    import { motion } from 'framer-motion';
    import { UserPlus, Search, Package, Plane, MessageSquare, CreditCard, CheckCircle, Users, MapPin, ClipboardCheck } from 'lucide-react';

    const steps = [
      {
        icon: <UserPlus className="w-10 h-10 text-primary" />,
        title: "1. Sign Up / Log In",
        description: "Create your <span class='font-vernaccia-bold'>Yankit</span> account or log in. It's quick and easy!"
      },
      {
        icon: <Package className="w-10 h-10 text-primary" />,
        title: "2. Travellers List Space",
        description: "Travellers list their origin and destination airports and allowable baggage space (2 bags, max 20kg each)."
      },
      {
        icon: <Search className="w-10 h-10 text-primary" />,
        title: "3. Algorithm Matching",
        description: "Our algorithm matches the traveller's route with a sender's needs and notifies the sender about the available slot."
      },
      {
        icon: <ClipboardCheck className="w-10 h-10 text-primary" />,
        title: "4. Pay & Declare",
        description: "Sender accepts the match, makes the payment, provides recipient details, and signs the dangerous goods declaration."
      },
      {
        icon: <MapPin className="w-10 h-10 text-primary" />,
        title: "5. Drop Off & Assessment",
        description: "Sender drops the bag at the designated Yankit drop-off point near the departure airport. Yankit staff assess the bag for safety."
      },
      {
        icon: <Plane className="w-10 h-10 text-primary" />,
        title: "6. Traveller Pick Up",
        description: "The traveller is notified to pick up the safely assessed bag from the Yankit drop-off point."
      },
      {
        icon: <CheckCircle className="w-10 h-10 text-green-500" />,
        title: "7. Delivery & Payout",
        description: "Traveller delivers the bag to the recipient at the destination airport. Once confirmed, the traveller receives payment."
      },
      {
        icon: <Users className="w-10 h-10 text-primary" />,
        title: "8. Rate & Review",
        description: "Share your experience by rating and reviewing to help build a trusted community."
      }
    ];

    const TripOnProcessPage = () => {
      return (
        <div className="container mx-auto py-12 px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-secondary mb-4">
              How <span className="font-vernaccia-bold">Yankit</span> Works
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground dark:text-slate-300 max-w-2xl mx-auto">
              A simple, step-by-step guide to using <span className="font-vernaccia-bold">Yankit</span> for secure peer-to-peer shipping.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-center justify-center mb-6">
                  <div className={`p-4 rounded-full bg-gradient-to-br ${step.title.includes("Delivery") ? 'from-green-400/20 to-emerald-500/20' : 'from-primary/20 to-blue-500/20'} `}>
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-foreground dark:text-white mb-3 text-center">{step.title}</h3>
                <p className="text-muted-foreground dark:text-slate-300 text-center leading-relaxed" dangerouslySetInnerHTML={{ __html: step.description }}></p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: steps.length * 0.1 + 0.5 }}
            className="mt-20 text-center"
          >
            <p className="text-xl text-muted-foreground dark:text-slate-200">
              Ready to get started? <a href="/signup" className="text-primary hover:underline font-semibold">Sign up today</a> and join the <span className="font-vernaccia-bold">Yankit</span> community!
            </p>
          </motion.div>
        </div>
      );
    };

    export default TripOnProcessPage;