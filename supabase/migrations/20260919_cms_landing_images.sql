CREATE TABLE public.landing_assets (
  key VARCHAR PRIMARY KEY,
  url TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

ALTER TABLE public.landing_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Landing assets are viewable by everyone." ON public.landing_assets FOR SELECT USING (true);
CREATE POLICY "Admins can manage landing assets." ON public.landing_assets FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

INSERT INTO public.landing_assets (key, url) VALUES
('hero_image', '/images/hero.webp'),
('merchant_cta_image', '/images/merchant-cta.webp');
