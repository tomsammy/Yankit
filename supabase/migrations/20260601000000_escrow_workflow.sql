-- Supabase Database Migration
-- Escrow & Payout Workflow for Yankit

-- 1. Add Stripe Connect details to profiles table if they don't already exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS stripe_connect_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS stripe_connect_status VARCHAR(50) DEFAULT 'unconnected';

-- 2. Create escrow_transactions table to manage held, released, and completed payments
CREATE TABLE IF NOT EXISTS public.escrow_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID REFERENCES public.shipments(id) ON DELETE CASCADE,
  yanker_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  amount NUMERIC NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  stripe_payment_intent_id VARCHAR(255),
  stripe_transfer_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'held', -- 'held', 'released', 'completed', 'refunded'
  created_at TIMESTAMPTZ DEFAULT now(),
  released_at TIMESTAMPTZ,
  payout_available_at TIMESTAMPTZ
);

-- 3. Enable Row Level Security (RLS) on escrow_transactions
ALTER TABLE public.escrow_transactions ENABLE ROW LEVEL SECURITY;

-- 4. Create security policies for escrow_transactions
-- Shippers should be able to view their own escrow transactions
CREATE POLICY "Users can view their own shipments escrow transactions" 
ON public.escrow_transactions 
FOR SELECT 
USING (
  auth.uid() IN (
    SELECT shipper_user_id FROM public.shipments WHERE id = shipment_id
    UNION
    SELECT traveler_user_id FROM public.shipments WHERE id = shipment_id
  )
);

-- 5. Add index for faster query on status and payout_available_at (crucial for the payout cron job)
CREATE INDEX IF NOT EXISTS idx_escrow_payout_holdback 
ON public.escrow_transactions (status, payout_available_at) 
WHERE stripe_transfer_id IS NULL;
