const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './apps/web/.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in apps/web/.env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Reading SQL files...");
  const schemaSql = fs.readFileSync(path.join(__dirname, 'supabase', 'schema.sql'), 'utf8');
  const incrementSoldSql = fs.readFileSync(path.join(__dirname, 'supabase', 'migrations', '20260918_increment_sold.sql'), 'utf8');

  console.log("Executing schema.sql...");
  
  // Note: supabase-js tidak memiliki method langsung untuk run raw SQL string panjang
  // Kita harus mengeksekusi ini via REST API / RPC khusus, atau yang paling mudah 
  // adalah menyuruh user menjalankan di SQL Editor web.
  // Tapi kita coba bypass dengan REST.
  
  console.log("\n⚠️ PERHATIAN: Skrip Node.js tidak bisa mengeksekusi multi-statement SQL secara langsung ke Supabase tanpa admin access (seperti psql / Supabase CLI).");
  console.log("\nSilakan ikuti langkah ini:");
  console.log("1. Buka https://supabase.com/dashboard/project/_/sql/new");
  console.log("2. Copy isi file supabase/schema.sql dan Paste di sana, lalu klik RUN.");
  console.log("3. Buka tab SQL baru, Copy isi file supabase/migrations/20260918_increment_sold.sql dan Paste di sana, lalu klik RUN.");
}

run();
