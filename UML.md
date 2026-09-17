# UML Diagrams

## 1. Use Case Diagram
```plantuml
left to right direction
actor Consumer
actor Merchant
actor Admin

package "Food Rescue App" {
  Consumer --> (Browse Listings)
  Consumer --> (Filter by Category/Halal)
  Consumer --> (Order & Pay)
  Consumer --> (View QR Code)
  Consumer --> (Review Merchant)
  Consumer --> (View Personal Impact)

  Merchant --> (Post Listing)
  Merchant --> (Set Pickup Window)
  Merchant --> (Manage Orders)
  Merchant --> (Scan QR Code)
  Merchant --> (View Analytics & Impact)
  Merchant --> (Earn Food Waste Warrior Badge)

  Admin --> (Verify Merchant Documents)
  Admin --> (Approve/Reject Merchant)
  Admin --> (Monitor Listings)
  Admin --> (View Impact Dashboard)
  Admin --> (Manage Food Safety Guidelines)
}
```

## 2. Entity Relationship Diagram (ERD)
```plantuml
entity "User" {
  +id : uuid
  name : varchar
  email : varchar
  password_hash : varchar
  role : enum(consumer, merchant, admin)
  avatar_url : varchar
  created_at : timestamp
}

entity "Merchant" {
  +id : uuid
  user_id : uuid (FK)
  store_name : varchar
  description : text
  address : varchar
  lat : decimal
  lng : decimal
  phone : varchar
  photo_url : varchar
  is_halal : boolean
  verified : boolean
  rating : decimal
  total_kg_saved : decimal
  created_at : timestamp
}

entity "Listing" {
  +id : uuid
  merchant_id : uuid (FK)
  title : varchar
  description : text
  photo_url : varchar
  category : varchar
  is_halal : boolean
  original_price : integer
  discounted_price : integer
  weight_kg : decimal
  quantity : integer
  quantity_sold : integer
  pickup_start : timestamp
  pickup_end : timestamp
  type : enum(surprise_bag, specific)
  status : enum(active, sold_out, expired)
  created_at : timestamp
}

entity "Order" {
  +id : uuid
  user_id : uuid (FK)
  listing_id : uuid (FK)
  quantity : integer
  total_price : integer
  total_weight_kg : decimal
  qr_code : varchar
  status : enum(pending, paid, picked_up, expired, cancelled)
  created_at : timestamp
  picked_up_at : timestamp
}

entity "Review" {
  +id : uuid
  order_id : uuid (FK)
  user_id : uuid (FK)
  merchant_id : uuid (FK)
  rating : integer
  comment : text
  created_at : timestamp
}

entity "Payment" {
  +id : uuid
  order_id : uuid (FK)
  amount : integer
  method : varchar
  status : enum(pending, success, failed, refunded)
  midtrans_ref : varchar
  created_at : timestamp
}

entity "ImpactLog" {
  +id : uuid
  order_id : uuid (FK)
  food_kg : decimal
  co2_kg : decimal
  created_at : timestamp
}

User ||--o{ Merchant : "has one"
Merchant ||--o{ Listing : "posts"
User ||--o{ Order : "places"
Listing ||--o{ Order : "fulfilled by"
Order ||--|| Payment : "paid via"
Order ||--o| Review : "reviewed in"
Order ||--|| ImpactLog : "tracked in"
```

## 3. Sequence Diagram — Order Flow
```plantuml
actor Consumer
participant "App" as App
participant "Backend" as API
participant "Midtrans" as Pay
participant "Merchant" as Merch

Consumer -> App : Browse & select listing
App -> API : GET /listings/:id
API --> App : Listing detail
Consumer -> App : Place order (qty)
App -> API : POST /orders
API -> Pay : Create payment
Pay --> API : Payment URL
API --> App : Redirect to payment
Consumer -> Pay : Complete payment
Pay -> API : Payment callback (success)
API -> API : Update order status → PAID
API -> API : Generate QR code
API -> Merch : Push notification (new order)
API --> App : Order confirmed + QR code
Consumer -> Merch : Show QR at pickup
Merch -> API : POST /orders/:id/verify (scan QR)
API -> API : Update status → PICKED_UP
API -> API : Log impact (food_kg, co2_kg)
API --> Merch : Pickup confirmed
```

## 4. State Diagram — Order
```plantuml
[*] --> PENDING : Order created
PENDING --> PAID : Payment success
PAID --> PICKED_UP : QR scanned by merchant
PAID --> CANCELLED : Consumer cancels (refund)
PAID --> EXPIRED : Pickup window passed
PICKED_UP --> [*]
CANCELLED --> [*]
EXPIRED --> [*]
```
