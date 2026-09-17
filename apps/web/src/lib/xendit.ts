import { Xendit } from "xendit-node";

// Inisialisasi Xendit client. Akan crash jika di call di client component
export const xenditClient = new Xendit({
  secretKey: process.env.XENDIT_SECRET_KEY || "dummy_key",
});

export const { Invoice } = xenditClient;
