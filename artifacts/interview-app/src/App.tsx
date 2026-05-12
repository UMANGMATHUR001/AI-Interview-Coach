import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@workspace/replit-auth-web";
import { Layout } from "@/components/layout";
import { Loader2 } from "lucide-react";

// Pages
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Interviews from "@/pages/interviews";
import InterviewSetup from "@/pages/interview-setup";
import InterviewRoom from "@/pages/interview-room";
import Analytics from "@/pages/analytics";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

// Protected route wrapper
function ProtectedRoute({ component: Component, ...rest }: any) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  if (!isAuthenticated) {
    window.location.href = "/";
    return null;
  }

  return (
    <Layout>
      <Component {...rest} />
    </Layout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/dashboard" component={() => <ProtectedRoute component={Dashboard} />} />
      <Route path="/interviews" component={() => <ProtectedRoute component={Interviews} />} />
      <Route path="/interview/new" component={() => <ProtectedRoute component={InterviewSetup} />} />
      <Route path="/interview/:id" component={() => <ProtectedRoute component={InterviewRoom} />} />
      <Route path="/analytics" component={() => <ProtectedRoute component={Analytics} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
