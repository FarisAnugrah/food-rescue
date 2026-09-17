-- ENUMS
CREATE TYPE user_role AS ENUM ('consumer', 'merchant', 'admin');
CREATE TYPE listing_type AS ENUM ('surprise_bag', 'specific');
CREATE TYPE listing_status AS ENUM ('active', 'sold_out', 'expired');
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'picked_up', 'expired', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'success', 'failed', 'refunded');

-- 1. USERS
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  role user_role DEFAULT 'consumer'::user_role NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 2. MERCHANTS
CREATE TABLE public.merchants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  store_name VARCHAR NOT NULL,
  description TEXT,
  address VARCHAR NOT NULL,
  lat DECIMAL,
  lng DECIMAL,
  phone VARCHAR NOT NULL,
  photo_url TEXT,
  is_halal BOOLEAN DEFAULT true,
  verified BOOLEAN DEFAULT false,
  rating DECIMAL DEFAULT 0.0,
  total_kg_saved DECIMAL DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 3. LISTINGS
CREATE TABLE public.listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  merchant_id UUID REFERENCES public.merchants(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR NOT NULL,
  description TEXT,
  photo_url TEXT,
  category VARCHAR NOT NULL,
  is_halal BOOLEAN DEFAULT true,
  original_price INTEGER NOT NULL,
  discounted_price INTEGER NOT NULL,
  weight_kg DECIMAL NOT NULL,
  quantity INTEGER NOT NULL,
  quantity_sold INTEGER DEFAULT 0 NOT NULL,
  pickup_start TIMESTAMP WITH TIME ZONE NOT NULL,
  pickup_end TIMESTAMP WITH TIME ZONE NOT NULL,
  type listing_type DEFAULT 'surprise_bag'::listing_type NOT NULL,
  status listing_status DEFAULT 'active'::listing_status NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 4. ORDERS
CREATE TABLE public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL,
  total_price INTEGER NOT NULL,
  total_weight_kg DECIMAL NOT NULL,
  qr_code VARCHAR UNIQUE NOT NULL,
  status order_status DEFAULT 'pending'::order_status NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  picked_up_at TIMESTAMP WITH TIME ZONE
);

-- 5. REVIEWS
CREATE TABLE public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE UNIQUE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  merchant_id UUID REFERENCES public.merchants(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 6. IMPACT LOGS
CREATE TABLE public.impact_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE UNIQUE NOT NULL,
  food_kg DECIMAL NOT NULL,
  co2_kg DECIMAL NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- TRIGGERS & FUNCTIONS
-- Trigger to auto-create user profile when auth.user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, name, email, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    COALESCE((new.raw_user_meta_data->>'role')::user_role, 'consumer'::user_role)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impact_logs ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies (Read-All, Write-Own)
CREATE POLICY "Public profiles are viewable by everyone." ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile." ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Merchants are viewable by everyone." ON public.merchants FOR SELECT USING (true);
CREATE POLICY "Merchants can insert their own profile." ON public.merchants FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Merchants can update own profile." ON public.merchants FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Listings are viewable by everyone." ON public.listings FOR SELECT USING (true);
CREATE POLICY "Merchants can insert own listings." ON public.listings FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.merchants WHERE id = merchant_id AND user_id = auth.uid())
);
CREATE POLICY "Merchants can update own listings." ON public.listings FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.merchants WHERE id = merchant_id AND user_id = auth.uid())
);

CREATE POLICY "Users can view own orders and merchant can view orders for their listings." ON public.orders FOR SELECT USING (
  auth.uid() = user_id OR
  EXISTS (SELECT 1 FROM public.listings l JOIN public.merchants m ON l.merchant_id = m.id WHERE l.id = listing_id AND m.user_id = auth.uid())
);
CREATE POLICY "Users can insert own orders." ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Merchants can update order status (pickup)." ON public.orders FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.listings l JOIN public.merchants m ON l.merchant_id = m.id WHERE l.id = listing_id AND m.user_id = auth.uid())
);
