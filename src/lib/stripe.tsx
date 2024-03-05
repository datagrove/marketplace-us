import { loadStripe } from  "@stripe/stripe-js"

const stripeKey = import.meta.env.PUBLIC_VITE_STRIPE_KEY

export const stripe = require('stripe')(stripeKey)