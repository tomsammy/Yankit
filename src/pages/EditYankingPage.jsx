import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Save, ArrowLeft, AlertCircle, ShieldCheck } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AirportSelect } from '@/components/AirportSelect';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { cn } from '@/lib/utils';
import { globalAirportsList } from '@/lib/airportData';
import { MAX_BAGGAGE_WEIGHT_PER_BAG, MAX_BAGS_PER_LISTING } from '@/config/constants';
import { Checkbox } from '@/components/ui/checkbox';

const EditYankingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const [data, setData] = useState({
    origin: null,
    destination: null,
    departure_date: null,
    number_of_bags: '1',
    estimated_distance_km: '',
    estimated_earnings: '',
    bag_handling_accepted: false,
  });
  
  const findAirportByLabel = useCallback(
    (label) =>
      globalAirportsList.find(a => a.label === label) || { label, value: label },
    []
  );

  const fetchYanking = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: row, error } = await supabase
        .from('yankings')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setData({
        origin: findAirportByLabel(row.origin),
        destination: findAirportByLabel(row.destination),
        departure_date: new Date(row.departure_date),
        number_of_bags: String(row.number_of_bags),
        estimated_distance_km: String(row.estimated_distance_km ?? ''),
        estimated_earnings: String(row.estimated_earnings ?? ''),
        bag_handling_accepted: !!row.bag_handling_accepted,
      });
      
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, [id, findAirportByLabel]);

  useEffect(() => {
    fetchYanking();
  }, [fetchYanking]);

  const update = (k, v) => setData(p => ({ ...p, [k]: v }));

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const bags = Number(data.number_of_bags);

      const { error } = await supabase
        .from('yankings')
        .update({
          origin: data.origin.label,
          destination: data.destination.label,
          departure_date: data.departure_date,
          number_of_bags: bags,
          available_space_kg: bags * MAX_BAGGAGE_WEIGHT_PER_BAG,
          estimated_distance_km: Number(data.estimated_distance_km),
          estimated_earnings: Number(data.estimated_earnings),
          bag_handling_accepted: data.bag_handling_accepted,
        })
        .eq('id', id);

      if (error) throw error;

      toast({ title: 'Updated', description: 'Yanking updated successfully' });
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
          <CardTitle>Edit Yanking</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">

            <div className='flex gap-2'>
                <div>
              <Label>Origin Airport</Label>
              <AirportSelect value={data.origin} onChange={v => update('origin', v)} />
            </div>

            <div>
              <Label>Destination Airport</Label>
              <AirportSelect value={data.destination} onChange={v => update('destination', v)} />
            </div>
            </div>
            <div>
              <Label>Departure Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start", !data.departure_date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {data.departure_date ? format(data.departure_date, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Calendar
                    mode="single"
                    selected={data.departure_date}
                    onSelect={v => update('departure_date', v)}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>Number of Bags</Label>
              <Select value={data.number_of_bags} onValueChange={v => update('number_of_bags', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(MAX_BAGS_PER_LISTING)].map((_, i) => (
                    <SelectItem key={i} value={`${i + 1}`}>
                      {i + 1} Bag{i > 0 ? 's' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <Label>Bag Handling Agreement</Label>
            </div>
            <div className="flex gap-3 items-start">
                <Checkbox
                checked={data.bag_handling_accepted}
                onCheckedChange={(v) =>
                    update('bag_handling_accepted', v === true)
                }
                disabled={isSaving}
                />
                <p className="text-sm leading-snug">
                I confirm that I will not open, tamper with, or alter the bag and will
                deliver it exactly as received.
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

export default EditYankingPage;
