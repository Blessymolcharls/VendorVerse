# VendorVerse 🛒

A **poly-vendor marketplace** where wholesalers (vendors) list products and buyers browse and rate them.

**Stack:** React · Node.js/Express · MongoDB/Mongoose

---

## Folder Structure

```
VendorVerse/
├── backend/                      # Express API
│   ├── middleware/
│   │   └── auth.js               # JWT protect, vendorOnly, buyerOnly
│   ├── models/
│   │   ├── Vendor.js
│   │   ├── Buyer.js
│   │   ├── Product.js
│   │   ├── Rating.js
│   │   └── Tag.js
│   ├── routes/
│   │   ├── auth.js               # /api/auth/vendor/* and /api/auth/buyer/*
│   │   ├── vendors.js            # /api/vendors
│   │   ├── buyers.js             # /api/buyers
│   │   ├── products.js           # /api/products
│   │   ├── ratings.js            # /api/ratings
│   │   └── tags.js               # /api/tags
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/                     # Vite + React
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── ProductCard.jsx
    │   │   ├── ProductFilter.jsx  # Search + tag filter
    │   │   ├── ProductForm.jsx    # Add / edit product form
    │   │   ├── RatingSystem.jsx   # Vendor rating widget
    │   │   └── VendorDashboard.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Home.jsx           # Product listing + filter
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── DashboardPage.jsx  # Vendor dashboard
    │   │   ├── VendorProfilePage.jsx
    │   │   └── ProductDetailPage.jsx
    │   ├── services/
    │   │   └── api.js             # Axios instance + all API calls
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## Setup & Run

### Prerequisites

- Node.js ≥ 18
- MongoDB running locally (`mongod`) or a MongoDB Atlas URI

### 1. Backend

```bash
cd backend
# Edit .env – set MONGO_URI if using Atlas
npm run dev     # starts on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm run dev     # starts on http://localhost:5173
```

---

## Environment Variables (`backend/.env`)

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/vendorverse
JWT_SECRET=vendorverse_jwt_secret_key_2026
JWT_EXPIRE=7d
```

---

## REST API Reference

### Authentication

| Method | Endpoint                     | Body                                           | Auth |
|--------|------------------------------|------------------------------------------------|------|
| POST   | `/api/auth/vendor/register`  | `businessName, email, password, [phone, address, description]` | — |
| POST   | `/api/auth/vendor/login`     | `email, password`                             | — |
| POST   | `/api/auth/buyer/register`   | `name, email, password, [phone, address]`     | — |
| POST   | `/api/auth/buyer/login`      | `email, password`                             | — |

### Products

| Method | Endpoint                  | Description                          | Auth         |
|--------|---------------------------|--------------------------------------|--------------|
| GET    | `/api/products`           | Browse products (filter/search/page) | —            |
| GET    | `/api/products/:id`       | Single product detail                | —            |
| GET    | `/api/products/vendor/me` | Vendor's own products                | Vendor JWT   |
| POST   | `/api/products`           | Add a new product                    | Vendor JWT   |
| PUT    | `/api/products/:id`       | Update a product                     | Vendor JWT   |
| DELETE | `/api/products/:id`       | Delete a product                     | Vendor JWT   |

**Query params for `GET /api/products`:**
- `search` – full-text search
- `tags` – comma-separated tag IDs
- `vendor` – filter by vendor ID
- `page`, `limit` – pagination

### Vendors

| Method | Endpoint               | Description                  | Auth       |
|--------|------------------------|------------------------------|------------|
| GET    | `/api/vendors`         | List all vendors             | —          |
| GET    | `/api/vendors/:id`     | Vendor profile + products + ratings | —   |
| GET    | `/api/vendors/me/profile` | Own vendor profile        | Vendor JWT |
| PUT    | `/api/vendors/me/profile` | Update own profile        | Vendor JWT |

### Ratings

| Method | Endpoint                       | Description                   | Auth      |
|--------|--------------------------------|-------------------------------|-----------|
| GET    | `/api/ratings/vendor/:vendorId`| All ratings for a vendor       | —         |
| POST   | `/api/ratings`                 | Submit / update a rating       | Buyer JWT |
| DELETE | `/api/ratings/:id`             | Delete a rating                | Buyer JWT |

### Tags

