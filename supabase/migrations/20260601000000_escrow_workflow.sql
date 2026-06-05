-- Supabase Database Migration
-- Escrow & Payout Workflow for Yankit (using Escrow.com API)

-- 1. Drop existing policies if any
DROP POLICY IF EXISTS "Users can view their own shipments escrow transactions" ON public.escrow_transactions;

-- 2. Drop existing table if exists
DROP TABLE IF EXISTS public.escrow_transactions;

-- 3. Create escrow_transactions table to manage held, released, and completed payments
CREATE TABLE public.escrow_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID REFERENCES public.shipments(id) ON DELETE CASCADE,
  yanker_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  amount NUMERIC NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  escrow_transaction_id VARCHAR(255), -- Escrow.com transaction ID
  status VARCHAR(50) DEFAULT 'created', -- 'created', 'funded', 'shipped', 'accepted', 'completed', 'cancelled'
  created_at TIMESTAMPTZ DEFAULT now(),
  released_at TIMESTAMPTZ,
  payout_available_at TIMESTAMPTZ
);

-- 4. Enable Row Level Security (RLS) on escrow_transactions
ALTER TABLE public.escrow_transactions ENABLE ROW LEVEL SECURITY;

-- 5. Create security policies for escrow_transactions
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

-- 6. Add index for faster query on status
CREATE INDEX IF NOT EXISTS idx_escrow_status 
ON public.escrow_transactions (status);
