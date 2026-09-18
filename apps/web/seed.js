const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' }); // Kadang Next.js pakai .env.local
require('dotenv').config({ path: '.env' }); // Fallback ke .env biasa

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes("dummy")) {
  console.error("Missing valid SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in apps/web/.env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function runSeed() {
  console.log("🌱 Starting database seed...");

  try {
    // 1. CREATE MERCHANT
    console.log("Creating Merchant User...");
    const { data: mUser, error: mErr } = await supabase.auth.admin.createUser({
      email: 'merchant@foodrescue.id',
      password: 'password123',
      email_confirm: true,
      user_metadata: { name: 'Bakery Makmur', role: 'merchant' }
    });
    if (mErr) throw mErr;
    
    // Tunggu trigger handle_new_user jalan
    await new Promise(r => setTimeout(r, 1000));
    
    // Pastikan rolenya merchant
    await supabase.from('users').update({ role: 'merchant' }).eq('id', mUser.user.id);
    
    // Buat profil merchant
    const { data: merchant, error: mProfileErr } = await supabase.from('merchants').insert({
      user_id: mUser.user.id,
      store_name: 'Bakery Makmur',
      description: 'Menjual roti dan kue kering berkualitas. Sisa hari ini dijual dengan diskon besar.',
      address: 'Jl. Sudirman No. 12, Jakarta',
      phone: '081122334455',
      verified: true,
      rating: 4.8,
      total_kg_saved: 120.5
    }).select('id').single();
    if (mProfileErr) throw mProfileErr;

    // 2. CREATE CONSUMER
    console.log("Creating Consumer User...");
    const { data: cUser, error: cErr } = await supabase.auth.admin.createUser({
      email: 'consumer@foodrescue.id',
      password: 'password123',
      email_confirm: true,
      user_metadata: { name: 'Rendra A.', role: 'consumer' }
    });
    if (cErr) throw cErr;

    // 3. CREATE LISTINGS
    console.log("Creating Listings...");
    const today = new Date().toISOString().split('T')[0];
    
    // Buat tanggal kemarin untuk test auto-expire
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = yesterdayDate.toISOString().split('T')[0];
    
    const { data: listings, error: lErr } = await supabase.from('listings').insert([
      {
        merchant_id: merchant.id, title: 'Surprise Bag — Roti & Pastry', category: 'Bakery',
        is_halal: true, original_price: 75000, discounted_price: 25000, weight_kg: 1.5, quantity: 10,
        quantity_sold: 2, pickup_start: `${today}T15:00:00Z`, pickup_end: `${today}T20:00:00Z`,
        type: 'surprise_bag', status: 'active'
      },
      {
        merchant_id: merchant.id, title: 'Aneka Kue Kering Kemarin', category: 'Bakery',
        is_halal: true, original_price: 50000, discounted_price: 15000, weight_kg: 0.8, quantity: 5,
        quantity_sold: 5, pickup_start: `${today}T10:00:00Z`, pickup_end: `${today}T14:00:00Z`,
        type: 'specific', status: 'sold_out'
      },
      {
        merchant_id: merchant.id, title: 'Nasi Kuning Sisa Kemarin (Test Expire)', category: 'Restoran',
        is_halal: true, original_price: 30000, discounted_price: 10000, weight_kg: 0.5, quantity: 5,
        quantity_sold: 1, pickup_start: `${yesterday}T16:00:00Z`, pickup_end: `${yesterday}T19:00:00Z`,
        type: 'specific', status: 'active'
      }
    ]).select('id');
    if (lErr) throw lErr;

    // 4. CREATE ORDERS
    console.log("Creating Orders...");
    const { data: orders, error: oErr } = await supabase.from('orders').insert([
      {
        user_id: cUser.user.id, listing_id: listings[0].id, quantity: 1, total_price: 25000,
        total_weight_kg: 1.5, qr_code: 'FR-SEED-001', status: 'paid'
      },
      {
        user_id: cUser.user.id, listing_id: listings[1].id, quantity: 2, total_price: 30000,
        total_weight_kg: 1.6, qr_code: 'FR-SEED-002', status: 'picked_up', picked_up_at: new Date().toISOString()
      },
      {
        // Order ini sengaja dibikin untuk testing Auto-Expire (karena nempel sama listing kemarin)
        user_id: cUser.user.id, listing_id: listings[2].id, quantity: 1, total_price: 10000,
        total_weight_kg: 0.5, qr_code: 'FR-SEED-003', status: 'paid'
      }
    ]).select('id');
    if (oErr) throw oErr;

    // 5. CREATE REVIEWS & IMPACT LOG
    console.log("Creating Reviews & Impact...");
    await supabase.from('reviews').insert({
      order_id: orders[1].id, user_id: cUser.user.id, merchant_id: merchant.id,
      rating: 5, comment: 'Rotinya masih empuk banget, dapet diskon gede pula!'
    });

    await supabase.from('impact_logs').insert({
      order_id: orders[1].id, food_kg: 1.6, co2_kg: 1.6 * 2.5
    });

    console.log("\n✅ Database seeder finished successfully!");
    console.log("-----------------------------------------");
    console.log("Merchant Account: merchant@foodrescue.id / password123");
    console.log("Consumer Account: consumer@foodrescue.id / password123");
    console.log("-----------------------------------------");

  } catch (err) {
    console.error("❌ Seed failed:", err);
  }
}

runSeed();
