// app/api/webhooks/stripe/route.js
import Stripe from "stripe";
import { connectDB } from "../../../lib/db"
import User from "../../../schema/user";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const body = await req.text(); // must be raw text, not parsed JSON
  const sig = req.headers.get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "account.updated") {
    const account = event.data.object;
    await connectDB();
    await User.findOneAndUpdate(
      { stripeAccountId: account.id },
      { stripeOnboardingDone: account.details_submitted && account.payouts_enabled }
    );
  }

  return Response.json({ received: true });
}