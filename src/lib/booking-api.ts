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
  const { data, error } = await (supabase as any)
    .from('bookings')
    .insert([{
      service_type: bookingData.service,
      date: bookingData.date,
      time: bookingData.time,
      status: 'booked',
      notes: bookingData.notes || null,
      created_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const createCheckoutSession = async (
  bookingId: string,
  amount: number,
  customerEmail: string,
  customerName: string,
  service: string,
  date: string,
  time: string,
  duration: number
) => {
  const { data, error } = await supabase.functions.invoke('create-checkout-session', {
    body: {
      bookingId,
      amount,
      customerEmail,
      customerName,
      service,
      date,
      time,
      duration
    }
  });

  if (error) throw error;
  return data;
};

export const getBookingBySessionId = async (sessionId: string) => {
  const { data, error } = await (supabase as any)
    .from('bookings')
    .select('*')
    .eq('stripe_session_id', sessionId)
    .single();

  if (error) throw error;
  return data;
};

export const getBookingsForDate = async (date: string) => {
  const { data, error } = await supabase
    .from('bookings')
    .select('time, status')
    .eq('date', date)
    .in('status', ['booked']);

  if (error) throw error;
  return data || [];
};

export const isTimeSlotAvailable = (time: string, duration: number, existingBookings: any[]) => {
  // Since the database doesn't have duration, we'll check for exact time matches
  // In a real implementation, you'd want to add duration to the database schema
  return !existingBookings.some(booking => booking.time === time);
};
