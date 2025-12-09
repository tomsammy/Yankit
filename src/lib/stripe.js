import { loadStripe } from '@stripe/stripe-js';

    const STRIPE_PUBLISHABLE_KEY = 'pk_live_51RZ7hCGdi1lKRwhju82Zyf4RCRCzMh881yXSErUSBFJlwE5RwUGNeLAoejsMtLtP4KUnAnWIwoUptF4pl5cr5aNr00lTz6m2FB';

    let stripePromise;

    export const getStripe = () => {
      if (!STRIPE_PUBLISHABLE_KEY || STRIPE_PUBLISHABLE_KEY.includes('YOUR_STRIPE_PUBLISHABLE_KEY')) {
        const errorMessage = "Stripe Publishable Key is not set correctly. Please provide a valid key.";
        console.error(errorMessage);
        return Promise.reject(new Error(errorMessage));
      }

      if (!stripePromise) {
        stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
      }
      
      return stripePromise;
    };