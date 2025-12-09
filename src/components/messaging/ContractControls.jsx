import React, { useState, useEffect, useCallback } from 'react';
    import { supabase } from '@/lib/customSupabaseClient';
    import { Button } from '@/components/ui/button';
    import { useToast } from '@/components/ui/use-toast';
    import { AlertTriangle, CheckCircle, XCircle, Info, Send, FileText, ShieldCheck, MessageSquare, Star as StarIcon } from 'lucide-react';
    import {
      AlertDialog,
      AlertDialogAction,
      AlertDialogCancel,
      AlertDialogContent,
      AlertDialogDescription,
      AlertDialogFooter,
      AlertDialogHeader,
      AlertDialogTitle,
      AlertDialogTrigger,
    } from "@/components/ui/alert-dialog";
    import ReviewModal from '@/components/reviews/ReviewModal';

    const ContractControls = ({ contract, currentUserId, onContractUpdate, onSendMessage, conversationId, listingId, travelerUserId, senderUserId }) => {
      const { toast } = useToast();
      const [isLoading, setIsLoading] = useState(false);
      const [showReviewModal, setShowReviewModal] = useState(false);
      const [reviewTargetUser, setReviewTargetUser] = useState(null);
      const [reviewShipment, setReviewShipment] = useState(null);
      const [reviewTypeForModal, setReviewTypeForModal] = useState('');
      const [currentUserProfile, setCurrentUserProfile] = useState(null);
      const [otherUserProfile, setOtherUserProfile] = useState(null);

      const isTraveler = currentUserId === travelerUserId;
      const isSender = currentUserId === senderUserId;

      const fetchUserProfiles = useCallback(async () => {
        if (!currentUserId || (!travelerUserId && !senderUserId)) return;
        
        const { data: currentUserData, error: currentUserError } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .eq('id', currentUserId)
          .single();
        
        if (currentUserError) console.error("Error fetching current user profile:", currentUserError);
        else setCurrentUserProfile(currentUserData);

        const otherId = isTraveler ? senderUserId : travelerUserId;
        if (otherId) {
          const { data: otherUserData, error: otherUserError } = await supabase
            .from('profiles')
            .select('id, full_name, email')
            .eq('id', otherId)
            .single();
          
          if (otherUserError) console.error("Error fetching other user profile:", otherUserError);
          else setOtherUserProfile(otherUserData);
        }
      }, [currentUserId, travelerUserId, senderUserId, isTraveler]);

      useEffect(() => {
        fetchUserProfiles();
      }, [fetchUserProfiles]);
      
      const handleUpdateContractStatus = async (newStatus, successMessage, systemMessage) => {
        if (!contract?.id) {
          toast({ title: 'Error', description: 'No active contract to update.', variant: 'destructive' });
          return;
        }
        setIsLoading(true);
        try {
          const { data, error } = await supabase
            .from('shipments')
            .update({ status: newStatus })
            .eq('id', contract.id)
            .select()
            .single();

          if (error) throw error;
          onContractUpdate(data);
          toast({ title: 'Success', description: successMessage, className: 'bg-green-500 text-white' });
          if (systemMessage && onSendMessage) {
            onSendMessage(systemMessage);
          }

          if (newStatus === 'Delivered' || newStatus === 'Completed') {
            await triggerReviewPrompt(data);
          }

        } catch (error) {
          console.error('Error updating contract:', error);
          toast({ title: 'Error', description: `Failed to update contract: ${error.message}`, variant: 'destructive' });
        } finally {
          setIsLoading(false);
        }
      };

      const triggerReviewPrompt = async (completedShipment) => {
        if (!currentUserProfile || !otherUserProfile) {
          await fetchUserProfiles(); // Ensure profiles are loaded
        }

        const reviewTarget = isTraveler ? otherUserProfile : otherUserProfile;
        const type = isTraveler ? 'yanker_to_sender' : 'sender_to_yanker';

        if (!reviewTarget) {
            console.warn("Review target user profile not loaded yet.");
            return;
        }

        setReviewTargetUser(reviewTarget);
        setReviewShipment(completedShipment);
        setReviewTypeForModal(type);
        setShowReviewModal(true);
      };


      const handleCreateContract = async () => {
        if (!listingId || !currentUserId || !travelerUserId || !senderUserId) {
          toast({ title: 'Error', description: 'Missing information to create contract.', variant: 'destructive' });
          return;
        }
        setIsLoading(true);
        try {
          const { data, error } = await supabase
            .from('shipments')
            .insert({
              listing_id: listingId,
              shipper_user_id: senderUserId, 
              traveler_user_id: travelerUserId,
              agreed_weight_kg: 0, 
              agreed_price: 0, 
              status: 'Pending Confirmation',
              conversation_id: conversationId,
            })
            .select()
            .single();
      
          if (error) throw error;
          onContractUpdate(data);
          toast({ title: 'Success', description: 'Contract initiated! Awaiting confirmation.', className: 'bg-green-500 text-white' });
          if (onSendMessage) {
            onSendMessage(`System: Contract initiated by ${isSender ? 'Sender' : 'Traveler'}. Awaiting confirmation.`);
          }
        } catch (error) {
          console.error('Error creating contract:', error);
          toast({ title: 'Error', description: `Failed to create contract: ${error.message}`, variant: 'destructive' });
        } finally {
          setIsLoading(false);
        }
      };

      if (!contract && isSender) {
        return (
          <div className="p-3 border-b dark:border-slate-700 bg-slate-100 dark:bg-slate-900/50">
            <Button onClick={handleCreateContract} disabled={isLoading} className="w-full bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-white">
              <FileText size={18} className="mr-2" /> {isLoading ? 'Initiating...' : 'Initiate Shipment Contract'}
            </Button>
          </div>
        );
      }

      if (!contract) {
        return (
          <div className="p-3 border-b dark:border-slate-700 bg-slate-100 dark:bg-slate-900/50 text-center">
            <p className="text-sm text-muted-foreground dark:text-slate-400 flex items-center justify-center">
              <Info size={16} className="mr-2" /> Waiting for Sender to initiate the contract.
            </p>
          </div>
        );
      }
      
      const renderTravelerActions = () => {
        switch (contract.status) {
          case 'Pending Confirmation':
            return (
              <Button onClick={() => handleUpdateContractStatus('Awaiting Pickup', 'Contract confirmed! Ready for item pickup.', `System: Traveler confirmed the contract. Ready for item pickup.`)} disabled={isLoading} className="w-full bg-green-500 hover:bg-green-600 text-white">
                <CheckCircle size={18} className="mr-2" /> {isLoading ? 'Confirming...' : 'Confirm Contract'}
              </Button>
            );
          case 'Awaiting Pickup':
            return (
              <Button onClick={() => handleUpdateContractStatus('In Transit', 'Item picked up and in transit.', `System: Traveler marked item as picked up and in transit.`)} disabled={isLoading} className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                <Send size={18} className="mr-2" /> {isLoading ? 'Updating...' : 'Mark as In Transit'}
              </Button>
            );
          case 'Delivered':
             return (
              <div className="flex items-center justify-center text-green-600 dark:text-green-400">
                <CheckCircle size={18} className="mr-2" /> Item delivered. Waiting for Sender to complete.
              </div>
            );
          case 'Completed':
            return (
              <div className="flex items-center justify-center text-green-600 dark:text-green-400">
                <ShieldCheck size={18} className="mr-2" /> Transaction Completed!
              </div>
            );
          default:
            return null;
        }
      };

      const renderSenderActions = () => {
        switch (contract.status) {
          case 'Pending Confirmation':
            return (
              <div className="flex items-center justify-center text-orange-500 dark:text-orange-400">
                <Info size={18} className="mr-2" /> Awaiting Traveler's confirmation.
              </div>
            );
          case 'In Transit':
            return (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button disabled={isLoading} className="w-full bg-green-500 hover:bg-green-600 text-white">
                    <CheckCircle size={18} className="mr-2" /> {isLoading ? 'Processing...' : 'Mark as Delivered & Complete'}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Delivery?</AlertDialogTitle>
                    <AlertDialogDescription>
                      By confirming, you acknowledge that you have received the item(s) and the transaction will be marked as completed. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleUpdateContractStatus('Completed', 'Shipment marked as delivered and completed!', `System: Sender confirmed delivery. Transaction completed.`)} className="bg-green-500 hover:bg-green-600">
                      Confirm Delivery
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            );
          case 'Delivered': // This state is primarily for traveler, sender action is to complete.
             return (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button disabled={isLoading} className="w-full bg-green-500 hover:bg-green-600 text-white">
                    <CheckCircle size={18} className="mr-2" /> {isLoading ? 'Processing...' : 'Confirm Receipt & Complete'}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Receipt?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Confirming receipt will complete the transaction. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleUpdateContractStatus('Completed', 'Shipment receipt confirmed and completed!', `System: Sender confirmed receipt. Transaction completed.`)} className="bg-green-500 hover:bg-green-600">
                      Confirm Receipt
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            );
          case 'Completed':
            return (
              <div className="flex items-center justify-center text-green-600 dark:text-green-400">
                <ShieldCheck size={18} className="mr-2" /> Transaction Completed!
              </div>
            );
          default:
            return null;
        }
      };
      
      const renderCancelAction = () => {
        if (contract.status !== 'Completed' && contract.status !== 'Cancelled') {
          return (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled={isLoading} className="w-full mt-2">
                  <XCircle size={18} className="mr-2" /> {isLoading ? 'Cancelling...' : 'Cancel Contract'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to cancel?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will cancel the contract. This may have implications based on <span className="font-vernaccia-bold">Yankit</span>'s terms of service.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep Contract</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleUpdateContractStatus('Cancelled', 'Contract cancelled.', `System: Contract cancelled by ${isTraveler ? 'Traveler' : 'Sender'}.`)} className="bg-red-500 hover:bg-red-600">
                    Yes, Cancel Contract
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          );
        }
        return null;
      };

      return (
        <div className="p-3 border-b dark:border-slate-700 bg-slate-100 dark:bg-slate-900/50 space-y-2">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-semibold text-slate-700 dark:text-slate-200">Contract Status:</span>
            <span className={`px-2 py-1 text-xs rounded-full font-medium
              ${contract.status === 'In Transit' ? 'bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-blue-100' :
                contract.status === 'Delivered' ? 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100' :
                contract.status === 'Completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-700 dark:text-emerald-100' :
                contract.status === 'Awaiting Pickup' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-100' :
                contract.status === 'Pending Confirmation' ? 'bg-orange-100 text-orange-700 dark:bg-orange-700 dark:text-orange-100' :
                contract.status === 'Cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100' :
                'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-200'}`}>
              {contract.status}
            </span>
          </div>
          
          {isTraveler && renderTravelerActions()}
          {isSender && renderSenderActions()}
          {renderCancelAction()}

          {showReviewModal && currentUserProfile && otherUserProfile && reviewShipment && (
            <ReviewModal
              isOpen={showReviewModal}
              setIsOpen={setShowReviewModal}
              shipment={reviewShipment}
              currentUser={currentUserProfile}
              otherUser={otherUserProfile}
              reviewType={reviewTypeForModal}
              onReviewSubmitted={() => {
                toast({ title: 'Review recorded!', description: 'Thank you for your feedback.' });
              }}
            />
          )}
        </div>
      );
    };

    export default ContractControls;