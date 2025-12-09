import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

const generateTrackingEvents = (shipment) => {
    if (!shipment) return [];

    const events = [];
    const { status, created_at, updated_at, listing } = shipment;

    events.push({
        title: 'Shipment Created',
        description: 'Agreement between sender and traveler has been finalized.',
        date: new Date(created_at),
        isComplete: true,
    });
    
    if (listing?.departure_date) {
        events.push({
            title: 'Awaiting Pickup',
            description: `Traveler is scheduled to pick up the item for departure on ${new Date(listing.departure_date).toLocaleDateString()}.`,
            date: new Date(listing.departure_date),
            isComplete: ['in_transit', 'delivery_pending', 'completed', 'delivered'].includes(status),
        });
    }

    const inTransit = ['in_transit', 'delivery_pending', 'completed', 'delivered'].includes(status);
    if (inTransit) {
        events.push({
            title: 'In Transit',
            description: 'The traveler has started their journey with the item.',
            date: new Date(updated_at), // Placeholder date
            isComplete: true,
        });
    } else {
        events.push({
            title: 'In Transit',
            description: 'Waiting for the traveler to begin the journey.',
            date: null,
            isComplete: false,
        });
    }
    
    const deliveryPending = ['delivery_pending', 'completed', 'delivered'].includes(status);
    if (deliveryPending) {
        events.push({
            title: 'Out for Delivery',
            description: 'The traveler has arrived and is coordinating delivery with the recipient.',
            date: new Date(updated_at), // Placeholder date
            isComplete: true,
        });
    } else {
         events.push({
            title: 'Out for Delivery',
            description: 'Waiting for traveler to arrive at destination.',
            date: null,
            isComplete: false,
        });
    }
    
    const delivered = ['completed', 'delivered'].includes(status);
    if (delivered) {
         events.push({
            title: 'Delivered',
            description: 'The item has been successfully delivered to the recipient.',
            date: new Date(updated_at), // This should be the actual delivery date if available
            isComplete: true,
        });
    } else {
        events.push({
            title: 'Delivered',
            description: 'Awaiting confirmation of delivery.',
            date: null,
            isComplete: false,
        });
    }

    return events.sort((a, b) => {
        if (!a.date) return 1;
        if (!b.date) return -1;
        return a.date - b.date;
    });
};

const useShipmentTracking = (shipmentId) => {
    const [shipment, setShipment] = useState(null);
    const [trackingEvents, setTrackingEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchShipmentDetails = useCallback(async () => {
        if (!shipmentId) {
            setError("Shipment ID is missing.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { data, error: shipmentError } = await supabase
                .from('shipments')
                .select(`
                    *,
                    listing:listings(*),
                    sender_profile:profiles!shipments_shipper_user_id_fkey(full_name, avatar_url),
                    traveler_profile:profiles!shipments_traveler_user_id_fkey(full_name, avatar_url)
                `)
                .eq('id', shipmentId)
                .single();

            if (shipmentError) {
                throw shipmentError;
            }

            if (!data) {
                throw new Error("Shipment not found.");
            }
            
            setShipment(data);
            setTrackingEvents(generateTrackingEvents(data));

        } catch (err) {
            console.error("Error fetching shipment details:", err);
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    }, [shipmentId]);

    useEffect(() => {
        fetchShipmentDetails();
    }, [fetchShipmentDetails]);

    return { shipment, trackingEvents, loading, error };
};

export default useShipmentTracking;