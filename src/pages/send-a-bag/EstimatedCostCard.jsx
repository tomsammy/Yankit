import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, TrendingUp, Coins as HandCoins, Building } from 'lucide-react';

const EstimatedCostCard = ({ isCalculating, estimatedCost, yankerEarnings, serviceFee, numberOfBags }) => {
    const hasValues = estimatedCost !== null && yankerEarnings !== null && serviceFee !== null;

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.3, delay: 0.2 } }
    };

    return (
        <Card className="bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 border-border/50 shadow-lg w-full">
            <CardHeader>
                <CardTitle className="flex items-center text-xl font-bold text-slate-800 dark:text-slate-100">
                    <TrendingUp className="mr-3 h-6 w-6 text-primary" />
                    Estimated Cost Breakdown
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400 pt-1">
                    Here’s what you can expect to pay for sending {numberOfBags || 0} {numberOfBags == 1 ? 'bag' : 'bags'}.
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
                            <Loader2 className="h-10 w-10 animate-spin text-primary mb-3" />
                            <p className="font-semibold text-lg">Calculating Cost...</p>
                            <p className="text-sm">Finding the best price for your route.</p>
                        </motion.div>
                    ) : hasValues && estimatedCost > 0 ? (
                        <motion.div
                            key="results"
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-4"
                        >
                            <motion.div variants={itemVariants} className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                                <div className="flex items-center">
                                    <HandCoins className="h-5 w-5 mr-3 text-green-500" />
                                    <span className="font-medium">Yanker's Earnings</span>
                                </div>
                                <span className="font-semibold text-lg">${yankerEarnings.toFixed(2)}</span>
                            </motion.div>

                            <motion.div variants={itemVariants} className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                                <div className="flex items-center">
                                    <Building className="h-5 w-5 mr-3 text-indigo-500" />
                                    <span className="font-medium">Yankit Service Fee</span>
                                </div>
                                <span className="font-semibold text-lg">${serviceFee.toFixed(2)}</span>
                            </motion.div>

                            <Separator className="my-4 bg-slate-200 dark:bg-slate-700" />

                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1, transition: { delay: 0.4, type: 'spring', stiffness: 150 } }}
                                className="flex justify-between items-center p-4 bg-primary/10 dark:bg-primary/20 rounded-lg"
                            >
                                <span className="text-xl font-bold text-primary dark:text-sky-300">Total Estimated Cost</span>
                                <span className="text-3xl font-extrabold text-primary dark:text-sky-300">${estimatedCost.toFixed(2)}</span>
                            </motion.div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="placeholder"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center h-48 flex flex-col justify-center items-center text-slate-500 dark:text-slate-400"
                        >
                            <p className="font-medium text-lg">Your cost estimate will appear here.</p>
                            <p className="text-sm">Please select your origin and destination airports.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>
            <CardFooter>
                <p className="text-xs text-center text-slate-500 dark:text-slate-500 w-full">
                    This is an estimate. Final costs may vary based on the matched traveler and specific agreements.
                </p>
            </CardFooter>
        </Card>
    );
};

export default EstimatedCostCard;