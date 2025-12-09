import React from 'react';
import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, ChevronRight } from 'lucide-react';

const faqs = [
  {
    question: "What is <span class='font-vernaccia-bold'>Yankit</span>?",
    answer: "<span class='font-vernaccia-bold'>Yankit</span> is a peer-to-peer platform connecting individuals who need to send items (Senders) with travellers who have spare baggage allowance (Yankers). It aims to make sending items more affordable and potentially faster by utilizing unused luggage space on specific flight routes."
  },
  {
    question: "How do I offer my baggage space as a Yanker (Traveller)?",
    answer: "If you're a Yanker, go to the 'Yank a Bag' page. You'll enter your flight details, including origin and destination airports. Our system will then automatically calculate your potential earnings for that specific route. Once you confirm, your offer becomes visible to Senders looking for space on that route."
  },
  {
    question: "How do I find a Yanker to send my bag?",
    answer: "If you're a Sender, go to the 'Send a Bag' page. Search using your desired origin and destination. You will see a list of available Yankers (travellers) for that route, along with the calculated, fixed price for the service. You can then connect with a Yanker to arrange the shipment."
  },
  {
    question: "How are prices calculated? Are they negotiable?",
    answer: "Prices are not negotiable. The cost for a Sender and the earnings for a Yanker are automatically calculated by our system based on the specific flight route (distance, demand, etc.). This ensures fair and transparent pricing for every transaction. The price you see is the final price."
  },
  {
    question: "How do Senders and Yankers communicate?",
    answer: "All communication should happen through <span class='font-vernaccia-bold'>Yankit</span>'s secure in-app conversation feature. This is where you finalize logistics like pickup/drop-off details and confirm the nature of the items being sent. This keeps a record and helps our support team assist if any issues arise."
  },
  {
    question: "What are the baggage limits on <span class='font-vernaccia-bold'>Yankit</span>?",
    answer: "A Yanker can offer space for a maximum of 2 bags per listing. Each bag must not exceed 20kg. Senders must ensure their items fit within these limits."
  },
  {
    question: "Is <span class='font-vernaccia-bold'>Yankit</span> secure?",
    answer: "We prioritize user safety through profile verification, secure messaging, and a transparent review system. However, users are solely responsible for what they send and carry. All items must comply with airline and customs regulations of both the origin and destination countries. <span class='font-vernaccia-bold'>Yankit</span> is a platform to connect users and is not liable for baggage contents."
  },
  {
    question: "How are payments handled?",
    answer: "Senders pay the final, calculated price through <span class='font-vernaccia-bold'>Yankit</span> when a shipment is confirmed. We hold the funds securely and release them to the Yanker only after the Sender confirms the items have been successfully delivered."
  },
  {
    question: "What fees does <span class='font-vernaccia-bold'>Yankit</span> charge?",
    answer: "<span class='font-vernaccia-bold'>Yankit</span> adds a small service fee to the final cost for Senders and deducts a fee from the Yanker's earnings. This helps us operate and continuously improve the platform. All fees are clearly displayed before any payment is made."
  },
  {
    question: "What can I send using <span class='font-vernaccia-bold'>Yankit</span>?",
    answer: "You are responsible for ensuring that all items comply with laws, airline policies, and customs rules. Prohibited items, illegal goods, hazardous materials, and anything restricted by airlines cannot be transported via <span class='font-vernaccia-bold'>Yankit</span>. Always clarify the contents of the package with the other party."
  },
  {
    question: "What if there's a problem with my transaction?",
    answer: "Clear communication is key. Document all agreements in the in-app chat. If a dispute arises, <span class='font-vernaccia-bold'>Yankit</span> provides a resolution process. Contact our support team with all relevant details and conversation history for assistance."
  },
];

const FaqSection = () => {
  return (
    <section id="faq" className="py-12 md:py-16 bg-slate-50 dark:bg-slate-800/70 rounded-xl shadow-inner">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="inline-block p-4 bg-gradient-to-r from-primary to-accent rounded-full shadow-lg mb-4"
          >
            <HelpCircle className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground dark:text-white">
            Your Questions Answered
          </h2>
          <p className="text-lg text-muted-foreground dark:text-slate-300 mt-3 max-w-2xl mx-auto">
            Find quick answers to common questions about using <span className="font-vernaccia-bold">Yankit</span> and its features.
          </p>
        </div>
        <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto bg-white dark:bg-slate-900/80 rounded-lg shadow-xl p-2 md:p-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`} 
              className="border-b border-slate-200 dark:border-slate-700 last:border-b-0"
            >
              <AccordionTrigger 
                className="text-left text-base md:text-lg font-semibold hover:no-underline py-5 px-4 md:px-6 text-foreground dark:text-slate-100 hover:bg-primary/5 dark:hover:bg-blue-600/10 rounded-md transition-colors group"
              >
                <span dangerouslySetInnerHTML={{ __html: faq.question }} />
              </AccordionTrigger>
              <AccordionContent 
                className="text-sm md:text-base text-muted-foreground dark:text-slate-300 pb-5 px-4 md:px-6 leading-relaxed"
              >
                <div className="flex">
                  <ChevronRight className="w-5 h-5 mr-2 mt-1 text-primary flex-shrink-0" />
                  <span dangerouslySetInnerHTML={{ __html: faq.answer }} />
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FaqSection;