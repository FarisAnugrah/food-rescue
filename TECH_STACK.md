# Tech Stack Deep Dive

Food Rescue Indonesia leverages a modern, highly scalable architecture built on the edge.

## Frontend
- **Next.js 15 (App Router)** for Server-Side Rendering (SSR) and SEO optimizations.
- **Tailwind CSS v4** combined with Headless UI principles for rapid, responsive styling.
- **Lucide React** for consistent, clean iconography.
- **React Leaflet** for interactive maps and geographic discovery.

## Backend & Database
- **Supabase PostgreSQL** as the core relational database.
- **Supabase Auth** handling secure, token-based authentication via email and Google OAuth.
- **Supabase Storage** for managing merchant KYC documents and food item imagery.
- **Supabase Realtime (WebSockets)** powering instant stock adjustments on the client.
- **Row Level Security (RLS)** strictly enforcing data privacy between consumers and merchants.

## Infrastructure & Payments
- **Vercel** for hosting the web frontend and serverless API endpoints.
- **Vercel Cron Jobs** executing automated SQL functions for order expirations.
- **Xendit API** securely handling e-wallet (OVO, GoPay, DANA) and Virtual Account transactions in real-time.
