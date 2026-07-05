// app/api/seller/onboard/complete/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth/[...nextauth]/route";
import { connectDB } from "../../../../../lib/db";
import User from "../../../../../schema/user";



import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    await connectDB();

    const user = await User.findById(session.user.id);

    const account = await stripe.accounts.retrieve(
      user.stripeAccountId
    );

    if (
      account.details_submitted &&
      account.payouts_enabled
    ) {
      await User.findByIdAndUpdate(
        session.user.id,
        { stripeOnboardingDone: true }
      );

      console.log("Stripe onboarding completed for user:", session.user.id, account);

      return Response.json({ success: true });
    }

    return Response.json({ success: false });
  }
  catch (error) {
    console.error("Error completing Stripe onboarding:", error);
    return Response.json({ error: "Failed to complete Stripe onboarding" }, { status: 500 });
  }
}
