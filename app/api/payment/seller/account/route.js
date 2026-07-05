// app/api/seller/onboard/route.js
import Stripe from "stripe";
import User from "../../../../schema/user";
import { connectDB } from "../../../../lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session.user.id);
    if (!user) {
        return Response.json({ error: "User not found" }, { status: 404 });
    }
    let email = user.email;
    let sellerId = user._id;

    let stripeAccountId = user.stripeAccountId;

    if (stripeAccountId) {
        try {
            const account = await stripe.accounts.retrieve(stripeAccountId);

            console.log("Retrieved Stripe account:", account);

            if (account.requirements?.disabled_reason) {
                return Response.json(
                    { error: "Your payout account was disabled. Please contact support." },
                    { status: 409 }
                );
            }


            const stillNeedsInfo = (account.requirements?.eventually_due?.length ?? 0) > 0;

            if (account.details_submitted && account.payouts_enabled && !stillNeedsInfo) {
                return Response.json({
                    alreadyCompleted: true,
                });
            }
            console.log("Stripe account requirements:", account.requirements.eventually_due.length);



        } catch (error) {
            console.error("Error retrieving Stripe account:", error);
            stripeAccountId = null;
        }
    }


    // Only create a new Stripe account if one doesn't exist yet
    if (!stripeAccountId) {
        try {
            const account = await stripe.accounts.create({
                type: "express",
                email,
                country: user.address?.country || "US",

                capabilities: {
                    transfers: { requested: true },
                },
            },
                { idempotencyKey: `acct-create-${user._id}` }
            );

            stripeAccountId = account.id;

            await User.findByIdAndUpdate(
                sellerId,
                { stripeAccountId },
                { new: true }
            );
        }
        catch (error) {
            console.error("Error creating Stripe account:", error);
            return Response.json({ error: "Failed to create Stripe account" }, { status: 500 });
        }
    }

    try {
        // Generate onboarding link (works for both new and existing accounts)
        const accountLink = await stripe.accountLinks.create({
            account: stripeAccountId,
            refresh_url: `${process.env.NEXT_PUBLIC_BASE_URL}/seller/onboard/refresh`,
            return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/seller/onboard/complete`,
            type: "account_onboarding",
        });
        return Response.json({ url: accountLink.url });

    } catch (error) {
        console.error("Error creating Stripe account link:", error);
        return Response.json({ error: "Failed to create Stripe account link" }, { status: 500 });
    }


}