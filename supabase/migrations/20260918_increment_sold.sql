-- Function to safely increment quantity_sold and prevent race conditions
CREATE OR REPLACE FUNCTION increment_sold(x_listing_id UUID, x_qty INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE public.listings
  SET quantity_sold = quantity_sold + x_qty,
      status = CASE 
                 WHEN quantity_sold + x_qty >= quantity THEN 'sold_out'::listing_status
                 ELSE status
               END
  WHERE id = x_listing_id;
END;
$$ LANGUAGE plpgsql;
