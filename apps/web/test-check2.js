require('dotenv').config({ path: '.env' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data } = await supabase.from('orders').select('payment_link').eq('id', '20063c32-a629-4f59-9cd5-958a647afcf6').single();
  console.log(data);
}
run();
