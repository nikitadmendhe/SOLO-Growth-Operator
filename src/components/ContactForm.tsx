import { useState, FormEvent, ChangeEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ContactFormInput } from "../types";
import { Check, CheckCircle2, Loader2, Send, ShieldCheck, Sparkles } from "lucide-react";

export default function ContactForm() {
  const [form, setForm] = useState<ContactFormInput>({
    name: "",
    email: "",
    handle: "",
    revenue: "",
    message: ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<ContactFormInput>>({});
  const [submissionId, setSubmissionId] = useState("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactFormInput]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<ContactFormInput> = {};
    if (!form.name.trim()) newErrors.name = "Identification name is required.";
    if (!form.email.trim()) {
      newErrors.email = "Communication email is required.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Provide a valid email destination.";
    }
    if (!form.revenue) newErrors.revenue = "Select a monetization tier.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    // Simulate luxury system submission latency
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      setSubmissionId("OP-" + Math.floor(100000 + Math.random() * 900000));
    }, 1500);
  };

  return (
    <section id="apply" className="bg-[#030303] px-6 py-24 md:px-16 lg:px-24 relative overflow-hidden">
      {/* Bottom glowing background indicator */}
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-red-950/15 blur-[160px] -z-10 pointer-events-none" />
      <div className="absolute top-10 left-[-10%] w-[350px] h-[350px] rounded-full bg-red-900/5 blur-[120px] -z-10 pointer-events-none" />

      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0e0e0e_1px,transparent_1px),linear-gradient(to_bottom,#0e0e0e_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-30 -z-10 pointer-events-none" />

      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="contact-form"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
            >
              {/* Section Tag */}
              <div className="text-center mb-12">
                <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
                  Let's see if we're a fit.
                </h2>
                <p className="text-neutral-400 text-sm md:text-base font-light max-w-xl mx-auto">
                  Submit your creator profile analytics. I review all applications personally inside 48 hours. Stealth operations match criteria apply.
                </p>
              </div>

              {/* Form card */}
              <form 
                id="intake-form"
                onSubmit={handleSubmit} 
                className="bg-[#050505] border border-neutral-900 p-8 md:p-12 rounded-sm space-y-8 relative"
              >
                {/* Visual Header Accents */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-neutral-900" />
                <div className="flex justify-between items-center font-mono text-[10px] text-neutral-500 pb-4 border-b border-neutral-900/80 uppercase">
                  <span>LEAD IDENTIFICATION BLUEPRINT</span>
                  <span className="text-red-500">[ SYSTEM_READY ]</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name field */}
                  <div className="space-y-2">
                    <label className="block font-mono text-[10px] uppercase text-neutral-400 tracking-wider font-semibold">
                      Your Name / Brand Identity *
                    </label>
                    <input
                      id="input-name"
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Austin M. / Peak Agency"
                      disabled={isLoading}
                      className={`w-full bg-[#080808] border ${errors.name ? 'border-red-500' : 'border-neutral-850 focus:border-red-500'} p-3.5 text-sm text-white rounded-sm focus:outline-none transition-colors duration-300 placeholder:text-neutral-600 font-sans`}
                    />
                    {errors.name && (
                      <span className="block font-mono text-[10px] text-red-500">{errors.name}</span>
                    )}
                  </div>

                  {/* Email field */}
                  <div className="space-y-2">
                    <label className="block font-mono text-[10px] uppercase text-neutral-400 tracking-wider font-semibold">
                      Corporate/Secure Email *
                    </label>
                    <input
                      id="input-email"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleInputChange}
                      placeholder="e.g. name@domain.com"
                      disabled={isLoading}
                      className={`w-full bg-[#080808] border ${errors.email ? 'border-red-500' : 'border-neutral-850 focus:border-red-500'} p-3.5 text-sm text-white rounded-sm focus:outline-none transition-colors duration-300 placeholder:text-neutral-600 font-sans`}
                    />
                    {errors.email && (
                      <span className="block font-mono text-[10px] text-red-500">{errors.email}</span>
                    )}
                  </div>

                  {/* Social Handle / Platform Info */}
                  <div className="space-y-2">
                    <label className="block font-mono text-[10px] uppercase text-neutral-400 tracking-wider font-semibold">
                      Platform Channel / Social Handle
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 font-mono text-xs text-neutral-500 select-none">@</span>
                      <input
                        id="input-handle"
                        type="text"
                        name="handle"
                        value={form.handle}
                        onChange={handleInputChange}
                        placeholder="youtube_channel / instahandle"
                        disabled={isLoading}
                        className="w-full bg-[#080808] border border-neutral-850 focus:border-red-500 p-3.5 pl-8 text-sm text-white rounded-sm focus:outline-none transition-colors duration-300 placeholder:text-neutral-600 font-sans"
                      />
                    </div>
                  </div>

                  {/* Monthly Revenue Level Select */}
                  <div className="space-y-2">
                    <label className="block font-mono text-[10px] uppercase text-neutral-400 tracking-wider font-semibold">
                      Current Monthly Revenue *
                    </label>
                    <select
                      id="input-revenue"
                      name="revenue"
                      value={form.revenue}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className={`w-full bg-[#080808] border ${errors.revenue ? 'border-red-500' : 'border-neutral-850 focus:border-red-500'} p-3.5 text-sm text-white rounded-sm focus:outline-none transition-colors duration-300 font-sans cursor-pointer`}
                    >
                      <option value="" disabled className="text-neutral-700">Select Revenue Range</option>
                      <option value="under-5k" className="bg-[#050505]">Not monetised yet / Under $5k/mo</option>
                      <option value="5k-20k" className="bg-[#050505]">$5,000 to $20,000 / mo</option>
                      <option value="20k-50k" className="bg-[#050505]">$20,005 to $50,000 / mo</option>
                      <option value="50k-100k" className="bg-[#050505]">$50,005 to $100,000 / mo</option>
                      <option value="over-100k" className="bg-[#050505]">Scale tier ($100k+/mo)</option>
                    </select>
                    {errors.revenue && (
                      <span className="block font-mono text-[10px] text-red-500">{errors.revenue}</span>
                    )}
                  </div>
                </div>

                {/* Message Field */}
                <div className="space-y-2">
                  <label className="block font-mono text-[10px] uppercase text-neutral-400 tracking-wider font-semibold">
                    Describe your audience scale, products, or bottlenecks
                  </label>
                  <textarea
                    id="input-message"
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={handleInputChange}
                    placeholder="Provide details about your audience scale, current digital products, and major revenue blockers..."
                    disabled={isLoading}
                    className="w-full bg-[#080808] border border-neutral-850 focus:border-red-500 p-3.5 text-sm text-white rounded-sm focus:outline-none transition-colors duration-300 placeholder:text-neutral-600 font-sans resize-none"
                  />
                </div>

                {/* Bottom metadata validation checkbox */}
                <div className="flex items-start gap-3 p-4 bg-[#080808] border border-neutral-900 rounded-sm">
                  <ShieldCheck className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                  <p className="font-mono text-[10px] text-neutral-500 leading-normal">
                    By submitting this secure briefing, you acknowledge that all platform analysis, diagnostics, and partnership information will remain strictly white-labeled under our stealth operational agreements.
                  </p>
                </div>

                {/* Submit row */}
                <div className="flex justify-end pt-2 border-t border-neutral-900">
                  <button
                    id="submit-application-btn"
                    type="submit"
                    disabled={isLoading}
                    className="w-full sm:w-auto px-10 py-4 bg-red-600 hover:bg-neutral-100 text-white hover:text-black font-semibold text-sm transition-all duration-300 rounded-sm tracking-wide shadow-[0_4px_20px_rgba(239,68,68,0.1)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white group-hover:text-black" />
                        <span>Validating Parameters...</span>
                      </>
                    ) : (
                      <>
                        <span>Apply Now</span>
                        <Send className="w-4 h-4 group-hover:translate-x-1.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              className="bg-[#050505] border border-red-550/35 p-10 md:p-14 text-center rounded-sm max-w-2xl mx-auto space-y-8 relative"
            >
              {/* Highlight red top border */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-red-600" />

              <div className="mx-auto w-16 h-16 rounded-full border border-red-500/20 bg-red-950/10 flex items-center justify-center relative">
                <Check className="w-8 h-8 text-red-500" />
                <span className="absolute inset-0 rounded-full border border-red-500/10 animate-ping" />
              </div>

              <div className="space-y-3">
                <span className="font-mono text-xs text-red-500 uppercase tracking-[0.25em] font-bold">
                  TRANSMISSION BUFFER REGISTERED
                </span>
                <h3 className="font-display text-2xl md:text-3xl font-bold text-white tracking-tight">
                  Briefing Code Delivered.
                </h3>
                <p className="text-neutral-400 text-sm md:text-base leading-relaxed font-light">
                  Thank you, <span className="text-white font-medium">{form.name}</span>. Your creator portfolio dossier has been parsed into our system. We will evaluate conversion benchmarks and contact you at <span className="text-white font-semibold">{form.email}</span>.
                </p>
              </div>

              {/* Secure Receipt Box */}
              <div className="bg-[#080808] border border-neutral-900 p-5 rounded-sm font-mono text-xs text-left max-w-md mx-auto space-y-2">
                <div className="flex justify-between border-b border-neutral-900 pb-2 mb-2 text-neutral-500 uppercase text-[10px]">
                  <span>TRANSACTION RECEIPT</span>
                  <span>[ STRICTLY_CONFIDENTIAL ]</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">SESSION ID:</span>
                  <span className="text-neutral-300 font-semibold">{submissionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">OPERATIONAL MARGIN:</span>
                  <span className="text-red-500">STETHMATCH_PENDING</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">COMMUNICATION VECTOR:</span>
                  <span className="text-neutral-350">{form.email}</span>
                </div>
              </div>

              <div>
                <button
                  id="reset-form-btn"
                  onClick={() => setIsSubmitted(false)}
                  className="px-6 py-2.5 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white font-mono text-xs uppercase tracking-widest transition-all rounded-sm cursor-pointer"
                >
                  [ Send Another Match Proposal ]
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
