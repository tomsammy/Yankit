import React, { useState, useEffect, useCallback } from 'react';
    import { supabase } from '@/lib/customSupabaseClient';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { useToast } from '@/components/ui/use-toast';
    import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
    import { UploadCloud, UserCircle, MapPin, Loader2 } from 'lucide-react';

    const australianStates = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"];

    const AvatarUpload = React.memo(({ avatarUrl, onAvatarChange, userInitial }) => (
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="w-32 h-32 border-4 border-primary dark:border-purple-400 shadow-lg">
          <AvatarImage src={avatarUrl} alt="User Avatar" />
          <AvatarFallback className="text-4xl bg-slate-200 dark:bg-slate-700 text-primary dark:text-purple-300">
            {userInitial ? userInitial : <UserCircle size={60} />}
          </AvatarFallback>
        </Avatar>
        <div className="relative">
          <Button type="button" variant="outline" className="dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700">
            <UploadCloud size={16} className="mr-2" /> Change Photo
          </Button>
          <Input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={onAvatarChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>
    ));
    AvatarUpload.displayName = "AvatarUpload";

    const NameFields = React.memo(({ firstName, setFirstName, surname, setSurname }) => (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="firstName" className="text-slate-700 dark:text-slate-300">First Name</Label>
          <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Enter your first name" className="dark:bg-slate-700 dark:text-white dark:border-slate-600" />
        </div>
        <div>
          <Label htmlFor="surname" className="text-slate-700 dark:text-slate-300">Surname</Label>
          <Input id="surname" value={surname} onChange={(e) => setSurname(e.target.value)} placeholder="Enter your surname" className="dark:bg-slate-700 dark:text-white dark:border-slate-600" />
        </div>
      </div>
    ));
    NameFields.displayName = "NameFields";

    const AustralianAddressInputSection = React.memo(({ australianAddressInput, handleAustralianAddressInputChange, handleAustralianAddressBlur }) => (
       <div className="space-y-4 p-4 border border-primary/30 dark:border-purple-500/30 rounded-lg shadow-sm bg-primary/5 dark:bg-purple-900/10">
        <h3 className="text-lg font-semibold text-primary dark:text-purple-300 flex items-center">
          <MapPin size={20} className="mr-2" />
          Australian Address
        </h3>
        <div>
          <Label htmlFor="australianAddressInput" className="text-slate-700 dark:text-slate-300">Enter Full Australian Address</Label>
          <Input 
            id="australianAddressInput" 
            value={australianAddressInput} 
            onChange={handleAustralianAddressInputChange}
            onBlur={handleAustralianAddressBlur}
            placeholder="e.g., 50 Wayworth Court, Bondi, NSW 2000" 
            className="dark:bg-slate-700 dark:text-white dark:border-slate-600 focus:ring-primary dark:focus:ring-purple-500" 
          />
          <p className="text-xs text-muted-foreground dark:text-slate-400 mt-1">
            Type your full address, and we'll try to populate the fields below.
          </p>
        </div>
      </div>
    ));
    AustralianAddressInputSection.displayName = "AustralianAddressInputSection";

    const AddressDetailFields = React.memo(({ addressLine1, setAddressLine1, addressLine2, setAddressLine2, suburb, setSuburb, stateProvinceRegion, setStateProvinceRegion, postalCode, setPostalCode, country, setCountry }) => (
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100">Address Details</h3>
        <div>
          <Label htmlFor="addressLine1" className="text-slate-700 dark:text-slate-300">Street Name & Number (Line 1)</Label>
          <Input id="addressLine1" value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} placeholder="e.g., 50 Wayworth Court or 1/50 Wayworth Court" className="dark:bg-slate-700 dark:text-white dark:border-slate-600" />
        </div>
        <div>
          <Label htmlFor="addressLine2" className="text-slate-700 dark:text-slate-300">Unit/Apartment (Line 2 - Optional)</Label>
          <Input id="addressLine2" value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} placeholder="Apartment, suite, unit, building, floor, etc." className="dark:bg-slate-700 dark:text-white dark:border-slate-600" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="suburb" className="text-slate-700 dark:text-slate-300">Suburb</Label>
            <Input id="suburb" value={suburb} onChange={(e) => setSuburb(e.target.value)} placeholder="e.g., Bondi" className="dark:bg-slate-700 dark:text-white dark:border-slate-600" />
          </div>
          <div>
            <Label htmlFor="stateProvinceRegion" className="text-slate-700 dark:text-slate-300">State</Label>
            <Input id="stateProvinceRegion" value={stateProvinceRegion} onChange={(e) => setStateProvinceRegion(e.target.value)} placeholder="e.g., NSW" className="dark:bg-slate-700 dark:text-white dark:border-slate-600" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="postalCode" className="text-slate-700 dark:text-slate-300">Postcode</Label>
            <Input id="postalCode" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="e.g., 2000" className="dark:bg-slate-700 dark:text-white dark:border-slate-600" />
          </div>
          <div>
            <Label htmlFor="country" className="text-slate-700 dark:text-slate-300">Country</Label>
            <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Enter your country" disabled className="bg-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-600" />
          </div>
        </div>
      </div>
    ));
    AddressDetailFields.displayName = "AddressDetailFields";

    const VerificationFields = React.memo(({ licenseNumber, setLicenseNumber, licenseCardNumber, setLicenseCardNumber }) => (
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100">Verification Details</h3>
        <p className="text-sm text-muted-foreground dark:text-slate-400">These details are used for security verification purposes.</p>
        <div>
          <Label htmlFor="licenseNumber" className="text-slate-700 dark:text-slate-300">License Number</Label>
          <Input id="licenseNumber" value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} placeholder="Enter your license number" className="dark:bg-slate-700 dark:text-white dark:border-slate-600" />
        </div>
        <div>
          <Label htmlFor="licenseCardNumber" className="text-slate-700 dark:text-slate-300">License Card Number</Label>
          <Input id="licenseCardNumber" value={licenseCardNumber} onChange={(e) => setLicenseCardNumber(e.target.value)} placeholder="Enter your license card number" className="dark:bg-slate-700 dark:text-white dark:border-slate-600" />
        </div>
      </div>
    ));
    VerificationFields.displayName = "VerificationFields";

    const useProfileFormState = (initialProfile) => {
      const [firstName, setFirstName] = useState('');
      const [surname, setSurname] = useState('');
      const [australianAddressInput, setAustralianAddressInput] = useState('');
      const [addressLine1, setAddressLine1] = useState('');
      const [addressLine2, setAddressLine2] = useState(''); 
      const [suburb, setSuburb] = useState(''); 
      const [stateProvinceRegion, setStateProvinceRegion] = useState('');
      const [postalCode, setPostalCode] = useState('');
      const [country, setCountry] = useState('Australia'); 
      const [licenseNumber, setLicenseNumber] = useState('');
      const [licenseCardNumber, setLicenseCardNumber] = useState('');
      const [avatarUrl, setAvatarUrl] = useState(null);
      const [avatarFile, setAvatarFile] = useState(null);

      useEffect(() => {
        if (initialProfile) {
          setFirstName(initialProfile.first_name || '');
          setSurname(initialProfile.surname || '');
          setAddressLine1(initialProfile.address_line1 || '');
          setAddressLine2(initialProfile.address_line2 || '');
          setSuburb(initialProfile.city || ''); 
          setStateProvinceRegion(initialProfile.state_province_region || '');
          setPostalCode(initialProfile.postal_code || '');
          setCountry(initialProfile.country || 'Australia');
          setLicenseNumber(initialProfile.license_number || '');
          setLicenseCardNumber(initialProfile.license_card_number || '');
          setAvatarUrl(initialProfile.avatar_url || null);

          if(initialProfile.address_line1 && initialProfile.city && initialProfile.state_province_region && initialProfile.postal_code) {
            setAustralianAddressInput(
              `${initialProfile.address_line1}${initialProfile.address_line2 ? `, ${initialProfile.address_line2}` : ''}, ${initialProfile.city}, ${initialProfile.state_province_region} ${initialProfile.postal_code}`.trim()
            );
          } else {
            setAustralianAddressInput('');
          }
        }
      }, [initialProfile]);

      return {
        firstName, setFirstName, surname, setSurname,
        australianAddressInput, setAustralianAddressInput,
        addressLine1, setAddressLine1, addressLine2, setAddressLine2,
        suburb, setSuburb, stateProvinceRegion, setStateProvinceRegion,
        postalCode, setPostalCode, country, setCountry,
        licenseNumber, setLicenseNumber, licenseCardNumber, setLicenseCardNumber,
        avatarUrl, setAvatarUrl, avatarFile, setAvatarFile
      };
    };


    const ProfileForm = ({ profile: initialProfile, session, onProfileUpdate }) => {
      const { toast } = useToast();
      const [loading, setLoading] = useState(false);
      const formState = useProfileFormState(initialProfile);

      const parseAustralianAddress = useCallback((addressString) => {
        if (!addressString) {
          formState.setAddressLine1(''); formState.setAddressLine2(''); formState.setSuburb(''); formState.setStateProvinceRegion(''); formState.setPostalCode('');
          return;
        }
        const parts = addressString.split(',').map(part => part.trim());
        let streetNumName = '', parsedSuburb = '', parsedState = '', parsedPostcode = '';

        if (parts.length > 0) streetNumName = parts[0];
        formState.setAddressLine1(streetNumName);

        if (parts.length > 1) parsedSuburb = parts[1];
        formState.setSuburb(parsedSuburb);
        
        if (parts.length > 2) {
            const statePostcodePart = parts[parts.length - 1];
            const postcodeMatch = statePostcodePart.match(/\b\d{4}\b/);
            if (postcodeMatch) {
                parsedPostcode = postcodeMatch[0];
                const statePart = statePostcodePart.replace(parsedPostcode, '').trim().toUpperCase();
                if (australianStates.includes(statePart)) parsedState = statePart;
            } else {
                 const statePartOnly = statePostcodePart.trim().toUpperCase();
                 if (australianStates.includes(statePartOnly)) parsedState = statePartOnly;
            }
        }
        formState.setStateProvinceRegion(parsedState);
        formState.setPostalCode(parsedPostcode);
        formState.setCountry('Australia');
      }, [formState]);

      const handleAustralianAddressInputChange = (e) => {
        const newAddress = e.target.value;
        formState.setAustralianAddressInput(newAddress);
        parseAustralianAddress(newAddress);
      };
      
      const handleAustralianAddressBlur = () => parseAustralianAddress(formState.australianAddressInput);

      const handleAvatarChange = (event) => {
        if (event.target.files && event.target.files[0]) {
          const file = event.target.files[0];
          formState.setAvatarFile(file);
          formState.setAvatarUrl(URL.createObjectURL(file));
        }
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        if (!session?.user) {
          toast({ title: 'Error', description: 'You must be logged in to update your profile.', variant: 'destructive' });
          return;
        }
        setLoading(true);
        let newAvatarPublicUrl = formState.avatarUrl;

        if (formState.avatarFile) {
          const fileExt = formState.avatarFile.name.split('.').pop();
          const filePath = `${session.user.id}/avatar.${fileExt}`;
          const { data: uploadData, error: uploadError } = await supabase.storage.from('avatars').upload(filePath, formState.avatarFile, { cacheControl: '3600', upsert: true });
          if (uploadError) {
            toast({ title: 'Error Uploading Avatar', description: uploadError.message, variant: 'destructive' });
            setLoading(false); return;
          }
          if (uploadData) {
            const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(uploadData.path);
            newAvatarPublicUrl = `${publicUrlData.publicUrl}?t=${new Date().getTime()}`;
          }
        }
        
        const updatedFullName = `${formState.firstName} ${formState.surname}`.trim();
        const updates = {
          id: session.user.id, first_name: formState.firstName, surname: formState.surname, full_name: updatedFullName, 
          address_line1: formState.addressLine1, address_line2: formState.addressLine2, city: formState.suburb, 
          state_province_region: formState.stateProvinceRegion, postal_code: formState.postalCode, country: formState.country,
          license_number: formState.licenseNumber, license_card_number: formState.licenseCardNumber,
          avatar_url: newAvatarPublicUrl, updated_at: new Date(),
        };

        const { error: updateError } = await supabase.from('profiles').upsert(updates, { returning: 'minimal' });
        if (updateError) {
          toast({ title: 'Error Updating Profile', description: updateError.message, variant: 'destructive' });
        } else {
          formState.setAvatarUrl(newAvatarPublicUrl); 
          toast({ title: 'Profile Updated', description: 'Your profile has been successfully updated.', variant: 'default', className: "bg-green-500 dark:bg-green-600 text-white" });
          if (onProfileUpdate) onProfileUpdate(); 
        }
        setLoading(false);
      };
      
      const userInitial = formState.firstName ? formState.firstName.charAt(0).toUpperCase() : (session?.user?.email ? session.user.email.charAt(0).toUpperCase() : '?');

      return (
        <form onSubmit={handleSubmit} className="space-y-8">
          <AvatarUpload avatarUrl={formState.avatarUrl} onAvatarChange={handleAvatarChange} userInitial={userInitial} />
          <NameFields firstName={formState.firstName} setFirstName={formState.setFirstName} surname={formState.surname} setSurname={formState.setSurname} />
          <div>
            <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">Email</Label>
            <Input id="email" type="email" value={session?.user?.email || ''} readOnly disabled className="bg-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-600" />
          </div>
          <AustralianAddressInputSection 
            australianAddressInput={formState.australianAddressInput} 
            handleAustralianAddressInputChange={handleAustralianAddressInputChange} 
            handleAustralianAddressBlur={handleAustralianAddressBlur} 
          />
          <AddressDetailFields 
            addressLine1={formState.addressLine1} setAddressLine1={formState.setAddressLine1}
            addressLine2={formState.addressLine2} setAddressLine2={formState.setAddressLine2}
            suburb={formState.suburb} setSuburb={formState.setSuburb}
            stateProvinceRegion={formState.stateProvinceRegion} setStateProvinceRegion={formState.setStateProvinceRegion}
            postalCode={formState.postalCode} setPostalCode={formState.setPostalCode}
            country={formState.country} setCountry={formState.setCountry}
          />
          <VerificationFields 
            licenseNumber={formState.licenseNumber} setLicenseNumber={formState.setLicenseNumber}
            licenseCardNumber={formState.licenseCardNumber} setLicenseCardNumber={formState.setLicenseCardNumber}
          />
          <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white dark:from-purple-500 dark:to-indigo-600 dark:hover:from-purple-600 dark:hover:to-indigo-700 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out">
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving Changes...</> : 'Save Changes'}
          </Button>
        </form>
      );
    };

    export default ProfileForm;