import { Terminal, Code, Target, Cpu } from "lucide-react";

export function CompactCommand() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-300 font-sans flex flex-col selection:bg-[#6366f1] selection:text-white">
      {/* Subtle top border accent line */}
      <div className="h-1 w-full bg-[#6366f1]"></div>

      <main className="flex-grow flex flex-col w-full max-w-4xl mx-auto px-6 py-12 md:py-24">
        
        {/* Top/Center Compressed Area */}
        <div className="flex flex-col items-start justify-center flex-grow">
          
          <h1 className="text-3xl md:text-5xl font-semibold text-white tracking-tight flex items-center gap-4 leading-none mb-6">
            <Terminal className="w-8 h-8 md:w-10 md:h-10 text-[#6366f1] shrink-0" strokeWidth={2.5} />
            Master Technical Interviews with AI
          </h1>
          
          <p className="text-base md:text-lg text-gray-400 max-w-2xl leading-relaxed mb-10 pl-12 md:pl-14">
            Practice with an AI that asks real questions, probes deeper, and gives honest feedback. Like having a senior engineer in your pocket.
          </p>

          <div className="pl-12 md:pl-14">
            <button className="bg-white hover:bg-gray-200 text-black font-mono text-sm font-bold px-8 py-3 rounded transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              Login <span className="text-gray-500 opacity-70 ml-2">_</span>
            </button>
          </div>
        </div>

        {/* Feature Strip at the bottom */}
        <div className="mt-20 w-full font-mono text-xs md:text-sm pl-12 md:pl-14">
          <div className="flex flex-col md:flex-row w-full justify-between items-start md:items-center gap-8 md:gap-4 border-t border-gray-800 pt-8">
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              <span className="text-gray-700 font-semibold">01</span>
              <Code className="w-5 h-5 text-[#6366f1]" />
              <div className="flex flex-col gap-1">
                <span className="text-gray-200 font-semibold tracking-wide">Real Scenarios</span>
                <span className="text-gray-500">System design + DSA</span>
              </div>
            </div>

            <div className="hidden md:block w-px h-8 bg-gray-800"></div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <span className="text-gray-700 font-semibold">02</span>
              <Target className="w-5 h-5 text-[#6366f1]" />
              <div className="flex flex-col gap-1">
                <span className="text-gray-200 font-semibold tracking-wide">Honest Feedback</span>
                <span className="text-gray-500">Scores technical depth</span>
              </div>
            </div>

            <div className="hidden md:block w-px h-8 bg-gray-800"></div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <span className="text-gray-700 font-semibold">03</span>
              <Cpu className="w-5 h-5 text-[#6366f1]" />
              <div className="flex flex-col gap-1">
                <span className="text-gray-200 font-semibold tracking-wide">Adaptive AI</span>
                <span className="text-gray-500">Adapts to answers</span>
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}
