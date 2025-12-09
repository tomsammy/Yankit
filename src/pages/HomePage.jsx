import React from 'react';
    import HeroSection from '@/components/home/HeroSection';
    import ProcessStepsSection from '@/components/home/ProcessStepsSection';
    import AppFeaturesOverview from '@/components/home/AppFeaturesOverview';
    import WhyChooseUsSection from '@/components/home/WhyChooseUsSection';
    import TestimonialsSection from '@/components/home/TestimonialsSection';
    import SafetyTrustSection from '@/components/home/SafetyTrustSection';
    import CallToActionSection from '@/components/home/CallToActionSection';
    import PaymentOptionsSection from '@/components/home/PaymentOptionsSection';
    import NewsletterSignup from '@/components/home/NewsletterSignup';
    import FeaturedRoutesSection from '@/components/home/FeaturedDestinationsSection';

    const HomePage = () => {
      return (
        <div className="space-y-16 md:space-y-24">
          <HeroSection />
          <ProcessStepsSection 
            title="How <span class='font-vernaccia-bold'>Yankit</span> Works: Simple & Secure"
            subtitle="Follow these easy steps to send or carry items with <span class='font-vernaccia-bold'>Yankit</span>."
          />
          <AppFeaturesOverview />
          <WhyChooseUsSection />
          <FeaturedRoutesSection />
          <TestimonialsSection />
          <SafetyTrustSection />
          <PaymentOptionsSection />
          <CallToActionSection />
          <NewsletterSignup />
        </div>
      );
    };

    export default HomePage;