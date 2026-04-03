# VendorVerse

VendorVerse is a multi-vendor marketplace web application where vendors publish wholesale products and buyers discover, compare, rate, and communicate with vendors.

Stack: React (Vite) + Node.js/Express + MongoDB (Mongoose)

Payment Note: This project now includes a dummy payment flow for academic/demo use only. No real payment gateway is integrated and no real money is processed.

## Project Overview

VendorVerse is designed as a DBMS-oriented full-stack project that demonstrates:

- Role-based authentication (Vendor and Buyer)
- Product catalog management with full-text search and tag filters
- Vendor rating and reliability scoring workflow
- Buyer-vendor messaging (chat-style conversations)
- Structured MongoDB schemas with references, indexing, and aggregation

The backend exposes REST APIs under `/api/*` and the frontend consumes them using Axios through a unified API layer.

## Objectives

1. Build a functional poly-vendor marketplace that supports both supply-side (vendors) and demand-side (buyers) workflows.
2. Model marketplace data cleanly using MongoDB collections with proper relationships (`ObjectId` references).
3. Implement secure JWT-based authentication and role-based route protection.
4. Support scalable product discovery with search, filters, and pagination.
5. Capture vendor trust metrics through a one-rating-per-buyer-per-vendor model and auto-updated average rating.
6. Demonstrate practical CRUD operations across multiple domain entities.

## Brief Description Of Major Modules

| Module | Brief Description |
|--------|-------------------|
| Authentication | Separate login/register flows for vendors and buyers with JWT token generation and protected profile endpoints. |
| Vendor Management | Public vendor listing/profile endpoints and private vendor profile update endpoint. |
| Buyer Management | Buyer profile read/update endpoint for authenticated buyers. |
| Product Management | Vendors create/update/delete products; buyers browse with search, tag filtering, vendor filtering, pagination, recommendations, and image-search mock endpoint. |
| Payments (Dummy) | Buyer-only mock checkout flow with selectable payment methods, simulated success/failure, and stored order records. |
| Ratings | Buyers submit/update/delete ratings for vendors; backend recalculates vendor `averageRating` and `totalRatings`. |
| Tags | Public tag listing and vendor-controlled tag creation for product categorization. |
| Messaging | Buyer-vendor direct messaging with conversation history and conversation summary list. |

## Project Structure

```text
VendorVerse/
├── backend/
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Vendor.js
│   │   ├── Buyer.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── Rating.js
│   │   ├── Tag.js
│   │   └── Message.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── vendors.js
│   │   ├── buyers.js
│   │   ├── products.js
│   │   ├── payments.js
│   │   ├── ratings.js
│   │   ├── tags.js
│   │   └── messages.js
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── services/
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

## Setup And Run

### Prerequisites

- Node.js 18+
- MongoDB local instance or MongoDB Atlas URI

### Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:5000` (from `.env` configuration).

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Environment Variables

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/vendorverse
JWT_SECRET=vendorverse_jwt_secret_key_2026
JWT_EXPIRE=7d
```

## Frontend Routes (Current)

| Route | Page |
|------|------|
| `/` | Landing page |
| `/browse` | Product browsing home |
| `/about` | About page |
| `/login` | Login page |
| `/register` | Register page |
| `/vendors/:id` | Vendor public profile |
| `/products/:id` | Product detail page |
| `/checkout` | Buyer-only dummy checkout page |
| `/profile` | Protected user profile |

## API Summary Tables

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/vendor/register` | Register vendor | Public |
| POST | `/api/auth/vendor/login` | Vendor login | Public |
| POST | `/api/auth/buyer/register` | Register buyer | Public |
| POST | `/api/auth/buyer/login` | Buyer login | Public |
| GET | `/api/auth/me` | Get current user profile | JWT |
| PUT | `/api/auth/profile` | Update current user profile | JWT |

