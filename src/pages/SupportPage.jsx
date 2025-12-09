import React, { useEffect } from 'react';
    import { useLocation } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import SupportPageHeader from '@/components/support/SupportPageHeader';
    import ContactMethodsSection from '@/components/support/ContactMethodsSection';
    import FaqSection from '@/components/support/FaqSection';
    import ContactFormSection from '@/components/support/ContactFormSection';
    // import OfficeInfoSection from '@/components/support/OfficeInfoSection'; // Removed as requested

    const pageVariants = {
      initial: { opacity: 0, y: 20 },
      in: { opacity: 1, y: 0 },
      out: { opacity: 0, y: -20 }
    };

    const SectionWrapper = ({ children, delay = 0, id, className = "" }) => (
      <motion.div
        id={id}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6, delay, type: "spring", stiffness: 90 }}
        className={className}
      >
        {children}
      </motion.div>
    );
    SectionWrapper.displayName = "SectionWrapper";

    const SupportPage = () => {
      const location = useLocation();

      useEffect(() => {
        if (location.hash) {
          const id = location.hash.replace('#', '');
          const element = document.getElementById(id);
          if (element) {
            setTimeout(() => {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
          }
        }
      }, [location]);

      return (
        <motion.div 
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={{ duration: 0.5 }}
          className="container mx-auto py-0 md:py-0" 
        >
          <SupportPageHeader />
          
          <div className="space-y-16 md:space-y-24 mt-0 md:mt-0 mb-12 md:mb-16">
            <SectionWrapper delay={0.1} id="contact-methods" className="pt-12 md:pt-16">
              <ContactMethodsSection />
            </SectionWrapper>
            
            <SectionWrapper delay={0.2} id="faq">
              <FaqSection />
            </SectionWrapper>

            <SectionWrapper delay={0.3} id="contact-form">
              <ContactFormSection />
            </SectionWrapper>

            {/* <SectionWrapper delay={0.4} id="office-info"> // Removed as requested
              <OfficeInfoSection />
            </SectionWrapper> */}
          </div>
        </motion.div>
      );
    };

    export default SupportPage;