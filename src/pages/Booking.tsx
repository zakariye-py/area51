import { Card, CardContent } from "@/components/ui/card";

const Booking = () => {
  return (
    <div className="min-h-screen pt-16">
      {/* FAQ Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12">Booking FAQ</h2>
          <div className="space-y-6">
            <Card className="bg-card/80 backdrop-blur-sm border-border">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2 text-neon-green">What should I prepare before my session?</h3>
                <p className="text-muted-foreground">
                  Bring your song ideas, lyrics if recording vocals, and any reference tracks. We'll handle all the technical setup!
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card/80 backdrop-blur-sm border-border">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2 text-neon-cyan">Can I reschedule my booking?</h3>
                <p className="text-muted-foreground">
                  Yes! Reschedules must be made at least 48 hours prior to your booking time. If you reschedule within this timeframe, you'll receive a full refund of your £10 deposit or can use it towards your next session.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm border-border">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2 text-neon-purple">What payment methods do you accept?</h3>
                <p className="text-muted-foreground">
                  We accept both cash and card payments. A £10 deposit is required to secure your booking, which will be applied towards your session total.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm border-border">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2 text-neon-green">What's included in my session?</h3>
                <p className="text-muted-foreground">
                  All sessions include professional equipment, an experienced engineer, and comfortable amenities. Raw files are provided after recording sessions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Booking;
