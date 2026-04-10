import { instance } from "../index.js";
import crypto from "crypto";

// ✅ Create Razorpay Order
export const createRazorpayOrder = async (req, res) => {
  try {
    const options = {
      amount: Number(req.body.amount * 100), // ✅ FIXED
      currency: "INR",
    };

    const order = await instance.orders.create(options);

    res.status(200).json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID, // ✅ FIXED
      amount: order.amount,
      currency: order.currency,
      order_id: order.id, // ✅ IMPORTANT
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Order creation failed" });
  }
};

// ✅ Verify Payment
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expected === razorpay_signature) {
      res.json({ success: true });
    } else {
      res.status(400).json({ success: false });
    }

  } catch (error) {
    res.status(500).json({ message: "Verification failed" });
  }
};