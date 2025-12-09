import React from 'react';
    import { motion } from 'framer-motion';
    import { Phone, Mail, MessageSquare, MapPin } from 'lucide-react';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

    const contactMethods = [
      {
        icon: <Mail className="w-8 h-8 text-primary group-hover:text-white transition-colors duration-300" />,
        title: "Email Support",
        details: "info@yankit.com.au",
        actionText: "Send us an email",
        href: "mailto:info@yankit.com.au"
      },
      {
        icon: <Phone className="w-8 h-8 text-primary group-hover:text-white transition-colors duration-300" />,
        title: "Phone Support",
        details: "+61 YANKIT NOW (926548 669)",
        actionText: "Call us",
        href: "tel:+61926548669" 
      },
      {
        icon: <MessageSquare className="w-8 h-8 text-primary group-hover:text-white transition-colors duration-300" />,
        title: "Live Chat",
        details: "Available during business hours via our website chatbot.",
        actionText: "Start a chat",
        actionOnClick: () => { 
            const chatbotButton = document.querySelector('button[aria-label="Toggle Chatbot"]');
            if (chatbotButton) chatbotButton.click();
         }
      },
       {
        icon: <MapPin className="w-8 h-8 text-primary group-hover:text-white transition-colors duration-300" />,
        title: "Address",
        details: "5/22 Magnolia Dr, Brookwater QLD 4300",
        actionText: "View on Map",
        href: "https://www.openstreetmap.org/search?query=5%2F22%20Magnolia%20Dr%2C%20Brookwater%20QLD%204300"
      }
    ];

    const ContactMethodsSection = () => {
      return (
        <section id="contact" className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 md:mb-16">
               <h2 className="text-3xl md:text-4xl font-extrabold text-foreground dark:text-white">
                How Can We Help You Today?
              </h2>
              <p className="text-lg text-muted-foreground dark:text-slate-300 mt-3 max-w-2xl mx-auto">
                Choose your preferred way to connect with our support team. We're ready to assist you with any inquiries.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {contactMethods.map((method, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <Card className="bg-white dark:bg-slate-800/80 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col border-transparent hover:border-primary dark:hover:border-secondary transform hover:-translate-y-1 hover:bg-gradient-to-br hover:from-primary/5 hover:to-blue-500/5 dark:hover:from-blue-600/10 dark:hover:to-sky-600/10">
                    <CardHeader className="flex flex-row items-center space-x-4 p-6">
                      <div className="p-4 bg-primary/10 dark:bg-blue-600/20 rounded-full group-hover:bg-primary dark:group-hover:bg-secondary transition-colors duration-300">
                         {method.icon}
                      </div>
                      <CardTitle className="text-xl font-semibold text-foreground dark:text-white group-hover:text-primary dark:group-hover:text-secondary transition-colors duration-300">{method.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0 flex-grow">
                      <p className="text-muted-foreground dark:text-slate-300 mb-4">{method.details}</p>
                      {method.href ? (
                        <a 
                            href={method.href} 
                            className="inline-flex items-center text-sm text-primary dark:text-secondary hover:underline font-medium group-hover:text-primary-dark dark:group-hover:text-secondary-light transition-colors duration-300"
                            target={method.href.startsWith('mailto:') || method.href.startsWith('tel:') ? '_self' : '_blank'}
                            rel="noopener noreferrer"
                        >
                            {method.actionText} <span aria-hidden="true" className="ml-1 transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
                        </a>
                      ) : method.actionOnClick ? (
                        <button 
                            onClick={method.actionOnClick} 
                            className="inline-flex items-center text-sm text-primary dark:text-secondary hover:underline font-medium group-hover:text-primary-dark dark:group-hover:text-secondary-light transition-colors duration-300 text-left"
                        >
                            {method.actionText} <span aria-hidden="true" className="ml-1 transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
                        </button>
                      ) : null}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      );
    };

    export default ContactMethodsSection;