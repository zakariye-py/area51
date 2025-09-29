-- Add some additional sample bookings for testing
-- These will be available for booking by users

INSERT INTO public.bookings (service_type, date, time, status, notes)
VALUES 
    ('Recording', '2024-12-16', '10:00', 'available', 'Morning recording slot'),
    ('Mixing', '2024-12-17', '14:00', 'available', 'Afternoon mixing session'),
    ('Mastering', '2024-12-18', '16:00', 'available', 'Evening mastering session'),
    ('Recording', '2024-12-19', '09:00', 'available', 'Early morning recording'),
    ('Mixing', '2024-12-20', '11:00', 'available', 'Late morning mixing');

-- Add comment for clarity
COMMENT ON TABLE public.bookings IS 'Studio booking system with support for different service types and user assignments';