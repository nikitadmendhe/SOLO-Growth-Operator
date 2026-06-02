import { motion } from "motion/react";
import { STEPS } from "../data";
import { ArrowRight, Eye, ShieldAlert, Sparkles } from "lucide-react";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-[#030303] px-6 py-24 md:px-16 lg:px-24 border-b border-neutral-900 relative">
      {/* Red Ambient Halo top-left */}
      <div className="absolute top-1/3 left-[-5%] w-[350px] h-[350px] rounded-full bg-red-950/5 blur-[100px] -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-20 items-end">
          <div className="md:col-span-8">
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-white">
              How It Works
            </h2>
          </div>
          <div className="md:col-span-4 md:text-right">
            <span className="font-mono text-xs text-neutral-500 italic block">
              // From initial leak diagnostic to hands-off payout
            </span>
          </div>
        </div>

        {/* Steps Column-Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6 relative">
          
          {/* Connector Line behind cards on desktop */}
          <div className="hidden lg:block absolute top-[110px] left-[10%] right-[10%] h-[1px] bg-neutral-850 bg-gradient-to-r from-red-600/30 via-neutral-800 to-red-600/10 -z-10" />

          {STEPS.map((step, index) => {
            return (
              <motion.div
                id={`how-works-step-${step.number}`}
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="bg-[#050505] border border-neutral-850 hover:border-neutral-800 p-8 md:p-10 rounded-sm relative group transition-all duration-300"
              >
                {/* Large Background Step Number */}
                <div className="font-display text-7xl md:text-8xl font-black text-neutral-900/50 group-hover:text-red-950/20 select-none absolute top-6 right-8 transition-colors duration-500">
                  {step.number}
                </div>

                {/* Step Metadata Card Icon indicator */}
                <div className="h-10 w-10 rounded-sm border border-neutral-800 bg-neutral-900 flex items-center justify-center font-mono text-xs text-red-500 font-bold mb-10 group-hover:bg-red-950/20 group-hover:border-red-500/30 transition-all duration-300">
                  {step.number}
                </div>

                {/* Text Block content */}
                <span className="font-mono text-[10px] text-red-500 uppercase tracking-widest block mb-2 font-semibold">
                  STAGE {step.number}
                </span>

                <h3 className="font-display text-2xl font-bold text-white mb-4 group-hover:text-red-500 transition-colors duration-300">
                  {step.title}
                </h3>

                <p className="text-neutral-300 text-sm md:text-base leading-relaxed mb-6 font-light">
                  {step.description}
                </p>

                <p className="text-neutral-500 text-xs md:text-sm leading-relaxed border-t border-neutral-900/80 pt-5 font-mono italic">
                  {step.detail}
                </p>

                {/* Footer Micro-Badge */}
                <div className="flex items-center gap-2 mt-8 pt-4 border-t border-neutral-900 text-[10px] uppercase font-mono tracking-wider text-neutral-600 group-hover:text-neutral-400 transition-colors">
                  {index === 0 && <ShieldAlert className="w-3.5 h-3.5 text-red-500/80" />}
                  {index === 1 && <Sparkles className="w-3.5 h-3.5 text-red-500/80" />}
                  {index === 2 && <Eye className="w-3.5 h-3.5 text-red-500/80" />}
                  <span>
                    {index === 0 && "Secure Deep Audit State"}
                    {index === 1 && "Autonomous Run Phase"}
                    {index === 2 && "Strict Operational Discretion"}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Process Guarantee Note */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 p-6 border border-neutral-900/60 bg-[#040404] rounded-sm flex flex-col md:flex-row gap-4 justify-between items-center max-w-4xl mx-auto"
        >
          <div className="flex gap-4 items-center">
            <span className="h-2 w-2 rounded-full bg-red-600 animate-ping shrink-0" />
            <p className="font-mono text-xs text-neutral-400">
              <span className="text-white font-semibold">STRICT DIRECTIVE:</span> No endless consultation meetings. No Slack spam. No agency hand-offs. I build the machines while you build the scale.
            </p>
          </div>
          <button 
            onClick={() => {
              const element = document.getElementById("apply");
              if (element) element.scrollIntoView({ behavior: "smooth" });
            }}
            className="text-red-500 hover:text-white transition-colors duration-300 font-mono text-xs uppercase tracking-widest shrink-0 flex items-center gap-1"
          >
            Initiate Deployment
            <ArrowRight className="w-3 h-3" />
          </button>
        </motion.div>

      </div>
    </section>
  );
}
