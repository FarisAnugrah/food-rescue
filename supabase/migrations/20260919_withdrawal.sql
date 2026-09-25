CREATE TYPE withdrawal_status AS ENUM ('pending', 'processing', 'completed', 'rejected');

CREATE TABLE public.withdrawals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  merchant_id UUID REFERENCES public.merchants(id) ON DELETE CASCADE NOT NULL,
  amount INTEGER NOT NULL,
  bank_name VARCHAR NOT NULL,
  account_number VARCHAR NOT NULL,
  account_name VARCHAR NOT NULL,
  status withdrawal_status DEFAULT 'pending'::withdrawal_status NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  processed_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Merchants can view own withdrawals." ON public.withdrawals FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.merchants WHERE id = merchant_id AND user_id = auth.uid())
);
CREATE POLICY "Merchants can insert own withdrawals." ON public.withdrawals FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.merchants WHERE id = merchant_id AND user_id = auth.uid())
);
CREATE POLICY "Admins can manage withdrawals." ON public.withdrawals FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

ALTER TABLE public.merchants ADD COLUMN bank_name VARCHAR;
ALTER TABLE public.merchants ADD COLUMN bank_account_number VARCHAR;
ALTER TABLE public.merchants ADD COLUMN bank_account_name VARCHAR;
