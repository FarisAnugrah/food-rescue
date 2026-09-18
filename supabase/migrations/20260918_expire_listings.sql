-- Update fungsi cron auto expire untuk meng-handle expired orders DAN expired listings
CREATE OR REPLACE FUNCTION public.auto_expire_orders()
RETURNS void AS $$
BEGIN
  -- 1. Expire Order: Ubah status order jadi expired jika sudah lewat pickup_end + 10 menit grace period
  -- Uang hangus: stok TIDAK dikembalikan ke merchant, revenue tetap masuk
  UPDATE public.orders o
  SET status = 'expired'::order_status 
  FROM public.listings l
  WHERE o.listing_id = l.id
    AND o.status IN ('pending', 'paid') 
    AND NOW() > (l.pickup_end + interval '10 minutes');

  -- 2. Expire Listing: Ubah status listing (makanan yang belum laku) jadi expired jika waktu pickup_end terlewati
  UPDATE public.listings
  SET status = 'expired'::listing_status
  WHERE status = 'active'
    AND NOW() > pickup_end;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;