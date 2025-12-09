import React from 'react';
    import { Info, CheckCircle, XCircle } from 'lucide-react';

    export const ContractInfoDisplay = ({ contract }) => {
      if (!contract) return null;
      const { status, item_description, agreed_price, currency } = contract;

      return (
        <div className="p-3 mb-3 border rounded-lg bg-slate-50 dark:bg-slate-700/50 text-xs">
          <p className="font-semibold text-sm mb-1 text-primary dark:text-secondary">Contract Details:</p>
          <p><strong>Item:</strong> {item_description}</p>
          <p><strong>Price:</strong> {currency} {agreed_price}</p>
          <p><strong>Status:</strong> <span className="font-medium capitalize">{status.replace(/_/g, ' ')}</span></p>
        </div>
      );
    };
    ContractInfoDisplay.displayName = "ContractInfoDisplay";

    export const ContractStatusMessage = ({ status, currency, agreedPrice }) => {
      if (status === 'pending_payment') {
        return (
          <p className="text-xs text-muted-foreground text-center p-1 rounded bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700">
            <Info size={14} className="inline mr-1" /> Contract is active. Please pay the agreed amount ({currency} {agreedPrice}).
          </p>
        );
      }
      if (status === 'payment_confirmed') {
        return (
          <p className="text-xs text-muted-foreground text-center p-2 rounded bg-green-50 dark:bg-green-900/30 border border-green-300 dark:border-green-700">
            <CheckCircle size={14} className="inline mr-1" /> Payment Confirmed! Traveler, please proceed with delivery. Sender, await your item.
          </p>
        );
      }
      if (status === 'completed') {
        return (
          <p className="text-sm font-semibold text-green-600 dark:text-green-400 text-center p-3 bg-green-50 dark:bg-green-900/30 rounded-md">
            <CheckCircle size={18} className="inline mr-2" />This transaction is complete!
          </p>
        );
      }
      if (status === 'cancelled') {
        return (
          <p className="text-sm font-semibold text-red-600 dark:text-red-400 text-center p-3 bg-red-50 dark:bg-red-900/30 rounded-md">
            <XCircle size={18} className="inline mr-2" />This contract has been cancelled.
          </p>
        );
      }
      return null;
    };
    ContractStatusMessage.displayName = "ContractStatusMessage";