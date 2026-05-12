import { useEffect } from "react";
import { useAuth } from "@workspace/replit-auth-web";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Terminal, Code, Cpu, Target } from "lucide-react";

export default function Landing() {
  const { isAuthenticated, isLoading, login } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse flex items-center gap-2 text-muted-foreground">
          <Terminal className="h-5 w-5" />
          <span>Initializing environment...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      
      <div className="z-10 max-w-3xl px-6 text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
              <Terminal className="h-10 w-10 text-primary" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
            Master the technical interview.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Practice with an AI that asks real questions, probes deeper, and gives honest feedback. Like having a senior engineer in your pocket.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center"
        >
          <Button onClick={login} size="lg" className="h-12 px-8 text-lg rounded-xl">
            Authenticate / Login
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 border-t border-border/50"
        >
          <div className="flex flex-col items-center p-6 space-y-3 bg-card/50 rounded-2xl border border-border/50">
            <Code className="h-6 w-6 text-primary" />
            <h3 className="font-semibold">Real Scenarios</h3>
            <p className="text-sm text-muted-foreground text-center">Practice system design, DSA, and specific tech stacks.</p>
          </div>
          <div className="flex flex-col items-center p-6 space-y-3 bg-card/50 rounded-2xl border border-border/50">
            <Target className="h-6 w-6 text-primary" />
            <h3 className="font-semibold">Honest Feedback</h3>
            <p className="text-sm text-muted-foreground text-center">Get detailed scores on technical depth and communication.</p>
          </div>
          <div className="flex flex-col items-center p-6 space-y-3 bg-card/50 rounded-2xl border border-border/50">
            <Cpu className="h-6 w-6 text-primary" />
            <h3 className="font-semibold">Adaptive AI</h3>
            <p className="text-sm text-muted-foreground text-center">The interviewer adapts to your answers and digs deeper.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}