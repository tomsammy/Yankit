import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import UniversalSearchForm from "@/components/home/UniversalSearchForm";

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary to-blue-700 dark:from-blue-800 dark:to-slate-900 text-white py-20 md:py-24 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <img
          alt="Abstract airport pattern"
          className="w-full h-full object-cover"
          src="./hero.webp"
          fetchpriority="high"
          loading="eager"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Travel Light, Ship Smart with{" "}
            <span className="font-vernaccia-bold">Yankit</span>
          </h1>
          <p className="text-lg md:text-xl text-white mb-10">
            Connect with travellers to send your packed bags globally, or earn
            by 'yanking' bags for others. Efficient, affordable, and
            community-driven shipping. Why mail it when you can{" "}
            <span className="font-vernaccia-bold">Yankit</span> it!
          </p>

          <UniversalSearchForm />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="mt-12"
          >
            <Link
              to="/how-it-works"
              className="text-white hover:text-slate-200 dark:text-sky-300 dark:hover:text-sky-100 transition-colors duration-200 group text-sm font-medium inline-flex items-center"
            >
              Learn how{" "}
              <span className="font-vernaccia-bold ml-1 mr-1">Yankit</span>{" "}
              works
              <ArrowRight className="inline-block ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
    </section>
  );
};

export default HeroSection;
