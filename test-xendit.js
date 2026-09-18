require('dotenv').config({ path: 'apps/web/.env' });
async function test() {
  const xenditToken = Buffer.from(`${process.env.XENDIT_SECRET_KEY}:`).toString('base64');
  const qrRes = await fetch("https://api.xendit.co/qr_codes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Basic ${xenditToken}`
    },
    body: JSON.stringify({
      reference_id: "test-" + Date.now(),
      type: "DYNAMIC",
      amount: 25000,
      currency: "IDR"
    })
  });
  const data = await qrRes.json();
  console.log(data);
}
test();
