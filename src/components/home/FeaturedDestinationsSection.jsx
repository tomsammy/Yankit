import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { PlaneTakeoff, PlaneLanding, ArrowRight, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const routes = [
  {
    name: "Perth to Heathrow",
    originCity: "Perth",
    destinationCity: "London",
    description: "Connect Australia with the heart of Europe.",
    imageUrl: "https://images.unsplash.com/photo-1689238702967-433e3a1c96cf",
    altText: "Perth city skyline at dusk",
    originAirportCode: "PER",
    destinationAirportCode: "LHR",
    originAirportName: "Perth Airport",
    destinationAirportName: "London Heathrow Airport",
  },
  {
    name: "Melbourne to Dallas",
    originCity: "Melbourne",
    destinationCity: "Dallas",
    description: "Bridge the Pacific, linking Australia to the USA.",
    imageUrl: "https://images.unsplash.com/photo-1617673758133-774053eeb42b",
    altText: "Melbourne city skyline at sunset",
    originAirportCode: "MEL",
    destinationAirportCode: "DFW",
    originAirportName: "Melbourne Airport",
    destinationAirportName: "Dallas/Fort Worth International Airport",
  },
  {
    name: "Auckland to Dubai",
    originCity: "Auckland",
    destinationCity: "Dubai",
    description: "A key route connecting Oceania with the Middle East.",
    imageUrl: "https://images.unsplash.com/photo-1642800268839-0fd259f95f93",
    altText: "Auckland's Sky Tower illuminated at dusk",
    originAirportCode: "AKL",
    destinationAirportCode: "DXB",
    originAirportName: "Auckland Airport",
    destinationAirportName: "Dubai International Airport",
  },
  {
    name: "Perth to Johannesburg",
    originCity: "Perth",
    destinationCity: "Johannesburg",
    description: "Linking Western Australia with Southern Africa.",
    imageUrl: "https://images.unsplash.com/photo-1554313553-ae79cea8f237",
    altText: "Johannesburg skyline with Hillbrow Tower",
    originAirportCode: "PER",
    destinationAirportCode: "JNB",
    originAirportName: "Perth Airport",
    destinationAirportName: "O.R. Tambo International Airport",
  },
];

const FeaturedRoutesSection = () => {
  const navigate = useNavigate();

  const handleSearchRoute = (route) => {
    navigate("/", {
      state: {
        prefillSearch: {
          origin: route.originAirportCode,
          destination: route.destinationAirportCode,
        },
      },
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground dark:text-white mb-3">
            Featured Routes
          </h2>
          <p className="text-lg text-muted-foreground dark:text-slate-300 max-w-xl mx-auto">
            Discover earning opportunities on Yankit with these featured routes.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {routes.map((route, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group h-full flex flex-col glassmorphism-subtle dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/50">
                <div className="relative h-48 md:h-56 overflow-hidden">
                  <img
                    src={route.imageUrl}
                    alt={route.altText}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center justify-between text-white mb-1">
                      <div className="text-center">
                        <PlaneTakeoff className="w-5 h-5 mx-auto text-sky-400 dark:text-sky-300" />
                        <span className="block text-xs font-medium drop-shadow-md mt-0.5">
                          {route.originAirportCode}
                        </span>
                        <span className="block text-[10px] opacity-80 drop-shadow-md">
                          {route.originCity}
                        </span>
                      </div>
                      <Plane className="w-6 h-6 text-white opacity-80 self-start mt-1" />
                      <div className="text-center">
                        <PlaneLanding className="w-5 h-5 mx-auto text-amber-400 dark:text-amber-300" />
                        <span className="block text-xs font-medium drop-shadow-md mt-0.5">
                          {route.destinationAirportCode}
                        </span>
                        <span className="block text-[10px] opacity-80 drop-shadow-md">
                          {route.destinationCity}
                        </span>
                      </div>
                    </div>
                    <h3
                      className="text-white text-base font-semibold drop-shadow-md mt-1 text-center flex items-center justify-center space-x-1.5 truncate"
                      title={`${route.originCity} to ${route.destinationCity}`}
                    >
                      <span className="truncate">{route.originCity}</span>
                      <Plane
                        size={16}
                        className="text-white opacity-90 shrink-0"
                      />
                      <span className="truncate">{route.destinationCity}</span>
                    </h3>
                  </div>
                </div>
                <CardContent className="p-4 flex-grow flex flex-col justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground dark:text-slate-400 mb-3 min-h-[40px]">
                      {route.description}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full mt-2 text-primary hover:bg-primary/10 dark:text-secondary dark:hover:bg-secondary/20 justify-start"
                    onClick={() => handleSearchRoute(route)}
                  >
                    Explore Route <ArrowRight size={16} className="ml-auto" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedRoutesSection;
