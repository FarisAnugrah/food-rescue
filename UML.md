# UML Diagrams

## 1. Use Case Diagram
```plantuml
left to right direction
actor Consumer
actor Merchant
actor Admin

package "Food Rescue App" {
  Consumer --> (Browse Listings)
  Consumer --> (Order & Pay)
  Consumer --> (View QR Code)
  
  Merchant --> (Post Listing)
  Merchant --> (Manage Orders)
  Merchant --> (Scan QR Code)
  
  Admin --> (Approve Merchant)
  Admin --> (Monitor Platform)
}
```

## 2. Entity Relationship Diagram (ERD)
```plantuml
entity "User" {
  +id
  name
  email
  role
}

entity "Merchant" {
  +id
  user_id
  store_name
  location
}

entity "Listing" {
  +id
  merchant_id
  title
  price
  stock
}

entity "Order" {
  +id
  user_id
  listing_id
  status
}

User ||--o{ Merchant : creates
Merchant ||--o{ Listing : posts
User ||--o{ Order : places
Listing ||--o{ Order : contains
```
