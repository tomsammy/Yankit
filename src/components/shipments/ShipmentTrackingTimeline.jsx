import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Clock } from 'lucide-react';

const TimelineItem = ({ event, isLast }) => {
    const { title, description, date, isComplete } = event;
    
    const getIcon = () => {
        if (isComplete) {
            return <CheckCircle className="h-5 w-5 text-green-500" />;
        }
        if (date) {
            return <Clock className="h-5 w-5 text-yellow-500" />;
        }
        return <Circle className="h-5 w-5 text-gray-400 dark:text-gray-500" />;
    };

    return (
        <motion.li
            className="relative flex items-start pb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
        >
            {!isLast && (
                <div className={`absolute left-[9px] top-5 h-full w-0.5 ${isComplete ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
            )}
            <div className="z-10 flex h-5 w-5 items-center justify-center rounded-full bg-white dark:bg-slate-800 mr-4">
                {getIcon()}
            </div>
            <div className="flex-1">
                <p className={`font-semibold ${isComplete ? 'text-gray-800 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                    {title}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    {description}
                </p>
                {date && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {new Date(date).toLocaleString()}
                    </p>
                )}
            </div>
        </motion.li>
    );
};

const ShipmentTrackingTimeline = ({ events }) => {
    if (!events || events.length === 0) {
        return <p className="text-gray-500 dark:text-gray-400">No tracking information available.</p>;
    }
    
    return (
        <ol>
            {events.map((event, index) => (
                <TimelineItem key={index} event={event} isLast={index === events.length - 1} />
            ))}
        </ol>
    );
};

export default ShipmentTrackingTimeline;