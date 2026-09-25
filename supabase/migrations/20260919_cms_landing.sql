CREATE TABLE public.testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quote TEXT NOT NULL,
  name VARCHAR NOT NULL,
  role VARCHAR NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Testimonials are viewable by everyone." ON public.testimonials FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage testimonials." ON public.testimonials FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

INSERT INTO public.testimonials (quote, name, role) VALUES
('Awalnya skeptis, tapi ternyata makanannya masih layak banget. Sekarang tiap sore saya cek app-nya sebelum pulang kerja.', 'Rendra A.', 'Consumer, Jakarta Selatan'),
('Dulu makanan sisa tiap malam dibuang. Sekarang malah jadi revenue tambahan. Tim onboarding-nya juga helpful banget.', 'Dewi S.', 'Owner Bakery, Bandung');
