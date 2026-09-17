# Software Requirements Specification (SRS)

## 1. Introduction
System to connect food merchants with consumers for discounted near‑expiry food.

## 2. Functional Requirements
- **Auth:** Email/password & Google login.
- **Consumer:** View map of listings, filter, purchase, view QR.
- **Merchant:** Dashboard to post items, view orders, scan QR.
- **Admin:** Approve merchants, ban users.

## 3. Non‑Functional Requirements
- **Performance:** App loads in <2s on mobile networks.
- **Scalability:** Handle 500 concurrent users.
- **Security:** Encrypted passwords, secure payment tokens.
- **Availability:** 99.9% uptime.

## 4. Tech Stack
- Frontend: Next.js (Web), React Native (Mobile).
- Backend/DB: Supabase (PostgreSQL).
- Payments: Midtrans.
