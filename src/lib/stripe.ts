import { loadStripe } from "@stripe/stripe-js";

export const getStripe = () => {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!key) throw new Error("Stripe publishable key not set");
  return loadStripe(key);
};

let stripePromise: ReturnType<typeof loadStripe> | null = null;

export const getStripePromise = () => {
  if (!stripePromise) stripePromise = getStripe();
  return stripePromise;
};
