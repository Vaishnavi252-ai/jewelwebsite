import express from "express";
import cors from "cors";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import { sendEmail } from "./email.js";


dotenv.config({ path: ['.env.local', '.env'] });

const app = express();

// Allow frontend origin to call backend endpoints
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error(
    `Missing Razorpay env vars. Need RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET. Got: key_id=${process.env.RAZORPAY_KEY_ID ? 'set' : 'missing'}, key_secret=${process.env.RAZORPAY_KEY_SECRET ? 'set' : 'missing'}`
  );
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});



app.post("/create-order", async (req, res) => {
  try {
    // Checkout.tsx sends `amountPaise`, but frontend service maps it to `amount`.
    const { amount } = req.body;

    const order = await razorpay.orders.create({
      amount: amount, // already in paise
      currency: "INR",
    });

    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Failed",
    });
  }
});

app.post("/notify-order-status", async (req, res) => {
  try {
    const { orderId, newStatus } = req.body;
    if (!orderId || !newStatus) return res.status(400).json({ error: "orderId and newStatus are required" });

    const { createSupabaseAdmin } = await import("./supabaseAdmin.js");
    const supabaseAdmin = createSupabaseAdmin();

    // 1) Fetch order + user_id
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("id,user_id,order_number,payment_status,customer_name")
      .eq("id", orderId)
      .maybeSingle();

    if (orderError) throw orderError;
    if (!order) return res.status(404).json({ error: "Order not found" });

    // 2) Fetch email of that user from auth.users
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUser(
      order.user_id
    );

    if (userError) throw userError;

    const email = userData?.user?.email;
    if (!email) {
      return res.status(400).json({ error: "No email found for this user" });
    }

    // 3) Send email
    const subject = `Order #${order.order_number} status updated: ${newStatus}`;
    const text = `Hi ${order.customer_name || "there"},\n\nYour order status is now: ${newStatus}.\nOrder ID: ${order.order_number}\n\nThanks!`;

    await sendEmail({
      to: email,
      subject,
      text,
    });

    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Notification failed" });
  }
});

app.post("/verify-payment", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      local_order_id,
    } = req.body;

    // Verify signature
    const crypto = await import("crypto");
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      return res.status(400).json({ verified: false, error: "Invalid signature" });
    }

    // IMPORTANT:
    // This project uses Supabase from the frontend, so backend only verifies signature here.
    // Checkout.tsx will update Supabase after receiving `verified: true`.
    return res.json({ verified: true, local_order_id });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Verification failed" });
  }
});

app.listen(5000, () => {
  console.log("Backend running");
});