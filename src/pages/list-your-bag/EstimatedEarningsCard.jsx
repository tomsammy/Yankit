import React from 'react';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
    import { Separator } from "@/components/ui/separator";
    import { motion, AnimatePresence } from 'framer-motion';
    import { Loader2, Zap, TrendingUp, Info } from 'lucide-react';

    const EstimatedEarningsCard = ({ isCalculating, estimatedDistance, estimatedEarningsPerBag, numberOfBags }) => {
        const hasValues = estimatedDistance !== null && estimatedEarningsPerBag !== null;
        const totalEarnings = hasValues ? (estimatedEarningsPerBag * parseInt(numberOfBags, 10)) : 0;

        const cardVariants = {
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
        };

        const itemVariants = {
            hidden: { opacity: 0, x: -10 },
            visible: { opacity: 1, x: 0, transition: { duration: 0.3, delay: 0.2 } }
        };

        return (
            <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-800 dark:to-slate-900 border-border/50 shadow-lg w-full">
                <CardHeader>
                    <CardTitle className="flex items-center text-xl font-bold text-slate-800 dark:text-slate-100">
                        <TrendingUp className="mr-3 h-6 w-6 text-green-500" />
                        Estimated Earnings
                    </CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-400 pt-1">
                        Here's what you could earn for this trip.
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
                                <p className="font-semibold text-lg">Calculating Earnings...</p>
                                <p className="text-sm">Based on your selected route.</p>
                            </motion.div>
                        ) : hasValues && estimatedEarningsPerBag > 0 ? (
                            <motion.div
                                key="results"
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                className="space-y-4"
                            >
                                <motion.div variants={itemVariants} className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                                    <div className="flex items-center">
                                        <Zap className="h-5 w-5 mr-3 text-yellow-500" />
                                        <span className="font-medium">Estimated Distance</span>
                                    </div>
                                    <span className="font-semibold text-lg">{estimatedDistance.toLocaleString()} km</span>
                                </motion.div>

                                <motion.div variants={itemVariants} className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                                    <div className="flex items-center">
                                        <Info className="h-5 w-5 mr-3 text-sky-500" />
                                        <span className="font-medium">Earnings per Bag</span>
                                    </div>
                                    <span className="font-semibold text-lg">${estimatedEarningsPerBag.toFixed(2)}</span>
                                </motion.div>
                                
                                <Separator className="my-4 bg-slate-200 dark:bg-slate-700" />

                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1, transition: { delay: 0.4, type: 'spring', stiffness: 150 } }}
                                    className="flex justify-between items-center p-4 bg-green-100/80 dark:bg-green-900/40 rounded-lg"
                                >
                                    <span className="text-xl font-bold text-green-700 dark:text-green-300">Total Potential Earnings</span>
                                    <span className="text-3xl font-extrabold text-green-800 dark:text-green-200">${totalEarnings.toFixed(2)}</span>
                                </motion.div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="placeholder"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center h-48 flex flex-col justify-center items-center text-slate-500 dark:text-slate-400"
                            >
                                <p className="font-medium text-lg">Your earnings estimate will appear here.</p>
                                <p className="text-sm">Please select your origin and destination.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
                 <CardFooter>
                    <p className="text-xs text-center text-slate-500 dark:text-slate-500 w-full">
                        This is an estimate. The final amount is confirmed upon successful delivery.
                    </p>
                </CardFooter>
            </Card>
        );
    };

    export default EstimatedEarningsCard;