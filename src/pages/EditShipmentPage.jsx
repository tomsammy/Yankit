import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, AlertCircle, Calendar as CalendarIcon, ShieldAlert } from 'lucide-react';
import { format } from 'date-fns';

import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { AirportSelect } from '@/components/AirportSelect';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { cn } from '@/lib/utils';
import { globalAirportsList } from '@/lib/airportData';
import { MAX_BAGGAGE_WEIGHT_PER_BAG, MAX_BAGS_PER_LISTING } from '@/config/constants';

const EditShipmentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isDateOpen, setIsDateOpen] = useState(false);

  const [data, setData] = useState({
    origin: null,
    destination: null,
    departure_date: null,
    number_of_bags: '1',
    bag_weight_kg: '',
    bag_length_cm: '',
    bag_width_cm: '',
    bag_height_cm: '',
    recipient_name: '',
    recipient_contact: '',
    dangerous_goods_declaration: false,
  });

  const findAirportByLabel = useCallback(
    (label) => globalAirportsList.find(a => a.label === label) || { label, value: label },
    []
  );

  const update = (k, v) => setData(p => ({ ...p, [k]: v }));

  const fetchShipment = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: row, error } = await supabase
        .from('shipments')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !row) throw error || new Error('Shipment not found');

      setData({
        origin: findAirportByLabel(row.origin),
        destination: findAirportByLabel(row.destination),
        departure_date: row.departure_date ? new Date(row.departure_date) : null,
        number_of_bags: String(row.number_of_bags ?? 1),

        bag_weight_kg: String(row.bag_weight_kg ?? ''),
        bag_length_cm: String(row.bag_length_cm ?? ''),
        bag_width_cm: String(row.bag_width_cm ?? ''),
        bag_height_cm: String(row.bag_height_cm ?? ''),

        recipient_name: row.recipient_name ?? '',
        recipient_contact: row.recipient_contact ?? '',
        dangerous_goods_declaration: !!row.dangerous_goods_declaration,
      });
    } catch (e) {
      setError(e.message);
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [id, toast, findAirportByLabel]);

  useEffect(() => {
    fetchShipment();
  }, [fetchShipment]);

  const save = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (!data.departure_date) throw new Error('Departure date is required');

      const bags = Number(data.number_of_bags);
      if (!Number.isFinite(bags) || bags < 1) throw new Error('Number of bags is invalid');

      const bagWeight = Number(data.bag_weight_kg);
      if (!Number.isFinite(bagWeight) || bagWeight <= 0) throw new Error('Bag weight is required');
      if (bagWeight > MAX_BAGGAGE_WEIGHT_PER_BAG)
        throw new Error(`Bag weight must be ≤ ${MAX_BAGGAGE_WEIGHT_PER_BAG}kg`);

      if (!data.recipient_name || !data.recipient_contact)
        throw new Error('Recipient details are required');

      if (!data.dangerous_goods_declaration)
        throw new Error('Dangerous goods declaration is required');

      const payload = {
        departure_date: data.departure_date,
        number_of_bags: bags,

        bag_weight_kg: bagWeight,
        bag_length_cm: Number(data.bag_length_cm),
        bag_width_cm: Number(data.bag_width_cm),
        bag_height_cm: Number(data.bag_height_cm),

        recipient_name: data.recipient_name,
        recipient_contact: data.recipient_contact,
        dangerous_goods_declaration: true,
      };

      const { error } = await supabase
        .from('shipments')
        .update(payload)
        .eq('id', id);

      if (error) throw error;

      toast({ title: 'Updated', description: 'Shipment updated successfully' });
      navigate('/my-listings');
    } catch (e) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="text-center py-10">
        <AlertCircle className="mx-auto mb-2 text-destructive" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <motion.div className="container mx-auto py-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Button variant="ghost" onClick={() => navigate('/my-listings')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <Card className="max-w-xl mx-auto mt-6">
        <CardHeader>
          <CardTitle>Edit Shipment</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={save} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Origin Airport</Label>
                <AirportSelect value={data.origin} isDisabled />
              </div>
              <div>
                <Label>Destination Airport</Label>
                <AirportSelect value={data.destination} isDisabled />
              </div>
            </div>

            <div>
              <Label>Departure Date</Label>
              <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn("w-full justify-start", !data.departure_date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {data.departure_date ? format(data.departure_date, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={data.departure_date}
                    onSelect={(d) => {
                      update('departure_date', d ?? null);
                      setIsDateOpen(false);
                    }}
                    disabled={(d) => d < new Date(new Date().setDate(new Date().getDate() - 1))}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>Number of Bags</Label>
              <Select value={data.number_of_bags} onValueChange={(v) => update('number_of_bags', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select bags" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(MAX_BAGS_PER_LISTING)].map((_, i) => (
                    <SelectItem key={i} value={`${i + 1}`}>
                      {i + 1} Bag{i === 0 ? '' : 's'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Bag Weight (kg)</Label>
              <Input
                type="number"
                value={data.bag_weight_kg}
                onChange={e => update('bag_weight_kg', e.target.value)}
              />
            </div>

            <div>
              <Label>Bag Dimensions (cm)</Label>
              <div className="grid grid-cols-3 gap-3">
                <Input placeholder="Length" value={data.bag_length_cm} onChange={e => update('bag_length_cm', e.target.value)} />
                <Input placeholder="Width" value={data.bag_width_cm} onChange={e => update('bag_width_cm', e.target.value)} />
                <Input placeholder="Height" value={data.bag_height_cm} onChange={e => update('bag_height_cm', e.target.value)} />
              </div>
            </div>

            <div>
              <Label>Recipient Name</Label>
              <Input value={data.recipient_name} onChange={e => update('recipient_name', e.target.value)} />
            </div>

            <div>
              <Label>Recipient Contact</Label>
              <Input value={data.recipient_contact} onChange={e => update('recipient_contact', e.target.value)} />
            </div>

            <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 mb-2">
                      <ShieldAlert className="h-4 w-4 text-primary" />
                      <Label>Dangerous Goods Declaration</Label>
                    </div>              
                    <div className="flex items-start gap-3">
                <Checkbox
                  checked={data.dangerous_goods_declaration}
                  onCheckedChange={(v) => update('dangerous_goods_declaration', v === true)}
                />
                <p className="text-sm leading-snug">
                  I confirm that no prohibited or dangerous items are included.
                </p>
              </div>
            </div>

            <Button type="submit" disabled={isSaving} className="w-full">
              {isSaving ? 'Saving…' : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EditShipmentPage;
