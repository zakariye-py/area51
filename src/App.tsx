import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navigation from "./components/Navigation";
import { StudioChatbot } from "./components/StudioChatbot";
import ErrorBoundary from "./components/ErrorBoundary";
import { AlertCircle } from "lucide-react";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Booking from "./pages/Booking";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import BookingSuccess from "./pages/BookingSuccess";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ErrorBoundary>
              <Navigation />
              <StudioChatbot />
              {/* WIP Notice - Fixed Bottom */}
              <Alert className="fixed bottom-0 left-0 right-0 z-50 rounded-none border-x-0 border-t-2 border-b-0 border-neon-green bg-gradient-to-r from-neon-green/30 via-neon-cyan/30 to-neon-purple/30 backdrop-blur-sm animate-pulse shadow-lg shadow-neon-green/50 p-3">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <AlertCircle className="h-5 w-5 text-neon-green animate-bounce flex-shrink-0" />
                  <span className="bg-gradient-to-r from-neon-green via-neon-cyan to-neon-purple bg-clip-text text-transparent animate-neon-flicker text-base font-bold">
                    WORK IN PROGRESS
                  </span>
                </div>
                <div className="text-center text-xs text-white/80">
                  Please contact us directly for pricing and booking info 💬
                </div>
              </Alert>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/booking/success" element={<BookingSuccess />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ErrorBoundary>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
