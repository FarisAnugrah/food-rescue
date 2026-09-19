require('dotenv').config({ path: 'apps/web/.env' });
async function test() {
  const xenditToken = Buffer.from(`${process.env.XENDIT_SECRET_KEY}:`).toString('base64');
  
  // Test VA
  const resVA = await fetch("https://api.xendit.co/payment_requests", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Basic ${xenditToken}`
    },
    body: JSON.stringify({
      reference_id: "test-va-" + Date.now(),
      amount: 25000,
      currency: "IDR",
      payment_method: {
        type: "VIRTUAL_ACCOUNT",
        reusability: "ONE_TIME_USE",
        virtual_account: {
          channel_code: "BCA",
          channel_properties: {
            customer_name: "Faris"
          }
        }
      }
    })
  });
  console.log("VA:", await resVA.json());

}
test();
