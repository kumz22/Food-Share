import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { FoodProvider } from "@/context/FoodContext";
import Navbar from "@/components/Navbar";
import HomePage from "@/pages/Home";
import DonatePage from "@/pages/Donate";
import BrowsePage from "@/pages/Browse";
import DashboardPage from "@/pages/Dashboard";
import LoginPage from "@/pages/Login";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <FoodProvider>
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/donate" element={<DonatePage />} />
              <Route path="/browse" element={<BrowsePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </FoodProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
