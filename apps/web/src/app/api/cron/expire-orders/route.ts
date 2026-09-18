import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.NODE_ENV === 'production') {
    return new Response('Unauthorized', { status: 401 });
  }

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    // Panggil fungsi auto expire di database (sudah kita buat lewat migration auto_expire)
    const { error } = await supabase.rpc('auto_expire_orders');
    
    if (error) {
      return NextResponse.json({ success: false, error: error.message });
    }
    
    return NextResponse.json({ success: true, message: "Auto expire cron executed successfully" });
  }
  
  return NextResponse.json({ success: false, message: "Supabase ENV not configured" });
}