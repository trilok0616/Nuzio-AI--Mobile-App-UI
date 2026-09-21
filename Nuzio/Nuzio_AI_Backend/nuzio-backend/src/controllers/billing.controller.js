const Stripe = require("stripe");
const User = require("../models/User");
const { HttpError } = require("../utils/httpError");

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

async function getSubscription(req, res) {
  res.json({ success: true, subscription: req.user.subscription });
}

async function createCheckoutSession(req, res) {
  const stripe = getStripe();

  if (!stripe || !process.env.STRIPE_PRICE_ID) {
    throw new HttpError(
      503,
      "Billing is not configured. Add STRIPE_SECRET_KEY and STRIPE_PRICE_ID."
    );
  }

  let customerId = req.user.subscription.providerCustomerId;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: req.user.email,
      name: req.user.name || undefined,
      metadata: { nuzioUserId: String(req.user._id) }
    });

    customerId = customer.id;
    req.user.subscription.provider = "stripe";
    req.user.subscription.providerCustomerId = customerId;
    await req.user.save();
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
    success_url:
      process.env.APP_SUCCESS_URL || "http://localhost:8081/billing/success",
    cancel_url:
      process.env.APP_CANCEL_URL || "http://localhost:8081/billing/cancel",
    metadata: { nuzioUserId: String(req.user._id) }
  });

  res.json({ success: true, checkoutUrl: session.url });
}

async function createBillingPortal(req, res) {
  const stripe = getStripe();
  const customerId = req.user.subscription.providerCustomerId;

  if (!stripe || !customerId) {
    throw new HttpError(400, "No Stripe customer is connected to this account");
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: process.env.APP_SUCCESS_URL || "http://localhost:8081/settings"
  });

  res.json({ success: true, url: session.url });
}

async function stripeWebhook(req, res, next) {
  try {
    const stripe = getStripe();

    if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
      return res.status(503).json({
        success: false,
        message: "Stripe webhook is not configured"
      });
    }

    const event = stripe.webhooks.constructEvent(
      req.body,
      req.headers["stripe-signature"],
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (
      event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      const subscription = event.data.object;

      const user = await User.findOne({
        "subscription.providerCustomerId": subscription.customer
      });

      if (user) {
        const activeLike = ["active", "trialing"].includes(subscription.status);

        user.subscription.provider = "stripe";
        user.subscription.providerSubscriptionId = subscription.id;
        user.subscription.plan = activeLike ? "plus" : "free";
        user.subscription.status =
          subscription.status === "unpaid"
            ? "past_due"
            : subscription.status === "incomplete_expired"
            ? "inactive"
            : subscription.status;

        if (subscription.current_period_end) {
          user.subscription.currentPeriodEnd = new Date(
            subscription.current_period_end * 1000
          );
        }

        await user.save();
      }
    }

    res.json({ received: true });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getSubscription,
  createCheckoutSession,
  createBillingPortal,
  stripeWebhook
};
