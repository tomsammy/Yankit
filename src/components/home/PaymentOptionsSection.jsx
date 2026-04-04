import React from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  ShieldCheck,
  Smartphone,
  Wallet,
  Route,
} from "lucide-react";

const paymentOptions = [
  {
    icon: <CreditCard className="w-10 h-10 text-primary mb-4" />,
    title: "All Major Cards (via Stripe)",
    description:
      "Securely pay using your Visa, Mastercard, American Express, and other major credit or debit cards. Processed by Stripe for maximum security.",
  },
  {
    icon: <Wallet className="w-10 h-10 text-primary mb-4" />,
    title: "Revolut Pay",
    description:
      "Experience seamless and instant payments with Revolut Pay. Fast, secure, and convenient for all your transactions.",
  },
  {
    icon: <Smartphone className="w-10 h-10 text-primary mb-4" />,
    title: "PAYID",
    description:
      "Make fast and simple payments directly from your bank account using PAYID. A quick and modern way to transact.",
  },
  {
    icon: <Route className="w-10 h-10 text-primary mb-4" />,
    title: "Transparent Pricing",
    description:
      "All prices are clearly calculated based on the specific route and bag details, ensuring fair and non-negotiable costs for every shipment.",
  },
  {
    icon: <ShieldCheck className="w-10 h-10 text-green-500 mb-4" />,
    title: "Secure Transactions",
    description:
      "<span class='font-vernaccia-bold'>Baggit</span> holds funds securely until successful delivery confirmation, providing complete peace of mind for both shippers and travelers.",
  },
];

const PaymentOptionsSection = () => {
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
            Flexible & Secure Payment Methods
          </h2>
          <p className="text-lg text-muted-foreground dark:text-slate-300 max-w-2xl mx-auto">
            <span className="font-vernaccia-bold">Baggit</span> offers
            convenient and secure ways to handle transactions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paymentOptions.map((option, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center"
            >
              {option.icon}
              <h3 className="text-xl font-semibold text-foreground dark:text-white mb-2">
                {option.title}
              </h3>
              <p
                className="text-muted-foreground dark:text-slate-300 text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: option.description }}
              ></p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PaymentOptionsSection;
