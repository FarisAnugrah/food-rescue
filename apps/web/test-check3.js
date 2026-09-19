require('dotenv').config({ path: '.env' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data, error } = await supabase.rpc('increment_sold', { x_listing_id: 'f6c7dc07-b9fa-4119-8241-a8b832e552b0', x_qty: 1 });
  console.log('rpc result:', error);
}
run();
