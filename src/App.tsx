import Hero from "./components/Hero";
import Services from "./components/Services";
import HowItWorks from "./components/HowItWorks";
import TargetAudience from "./components/TargetAudience";
import Testimonials from "./components/Testimonials";
import ContactForm from "./components/ContactForm";
import FloatingCTA from "./components/FloatingCTA";
import { EyeOff, ShieldCheck } from "lucide-react";

export default function App() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div id="landing-root" className="min-h-screen bg-[#030303] text-neutral-100 flex flex-col justify-between selection:bg-red-600 selection:text-white">
      
      {/* Primary Landing Page Flow */}
      <main className="flex-grow">
        <Hero />
        <Services />
        <HowItWorks />
        <TargetAudience />
        <Testimonials />
        <ContactForm />
      </main>

      {/* Floating CTA follows scroll past hero */}
      <FloatingCTA />

      {/* High-End Stealth Footer */}
      <footer id="editorial-footer" className="bg-[#020202] border-t border-neutral-900 py-16 px-6 md:px-16 lg:px-24 text-neutral-500 font-mono text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          
          {/* Logo / Operations Status */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2 text-white">
              <span className="w-2 h-2 rounded-full bg-red-600" />
              <span className="font-display font-bold text-sm uppercase tracking-wider">SILENT SYSTEMS</span>
            </div>
            <p className="text-neutral-500 text-xs font-light font-sans max-w-xs leading-relaxed">
              Engineering conversions and launch funnels for premium creators in absolute stealth mode. Scaling audiences quietly, globally.
            </p>
          </div>

          {/* Directives & Info */}
          <div className="md:col-span-4 space-y-4 pt-1 sm:pt-0">
            <span className="text-neutral-400 font-semibold tracking-wider block">DISCRETION AGREEMENT</span>
            <div className="flex gap-2 items-start text-neutral-500">
              <EyeOff className="w-4 h-4 shrink-0 text-red-500/60 mt-0.5" />
              <p className="text-[11px] leading-relaxed font-light">
                Partnership metrics and proprietary backend logic are fully shielded under active non-disclosure frameworks.
              </p>
            </div>
          </div>

          {/* Anchor Links / Navigation */}
          <div className="md:col-span-4 flex flex-col md:items-end gap-3 justify-end h-full">
            <button
              onClick={scrollToTop}
              className="text-neutral-400 hover:text-red-500 transition-colors uppercase tracking-widest text-[10px] flex items-center gap-1 cursor-pointer"
            >
              Back to System Orbit ▲
            </button>
            <div className="text-[10px] text-neutral-605 space-y-1 md:text-right pt-4 border-t border-neutral-900 w-full">
              <div>© {new Date().getFullYear()} STEALTH SYSTEMS. ALL RIGHTS RESERVED.</div>
              <div className="flex justify-start md:justify-end gap-1.5 items-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/70" />
                <span>SECURE RUNTIME PROTOCOL ACTIVE</span>
              </div>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}

