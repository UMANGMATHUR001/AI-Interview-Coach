import React from 'react';
import { Terminal, Code, Target, Cpu } from 'lucide-react';

export function CardFirst() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6 md:p-12 font-sans overflow-x-hidden selection:bg-white/20">
      
      {/* Tiny Logo Mark */}
      <div className="w-full max-w-6xl flex justify-center mb-8 md:mb-12">
        <div className="p-3 bg-white/5 rounded-full ring-1 ring-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
          <Terminal className="w-5 h-5 text-white/70" />
        </div>
      </div>

      {/* Dominant Feature Cards */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-24 flex-grow">
        {/* Card 1 */}
        <div className="group relative bg-[#111] rounded-3xl p-8 md:p-10 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] hover:border-white/20 transition-all duration-300 flex flex-col items-center text-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent rounded-3xl pointer-events-none"></div>
          <div className="mb-6 p-4 bg-white/5 rounded-2xl ring-1 ring-white/10 group-hover:scale-110 transition-transform duration-300">
            <Code className="w-10 h-10 text-emerald-400" />
          </div>
          <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-white mb-4">Real Scenarios</h3>
          <p className="text-white/60 leading-relaxed md:text-lg">Tackle system design and data structures & algorithms just like the real thing.</p>
        </div>

        {/* Card 2 */}
        <div className="group relative bg-[#111] rounded-3xl p-8 md:p-10 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] hover:border-white/20 transition-all duration-300 flex flex-col items-center text-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent rounded-3xl pointer-events-none"></div>
          <div className="mb-6 p-4 bg-white/5 rounded-2xl ring-1 ring-white/10 group-hover:scale-110 transition-transform duration-300">
            <Target className="w-10 h-10 text-rose-400" />
          </div>
          <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-white mb-4">Honest Feedback</h3>
          <p className="text-white/60 leading-relaxed md:text-lg">Get immediate, deep technical scoring and qualitative reviews on your performance.</p>
        </div>

        {/* Card 3 */}
        <div className="group relative bg-[#111] rounded-3xl p-8 md:p-10 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] hover:border-white/20 transition-all duration-300 flex flex-col items-center text-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent rounded-3xl pointer-events-none"></div>
          <div className="mb-6 p-4 bg-white/5 rounded-2xl ring-1 ring-white/10 group-hover:scale-110 transition-transform duration-300">
            <Cpu className="w-10 h-10 text-blue-400" />
          </div>
          <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-white mb-4">Adaptive AI</h3>
          <p className="text-white/60 leading-relaxed md:text-lg">The AI probes deeper into your specific answers, adjusting on the fly.</p>
        </div>
      </div>

      {/* Compact Bottom Strip */}
      <div className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-between bg-white/[0.02] border border-white/10 p-6 md:p-8 rounded-3xl gap-8 shadow-2xl backdrop-blur-sm">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">Master Technical Interviews with AI</h1>
          <p className="text-white/50 text-sm md:text-base leading-relaxed max-w-xl">Practice with an AI that asks real questions, probes deeper, and gives honest feedback. Like having a senior engineer in your pocket.</p>
        </div>
        <button className="whitespace-nowrap px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-200 hover:scale-105 active:scale-95 transition-all duration-200">
          Login
        </button>
      </div>

    </div>
  );
}
