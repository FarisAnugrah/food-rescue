ALTER TABLE public.merchants ADD COLUMN IF NOT EXISTS owner_name VARCHAR;
ALTER TABLE public.merchants ADD COLUMN IF NOT EXISTS ktp_url TEXT;
