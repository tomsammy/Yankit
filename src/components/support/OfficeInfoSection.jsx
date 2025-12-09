import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Building } from 'lucide-react';

    const OfficeInfoSection = () => {
      const officeDetails = {
        name: "<span class='font-vernaccia-bold'>Yankit</span> Proprietary Ltd",
        address: "Building 5, 22 Magnolia Dr, Brookwater QLD 4300",
        phone: "+61 7 1234 5678",
        email: "support@yankit.com.au",
      };

      const detailItemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: (i) => ({
          opacity: 1,
          x: 0,
          transition: {
            delay: i * 0.1,
            duration: 0.5,
            ease: "easeOut"
          }
        })
      };

      return (
        <motion.section 
          className="py-16 md:py-24 bg-gradient-to-br from-slate-50 to-sky-100 dark:from-slate-800 dark:to-blue-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div 
                className="space-y-8"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <h2 className="text-3xl md:text-4xl font-extrabold text-foreground dark:text-white mb-2" dangerouslySetInnerHTML={{ __html: officeDetails.name }}></h2>
                <p className="text-lg text-muted-foreground dark:text-slate-300 mb-8">
                  We're here to help! Reach out to us through any of the methods below, or visit us at our main office.
                </p>
                
                {[
                  { icon: <Building className="w-6 h-6 text-primary" />, label: "Office", value: officeDetails.address, href: `https://www.openstreetmap.org/search?query=${encodeURIComponent(officeDetails.address)}` },
                  { icon: <MapPin className="w-6 h-6 text-primary" />, label: "Location", value: "Brookwater, QLD, Australia" },
                  { icon: <Phone className="w-6 h-6 text-primary" />, label: "Phone", value: officeDetails.phone, href: `tel:${officeDetails.phone.replace(/\s/g, '')}` },
                  { icon: <Mail className="w-6 h-6 text-primary" />, label: "Email", value: officeDetails.email, href: `mailto:${officeDetails.email}` },
                ].map((item, index) => (
                  <motion.div 
                    key={item.label}
                    custom={index}
                    variants={detailItemVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex items-start space-x-4 group"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 dark:bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-primary/20 dark:group-hover:bg-blue-500/30 transition-colors">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground dark:text-white">{item.label}</h3>
                      {item.href ? (
                        <a 
                          href={item.href} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-muted-foreground dark:text-slate-300 hover:text-primary dark:hover:text-sky-300 transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-muted-foreground dark:text-slate-300">{item.value}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div 
                className="rounded-xl overflow-hidden shadow-2xl h-80 md:h-full min-h-[300px] bg-slate-200 dark:bg-slate-700 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              >
                <p className="text-muted-foreground dark:text-slate-400 text-center p-4">
                  Map visualization is currently unavailable. <br/> Please use the address link for directions.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.section>
      );
    };

    export default OfficeInfoSection;