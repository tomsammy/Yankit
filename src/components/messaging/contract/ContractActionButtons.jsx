import React from 'react';
    import { Button } from '@/components/ui/button';
    import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog.jsx";
    import { CheckCircle, XCircle, Send, Loader2, MessageSquarePlus, CreditCard } from 'lucide-react';

    export const ProposeContractButton = ({ onClick, isLoading }) => (
      <Button onClick={onClick} disabled={isLoading} className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90">
        {isLoading ? <Loader2 className="animate-spin mr-2" /> : <MessageSquarePlus className="mr-2 h-5 w-5" />} Propose Contract
      </Button>
    );
    ProposeContractButton.displayName = "ProposeContractButton";

    export const AgreeButton = ({ onClick, isLoading, buttonText = "Agree to Contract" }) => (
      <Button onClick={onClick} disabled={isLoading} className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90">
        {isLoading ? <Loader2 className="animate-spin mr-2" /> : <CheckCircle className="mr-2 h-5 w-5" />} {buttonText}
      </Button>
    );
    AgreeButton.displayName = "AgreeButton";

    export const PaymentButtons = ({ onCardPayment, onMobileMoneyPayment, isLoading, currency, agreedPrice }) => (
      <div className="space-y-2">
        <Button onClick={onCardPayment} disabled={isLoading} className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90">
          {isLoading ? <Loader2 className="animate-spin mr-2" /> : <CreditCard className="mr-2 h-5 w-5" />} Pay {currency} {agreedPrice} with Card
        </Button>
        <Button onClick={onMobileMoneyPayment} variant="outline" disabled={isLoading} className="w-full">
          {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Send className="mr-2 h-5 w-5" />} Pay with Mobile Money
        </Button>
      </div>
    );
    PaymentButtons.displayName = "PaymentButtons";

    export const ConfirmDeliveryButton = ({ onClick, isLoading }) => (
      <Button onClick={onClick} disabled={isLoading} className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90">
        {isLoading ? <Loader2 className="animate-spin mr-2" /> : <CheckCircle className="mr-2 h-5 w-5" />} Confirm Item Received
      </Button>
    );
    ConfirmDeliveryButton.displayName = "ConfirmDeliveryButton";

    export const CancelContractButton = ({ onCancel, isLoading }) => (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" outline disabled={isLoading} className="w-full">
            {isLoading ? <Loader2 className="animate-spin mr-2" /> : <XCircle className="mr-2 h-5 w-5" />} Cancel Contract
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to cancel this contract?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Cancelling the contract will terminate the agreement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Contract</AlertDialogCancel>
            <AlertDialogAction onClick={onCancel} className="bg-destructive hover:bg-destructive/90">Confirm Cancellation</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
    CancelContractButton.displayName = "CancelContractButton";