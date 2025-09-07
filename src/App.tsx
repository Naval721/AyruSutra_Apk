import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import BottomNav from "@/components/BottomNav";
import AppHeader from "@/components/AppHeader";
import Index from "./pages/Index";
import Chat from "./pages/Chat";
import Schedule from "./pages/ScheduleNew";
import Progress from "./pages/Progress";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";
import { AuthProvider, ProtectedRoute } from "@/lib/auth";
import AuthPage from "./pages/Auth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <SidebarProvider defaultOpen={false}>
            <div className="min-h-screen flex w-full bg-gradient-earth pb-16 sm:pb-0">
              <AppSidebar />
              <div className="flex-1 flex flex-col">
                <Routes>
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/" element={
                    <>
                      <AppHeader title="Dashboard" subtitle="Welcome to your wellness journey" />
                      <ProtectedRoute>
                        <Index />
                      </ProtectedRoute>
                    </>
                  } />
                  <Route path="/chat" element={
                    <>
                      <AppHeader title="Assistant" subtitle="Your personal Ayurvedic guide" />
                      <ProtectedRoute>
                        <Chat />
                      </ProtectedRoute>
                    </>
                  } />
                  <Route path="/schedule" element={
                    <>
                      <AppHeader title="My Schedule" subtitle="Today's therapies and appointments" />
                      <ProtectedRoute>
                        <Schedule />
                      </ProtectedRoute>
                    </>
                  } />
                  <Route path="/progress" element={
                    <>
                      <AppHeader title="Progress" subtitle="Track your healing journey" />
                      <ProtectedRoute>
                        <Progress />
                      </ProtectedRoute>
                    </>
                  } />
                  <Route path="/profile" element={
                    <>
                      <AppHeader title="Profile" subtitle="Your wellness profile and preferences" />
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    </>
                  } />
                  <Route path="/settings" element={
                    <>
                      <AppHeader title="Settings" subtitle="Customize your experience" />
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    </>
                  } />
                  <Route path="/help" element={
                    <>
                      <AppHeader title="Help & Support" subtitle="Get assistance with your journey" />
                      <ProtectedRoute>
                        <Help />
                      </ProtectedRoute>
                    </>
                  } />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <BottomNav />
              </div>
            </div>
          </SidebarProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
