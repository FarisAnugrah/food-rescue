CREATE OR REPLACE FUNCTION public.auto_expire_orders()
RETURNS void AS $$
DECLARE
  rec RECORD;
BEGIN
  -- 1. Tangani Order PENDING (Belum Dibayar) yang melewati batas waktu
  -- Jika belum dibayar tapi toko sudah tutup, order hangus dan STOK KEMBALI
  FOR rec IN 
    SELECT o.id, o.listing_id, o.quantity 
    FROM public.orders o
    JOIN public.listings l ON o.listing_id = l.id
    WHERE o.status = 'pending'
      AND NOW() > l.pickup_end
  LOOP
    UPDATE public.orders SET status = 'cancelled' WHERE id = rec.id;
    
    -- Kembalikan stok
    UPDATE public.listings
    SET quantity_sold = GREATEST(0, quantity_sold - rec.quantity),
        status = CASE 
                   WHEN status = 'sold_out' THEN 'active'::listing_status
                   ELSE status
                 END
    WHERE id = rec.listing_id;
  END LOOP;

  -- 2. Tangani Order PAID (Sudah Dibayar) yang tidak di-pickup (No-Show)
  -- Lewat dari pickup_end + 10 menit grace period.
  -- Uang hangus, merchant tetap dapat revenue, STOK TIDAK KEMBALI
  UPDATE public.orders o
  SET status = 'expired'::order_status 
  FROM public.listings l
  WHERE o.listing_id = l.id
    AND o.status = 'paid'
    AND NOW() > (l.pickup_end + interval '10 minutes');

  -- 3. Expire Listing: Ubah status listing (makanan yang belum laku) jadi expired jika waktu pickup_end terlewati
  UPDATE public.listings
  SET status = 'expired'::listing_status
  WHERE status = 'active'
    AND NOW() > pickup_end;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;