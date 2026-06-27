type CreateRazorpayOrderInput = {
  localOrderId: string;
  amountPaise: number;
  currency: string;
  notes?: Record<string, unknown>;
};

const API_URL = "https://jewelwebsite.onrender.com";

export const createRazorpayOrder = async (
  input: CreateRazorpayOrderInput
) => {
  const response = await fetch(`${API_URL}/create-order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: input.amountPaise,
      currency: input.currency,
      notes: input.notes,
      localOrderId: input.localOrderId,
    }),
  });

  const data = (await response.json()) as {
    id: string;
    [key: string]: unknown;
  };

  return {
    razorpayOrderId: data.id,
    ...data,
  };
};

type VerifyRazorpayPaymentInput = {
  localOrderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  paymentMethod: string;
};

export const verifyRazorpayPayment = async (
  input: VerifyRazorpayPaymentInput
) => {
  const response = await fetch(`${API_URL}/verify-payment`, {
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

  const data = (await response.json()) as {
    verified: boolean;
    error?: string;
  };

  if (!data.verified) {
    throw new Error(data.error || "Invalid Razorpay payment");
  }

  return true;
};