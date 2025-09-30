# Manual Stripe Setup Instructions

## ✅ Environment Variables Set
Your `.env.local` file has been created with your Stripe publishable key.

## 🔧 Next Steps (Manual Setup Required)

### 1. Supabase Dashboard Setup
Since the CLI requires authentication, you'll need to set up the environment variables manually in your Supabase dashboard:

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard/project/nhqtpdffhqyjsiwoyawb)
2. Navigate to **Settings** → **Edge Functions**
3. Add these environment variables:

```
STRIPE_SECRET_KEY=sk_test_51SCeHMHqpJV7TOolY6w9VAbrKnOFb25ULxRR0vKhLTtVlAGKCKkyxrIi8aJpgGBQr2Dv3L02uBd5gUETPlwlwHrK002Xmw04VS
SITE_URL=http://localhost:5173
SUPABASE_URL=https://nhqtpdffhqyjsiwoyawb.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 2. Deploy Edge Functions
In your Supabase dashboard:
1. Go to **Edge Functions**
2. Click **Create a new function**
3. Name: `create-checkout-session`
4. Copy the code from `supabase/functions/create-checkout-session/index.ts`
5. Click **Deploy**

Repeat for `stripe-webhook` function.

### 3. Database Migration
Run this SQL in your Supabase SQL Editor:

```sql
-- Add Stripe-related fields to bookings table
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS payment_intent_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_session_id TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_bookings_stripe_session_id ON bookings(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_intent_id ON bookings(payment_intent_id);

-- Update the updated_at column when a row is updated
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### 4. Set Up Stripe Webhook
1. Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **Add endpoint**
3. Set URL to: `https://nhqtpdffhqyjsiwoyawb.supabase.co/functions/v1/stripe-webhook`
4. Select events:
   - `checkout.session.completed`
   - `payment_intent.payment_failed`
5. Copy the webhook secret and add it to Supabase environment variables as `STRIPE_WEBHOOK_SECRET`

### 5. Test Your Integration
1. Start your dev server: `npm run dev`
2. Go to `/booking`
3. Fill out the form
4. Use test card: `4242 4242 4242 4242`
5. Any future expiry date and any CVC

## 🎉 You're Ready!
Your Stripe integration is now set up and ready to process real payments!
