// app/api/seller/is-seller/route.js
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { connectDB } from "../../../lib/db";
import Auction from "../../../schema/auction";
import User from "../../../schema/user";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const [hasAuction, user] = await Promise.all([
    Auction.exists({ owner: session.user.id }),
    User.findById(session.user.id).select("stripeAccountId"),
  ]);

  const needsPayout = !!hasAuction && !user?.stripeAccountId;

  let needsMoreInfo = false;
  if (user?.stripeAccountId) {
    try {
      const account = await stripe.accounts.retrieve(user.stripeAccountId);
      needsMoreInfo = (account.requirements?.eventually_due?.length ?? 0) > 0;
    } catch (err) {
      console.error("Error retrieving Stripe account for requirements check:", err);
      // fail silently — don't block the whole route on a Stripe hiccup
    }
  }

  return Response.json({ needsPayout, needsMoreInfo });
}