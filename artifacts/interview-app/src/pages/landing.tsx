import { useEffect } from "react";
import { useAuth } from "@workspace/replit-auth-web";
import { useLocation } from "wouter";
import { Terminal, Code, Target, Cpu } from "lucide-react";

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
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-pulse flex items-center gap-2 text-white/40">
          <Terminal className="h-5 w-5" />
          <span className="font-mono text-sm">Initializing environment...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col lg:flex-row overflow-hidden font-sans">
      {/* Left Column */}
      <div className="w-full lg:w-[55%] flex flex-col justify-center p-8 lg:p-20 xl:p-32 border-b lg:border-b-0 lg:border-r border-white/10">
        <div className="max-w-2xl">
          <div className="mb-16 flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10">
            <Terminal className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-5xl lg:text-7xl xl:text-8xl font-bold tracking-tight mb-8 leading-[1.1]">
            Master Technical<br />
            Interviews with AI
          </h1>

          <p className="text-xl lg:text-2xl text-white/60 mb-12 leading-relaxed max-w-xl">
            Practice with an AI that asks real questions, probes deeper, and gives honest feedback. Like having a senior engineer in your pocket.
          </p>

          <button
            onClick={login}
            className="bg-white text-black hover:bg-white/90 transition-colors text-lg font-semibold px-8 py-4 rounded-full w-full sm:w-auto"
          >
            Login
          </button>
        </div>
      </div>

      {/* Right Column */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center p-8 lg:p-20 bg-[#0c0c0c]">
        <div className="max-w-xl flex flex-col gap-6">
          <div className="flex flex-col p-8 border-l-4 border-indigo-500 bg-white/5 hover:bg-white/[0.07] transition-colors rounded-r-2xl">
            <div className="mb-4 text-indigo-400">
              <Code className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-semibold mb-3">Real Scenarios</h3>
            <p className="text-lg text-white/50 leading-relaxed">
              Tackle complex system design and DSA problems that mirror actual tech company interviews.
            </p>
          </div>

          <div className="flex flex-col p-8 border-l-4 border-emerald-500 bg-white/5 hover:bg-white/[0.07] transition-colors rounded-r-2xl">
            <div className="mb-4 text-emerald-400">
              <Target className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-semibold mb-3">Honest Feedback</h3>
            <p className="text-lg text-white/50 leading-relaxed">
              Get objective scores and detailed breakdowns on your technical depth and communication.
            </p>
          </div>

          <div className="flex flex-col p-8 border-l-4 border-amber-500 bg-white/5 hover:bg-white/[0.07] transition-colors rounded-r-2xl">
            <div className="mb-4 text-amber-400">
              <Cpu className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-semibold mb-3">Adaptive AI</h3>
            <p className="text-lg text-white/50 leading-relaxed">
              Experience an interviewer that dynamically adapts its follow-up questions based on your answers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
