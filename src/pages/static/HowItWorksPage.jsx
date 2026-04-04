import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Send,
  Search,
  Briefcase,
  CheckCircle,
  Users,
  Shield,
  Globe,
  Landmark,
  MapPin,
  ClipboardCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const StepCard = ({ icon, title, description, stepNumber, className }) => {
  const IconComponent = icon;
  return (
    <motion.div
      variants={itemVariants}
      className="relative p-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl hover:shadow-primary/20 transition-all duration-300 group"
    >
      <div
        className={cn(
          "absolute -top-8 -right-8 text-7xl font-bold text-gray-200 group-hover:text-primary/20 transition-colors duration-300",
          className,
        )}
      >
        {stepNumber}
      </div>
      <div className="relative z-10">
        <div
          className={cn(
            "w-14 h-14 flex items-center justify-center rounded-xl mb-4 text-white shadow-md",
            className,
          )}
        >
          <IconComponent size={32} />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-700 text-sm leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
};
StepCard.displayName = "StepCard";

const BenefitCard = ({ icon, title, description }) => {
  const IconComponent = icon;
  return (
    <motion.div
      variants={itemVariants}
      className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-lg border border-gray-200 hover:border-gray-300 transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="p-4 bg-gradient-to-br from-primary to-accent text-white rounded-full mb-4 shadow-lg">
        <IconComponent size={28} />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-700">{description}</p>
    </motion.div>
  );
};
BenefitCard.displayName = "BenefitCard";

const HowItWorksPage = () => {
  const senderSteps = [
    {
      icon: Search,
      title: "Match & Notify",
      description:
        "Our algorithm matches your route with a traveller's available space and notifies you of the slot.",
      colorClass: "bg-primary",
    },
    {
      icon: ClipboardCheck,
      title: "Pay & Declare",
      description:
        "Accept the match, make payment, provide recipient details, and sign the dangerous goods declaration.",
      colorClass: "bg-primary",
    },
    {
      icon: MapPin,
      title: "Drop Off & Assess",
      description:
        "Drop your bag at the designated Baggit drop-off point near the departure airport for staff assessment.",
      colorClass: "bg-primary",
    },
    {
      icon: CheckCircle,
      title: "Track & Confirm",
      description:
        "Track your bag as the traveller picks it up and delivers it to your recipient.",
      colorClass: "bg-primary",
    },
  ];

  const travelerSteps = [
    {
      icon: Briefcase,
      title: "List Your Space",
      description:
        "List your origin and destination airports and available baggage allowance (max 2 bags, 20kg each).",
      colorClass: "bg-primary",
    },
    {
      icon: Users,
      title: "Get Matched",
      description:
        "Our system matches you with a sender and notifies you to pick up a bag.",
      colorClass: "bg-primary",
    },
    {
      icon: Shield,
      title: "Pick Up Securely",
      description:
        "Pick up the bag from the Baggit drop-off point, where it has been safely assessed by our staff.",
      colorClass: "bg-primary",
    },
    {
      icon: Landmark,
      title: "Deliver & Earn",
      description:
        "Deliver the bag to the recipient at the destination airport and receive your payment.",
      colorClass: "bg-primary",
    },
  ];

  const benefits = [
    {
      icon: Globe,
      title: "Global Reach",
      description:
        "Send and receive items across continents with a community of trusted travelers.",
    },
    {
      icon: Shield,
      title: "Secure Assessment",
      description:
        "All bags are assessed by Baggit staff at drop-off points for safety and peace of mind.",
    },
    {
      icon: Briefcase,
      title: "Earn While Traveling",
      description:
        "Offset your travel costs by utilizing your unused baggage allowance.",
    },
    {
      icon: Send,
      title: "Affordable Shipping",
      description:
        "A cost-effective alternative to traditional shipping methods for senders.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 py-12 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-16 md:mb-24"
        >
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-blue-600"
          >
            How <span className="font-vernaccia-bold">Baggit</span> Works
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto"
          >
            Baggit is a revolutionary way that brings together travellers with
            those wanting to send anything, anywhere, domestically or
            internationally. It is a simple platform that enables travellers to
            list their allowable baggage space, and our algorithm matches them
            with senders for a seamless, secure experience.
          </motion.p>
        </motion.section>

        <motion.section
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="mb-16 md:mb-24"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            For <span className="text-primary">Senders</span>: Ship with Ease
          </h2>
          <p className="text-center text-gray-700 mb-10 md:mb-12 max-w-2xl mx-auto">
            Follow these simple steps to send your items securely.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {senderSteps.map((step, index) => (
              <StepCard
                key={index}
                icon={step.icon}
                title={step.title}
                description={step.description}
                stepNumber={String(index + 1).padStart(2, "0")}
                className={step.colorClass}
              />
            ))}
          </div>
          <motion.div variants={itemVariants} className="text-center mt-12">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-semibold shadow-lg transform hover:scale-105 transition-transform duration-300"
            >
              <Link to="/list-baggage">
                Send an Item Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </motion.section>

        <motion.section
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="mb-16 md:mb-24"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            For <span className="text-primary">Travelers</span>: Earn on the Go
          </h2>
          <p className="text-center text-gray-700 mb-10 md:mb-12 max-w-2xl mx-auto">
            Turn your extra baggage space into extra cash on your next trip.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {travelerSteps.map((step, index) => (
              <StepCard
                key={index}
                icon={step.icon}
                title={step.title}
                description={step.description}
                stepNumber={String(index + 1).padStart(2, "0")}
                className={step.colorClass}
              />
            ))}
          </div>
          <motion.div variants={itemVariants} className="text-center mt-12">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-semibold shadow-lg transform hover:scale-105 transition-transform duration-300"
            >
              <Link to="/yank-a-bag">
                List Your Trip <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </motion.section>

        <motion.section
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="mb-16 md:mb-24"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-10 md:mb-12">
            Why Choose{" "}
            <span className="font-vernaccia-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-blue-600">
              Baggit
            </span>
            ?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {benefits.map((benefit, index) => (
              <BenefitCard
                key={index}
                icon={benefit.icon}
                title={benefit.title}
                description={benefit.description}
              />
            ))}
          </div>
        </motion.section>

        <motion.section
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="text-center bg-white p-8 md:p-12 rounded-2xl shadow-2xl border border-gray-200"
        >
          <motion.h2
            variants={itemVariants}
            className="text-2xl md:text-3xl font-bold text-gray-900 mb-4"
          >
            Ready to Get Started?
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-gray-700 mb-8 max-w-xl mx-auto"
          >
            Join the{" "}
            <span className="font-vernaccia-bold text-gray-900">Baggit</span>{" "}
            community today and experience the future of peer-to-peer shipping
            and travel earnings.
          </motion.p>
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold shadow-lg transform hover:scale-105 transition-transform duration-300 w-full sm:w-auto"
            >
              <Link to="/signup">
                Sign Up Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary/10 w-full sm:w-auto font-semibold transform hover:scale-105 transition-transform duration-300"
            >
              <Link to="/support">Learn More</Link>
            </Button>
          </motion.div>
        </motion.section>
      </div>
    </div>
  );
};
HowItWorksPage.displayName = "HowItWorksPage";

export default HowItWorksPage;
