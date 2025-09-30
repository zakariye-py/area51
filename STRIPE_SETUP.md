# Stripe Integration Setup Guide

## 1. Get Your Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Copy your **Publishable key** (starts with `pk_test_` or `pk_live_`)
3. Copy your **Secret key** (starts with `sk_test_` or `sk_live_`)

## 2. Environment Variables Setup

### Frontend (.env.local)
Create a `.env.local` file in your project root:
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

### Supabase Edge Functions
In your Supabase project dashboard:
1. Go to Settings > Edge Functions
2. Add these environment variables:
   - `STRIPE_SECRET_KEY` = your secret key
   - `STRIPE_WEBHOOK_SECRET` = your webhook secret (see step 4)
   - `SITE_URL` = your site URL (e.g., `http://localhost:5173` for dev)
   - `SUPABASE_URL` = your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY` = your Supabase service role key

## 3. Deploy Supabase Functions

Run these commands to deploy your Edge Functions:

```bash
# Deploy the checkout session function
supabase functions deploy create-checkout-session

# Deploy the webhook handler
supabase functions deploy stripe-webhook
```

## 4. Set Up Stripe Webhooks

1. Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Set the endpoint URL to: `https://your-project.supabase.co/functions/v1/stripe-webhook`
4. Select these events:
   - `checkout.session.completed`
   - `payment_intent.payment_failed`
5. Copy the webhook signing secret and add it to your Supabase environment variables

## 5. Run Database Migration

```bash
supabase db push
```

## 6. Test Your Integration

1. Start your development server: `npm run dev`
2. Go to the booking page
3. Fill out the form and click "Pay with Stripe"
4. Use Stripe's test card numbers:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - Any future expiry date and any 3-digit CVC

## 7. Production Setup

When ready for production:
1. Switch to live Stripe keys
2. Update `SITE_URL` to your production domain
3. Test with real payment methods
4. Set up proper error monitoring

## Troubleshooting

- **"Stripe failed to initialize"**: Check your publishable key
- **"Webhook signature verification failed"**: Verify webhook secret
- **"Function not found"**: Make sure functions are deployed
- **Database errors**: Run the migration with `supabase db push`
