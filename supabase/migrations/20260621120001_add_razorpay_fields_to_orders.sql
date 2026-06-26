-- Add Razorpay identifiers to orders

ALTER TABLE orders
  ADD razorpay_order_id TEXT;

ALTER TABLE orders
  ADD razorpay_payment_id TEXT;