### Products

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/products` | Browse products with search, tags, vendor, page, limit | Public / Optional Auth |
| GET | `/api/products/:id` | Get single product details | Public |
| GET | `/api/products/recommendations` | Get buyer recommendations from recent searches | Buyer JWT |
| POST | `/api/products/search-by-image` | Mock image-based product search | Public |
| GET | `/api/products/vendor/me` | Get vendor's own products | Vendor JWT |
| POST | `/api/products` | Create product | Vendor JWT |
| PUT | `/api/products/:id` | Update own product | Vendor JWT |
| DELETE | `/api/products/:id` | Delete own product | Vendor JWT |

### Payments (Dummy)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/payments/mock-checkout` | Simulate payment and create order record | Buyer JWT |
| GET | `/api/payments/my-orders` | Get logged-in buyer order history | Buyer JWT |

### Vendors

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/vendors` | List active vendors | Public |
| GET | `/api/vendors/:id` | Vendor profile with products and ratings | Public |
| GET | `/api/vendors/me/profile` | Get own vendor profile | Vendor JWT |
| PUT | `/api/vendors/me/profile` | Update own vendor profile | Vendor JWT |

### Buyers

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/buyers/me` | Get own buyer profile | Buyer JWT |
| PUT | `/api/buyers/me` | Update own buyer profile | Buyer JWT |

### Ratings

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/ratings/vendor/:vendorId` | Get all ratings for vendor | Public |
| POST | `/api/ratings` | Create/update buyer rating for vendor | Buyer JWT |
| DELETE | `/api/ratings/:id` | Delete own rating | Buyer JWT |

### Tags

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/tags` | List tags | Public |
| POST | `/api/tags` | Create tag | Vendor JWT |

