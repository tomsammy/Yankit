import React, { useState, useEffect } from 'react';
    import { Progress } from '@/components/ui/progress';
    import { Info, MessageSquare, CheckCircle, Plane, AlertCircle, Clock } from 'lucide-react';

    const stageDetailsConfig = {
      initiated: { 
        label: "Booking Initiated", 
        progress: 10, 
        icon: <Info className="h-5 w-5 text-blue-500" />
      },
      pending_deposit: { 
        label: "Awaiting Deposit", 
        progress: 20, 
        icon: <Clock className="h-5 w-5 text-orange-500" />
      },
      pending_whatsapp_confirmation: { 
        label: "Awaiting WhatsApp Proof", 
        progress: 40, 
        icon: <MessageSquare className="h-5 w-5 text-yellow-500" />
      },
      payment_confirmed: { 
        label: "Payment Confirmed", 
        progress: 70, 
        icon: <CheckCircle className="h-5 w-5 text-green-500" />
      },
      booking_confirmed: { 
        label: "Booking Confirmed", 
        progress: 85, 
        icon: <Plane className="h-5 w-5 text-teal-500" />
      },
      ticket_issued: { 
        label: "Ticket Issued", 
        progress: 100, 
        icon: <CheckCircle className="h-5 w-5 text-emerald-500" />
      },
      cancelled: { 
        label: "Cancelled", 
        progress: 0, 
        icon: <AlertCircle className="h-5 w-5 text-red-500" />
      },
      failed: {
        label: "Payment Failed",
        progress: 10,
        icon: <AlertCircle className="h-5 w-5 text-red-500" />
      }
    };

    const getStageInfoForTracker = (status) => {
        return stageDetailsConfig[status] || { label: "Unknown", progress: 0, icon: <Info className="h-5 w-5 text-gray-500" /> };
    };
    
    const cardViewStages = [
        getStageInfoForTracker('initiated'),
        getStageInfoForTracker('pending_whatsapp_confirmation'),
        getStageInfoForTracker('payment_confirmed'), 
        getStageInfoForTracker('ticket_issued')
    ];


    const TicketTracker = ({ currentStatus, bookingTime }) => { 
      const [currentStageDetails, setCurrentStageDetails] = useState(getStageInfoForTracker(currentStatus));

      useEffect(() => {
        setCurrentStageDetails(getStageInfoForTracker(currentStatus));
      }, [currentStatus]);
      
      return (
        <div className="mt-4 pt-4 border-t border-border/40 dark:border-slate-700/60">
          <h4 className="text-sm font-semibold mb-3 text-foreground dark:text-slate-200">Booking Progress</h4>
          <Progress value={currentStageDetails.progress} className="w-full h-2 mb-2 bg-slate-200 dark:bg-slate-700 [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-green-500" />
          <div className="flex justify-between text-xs text-muted-foreground dark:text-slate-400 mb-3">
            {cardViewStages.map((s, index) => (
              <div key={s.label + index} className={`flex-1 text-center ${currentStageDetails.progress >= s.progress ? 'font-semibold text-primary dark:text-secondary' : ''}`}>
                {s.label}
              </div>
            ))}
          </div>
          <div className="flex items-center text-sm text-muted-foreground dark:text-slate-300">
            {currentStageDetails.icon}
            <span className="ml-2">
              Current Stage: {currentStageDetails.label}.
            </span>
          </div>
        </div>
      );
    };

    export default TicketTracker;