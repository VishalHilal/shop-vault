import express from "express";
import cors from "cors";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3001;

// ⚠️ put in .env in real project
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());

// Create Stripe Checkout Session
app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const { amount } = req.body; // amount in dollars

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Order Payment",
            },
            unit_amount: Math.round(amount * 100), // cents
          },
          quantity: 1,
        },
      ],
      success_url: "http://localhost:5173/payment-success",
      cancel_url: "http://localhost:5173/payment-cancel",
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Stripe server running on http://localhost:${PORT}`);
});
