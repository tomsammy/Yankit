import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Zap,
  TrendingUp,
  Info,
  DollarSign,
  BaggageClaimIcon,
  Percent,
} from "lucide-react";

const EstimatedCostCard = ({
  isCalculating,
  estimatedDistance,
  estimatedCostPerBag,
  numberOfBags,
}) => {
  const hasValues = estimatedDistance !== null && estimatedCostPerBag !== null;
  const bags = parseInt(numberOfBags, 10) || 1;
  const totalCost = hasValues ? estimatedCostPerBag * bags : 0;

  const baseCost = hasValues ? estimatedCostPerBag / 1.2 : 0;
  const yankitFee = hasValues ? estimatedCostPerBag - baseCost : 0;
  const pricePerKg = hasValues ? baseCost / 20 : 0;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3, delay: 0.2 } },
  };

  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-800 dark:to-slate-900 border-border/50 shadow-lg w-full">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-bold text-slate-800 dark:text-slate-100">
          <TrendingUp className="mr-3 h-6 w-6 text-green-500" />
          Estimated Costs
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400 pt-1">
          Here's what this shipment could cost.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {isCalculating ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-48 text-slate-600 dark:text-slate-400"
            >
              <Loader2 className="h-10 w-10 animate-spin text-green-500 mb-3" />
              <p className="font-semibold text-lg">Calculating Cost...</p>
              <p className="text-sm">Based on your selected route.</p>
            </motion.div>
          ) : hasValues && estimatedCostPerBag > 0 ? (
            <motion.div
              key="results"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              <motion.div
                variants={itemVariants}
                className="flex justify-between items-center text-slate-700 dark:text-slate-300"
              >
                <div className="flex items-center">
                  <Zap className="h-5 w-5 mr-3 text-yellow-500" />
                  <span className="font-medium">Estimated Distance</span>
                </div>
                <span className="font-semibold text-lg">
                  {estimatedDistance.toLocaleString()} km
                </span>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex justify-between items-center text-slate-700 dark:text-slate-300"
              >
                <div className="flex items-center">
                  <Info className="h-5 w-5 mr-3 text-sky-500" />
                  <span className="font-medium">Cost per Bag</span>
                </div>
                <span className="font-semibold text-lg">
                  ${estimatedCostPerBag.toFixed(2)}
                </span>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex justify-between items-center text-slate-700 dark:text-slate-300"
              >
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-3 text-green-500" />
                  <span className="font-medium">Price per kg</span>
                </div>
                <span className="font-semibold text-lg">
                  ${pricePerKg.toFixed(2)}
                </span>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex justify-between items-center text-slate-700 dark:text-slate-300"
              >
                <div className="flex items-center">
                  <BaggageClaimIcon className="h-5 w-5 mr-3 text-purple-500" />
                  <span className="font-medium">Base price per bag (20kg)</span>
                </div>
                <span className="font-semibold text-lg">
                  ${baseCost.toFixed(2)}
                </span>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex justify-between items-center text-slate-700 dark:text-slate-300"
              >
                <div className="flex items-center">
                  <Percent className="h-5 w-5 mr-3 text-red-500" />
                  <span className="font-medium">Baggit fee (20%)</span>
                </div>
                <span className="font-semibold text-lg">
                  ${yankitFee.toFixed(2)}
                </span>
              </motion.div>

              <Separator className="my-4 bg-slate-200 dark:bg-slate-700" />

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  transition: { delay: 0.4, type: "spring", stiffness: 150 },
                }}
                className="flex justify-between items-center p-4 bg-green-100/80 dark:bg-green-900/40 rounded-lg"
              >
                <span className="text-xl font-bold text-green-700 dark:text-green-300">
                  Total Potential Cost
                </span>
                <span className="text-3xl font-extrabold text-green-800 dark:text-green-200">
                  ${totalCost.toFixed(2)}
                </span>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center h-48 flex flex-col justify-center items-center text-slate-500 dark:text-slate-400"
            >
              <p className="font-medium text-lg">
                Your cost estimate will appear here.
              </p>
              <p className="text-sm">
                Please provide the baggage details and destination.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-center text-slate-500 dark:text-slate-500 w-full">
          Includes 20% platform fee. This is an estimate. The final cost is
          calculated and based on flight distance.
        </p>
      </CardFooter>
    </Card>
  );
};

export default EstimatedCostCard;
