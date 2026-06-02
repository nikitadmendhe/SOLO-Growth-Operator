import { motion } from "motion/react";
import { ArrowRight, EyeOff, Globe, Server } from "lucide-react";

export default function Hero() {
  const scrollToContact = () => {
    const element = document.getElementById("apply");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-between border-b border-neutral-900 px-6 py-12 md:px-16 md:py-20 lg:px-24 bg-[#030303] overflow-hidden">
      {/* Absolute red glow background details for high-end feel */}
      <div className="absolute top-1/4 right-[-10%] w-[450px] h-[450px] rounded-full bg-red-950/10 blur-[150px] -z-10 pointer-events-none" />
      <div className="absolute bottom-10 left-[-5%] w-[300px] h-[300px] rounded-full bg-red-900/5 blur-[120px] -z-10 pointer-events-none" />

      {/* Grid Pattern overlay for tech-vibe */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#121212_1px,transparent_1px),linear-gradient(to_bottom,#121212_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35 -z-10 pointer-events-none" />

      {/* Top Header Row within the landing section */}
      <div className="flex justify-between items-center w-full mb-12 select-none">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3"
        >
          <div className="w-8 h-8 rounded-sm border border-red-500/30 bg-red-950/10 flex items-center justify-center relative group">
            <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse group-hover:scale-125 transition-transform" />
          </div>
          <span className="font-mono text-xs letter text-neutral-400 uppercase tracking-[0.25em]">
            SYSTEMS / OPERATOR
          </span>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="hidden md:flex items-center gap-5 font-mono text-[10px] text-neutral-500 tracking-wider"
        >
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>STEALTH MODE ACTIVE</span>
          </div>
          <span>•</span>
          <span>EST. MMXXVI</span>
        </motion.div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start my-auto w-full max-w-7xl mx-auto">
        
        {/* Left Column (Main Copy) */}
        <div className="lg:col-span-8 flex flex-col justify-center">
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="inline-flex items-center gap-2 mb-6"
          >
            <span className="h-[1px] w-8 bg-red-500" />
            <span className="font-mono text-xs uppercase text-red-500 tracking-[0.2em] font-medium">
              The Architect in the Shadows
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-bold leading-[1.05] text-white tracking-tight mb-8"
          >
            The Operator <br className="hidden sm:inline" />
            Behind the Brand.
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-neutral-400 text-lg md:text-xl font-light leading-relaxed max-w-2xl mb-8"
          >
            I help creators and personal brands launch products, build conversion funnels, and 
            fully monetise their global audiences—all without the noise, risk, or overhead of 
            hiring a bloated agency. You create the contents. I build the systems.
          </motion.p>

          {/* Buttons / CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 items-start sm:items-center"
          >
            <button
              id="hero-cta-btn"
              onClick={scrollToContact}
              className="group relative px-8 py-4 bg-red-600 hover:bg-neutral-100 text-white hover:text-black font-semibold text-sm transition-all duration-300 rounded-sm tracking-wide shadow-[0_0_20px_rgba(239,68,68,0.15)] hover:shadow-none flex items-center gap-2"
            >
              Apply to Work With Me
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
            </button>
            <a
              id="hero-secondary-btn"
              href="#services"
              className="px-6 py-4 text-xs font-mono uppercase tracking-widest text-neutral-400 hover:text-white transition-colors duration-300 flex items-center gap-1.5"
            >
              <span>Explore Services</span>
              <span className="text-red-500 font-mono">/&gt;</span>
            </a>
          </motion.div>
        </div>

        {/* Right Column (Highly custom side layouts containing the vertical tagline and one-liner) */}
        <div className="lg:col-span-4 flex flex-col justify-between h-full border-t lg:border-t-0 lg:border-l border-neutral-800/60 pt-8 lg:pt-0 lg:pl-12 mt-12 lg:mt-0 min-h-[250px]">
          
          {/* Tagline Banner inside right column */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-500">
              [ THE PHILOSOPHY ]
            </h3>
            <p className="font-display text-2xl font-light leading-snug text-neutral-100 tracking-tight">
              Scaling creators{" "}
              <span className="text-red-500 underline decoration-red-600 underline-offset-4 font-semibold italic">quietly</span>,{" "}
              <span className="text-white relative inline-block">
                globally.
              </span>
            </p>
          </motion.div>

          {/* Special Side Small tag as requested:
              "scaling creators quietly, globally . and this line is in small font down side :-I build the systems. You scale the success." */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="space-y-4 pt-8 lg:pt-16 border-t border-neutral-900"
          >
            <div className="flex gap-4 items-start">
              <span className="text-red-600/70 shrink-0 font-mono text-xs font-bold">└</span>
              <div className="space-y-1">
                <span className="font-mono text-[10px] text-red-500 uppercase tracking-widest block font-medium">
                  OPERATIONAL MANDATE
                </span>
                <span className="font-mono text-xs text-neutral-400 block italic leading-relaxed">
                  "I build the systems. You scale the success."
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-xs text-neutral-500 pt-2 font-mono">
              <EyeOff className="w-3.5 h-3.5 text-red-500/55" />
              <span>Zero client branding leaks. Fully white-labeled.</span>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Tiny Footer Badges with visual metadata links */}
      <div className="w-full max-w-7xl mx-auto flex flex-wrap gap-y-3 justify-between items-center border-t border-neutral-900/80 pt-10 mt-16 font-mono text-xs text-neutral-500">
        <div className="flex items-center gap-5">
          <span className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-red-500" />
            STRICTLY GLOBAL AUDIENCES
          </span>
          <span className="hidden sm:inline text-neutral-800">/</span>
          <span className="hidden sm:inline flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-neutral-500" />
            99.9% FUNNEL UPTIME ENGINEERED
          </span>
        </div>
        <div className="text-neutral-600 hover:text-neutral-400 transition-colors uppercase tracking-widest text-[10px]">
          [ SCROLL FOR THE BLUEPRINTS ▼ ]
        </div>
      </div>
    </section>
  );
}
