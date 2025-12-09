import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { motion } from 'framer-motion';

const DashboardProfileTab = ({ profile, session, onProfileUpdate, stats }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    first_name: '',
    surname: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state_province_region: '',
    postal_code: '',
    country: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || session?.user?.user_metadata.full_name || '',
        email: profile.email || session?.user?.email || '',
        first_name: profile.first_name || session?.user?.user_metadata.first_name || '',
        surname: profile.surname || session?.user?.user_metadata.surname || '',
        address_line1: profile.address_line1 || '',
        address_line2: profile.address_line2 || '',
        city: profile.city || '',
        state_province_region: profile.state_province_region || '',
        postal_code: profile.postal_code || '',
        country: profile.country || '',
      });
    }
  }, [profile, session]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onProfileUpdate(formData);
      toast({
        title: 'Profile Updated! 🎉',
        description: 'Your profile information has been successfully saved.',
        variant: 'success',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Uh oh! Something went wrong.',
        description: 'There was an error saving your profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      

      <Card className="bg-background/80 dark:bg-slate-900/80 shadow-lg border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary dark:text-white">Personal Information</CardTitle>
          <CardDescription className="text-muted-foreground dark:text-slate-400">
            Update your personal details and email address.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name" className="text-sm font-medium text-gray-700 dark:text-slate-300">First Name</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
              </div>
              <div>
                <Label htmlFor="surname" className="text-sm font-medium text-gray-700 dark:text-slate-300">Surname</Label>
                <Input
                  id="surname"
                  value={formData.surname}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-slate-300">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-slate-700 dark:border-slate-600 dark:text-white cursor-not-allowed"
              />
              <p className="mt-2 text-sm text-muted-foreground dark:text-slate-400">
                Email address cannot be changed here. Please contact support to update your email.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-primary dark:text-white mt-8 mb-4">Address Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="address_line1" className="text-sm font-medium text-gray-700 dark:text-slate-300">Address Line 1</Label>
                <Input
                  id="address_line1"
                  value={formData.address_line1}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
              </div>
              <div>
                <Label htmlFor="address_line2" className="text-sm font-medium text-gray-700 dark:text-slate-300">Address Line 2 (Optional)</Label>
                <Input
                  id="address_line2"
                  value={formData.address_line2}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
              </div>
              <div>
                <Label htmlFor="city" className="text-sm font-medium text-gray-700 dark:text-slate-300">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
              </div>
              <div>
                <Label htmlFor="state_province_region" className="text-sm font-medium text-gray-700 dark:text-slate-300">State/Province/Region</Label>
                <Input
                  id="state_province_region"
                  value={formData.state_province_region}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
              </div>
              <div>
                <Label htmlFor="postal_code" className="text-sm font-medium text-gray-700 dark:text-slate-300">Postal Code</Label>
                <Input
                  id="postal_code"
                  value={formData.postal_code}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
              </div>
              <div>
                <Label htmlFor="country" className="text-sm font-medium text-gray-700 dark:text-slate-300">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full md:w-auto bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-bold py-2 px-6 rounded-md shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
              disabled={isSaving}
            >
              {isSaving ? <LoadingSpinner /> : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DashboardProfileTab;