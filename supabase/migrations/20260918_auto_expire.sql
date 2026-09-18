-- Fungsi untuk mengecek dan mengubah status order menjadi expired
CREATE OR REPLACE FUNCTION public.auto_expire_orders()
RETURNS void AS $$
BEGIN
  -- Looping semua order yang masih paid/pending tapi waktu pickup sudah lewat 10 menit
  -- Uang hangus: kita TIDAK mengembalikan stok / mengurangi quantity_sold
  -- Merchant tetap bisa klaim revenue dari order 'expired' yang sudah dibayar
  UPDATE public.orders o
  SET status = 'expired'::order_status 
  FROM public.listings l
  WHERE o.listing_id = l.id
    AND o.status IN ('pending', 'paid') 
    AND NOW() > (l.pickup_end + interval '10 minutes');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Untuk menjalankannya secara otomatis di Supabase, biasanya kita mengaktifkan ekstensi pg_cron
-- Namun karena pg_cron butuh akses superuser, kita bisa memanggil fungsi ini secara manual
-- dari Backend/Middleware Next.js setiap ada user yang membuka aplikasi.

-- Contoh menjalankan cron jika pg_cron aktif (Hanya bisa di Supabase pro/superuser):
-- select cron.schedule('expire-orders-every-15-mins', '*/15 * * * *', 'SELECT public.auto_expire_orders();');
