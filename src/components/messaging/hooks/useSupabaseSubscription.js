import { useEffect, useRef } from 'react';
    import { supabase } from '@/lib/customSupabaseClient';
    import isEqual from 'lodash/isEqual'; 

    const useSupabaseSubscription = (subscriptionConfigs) => {
      const prevSubscriptionConfigsRef = useRef();

      useEffect(() => {
        if (!Array.isArray(subscriptionConfigs) || subscriptionConfigs.length === 0) {
          return;
        }

        if (isEqual(prevSubscriptionConfigsRef.current, subscriptionConfigs)) {
          return;
        }
        prevSubscriptionConfigsRef.current = subscriptionConfigs;

        const channels = subscriptionConfigs.map(config => {
          if (!config || !config.table || !config.callback) {
            console.warn('Invalid subscription config:', config);
            return null;
          }
          
          const channelKey = `realtime:${config.schema || 'public'}:${config.table}:${config.filter || 'all'}:${config.event || '*'}`;
          let channel = supabase.channel(channelKey, {
            config: {
              broadcast: { ack: true },
            },
          });

          channel
            .on('postgres_changes', 
              { 
                event: config.event || '*', 
                schema: config.schema || 'public', 
                table: config.table, 
                filter: config.filter 
              },
              (payload) => {
                config.callback(payload);
              }
            )
            .subscribe((status, err) => {
              if (status === 'SUBSCRIBED') {
                // console.log(`Successfully subscribed to ${channelKey}`);
              } else if (status === 'CHANNEL_ERROR') {
                console.error(`Failed to subscribe to ${channelKey}: CHANNEL_ERROR`, err);
              } else if (status === 'TIMED_OUT') {
                console.error(`Failed to subscribe to ${channelKey}: TIMED_OUT`, err);
              } else if (status === 'CLOSED') {
                // console.log(`Subscription to ${channelKey} closed.`);
              }
            });
          return channel;
        }).filter(Boolean); 
    
        return () => {
          channels.forEach(channel => {
            if (channel) {
              supabase.removeChannel(channel).then(status => {
                // console.log(`Unsubscribed from channel ${channel.topic}, status: ${status}`);
              }).catch(error => {
                console.error(`Error unsubscribing from channel ${channel.topic}:`, error);
              });
            }
          });
        };
      }, [subscriptionConfigs]);
    };
    
    export default useSupabaseSubscription;