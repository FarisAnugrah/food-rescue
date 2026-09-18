-- Fungsi untuk mengecek dan mengubah status order menjadi expired
CREATE OR REPLACE FUNCTION public.auto_expire_orders()
RETURNS void AS $$
DECLARE
  expired_order RECORD;
BEGIN
  -- Looping semua order yang masih paid/pending tapi waktu pickup sudah lewat
  FOR expired_order IN 
    SELECT o.id, o.listing_id, o.quantity 
    FROM public.orders o
    JOIN public.listings l ON o.listing_id = l.id
    WHERE o.status IN ('pending', 'paid') 
    -- Expired jika waktu sekarang sudah melebihi 1 jam dari batas akhir pickup
    AND NOW() > (l.pickup_end + interval '1 hour')
  LOOP
    -- 1. Ubah status order jadi expired
    UPDATE public.orders 
    SET status = 'expired'::order_status 
    WHERE id = expired_order.id;

    -- 2. Kembalikan stok (quantity_sold berkurang), 
    -- dan ubah status listing kalau tadinya sold_out jadi active (meski sudah lewat waktu, 
    -- ini murni untuk konsistensi akuntansi data stok)
    UPDATE public.listings
    SET quantity_sold = GREATEST(0, quantity_sold - expired_order.quantity),
        status = CASE 
                   WHEN status = 'sold_out' THEN 'active'::listing_status
                   ELSE status
                 END
    WHERE id = expired_order.listing_id;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Untuk menjalankannya secara otomatis di Supabase, biasanya kita mengaktifkan ekstensi pg_cron
-- Namun karena pg_cron butuh akses superuser, kita bisa memanggil fungsi ini secara manual
-- dari Backend/Middleware Next.js setiap ada user yang membuka aplikasi.

-- Contoh menjalankan cron jika pg_cron aktif (Hanya bisa di Supabase pro/superuser):
-- select cron.schedule('expire-orders-every-15-mins', '*/15 * * * *', 'SELECT public.auto_expire_orders();');
