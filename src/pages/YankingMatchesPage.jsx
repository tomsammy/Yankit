import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import AuthWall from '@/components/auth/AuthWall';

const YankingMatchesPage = () => {
  const { yankingId } = useParams();
  const { session } = useAuth();
  const navigate = useNavigate();

  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!session || !yankingId) return;

    const fetchMatches = async () => {
      setLoading(true);

      const { data: yanking } = await supabase
        .from('yankings')
        .select('*')
        .eq('id', yankingId)
        .single();

      if (!yanking) {
        setLoading(false);
        return;
      }

      const matchDate = new Date(yanking.departure_date)
        .toISOString()
        .split('T')[0];

      const { data } = await supabase
        .from('shipments')
        .select('*')
        .eq('origin', yanking.origin)
        .eq('destination', yanking.destination)
        .eq('departure_date', matchDate)
        .eq('status', 'open')
        .is('traveler_user_id', null)
        .neq('shipper_user_id', yanking.yanker_user_id)
        .lte('agreed_weight_kg', yanking.available_space_kg)
        .lte('number_of_bags', yanking.number_of_bags);

      setShipments(data || []);
      setLoading(false);
    };

    fetchMatches();
  }, [session, yankingId]);

  const confirmOffer = async () => {
    if (!selectedShipment || !session) return;

    setConfirming(true);

    const { error } = await supabase.rpc('assign_shipment_to_yanking', {
      p_shipment_id: selectedShipment.id,
      p_yanking_id: yankingId,
      p_yanker_id: session.user.id,
    });

    setConfirming(false);

    if (!error) {
      navigate('/dashboard');
    }
  };

  if (!session) {
    return <AuthWall message="You need to be signed in to view matches." />;
  }

  return (
    <>
      <Helmet>
        <title>Matching Shipments | Yankit</title>
      </Helmet>

      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <h1 className="text-2xl font-semibold mb-2">Matching Shipments</h1>
        <p className="text-sm text-muted-foreground mb-6">
          These shipments match your route, date, and available baggage space.
        </p>

        {loading && (
          <div className="py-12 text-center text-muted-foreground">
            Looking for matching shipments...
          </div>
        )}

        {!loading && shipments.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center space-y-4">
              <div className="text-lg font-medium">
                No matching shipments right now
              </div>
              <div className="text-sm text-muted-foreground">
                You’ll be notified when a shipment matches your route.
              </div>
              <Button onClick={() => navigate('/dashboard')}>
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        )}

        {!loading && shipments.length > 0 && (
          <div className="grid gap-4">
            {shipments.map((s) => (
              <Card key={s.id}>
                <CardContent className="p-6 flex flex-col gap-3">
                  <div className="flex justify-between">
                    <div className="font-medium">
                      {s.origin} → {s.destination}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {s.currency} {s.agreed_price.toFixed(2)}
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    {s.number_of_bags} bag(s) • {s.agreed_weight_kg} kg
                  </div>

                  <Button onClick={() => setSelectedShipment(s)}>
                    Offer to Carry
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!selectedShipment} onOpenChange={() => setSelectedShipment(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Shipment</DialogTitle>
          </DialogHeader>

          {selectedShipment && (
            <div className="space-y-2 text-sm">
              <div><b>Route:</b> {selectedShipment.origin} → {selectedShipment.destination}</div>
              <div><b>Date:</b> {selectedShipment.departure_date}</div>
              <div><b>Bags:</b> {selectedShipment.number_of_bags}</div>
              <div><b>Total Weight:</b> {selectedShipment.agreed_weight_kg} kg</div>
              <div><b>Payout:</b> {selectedShipment.currency} {selectedShipment.agreed_price}</div>
              <div><b>Recipient:</b> {selectedShipment.recipient_name}</div>
              <div><b>Contact:</b> {selectedShipment.recipient_contact}</div>
            </div>
          )}

          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => setSelectedShipment(null)}>
              Cancel
            </Button>
            <Button onClick={confirmOffer} disabled={confirming}>
              {confirming ? 'Confirming...' : 'Confirm & Accept'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default YankingMatchesPage;
