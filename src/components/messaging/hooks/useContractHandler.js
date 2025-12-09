import { useState, useEffect, useCallback } from 'react';
    import { supabase } from '@/lib/customSupabaseClient';

    const PLATFORM_FEE_PERCENTAGE = 0.21;

    const useContractHandler = ({ conversationId, currentUserId, otherUserId, listingId, listingDetails, toast }) => {
      const [contract, setContract] = useState(null);
      const [isContractLoading, setIsContractLoading] = useState(false);
      const [contractFormData, setContractFormData] = useState({ 
        item_description: '', 
        agreed_price: '', // This will store the amount traveler receives
        currency: 'USD',
        item_weight_kg: '', // New field for weight if proposing based on listing
      });

      const fetchContract = useCallback(async () => {
        if (!conversationId) return;
        setIsContractLoading(true);
        try {
          const { data, error } = await supabase
            .from('contracts')
            .select('*')
            .eq('conversation_id', conversationId)
            .maybeSingle();
          
          if (error) throw error;

          setContract(data);
          if (data) {
            setContractFormData(prev => ({ 
              ...prev,
              item_description: data.item_description || '', 
              agreed_price: data.agreed_price || '', // Traveler's price
              currency: data.currency || 'USD',
              // item_weight_kg might not be stored directly on contract, or could be if needed
            }));
          } else {
             // If no contract, and we have listingDetails, pre-fill based on that
            if (listingDetails?.price_per_kg) {
                setContractFormData(prev => ({
                    ...prev,
                    item_description: '',
                    agreed_price: '', // Will be calculated if weight is entered
                    currency: 'USD',
                    item_weight_kg: '',
                }));
            } else {
                setContractFormData({ item_description: '', agreed_price: '', currency: 'USD', item_weight_kg: '' });
            }
          }
        } catch (error) {
          console.error('Error fetching contract:', error);
          toast({ title: 'Error', description: 'Could not load contract details.', variant: 'destructive' });
        } finally {
          setIsContractLoading(false);
        }
      }, [conversationId, toast, listingDetails]);

      useEffect(() => {
        fetchContract();
      }, [fetchContract]);
      
      const handleContractFormChange = useCallback((e) => {
        const { name, value } = e.target;
        setContractFormData(prev => ({ ...prev, [name]: value }));
      }, []);

      const handleProposeContract = async () => {
        if (!contractFormData.item_description.trim() || !contractFormData.currency) {
          toast({ title: 'Missing Information', description: 'Please fill in item description and currency.', variant: 'destructive' });
          return;
        }

        let finalAgreedPrice = parseFloat(contractFormData.agreed_price);

        if (listingDetails?.price_per_kg && contractFormData.item_weight_kg) {
            const travelerPricePerKg = parseFloat(listingDetails.price_per_kg);
            const itemWeight = parseFloat(contractFormData.item_weight_kg);
            if (isNaN(travelerPricePerKg) || isNaN(itemWeight) || itemWeight <= 0) {
                toast({ title: 'Invalid Input', description: 'Please enter a valid item weight.', variant: 'destructive' });
                return;
            }
            finalAgreedPrice = travelerPricePerKg * itemWeight;
        } else if (isNaN(finalAgreedPrice) || finalAgreedPrice <= 0) {
            toast({ title: 'Invalid Price', description: 'Please ensure a valid price for the traveler.', variant: 'destructive' });
            return;
        }


        setIsContractLoading(true);
        try {
          const itemSenderId = currentUserId; 
          const itemTravelerId = otherUserId;

          const { data, error } = await supabase.from('contracts').insert({
            conversation_id: conversationId,
            listing_id: listingId, 
            sender_user_id: itemSenderId,
            traveler_user_id: itemTravelerId,
            item_description: contractFormData.item_description,
            agreed_price: finalAgreedPrice, // This is the amount the traveler receives
            currency: contractFormData.currency,
            status: 'pending_agreement',
            updated_at: new Date().toISOString(), 
            created_at: new Date().toISOString(), 
          }).select().single();

          if (error) throw error;
          
          setContract(data);
          // Update form data to reflect the actual proposed price (traveler's share)
          setContractFormData(prev => ({ ...prev, agreed_price: data.agreed_price.toString() }));
          toast({ title: 'Success', description: 'Contract proposed.' });
        } catch (error) {
          console.error('Error proposing contract:', error);
          toast({ title: 'Error', description: `Could not propose contract. ${error.message}`, variant: 'destructive' });
        } finally {
          setIsContractLoading(false);
        }
      };
      
      const handleAgreeToContract = async () => {
        if (!contract) return;
        setIsContractLoading(true);
        
        const updates = { updated_at: new Date().toISOString() };
        let newStatus = contract.status;
        let canAgree = false;

        if (currentUserId === contract.sender_user_id && !contract.sender_agreed_at) {
          updates.sender_agreed_at = new Date().toISOString();
          newStatus = contract.traveler_agreed_at ? 'active' : 'sender_agreed';
          canAgree = true;
        } else if (currentUserId === contract.traveler_user_id && !contract.traveler_agreed_at) {
          updates.traveler_agreed_at = new Date().toISOString();
          newStatus = contract.sender_agreed_at ? 'active' : 'traveler_agreed';
          canAgree = true;
        }
        
        if (!canAgree) {
           toast({ title: 'Info', description: 'You have already agreed or cannot agree to this contract at this stage.' });
           setIsContractLoading(false);
           return;
        }
        updates.status = newStatus;

        try {
          const { data, error } = await supabase
            .from('contracts')
            .update(updates)
            .eq('id', contract.id)
            .select()
            .single();

          if (error) throw error;

          setContract(data);
          toast({ title: 'Success', description: 'You agreed to the contract.' });
          if (data.status === 'active') {
            const travelerReceives = parseFloat(data.agreed_price);
            const platformFee = travelerReceives * PLATFORM_FEE_PERCENTAGE;
            const senderPays = travelerReceives + platformFee;
            toast({ 
                title: 'Contract Active!', 
                description: `Both parties agreed. Traveler receives $${travelerReceives.toFixed(2)}. Sender to pay $${senderPays.toFixed(2)}. Sender can now proceed to payment.`,
                duration: 7000 
            });
          }
        } catch (error) {
          console.error('Error agreeing to contract:', error);
          toast({ title: 'Error', description: `Could not agree to contract. ${error.message}`, variant: 'destructive' });
        } finally {
          setIsContractLoading(false);
        }
      };

      return {
        contract,
        setContract,
        isContractLoading,
        contractFormData,
        handleContractFormChange,
        handleProposeContract,
        handleAgreeToContract,
      };
    };

    export default useContractHandler;