| Method | Endpoint     | Description        | Auth       |
|--------|--------------|--------------------|------------|
| GET    | `/api/tags`  | List all tags      | —          |
| POST   | `/api/tags`  | Create a tag       | Vendor JWT |

---

## Example API Requests

### Register a Vendor

```json
POST /api/auth/vendor/register
Content-Type: application/json

{
  "businessName": "BulkElectronics Co.",
  "email": "vendor@example.com",
  "password": "securepass123",
  "phone": "+1-555-0100",
  "description": "Wholesale electronics supplier since 2010",
  "address": "123 Warehouse Blvd, Chicago, IL"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI...",
  "user": {
    "id": "65f4a2b3c8d9e0f1a2b3c4d5",
    "businessName": "BulkElectronics Co.",
    "email": "vendor@example.com",
    "role": "vendor"
  }
}
```

---

### Add a Product (Vendor JWT required)

```json
POST /api/products
Authorization: Bearer <vendor_token>
Content-Type: application/json

{
  "name": "USB-C Hub 7-in-1",
  "description": "Aluminum 7-port USB-C hub with HDMI 4K, 3x USB-A, SD card reader",
  "price": 18.50,
  "stock": 500,
  "unit": "piece",
  "minOrderQty": 10,
  "images": ["https://example.com/images/hub1.jpg"],
  "tags": ["65f4a2b3c8d9e0f1a2b3c4e1", "65f4a2b3c8d9e0f1a2b3c4e2"]
}
```

**Response:**
```json
{
  "success": true,
  "product": {
    "_id": "65f4a2b3c8d9e0f1a2b3c4f0",
    "name": "USB-C Hub 7-in-1",
    "price": 18.5,
    "stock": 500,
    "vendor": "65f4a2b3c8d9e0f1a2b3c4d5",
    "tags": [
      { "_id": "65f4a2b3c8d9e0f1a2b3c4e1", "name": "electronics", "slug": "electronics" },
      { "_id": "65f4a2b3c8d9e0f1a2b3c4e2", "name": "wholesale",    "slug": "wholesale"   }
    ],
    "isAvailable": true,
    "createdAt": "2026-03-05T08:00:00.000Z"
  }
}
```

---

### Rate a Vendor (Buyer JWT required)

```json
POST /api/ratings
Authorization: Bearer <buyer_token>
Content-Type: application/json

{
  "vendorId": "65f4a2b3c8d9e0f1a2b3c4d5",
  "score": 5,
  "reliability": 5,
  "communication": 4,
  "delivery": 5,
  "review": "Excellent wholesale partner. Fast shipping, great product quality."
}
```

**Response:**
```json
{
  "success": true,
  "rating": {
    "_id": "65f4a2b3c8d9e0f1a2b3c510",
    "vendor": "65f4a2b3c8d9e0f1a2b3c4d5",
    "buyer": { "_id": "...", "name": "John Doe" },
    "score": 5,
    "reliability": 5,
    "communication": 4,
    "delivery": 5,
    "review": "Excellent wholesale partner. Fast shipping, great product quality.",
    "createdAt": "2026-03-05T09:00:00.000Z"
  }
}
```

---

### Browse Products with Filter

```
GET /api/products?search=usb&tags=65f4...e1,65f4...e2&page=1&limit=12
```

---

## MongoDB Collections

| Collection | Key Fields |
|------------|-----------|
| `vendors`  | businessName, email, password (hashed), averageRating, totalRatings |
| `buyers`   | name, email, password (hashed) |
| `products` | name, price, stock, vendor (ref), tags (ref[]), isAvailable |
| `ratings`  | vendor (ref), buyer (ref), score 1-5, reliability, communication, delivery |
| `tags`     | name, slug, category |

---

## Features Summary

- **Dual auth** – separate JWT flows for vendors and buyers
- **Vendor dashboard** – add / edit / delete products with multi-tag support
- **Product browsing** – full-text search + multi-tag filter + pagination
- **Vendor profiles** – public page with product listings and review feed
- **Reliability rating** – buyers rate vendors on overall score + reliability / communication / delivery dimensions
- **One rating per buyer per vendor** – upsert enforced at DB level with a unique compound index
- **Auto-recalculated** vendor `averageRating` after every rating submission or deletion
