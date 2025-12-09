import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Edit, Save, ArrowLeft, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AirportSelect } from '@/components/AirportSelect';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { cn } from '@/lib/utils';

const pageVariants = {
  initial: { opacity: 0, x: -50 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: 50 },
};

const EditListingPage = () => {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [listing, setListing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    departure_date: null,
    number_of_bags: 1,
    available_space_kg: 20,
  });

  const fetchListing = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', listingId)
        .single();

      if (error) throw error;
      if (!data) throw new Error("Listing not found.");

      setListing(data);
      setFormData({
        origin: data.origin,
        destination: data.destination,
        departure_date: new Date(data.departure_date),
        number_of_bags: data.number_of_bags,
        available_space_kg: data.available_space_kg,
      });

    } catch (err) {
      console.error("Error fetching listing:", err);
      setError("Could not load the listing data. It might have been deleted.");
      toast({
        title: "Error",
        description: `Failed to fetch listing: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [listingId, toast]);

  useEffect(() => {
    fetchListing();
  }, [fetchListing]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleBagChange = (value) => {
    const bags = parseInt(value, 10);
    setFormData(prev => ({
        ...prev,
        number_of_bags: bags,
        available_space_kg: bags * 20,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    const { origin, destination, departure_date, number_of_bags, available_space_kg } = formData;
    if (!origin || !destination || !departure_date) {
        toast({ title: "Missing Information", description: "Please fill all fields.", variant: "destructive" });
        setIsSaving(false);
        return;
    }

    try {
      const { error } = await supabase
        .from('listings')
        .update({
          origin,
          destination,
          departure_date: departure_date.toISOString(),
          number_of_bags,
          available_space_kg,
        })
        .eq('id', listingId);

      if (error) throw error;

      toast({
        title: "Success! ✨",
        description: "Your listing has been updated successfully.",
      });
      navigate('/my-listings');

    } catch (err) {
      console.error("Error updating listing:", err);
      toast({
        title: "Update Failed",
        description: `Could not update listing: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[calc(100vh-180px)]"><LoadingSpinner size="lg" /></div>;
  }

  if (error) {
    return (
        <div className="container mx-auto py-12 px-4 md:px-6 flex flex-col items-center justify-center text-center min-h-[calc(100vh-180px)]">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Oops! Something went wrong.</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={() => navigate('/my-listings')}><ArrowLeft className="mr-2 h-4 w-4" /> Back to My Listings</Button>
        </div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
      transition={{ duration: 0.4 }}
      className="container mx-auto py-12 px-4 md:px-6"
    >
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" onClick={() => navigate('/my-listings')} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Listings
        </Button>
        <Card className="glassmorphism dark:bg-slate-800/50">
          <CardHeader>
            <div className="flex items-center gap-4">
                <Edit className="w-8 h-8 text-primary" />
                <div>
                    <CardTitle className="text-3xl font-bold text-foreground dark:text-white">Edit Listing</CardTitle>
                    <CardDescription className="text-muted-foreground dark:text-slate-400">Update the details of your baggage space offer.</CardDescription>
                </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="origin">Origin</Label>
                  <AirportSelect type="origin" value={formData.origin} onChange={(value) => handleInputChange('origin', value)} />
                </div>
                <div>
                  <Label htmlFor="destination">Destination</Label>
                  <AirportSelect type="destination" value={formData.destination} onChange={(value) => handleInputChange('destination', value)} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="departure_date">Departure Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.departure_date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.departure_date ? format(formData.departure_date, "PPP") : <span>Pick a date</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={formData.departure_date}
                            onSelect={(date) => handleInputChange('departure_date', date)}
                            disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                </div>
                <div>
                    <Label htmlFor="number_of_bags">Number of Bags</Label>
                    <Select onValueChange={handleBagChange} defaultValue={String(formData.number_of_bags)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select bags" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">1 Bag (20kg)</SelectItem>
                            <SelectItem value="2">2 Bags (40kg)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
              </div>

              <div>
                <Label>Available Space (kg)</Label>
                <Input value={formData.available_space_kg} disabled />
              </div>

              <Button type="submit" className="w-full" disabled={isSaving}>
                {isSaving ? <LoadingSpinner /> : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default EditListingPage;