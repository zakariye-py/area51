import { supabase } from '@/integrations/supabase/client';

export interface BookingData {
  service: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  notes?: string;
}

export const createBooking = async (bookingData: BookingData) => {
  const { data, error } = await supabase
    .from('bookings')
    .insert([{
      ...bookingData,
      status: 'pending',
      created_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const createPaymentIntent = async (amount: number, bookingId: string) => {
  // For demo purposes, we'll simulate a payment intent creation
  // In production, this would call your backend API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        clientSecret: `pi_mock_${bookingId}_${Date.now()}`
      });
    }, 1000);
  });
};
