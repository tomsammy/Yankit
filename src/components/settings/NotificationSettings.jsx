import React, { useEffect, useState, useCallback } from 'react';
    import { Switch } from '@/components/ui/switch';
    import { Label } from '@/components/ui/label';
    import { useToast } from '@/components/ui/use-toast';
    import { supabase } from '@/lib/customSupabaseClient';
    import { useAuth } from '@/contexts/SupabaseAuthContext';
    import LoadingSpinner from '@/components/ui/LoadingSpinner';

    const NotificationSettings = () => {
        const { session } = useAuth();
        const { toast } = useToast();
        const [preferences, setPreferences] = useState(null);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);

        const fetchPreferences = useCallback(async () => {
            if (!session?.user?.id) return;
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from('user_notification_preferences')
                .select('*')
                .eq('user_id', session.user.id)
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116: row not found
                console.error('Error fetching notification preferences:', error);
                setError('Could not load your notification settings. Please try again.');
                toast({ title: 'Error', description: 'Failed to fetch notification settings.', variant: 'destructive' });
            } else {
                setPreferences(data);
            }
            setLoading(false);
        }, [session?.user?.id, toast]);

        useEffect(() => {
            fetchPreferences();
        }, [fetchPreferences]);

        const handlePreferenceChange = async (key, value) => {
            if (!preferences) return;

            const oldPreferences = { ...preferences };
            const newPreferences = { ...preferences, [key]: value, updated_at: new Date().toISOString() };
            setPreferences(newPreferences);

            const { error } = await supabase
                .from('user_notification_preferences')
                .update({ [key]: value, updated_at: new Date().toISOString() })
                .eq('user_id', session.user.id);

            if (error) {
                console.error('Error updating notification preferences:', error);
                toast({ title: 'Error', description: 'Failed to save your changes.', variant: 'destructive' });
                setPreferences(oldPreferences); // Revert on error
            } else {
                toast({ title: 'Success', description: 'Notification settings updated.', className: 'bg-green-500 text-white' });
            }
        };

        if (loading) {
            return <div className="flex justify-center items-center h-24"><LoadingSpinner /></div>;
        }

        if (error) {
            return <p className="text-destructive text-center">{error}</p>;
        }

        if (!preferences) {
            return <p className="text-muted-foreground text-center">Notification settings are not available at the moment.</p>;
        }

        const preferenceItems = [
            { id: 'new_message_email', label: 'New Messages', description: 'Receive an email when you get a new message.', key: 'new_message_email' },
            { id: 'shipment_update_email', label: 'Shipment Updates', description: 'Get notified about the status of your shipments.', key: 'shipment_update_email' },
            { id: 'promotional_email', label: 'Promotions & News', description: 'Receive occasional updates and special offers from Yankit.', key: 'promotional_email' },
        ];

        return (
            <div className="space-y-6">
                {preferenceItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 dark:bg-slate-700/30">
                        <div>
                            <Label htmlFor={item.id} className="font-semibold text-foreground dark:text-slate-200">{item.label}</Label>
                            <p className="text-sm text-muted-foreground dark:text-slate-400">{item.description}</p>
                        </div>
                        <Switch
                            id={item.id}
                            checked={preferences[item.key]}
                            onCheckedChange={(checked) => handlePreferenceChange(item.key, checked)}
                        />
                    </div>
                ))}
            </div>
        );
    };

    export default NotificationSettings;