### Messages

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/messages` | Send message to buyer/vendor | JWT |
| GET | `/api/messages/:otherUserId` | Get conversation messages with another user | JWT |
| GET | `/api/messages/conversations/me` | Get conversation list with last message and unread count | JWT |

## Database Tables (MongoDB Collections)

### Overview Table

| Collection | Purpose |
|-----------|---------|
| `vendors` | Stores vendor accounts, profile details, rating aggregates, and status. |
| `buyers` | Stores buyer accounts, profile details, and recent search history. |
| `products` | Stores product catalog entries linked to vendors and tags. |
| `orders` | Stores checkout snapshots, totals, shipping address, and dummy payment metadata. |
| `ratings` | Stores buyer-to-vendor ratings with review and dimension scores. |
| `tags` | Stores reusable product tags and categories. |
| `messages` | Stores direct messages exchanged between buyers and vendors. |

### Detailed Table Definitions

#### 1) `vendors`

| Field | Type | Description |
|------|------|-------------|
| `businessName` | String | Vendor/organization display name. |
| `email` | String (unique) | Login identity for vendor. |
| `password` | String (hashed) | Encrypted password via `bcryptjs` pre-save hook. |
| `phone` | String | Contact number. |
| `description` | String | Vendor profile summary. |
| `addresses` | [String] | One or more addresses. |
| `logo` | String | Logo URL/path. |
| `averageRating` | Number | Aggregated average from `ratings` collection. |
| `totalRatings` | Number | Count of ratings received. |
| `isActive` | Boolean | Indicates if vendor is active. |
| `createdAt`, `updatedAt` | Date | Auto-managed timestamps. |

#### 2) `buyers`

| Field | Type | Description |
|------|------|-------------|
| `name` | String | Buyer full name. |
| `email` | String (unique) | Login identity for buyer. |
| `password` | String (hashed) | Encrypted password via `bcryptjs` pre-save hook. |
| `phone` | String | Contact number. |
| `addresses` | [String] | Saved addresses. |
| `avatar` | String | Profile avatar URL/path. |
| `recentSearches` | [String] | Recent search terms for recommendations. |
| `createdAt`, `updatedAt` | Date | Auto-managed timestamps. |

#### 3) `products`

| Field | Type | Description |
|------|------|-------------|
| `name` | String | Product name. |
| `description` | String | Product description text. |
| `price` | Number | Unit price (min 0). |
| `stock` | Number | Available quantity (min 0). |
| `images` | [String] | Product image URLs/paths. |
| `vendor` | ObjectId -> `vendors` | Vendor owner reference. |
| `tags` | [ObjectId -> `tags`] | Tag references used in filtering. |
| `unit` | String | Sale unit (default: piece). |
| `minOrderQty` | Number | Minimum order quantity. |
| `isAvailable` | Boolean | Availability status. |
| `createdAt`, `updatedAt` | Date | Auto-managed timestamps. |

Indexes:
- Text index on `{ name, description }` for full-text search.

#### 4) `ratings`

| Field | Type | Description |
|------|------|-------------|
| `vendor` | ObjectId -> `vendors` | Rated vendor. |
| `buyer` | ObjectId -> `buyers` | Buyer who submitted rating. |
| `score` | Number (1-5) | Overall rating score. |
| `review` | String | Optional textual review. |
| `reliability` | Number (1-5) | Reliability dimension score. |
| `communication` | Number (1-5) | Communication dimension score. |
| `delivery` | Number (1-5) | Delivery dimension score. |
| `createdAt`, `updatedAt` | Date | Auto-managed timestamps. |

Indexes:
- Unique compound index on `{ vendor: 1, buyer: 1 }` to enforce one rating per buyer per vendor.

#### 5) `tags`

| Field | Type | Description |
|------|------|-------------|
| `name` | String (unique) | Human-friendly tag name (lowercase). |
| `slug` | String (unique) | URL-safe tag identifier. |
| `category` | String | Optional tag category (default: general). |
| `createdAt`, `updatedAt` | Date | Auto-managed timestamps. |

#### 6) `messages`

| Field | Type | Description |
|------|------|-------------|
| `sender` | ObjectId | Sender user id. |
| `senderModel` | String (`Buyer`/`Vendor`) | Sender role model. |
| `recipient` | ObjectId | Recipient user id. |
| `recipientModel` | String (`Buyer`/`Vendor`) | Recipient role model. |
| `content` | String | Message body text. |
| `read` | Boolean | Read/unread status. |
| `createdAt`, `updatedAt` | Date | Auto-managed timestamps. |

#### 7) `orders`

| Field | Type | Description |
|------|------|-------------|
| `buyer` | ObjectId -> `buyers` | Buyer who placed checkout request. |
| `items` | [Object] | Snapshot items with `product`, `vendor`, `name`, `unitPrice`, `quantity`, `lineTotal`. |
| `totals` | Object | `subtotal`, `tax`, `shipping`, `grandTotal`. |
| `shippingAddress` | String | Delivery location used during checkout. |
| `payment.method` | String | One of `COD`, `MOCK_UPI`, `MOCK_CARD`. |
| `payment.status` | String | `success` or `failed` for simulated payment. |
| `payment.transactionId` | String | Generated mock transaction id (`mock_txn_*`). |
| `payment.paidAt` | Date | Timestamp when mock payment succeeded. |
| `orderStatus` | String | `placed` or `payment_failed`. |
| `isMockPayment` | Boolean | Always `true` for dummy flow. |
| `createdAt`, `updatedAt` | Date | Auto-managed timestamps. |

## Current Feature Highlights

- Dual user system (buyer/vendor) with JWT auth
- Product search, filtering, and pagination
- Buyer recommendation based on search history
- Mock image-to-product search endpoint
- Dummy payment checkout (no real money) with mock transaction IDs
- Vendor trust scoring and review system
- Basic in-app messaging between buyers and vendors
"# VendorVerse" 
"# VendorVerse" 
"# VendorVerse" 
"# VendorVerse" 
#   V e n d o r V e r s e  
 