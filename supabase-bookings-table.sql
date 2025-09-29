-- Create bookings table for Area 51 Booths
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  duration INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on customer_email for faster lookups
CREATE INDEX IF NOT EXISTS idx_bookings_customer_email ON bookings(customer_email);

-- Create an index on date for availability queries
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date);

-- Enable Row Level Security (RLS)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows users to read their own bookings
CREATE POLICY "Users can view their own bookings" ON bookings
  FOR SELECT USING (customer_email = auth.jwt() ->> 'email');

-- Create a policy that allows users to insert their own bookings
CREATE POLICY "Users can create their own bookings" ON bookings
  FOR INSERT WITH CHECK (true);

-- Create a policy that allows admins to view all bookings
CREATE POLICY "Admins can view all bookings" ON bookings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_roles.user_id = auth.uid() 
      AND user_roles.role = 'admin'
    )
  );
