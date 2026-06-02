import { useState } from "react";
import { motion } from "motion/react";
import { SERVICES } from "../data";
import { CheckCircle2, ChevronRight, CornerDownRight, Laptop, Sparkles, TrendingUp, Users } from "lucide-react";

export default function Services() {
  const [activeService, setActiveService] = useState<string | null>(null);

  // Helper to map icons to services
  const getIcon = (id: string, colorClass: string) => {
    switch (id) {
      case "audience-monetisation":
        return <Users className={`w-6 h-6 ${colorClass}`} />;
      case "product-launches":
        return <Sparkles className={`w-6 h-6 ${colorClass}`} />;
      case "funnel-buildout":
        return <Laptop className={`w-6 h-6 ${colorClass}`} />;
      case "growth-strategy":
        return <TrendingUp className={`w-6 h-6 ${colorClass}`} />;
      default:
        return <CheckCircle2 className={`w-6 h-6 ${colorClass}`} />;
    }
  };

  return (
    <section id="services" className="bg-[#030303] px-6 py-20 md:px-16 lg:px-24 border-b border-neutral-900 relative">
      {/* Background glow details */}
      <div className="absolute right-0 bottom-0 w-[400px] h-[400px] rounded-full bg-red-950/5 blur-[120px] -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-16 items-end">
          <div className="md:col-span-8">
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-white">
              What I Do
            </h2>
          </div>
          <div className="md:col-span-4 md:text-right">
            <span className="font-mono text-xs text-neutral-500 italic block">
              // Re-architecting engagement into yield
            </span>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SERVICES.map((service, index) => {
            const isActive = activeService === service.id;
            return (
              <motion.div
                id={`service-card-${service.id}`}
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onMouseEnter={() => setActiveService(service.id)}
                onMouseLeave={() => setActiveService(null)}
                className={`group p-8 md:p-10 border transition-all duration-500 rounded-sm cursor-default relative flex flex-col justify-between overflow-hidden min-h-[380px]
                  ${isActive 
                    ? "bg-[#090909] border-red-600 shadow-[0_10px_30px_-10px_rgba(239,68,68,0.08)]" 
                    : "bg-[#050505] border-neutral-800 hover:border-neutral-700"
                  }`}
              >
                {/* Border neon top highlight */}
                {isActive && (
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-600 via-red-500 to-transparent" />
                )}

                {/* Card Top Information */}
                <div>
                  <div className="flex justify-between items-start mb-8">
                    <div className={`p-3 rounded-sm border transition-colors duration-500 
                      ${isActive 
                        ? "bg-red-950/20 border-red-500/30" 
                        : "bg-neutral-900 border-neutral-800"
                      }`}
                    >
                      {getIcon(service.id, isActive ? "text-red-500" : "text-neutral-400 group-hover:text-neutral-100")}
                    </div>
                    <span className="font-mono text-xs text-neutral-600 font-bold">
                      [ S - {index + 1} ]
                    </span>
                  </div>

                  <h3 className="font-display text-2xl font-bold text-white mb-4 group-hover:text-red-500 transition-colors duration-300">
                    {service.title}
                  </h3>
                  
                  <p className="text-neutral-400 text-sm md:text-base font-light leading-relaxed mb-8">
                    {service.shortDescription}
                  </p>
                </div>

                {/* Deliverables Block */}
                <div>
                  <div className="border-t border-neutral-800/80 pt-6 mt-auto">
                    <h4 className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest mb-4 flex items-center gap-1.5 font-bold">
                      <CornerDownRight className="w-3.5 h-3.5 text-red-500/70" />
                      SPECIFIC DELIVERABLES
                    </h4>
                    <ul className="space-y-2.5">
                      {service.deliverables.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-neutral-400 group-hover:text-neutral-300 transition-colors">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600/80 mt-1.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Call to action trigger */}
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-neutral-500 group-hover:text-white transition-colors duration-300 mt-8 pt-3 border-t border-neutral-900/50">
                    <span>LAUNCH SYSTEM PROTOCOL</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
