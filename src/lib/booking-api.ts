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

export interface ExistingBooking {
  time: string;
  status: string;
  duration?: number; // Duration in hours if available
}

// Helper function to convert time string to minutes from midnight
const timeToMinutes = (time: string): number => {
  const [timeStr, period] = time.split(' ');
  const [hours, minutes] = timeStr.split(':').map(Number);
  let totalMinutes = hours * 60 + minutes;
  
  if (period === 'PM' && hours !== 12) {
    totalMinutes += 12 * 60;
  } else if (period === 'AM' && hours === 12) {
    totalMinutes -= 12 * 60;
  }
  
  return totalMinutes;
};

// Helper function to check if two time slots overlap
const timeSlotsOverlap = (
  start1: string,
  duration1: number,
  start2: string,
  duration2: number = 1
): boolean => {
  const start1Minutes = timeToMinutes(start1);
  const end1Minutes = start1Minutes + (duration1 * 60);
  const start2Minutes = timeToMinutes(start2);
  const end2Minutes = start2Minutes + (duration2 * 60);
  
  // Check if slots overlap: start1 < end2 && start2 < end1
  return start1Minutes < end2Minutes && start2Minutes < end1Minutes;
};

export const createBooking = async (bookingData: BookingData) => {
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('You must be logged in to create a booking');
  }

  // Validate date is in the future
  const bookingDate = new Date(bookingData.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (bookingDate < today) {
    throw new Error('Booking date must be in the future');
  }

  const { data, error } = await supabase
    .from('bookings')
    .insert([{
      user_id: user.id,
      service_type: bookingData.service,
      date: bookingData.date,
      time: bookingData.time,
      duration: bookingData.duration,
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

export const getBookingsForDate = async (date: string): Promise<ExistingBooking[]> => {
  const { data, error } = await supabase
    .from('bookings')
    .select('time, status')
    .eq('date', date)
    .in('status', ['booked']);

  if (error) throw error;
  // Map to ExistingBooking type, defaulting duration to 1 if not present
  return (data || []).map((booking: any) => ({
    time: booking.time,
    status: booking.status,
    duration: booking.duration || 1 // Default to 1 hour if duration not in DB
  })) as ExistingBooking[];
};

export const isTimeSlotAvailable = (
  time: string, 
  duration: number, 
  existingBookings: ExistingBooking[]
): boolean => {
  // Check if the requested time slot overlaps with any existing booking
  return !existingBookings.some(booking => {
    // If booking has no duration, assume 1 hour default
    const bookingDuration = booking.duration || 1;
    
    // Check if time slots overlap
    return timeSlotsOverlap(booking.time, bookingDuration, time, duration);
  });
};
