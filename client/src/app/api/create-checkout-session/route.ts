import { NextRequest, NextResponse } from "next/server"
import { Stripe } from "stripe"

// Validate that STRIPE_SECRET_KEY is set
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
    console.error("STRIPE_SECRET_KEY is not configured in environment variables");
}

const stripe = new Stripe(stripeSecretKey || "", {
    apiVersion: "2023-10-16",
})

interface CheckoutItem {
    name: string;
    description?: string;
    amount: number;
    currency: string;
    quantity: number;
    images?: string[];
}

export async function POST(request: NextRequest) {
    try {
        // Check if Stripe is properly configured
        if (!stripeSecretKey) {
            console.error("Stripe checkout failed: STRIPE_SECRET_KEY is not set");
            return NextResponse.json(
                { error: "Payment service is not configured. Please contact support." },
                { status: 503 }
            );
        }

        const { items, successUrl, cancelUrl, customerEmail, metadata } =
            await request.json();

        // Validate required fields
        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                { error: "Invalid checkout items" },
                { status: 400 }
            );
        }

        if (!successUrl || !cancelUrl) {
            return NextResponse.json(
                { error: "Success and cancel URLs are required" },
                { status: 400 }
            );
        }

        // Create line items for stripe checkout
        const lineItems = items.map((item: CheckoutItem) => ({
            price_data: {
                currency: item.currency || "usd",
                product_data: {
                    name: item.name,
                    description: item.description,
                    images: item.images || []
                },
                unit_amount: item.amount
            },
            quantity: item.quantity
        }))

        // Create a checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: successUrl,
            cancel_url: cancelUrl,
            customer_email: customerEmail,
            metadata: metadata || {},
            billing_address_collection: "auto"
        })

        if (!session.url) {
            console.error("Stripe session created but no URL returned");
            return NextResponse.json(
                { error: "Failed to generate checkout URL" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, url: session.url });
    } catch (error) {
        console.error("Error creating checkout session:", error);

        // Provide more specific error messages
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        const isStripeError = error instanceof Stripe.errors.StripeError;

        return NextResponse.json(
            {
                error: isStripeError
                    ? "Payment processing error. Please try again."
                    : "Failed to create checkout session",
                details: process.env.NODE_ENV === "development" ? errorMessage : undefined
            },
            { status: 500 }
        );
    }
}