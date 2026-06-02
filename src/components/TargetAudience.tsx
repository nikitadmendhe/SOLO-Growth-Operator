import { motion } from "motion/react";
import { TARGETS } from "../data";
import { AlertCircle, HelpCircle, ShieldCheck } from "lucide-react";

export default function TargetAudience() {
  return (
    <section id="who-is-this-for" className="bg-[#030303] px-6 py-24 md:px-16 lg:px-24 border-b border-b-neutral-900 relative">
      <div className="absolute top-1/2 right-[5%] w-[350px] h-[350px] rounded-full bg-red-950/5 blur-[120px] -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Header Block */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-20 items-end">
          <div className="md:col-span-8">
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-white animate-fade-in">
              Who This Is For
            </h2>
          </div>
          <div className="md:col-span-4 md:text-right">
            <span className="font-mono text-xs text-neutral-500 italic block">
              // Selected scale models for optimal yield matches
            </span>
          </div>
        </div>

        {/* Custom Bento-like Grid / Row Spread */}
        <div className="flex flex-col gap-6">
          {TARGETS.map((target, index) => {
            return (
              <motion.div
                id={`target-audience-${target.id}`}
                key={target.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="bg-[#050505] border border-neutral-900 hover:border-neutral-800 p-8 md:p-12 rounded-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center transition-all duration-300"
              >
                {/* Index & Name */}
                <div className="lg:col-span-4 flex items-start gap-4">
                  <div className="font-mono text-xs text-red-500 font-bold border border-red-500/20 bg-red-950/15 py-1 px-2.5 rounded-sm shrink-0">
                    0{index + 1}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-display text-xl sm:text-2xl font-semibold text-white tracking-tight">
                      {target.title}
                    </h3>
                    <p className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
                      SYSTEM COMPATIBILITY MATCH
                    </p>
                  </div>
                </div>

                {/* Core Description Core Paragraph */}
                <div className="lg:col-span-4">
                  <p className="text-neutral-300 text-sm md:text-base font-light leading-relaxed">
                    {target.description}
                  </p>
                </div>

                {/* Painpoints vs Solution Comparison Column */}
                <div className="lg:col-span-4 space-y-4 pt-6 lg:pt-0 border-t lg:border-t-0 lg:border-l border-neutral-800/80 lg:pl-8">
                  {/* Pain point */}
                  <div className="flex items-start gap-2.5 text-xs">
                    <AlertCircle className="w-4 h-4 text-neutral-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-neutral-500 uppercase tracking-wider font-mono text-[9px] block mb-0.5">THE PROBLEM</span>
                      <span className="text-neutral-400 font-light leading-relaxed block">{target.painPoint}</span>
                    </div>
                  </div>
                  
                  {/* Solution */}
                  <div className="flex items-start gap-2.5 text-xs">
                    <ShieldCheck className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-red-500 uppercase tracking-wider font-mono text-[9px] block mb-0.5">THE RESOLUTION</span>
                      <span className="text-neutral-200 font-medium leading-relaxed block">{target.solution}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Anti-ideal-client callout (luxury editorial sites often explain who they are NOT for to filter low quality leads) */}
        <div className="mt-16 text-center max-w-xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 font-mono text-[10px] text-neutral-500 uppercase">
            <HelpCircle className="w-3.5 h-3.5" />
            WHO THIS IS NOT FOR
          </div>
          <p className="text-neutral-500 text-xs leading-relaxed font-light font-mono">
            Creators with audience sizes under 25k, course/product sellers looking for passive consultations without execution, or teams requiring high-frequency administrative meetings. We operate purely on execution.
          </p>
        </div>

      </div>
    </section>
  );
}
