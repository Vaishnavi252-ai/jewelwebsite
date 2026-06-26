# 💎 JewelWebsite – Online Jewellery E-Commerce Platform

A modern full-stack **Jewellery E-Commerce Application** built using **React, TypeScript, Supabase, Node.js, Express, and Razorpay**. The platform enables customers to browse handcrafted jewellery collections, securely place orders using **Razorpay (Card/UPI)** or **Cash on Delivery (COD)**, track their purchases, and manage their profiles. It also includes a comprehensive **Admin Dashboard** for product management, order processing, and order status updates.

---

## ✨ Features

### 🛍️ Customer Storefront

* Home
* Products
* Product Details
* Blog
* About
* Contact

### 🔐 Authentication

* User Registration & Login
* Protected Routes
* User Profile

### ❤️ Customer Features

* Wishlist
* Shopping Cart
* Checkout
* Order Confirmation
* My Orders
* Order Tracking

### 💳 Payment Options

#### Razorpay

* Card Payments
* UPI Payments
* Secure Payment Verification
* Payment Signature Validation

#### Cash on Delivery (COD)

* Place orders without online payment
* Instant order confirmation

### 📦 Order Management

#### Customer

* View Orders
* Track Order Status
* Order Confirmation

#### Admin

* Admin Dashboard
* Manage Products
* Manage Orders
* Update Order Status

---

# 🚀 Tech Stack

## Frontend

* React
* TypeScript
* Vite
* React Router
* Tailwind CSS
* TanStack React Query
* Supabase
* Razorpay Checkout SDK

## Backend

* Node.js
* Express.js
* Razorpay API
* Supabase Admin SDK
* CORS
* dotenv

---

# 📁 Project Structure

```text
jewelwebsite/
│
├── backend/
│   ├── index.js
│   ├── email.js
│   ├── package.json
│   ├── .env
│   └── .env.local
│
├── public/
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── hooks/
│   ├── layouts/
│   ├── lib/
│   ├── pages/
│   │   ├── Checkout.tsx
│   │   ├── AdminOrders.tsx
│   │   └── ...
│   │
│   ├── services/
│   │   ├── razorpay.ts
│   │   ├── cartService.ts
│   │   ├── orderService.ts
│   │   └── ...
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── .env
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

---

# ⚙️ Environment Variables

This project uses **three environment files**.

## 1. Root `.env` (Frontend)

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

---

## 2. `backend/.env`

```env
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
PORT=5000
```

---

## 3. `backend/.env.local` *(Optional)*

```env
RAZORPAY_KEY_ID=your_local_razorpay_key
RAZORPAY_KEY_SECRET=your_local_razorpay_secret
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
PORT=5000
```

> **Note:** `.env.local` overrides values in `.env` during local development and should not be committed to version control.

---

# 📦 Installation

Clone the repository

```bash
git clone <repository-url>
```

Move into the project directory

```bash
cd jewelwebsite
```

Install frontend dependencies

```bash
npm install
```

Install backend dependencies

```bash
cd backend
npm install
```

---

# ▶️ Running the Application

## Frontend

```bash
npm run dev
```

Runs on:

```
http://localhost:5173
```

---

## Backend

```bash
npm run backend:razorpay:dev
```

Runs on:

```
http://localhost:5000
```

---

# 💳 Payment Flow

## Razorpay (Card / UPI)

1. Customer proceeds to Checkout.
2. A local pending order is created in Supabase.
3. Frontend sends a request to:

```http
POST /create-order
```

4. Backend creates a Razorpay order.
5. Razorpay Checkout opens.
6. Customer completes payment.
7. Frontend sends payment details to:

```http
POST /verify-payment
```

8. Backend verifies the payment signature.
9. Order is marked as **Paid**.
10. Cart is cleared.
11. Customer is redirected to the Order Confirmation page.

---

## Cash on Delivery (COD)

* Razorpay Checkout is skipped.
* Order is immediately marked as **Paid**.
* `payment_verified` is stored as `false`.
* Cart is cleared.
* Customer is redirected to Order Confirmation.

---

# 📦 Admin Workflow

The Admin Dashboard allows administrators to:

* Manage Products
* View Paid Orders
* Update Order Status
* Process Customer Orders

---

# 📂 Backend API

| Method | Endpoint               | Description                               |
| ------ | ---------------------- | ----------------------------------------- |
| POST   | `/create-order`        | Create Razorpay Order                     |
| POST   | `/verify-payment`      | Verify Razorpay Payment                   |
| POST   | `/notify-order-status` | Notify customer after order status update |

---

# 🔒 Protected Routes

* Profile
* Wishlist
* Cart
* Checkout
* Order Confirmation
* My Orders
* Admin Dashboard
* Manage Products
* Manage Orders

---

# 📌 Notes

* Admin Orders page displays **only paid orders** (`payment_status = "paid"`).
* Backend CORS is configured for:

```
http://localhost:5173
```

* Razorpay payment verification is performed securely on the backend.
* Cash on Delivery orders bypass online payment verification.

---

# 🚀 Future Improvements

* Coupon & Discount System
* Product Reviews & Ratings
* Product Search & Filters
* Inventory Management
* Sales Analytics
* PDF Invoice Generation
* Multi-language Support
* Delivery Tracking
* Progressive Web App (PWA)

---

# 👩‍💻 Author

**Vaishnavi Misal**

Full Stack Developer

---

## 📄 License

This project is created for educational and portfolio purposes. Feel free to modify and extend it for your own learning.
