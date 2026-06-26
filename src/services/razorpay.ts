type CreateRazorpayOrderInput = {
  localOrderId: string;
  amountPaise: number;
  currency: string;
  notes?: Record<string, unknown>;
};

export const createRazorpayOrder = async (input: CreateRazorpayOrderInput) => {
  const response = await fetch("http://localhost:5000/create-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // backend currently only expects `amount`
    body: JSON.stringify({ amount: input.amountPaise, currency: input.currency, notes: input.notes, localOrderId: input.localOrderId }),
  });

  // Backend returns Razorpay order object with `id`.
  // Checkout.tsx expects `{ razorpayOrderId }`.
  const data = (await response.json()) as { id: string; [key: string]: unknown };
  return { razorpayOrderId: data.id, ...data };

};

type VerifyRazorpayPaymentInput = {
  localOrderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  paymentMethod: string;
};

export const verifyRazorpayPayment = async (input: VerifyRazorpayPaymentInput) => {
  const response = await fetch("http://localhost:5000/verify-payment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      razorpay_order_id: input.razorpayOrderId,
      razorpay_payment_id: input.razorpayPaymentId,
      razorpay_signature: input.razorpaySignature,
      local_order_id: input.localOrderId,
    }),
  });

  const data = (await response.json()) as { verified: boolean; error?: string };
  if (!data.verified) {
    throw new Error(data.error || "Invalid Razorpay payment");
  }
  return true;
};
