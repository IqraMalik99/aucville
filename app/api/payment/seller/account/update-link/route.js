import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth/[...nextauth]/route";
import User from "../../../../../schema/user";
import { connectDB } from "../../../../../lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const user = await User.findById(session.user.id);
  if (!user?.stripeAccountId) {
    return Response.json({ error: "No payout account found" }, { status: 404 });
  }

  try {
    const accountLink = await stripe.accountLinks.create({
      account: user.stripeAccountId,
      refresh_url: `${process.env.NEXT_PUBLIC_BASE_URL}/seller/onboard/refresh`,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/seller/onboard/complete`,
      type: "account_onboarding",
    });
    return Response.json({ url: accountLink.url });
  } catch (err) {
    console.error("Error creating account update link:", err);
    return Response.json({ error: "Failed to create update link" }, { status: 502 });
  }
}