require('dotenv').config({ path: '.env' });
async function test() {
  const xenditToken = Buffer.from(`${process.env.XENDIT_SECRET_KEY}:`).toString('base64');
  
  const resEw = await fetch("https://api.xendit.co/payment_requests", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Basic ${xenditToken}`
    },
    body: JSON.stringify({
      reference_id: "test-ovo-" + Date.now(),
      amount: 25000,
      currency: "IDR",
      payment_method: {
        type: "EWALLET",
        reusability: "ONE_TIME_USE",
        ewallet: {
          channel_code: "OVO",
          channel_properties: {
            mobile_number: "+6281234567890"
          }
        }
      }
    })
  });
  console.log(await resEw.json());
}
test();
