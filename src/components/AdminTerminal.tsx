import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Eye, EyeOff, Shield, Trash2, X, Download, Server, RefreshCw, Layers, TrendingUp, Search, Calendar, UserCheck } from "lucide-react";

interface Lead {
  id: string;
  name: string;
  email: string;
  handle: string;
  revenue: string;
  message: string;
  timestamp: string;
}

const REVENUE_LABELS: Record<string, string> = {
  "under-5k": "Under $5k/mo",
  "5k-20k": "$5,000 to $20,000 / mo",
  "20k-50k": "$20,005 to $50,000 / mo",
  "50k-100k": "$50,050 to $100,000 / mo",
  "over-100k": "Scale tier ($100k+/mo)"
};

interface AdminTerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminTerminal({ isOpen, onClose }: AdminTerminalProps) {
  const [passcode, setPasscode] = useState("");
  const [activePasscode, setActivePasscode] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRevenue, setFilterRevenue] = useState("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Sync leads from server or localStorage
  const loadLeads = async (passToUse?: string) => {
    const code = passToUse || activePasscode || sessionStorage.getItem("_operator_terminal_passcode") || "";
    
    if (!code) {
      try {
        const stored = localStorage.getItem("_stealth_operator_leads");
        if (stored) {
          setLeads(JSON.parse(stored));
        } else {
          setLeads([]);
        }
      } catch (e) {
        console.error("Could not parse lead store", e);
      }
      return;
    }

    try {
      const response = await fetch("/api/leads", {
        method: "GET",
        headers: {
          "x-admin-passcode": code
        }
      });

      if (response.ok) {
        const serverLeads = await response.json();
        setLeads(serverLeads);
        // Backup to localStorage for cache
        localStorage.setItem("_stealth_operator_leads", JSON.stringify(serverLeads));
      } else {
        throw new Error("Validation rejected by secure server module");
      }
    } catch (err) {
      console.warn("Server leads database sync error, showing local cache:", err);
      try {
        const stored = localStorage.getItem("_stealth_operator_leads");
        if (stored) {
          setLeads(JSON.parse(stored));
        }
      } catch (e) {
        console.error("Could not parse offline cache leads list", e);
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      const cachedPass = sessionStorage.getItem("_operator_terminal_passcode") || "";
      const sessionUnlock = sessionStorage.getItem("_operator_terminal_unlocked");
      if (sessionUnlock === "true" && cachedPass) {
        setActivePasscode(cachedPass);
        setIsUnlocked(true);
        loadLeads(cachedPass);
      } else {
        loadLeads();
      }
    }
  }, [isOpen]);

  const hashStringSHA256 = async (input: string): Promise<string> => {
    const msgUint8 = new TextEncoder().encode(input);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPass = passcode.trim();
    if (!cleanPass) return;

    let isMatch = false;

    // 1. Try custom environment variable first
    const envPasscode = (import.meta as any).env?.VITE_ADMIN_PASSCODE;
    if (envPasscode && cleanPass.toLowerCase() === envPasscode.trim().toLowerCase()) {
      isMatch = true;
    } else {
      // 2. Cryptographic signature check against target hash of 'ndmendhe1999'
      const hashedVal = await hashStringSHA256(cleanPass.toLowerCase());
      const targetHash = "032a9a825c63c481cf992d6adb7a02572a6c1df7a0a006fcbe81f8495eea5e78";
      if (hashedVal === targetHash) {
        isMatch = true;
      }
    }

    if (isMatch) {
      setIsUnlocked(true);
      setActivePasscode(cleanPass);
      setErrorMsg("");
      setPasscode("");
      sessionStorage.setItem("_operator_terminal_unlocked", "true");
      sessionStorage.setItem("_operator_terminal_passcode", cleanPass);
      loadLeads(cleanPass);
    } else {
      setErrorMsg("INVALID SECURE KEY PROTOCOL. ACCESS DENIED.");
      setTimeout(() => setErrorMsg(""), 3000);
    }
  };

  const clearSession = () => {
    setIsUnlocked(false);
    setActivePasscode("");
    sessionStorage.removeItem("_operator_terminal_unlocked");
    sessionStorage.removeItem("_operator_terminal_passcode");
  };

  // Generate mock leads for testing / demo sandbox
  const generateSampleLeads = async () => {
    const samples: Lead[] = [
      {
        id: "OP-920485",
        name: "Elena Rostova",
        email: "elena.r@creatornetwork.co",
        handle: "elenacodes",
        revenue: "over-100k",
        message: "We have built a massive YouTube following on tech education (1.4M sub) but currently generate only standard Adsense payout. Need an elite background operator to help structure custom course materials, membership triggers, and funnel optimization ASAP. We don't want to hire a full 10-person agency overhead.",
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString()
      },
      {
        id: "OP-185934",
        name: "Austen Miller",
        email: "austin@peakintel.email",
        handle: "austin_peak",
        revenue: "50k-100k",
        message: "Running a premium newsletter with 850k+ readers. Conversion on our high-ticket consulting offer has stagnated. I need someone to build and optimize custom checkouts, run back-end scripts, and automate post-purchase email series quietly.",
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString()
      },
      {
        id: "OP-483921",
        name: "Chloe Vance",
        email: "chloe@vanceventures.com",
        handle: "chloereads",
        revenue: "under-5k",
        message: "I am a newsletter creator with 45,000 highly converting subscribers we have not monetised properly yet. I need a launch blueprint and custom product funnel, but want a single technical developer partner to build & run it all in the dark without high fixed consulting fees.",
        timestamp: new Date(Date.now() - 3600000 * 72).toISOString()
      }
    ];

    const code = activePasscode || sessionStorage.getItem("_operator_terminal_passcode") || "";

    // Upload samples to Express server directly if online
    if (code) {
      try {
        for (const sample of samples) {
          await fetch("/api/leads", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(sample)
          });
        }
        await loadLeads(code);
        return;
      } catch (err) {
        console.warn("Failed posting samples to server, writing locally only", err);
      }
    }

    const updated = [...samples, ...leads];
    const unique = Array.from(new Map(updated.map(item => [item.email, item])).values());
    localStorage.setItem("_stealth_operator_leads", JSON.stringify(unique));
    setLeads(unique);
  };

  const deleteLead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to permanently delete this lead record?")) {
      const code = activePasscode || sessionStorage.getItem("_operator_terminal_passcode") || "";
      
      try {
        const response = await fetch(`/api/leads/${id}`, {
          method: "DELETE",
          headers: {
            "x-admin-passcode": code
          }
        });

        if (response.ok) {
          const filtered = leads.filter(l => l.id !== id);
          setLeads(filtered);
          localStorage.setItem("_stealth_operator_leads", JSON.stringify(filtered));
          if (selectedLead?.id === id) {
            setSelectedLead(null);
          }
        } else {
          throw new Error("Access rejected by server database");
        }
      } catch (err) {
        console.warn("Server delete failed, fallback updating local cache:", err);
        const filtered = leads.filter(l => l.id !== id);
        setLeads(filtered);
        localStorage.setItem("_stealth_operator_leads", JSON.stringify(filtered));
        if (selectedLead?.id === id) {
          setSelectedLead(null);
        }
      }
    }
  };

  const resetAllLeads = async () => {
    if (confirm("CRITICAL PROTOCOL: Do you want to wipe all records? Prior file backups are recommended.")) {
      const code = activePasscode || sessionStorage.getItem("_operator_terminal_passcode") || "";
      
      // Wipe remote ones if online
      if (code && leads.length > 0) {
        try {
          for (const lead of leads) {
            await fetch(`/api/leads/${lead.id}`, {
              method: "DELETE",
              headers: { "x-admin-passcode": code }
            });
          }
        } catch (err) {
          console.warn("Failed purging remote records", err);
        }
      }

      localStorage.removeItem("_stealth_operator_leads");
      setLeads([]);
      setSelectedLead(null);
    }
  };

  // Export JSON dossier file
  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(leads, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `stealth_leads_export_${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Export CSV dossier file
  const exportCSV = () => {
    const headers = ["Lead ID", "Name", "Email", "Handle", "Monetization Level", "Timestamp", "Message"];
    const rows = leads.map(l => [
      l.id,
      `"${l.name.replace(/"/g, '""')}"`,
      l.email,
      l.handle ? `@${l.handle}` : "None",
      REVENUE_LABELS[l.revenue] || l.revenue,
      l.timestamp,
      `"${l.message.replace(/"/g, '""')}"`
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", encodeURI(csvContent));
    downloadAnchor.setAttribute("download", `stealth_leads_dossier_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (lead.handle && lead.handle.toLowerCase().includes(searchTerm.toLowerCase())) ||
      lead.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRevenue = filterRevenue === "all" || lead.revenue === filterRevenue;
    return matchesSearch && matchesRevenue;
  });

  // Calculate revenue counts
  const getCountByRev = (key: string) => leads.filter(l => l.revenue === key).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop shadow overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/95 backdrop-blur-md"
          />

          {/* Secure Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
            className="relative w-full max-w-5xl h-[85vh] bg-[#050505] border border-neutral-800 rounded-lg shadow-[0_0_50px_rgba(239,68,68,0.08)] flex flex-col overflow-hidden z-10"
          >
            {/* Header Status Bar */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-neutral-900 bg-[#070707] font-mono text-xs select-none">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                <span className="text-neutral-400 font-bold tracking-widest uppercase">STEALTH OPERATIONS SECURITY PROTOCOL</span>
              </div>
              
              <div className="flex items-center gap-4">
                {isUnlocked && (
                  <button
                    onClick={clearSession}
                    className="text-[10px] text-red-500 hover:underline hover:text-red-400 flex items-center gap-1.5"
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                    [ COLD LOCK CONTAINER ]
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="text-neutral-500 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content Container */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {!isUnlocked ? (
                /* Unauthenticated Guard Panel */
                <div className="flex-grow flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
                  <div className="w-16 h-16 rounded-full border border-red-500/20 bg-red-950/10 flex items-center justify-center mb-6">
                    <Shield className="w-8 h-8 text-red-500 animate-pulse" />
                  </div>

                  <h3 className="font-display text-2xl font-bold text-white tracking-tight mb-2">
                    Credentials Validation Required
                  </h3>
                  
                  <p className="text-neutral-500 text-xs font-mono mb-8 leading-relaxed">
                    This workspace is white-labeled. Enter the secure security key descriptor sequence to unlock your Lead Intake list dashboard.
                  </p>

                  <form onSubmit={handleUnlock} className="w-full space-y-4">
                    <div className="space-y-1 text-left">
                      <label className="block font-mono text-[9px] text-neutral-500 uppercase tracking-widest">
                        SECURE DECODING PASSCODE:
                      </label>
                      <input
                        id="terminal-passcode-input"
                        type="password"
                        placeholder="Enter secure decryption key..."
                        value={passcode}
                        onChange={(e) => setPasscode(e.target.value)}
                        autoFocus
                        className={`w-full bg-[#0a0a0a] border ${errorMsg ? 'border-red-600' : 'border-neutral-800 focus:border-red-500'} p-3 text-center text-sm rounded-sm font-mono tracking-widest text-white focus:outline-none focus:ring-0`}
                      />
                    </div>

                    <AnimatePresence mode="wait">
                      {errorMsg && (
                        <motion.span
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="block font-mono text-[10px] text-red-500 font-bold uppercase"
                        >
                          {errorMsg}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    <button
                      id="unlock-terminal-btn"
                      type="submit"
                      className="w-full py-3 bg-red-600 hover:bg-white text-white hover:text-black font-mono font-bold text-xs uppercase tracking-widest transition-all rounded-sm cursor-pointer border border-transparent"
                    >
                      [ INITIATE ACCESS AUTHORISATION ]
                    </button>
                  </form>
                </div>
              ) : (
                /* Authenticated Dashboard Core Panel Workspace */
                <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                  
                  {/* Left Column: Lead rosters index / controls */}
                  <div className="flex-1 flex flex-col border-r border-neutral-900 overflow-hidden">
                    
                    {/* Top utility action ribbon */}
                    <div className="p-4 border-b border-neutral-900 bg-[#060606] flex flex-wrap gap-3 items-center justify-between">
                      
                      {/* Search and filters */}
                      <div className="flex flex-1 min-w-[200px] items-center gap-2">
                        <div className="relative flex-1">
                          <Search className="w-4 h-4 text-neutral-600 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="Filter leads name, email, keyword..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#0a0a0a] border border-neutral-850 focus:border-red-500 pl-9 pr-3 py-1.5 rounded-sm font-mono text-xs text-white focus:outline-none focus:ring-0"
                          />
                        </div>

                        <select
                          value={filterRevenue}
                          onChange={(e) => setFilterRevenue(e.target.value)}
                          className="bg-[#0a0a0a] border border-neutral-850 p-1.5 focus:border-red-500 rounded-sm font-mono text-xs text-neutral-400 cursor-pointer"
                        >
                          <option value="all">All Tiers</option>
                          <option value="under-5k">Not Monetised / &lt;$5k</option>
                          <option value="5k-20k">$5k-$20k/mo</option>
                          <option value="20k-50k">$20k-$50k/mo</option>
                          <option value="50k-100k">$50k-$100k/mo</option>
                          <option value="over-100k">Scale ($100k+/mo)</option>
                        </select>
                      </div>

                      {/* Diagnostic sandbox triggers */}
                      <div className="flex items-center gap-2">
                        {leads.length === 0 && (
                          <button
                            onClick={generateSampleLeads}
                            className="px-2.5 py-1.5 bg-red-950/20 border border-red-500/30 text-red-400 hover:text-white font-mono text-[10px] uppercase rounded-sm flex items-center gap-1"
                            title="Generate Mock Records for Testing"
                          >
                            <RefreshCw className="w-3 h-3 animate-spin text-red-500" />
                            <span>Inject Mock Leads</span>
                          </button>
                        )}

                        {leads.length > 0 && (
                          <>
                            <div className="flex items-center border border-neutral-850 bg-[#0a0a0a] overflow-hidden rounded-sm font-mono text-[10px]">
                              <button
                                onClick={exportJSON}
                                className="px-2.5 py-1.5 hover:text-white border-r border-neutral-850 text-neutral-500 flex items-center gap-1"
                                title="Export JSON Document"
                              >
                                <Download className="w-3 h-3 text-red-500" />
                                <span>JSON</span>
                              </button>
                              <button
                                onClick={exportCSV}
                                className="px-2.5 py-1.5 hover:text-white text-neutral-500 flex items-center gap-1"
                                title="Export CSV Dossier"
                              >
                                <Download className="w-3 h-3 text-red-500" />
                                <span>CSV</span>
                              </button>
                            </div>

                            <button
                              onClick={resetAllLeads}
                              className="p-1 px-2 border border-neutral-900 bg-[#090909] text-neutral-500 hover:border-red-650 hover:text-red-500 font-mono text-[10px] rounded-sm uppercase tracking-wider"
                              title="Clear Lead Ledger database"
                            >
                              Reset Database
                            </button>
                          </>
                        )}
                      </div>

                    </div>

                    {/* Leads List */}
                    <div className="flex-1 overflow-y-auto divide-y divide-neutral-900">
                      {filteredLeads.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center p-8 text-center text-neutral-500">
                          <Server className="w-10 h-10 text-neutral-800 mb-4" />
                          <span className="font-mono text-xs uppercase text-neutral-400">Ledger Container Empty</span>
                          <p className="text-[11px] font-sans max-w-xs mt-2 text-neutral-650">
                            No real contacts registered yet. Try submitting the contact form on your page, or click "Inject Mock Leads" above to immediately test the system panel!
                          </p>
                        </div>
                      ) : (
                        filteredLeads.map((lead) => {
                          const isSelected = selectedLead?.id === lead.id;
                          return (
                            <div
                              key={lead.id}
                              onClick={() => setSelectedLead(lead)}
                              className={`p-5 transition-colors duration-200 cursor-pointer flex justify-between items-start gap-3
                                ${isSelected ? "bg-red-950/10 border-l-[3px] border-l-red-600" : "bg-transparent hover:bg-neutral-900/45"}
                              `}
                            >
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-display font-bold text-sm text-neutral-200">{lead.name}</span>
                                  {lead.handle && (
                                    <span className="font-mono text-[10px] text-neutral-500">@{lead.handle}</span>
                                  )}
                                </div>

                                <div className="font-mono text-[11px] text-neutral-400 flex flex-wrap gap-x-3 gap-y-1">
                                  <span className="underline decoration-neutral-800">{lead.email}</span>
                                  <span className="text-red-500 font-semibold">{REVENUE_LABELS[lead.revenue] || lead.revenue}</span>
                                </div>

                                <p className="text-xs text-neutral-500 font-light line-clamp-2 pr-4 font-sans leading-relaxed">
                                  {lead.message || "No custom message provided."}
                                </p>
                              </div>

                              <div className="flex flex-col items-end justify-between h-full space-y-4">
                                <span className="font-mono text-[9px] text-neutral-600 uppercase">
                                  {lead.id}
                                </span>
                                
                                <button
                                  onClick={(e) => deleteLead(lead.id, e)}
                                  className="text-neutral-700 hover:text-red-500 transition-colors p-1"
                                  title="Wipe Lead File"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Footer diagnostics information stats panel */}
                    <div className="p-4 border-t border-neutral-900 bg-[#060606] grid grid-cols-3 gap-3 text-center text-xs font-mono select-none">
                      <div>
                        <span className="block text-[10px] text-neutral-600 uppercase">TOTAL SYSTEM LEADS</span>
                        <span className="text-white font-bold text-sm">{leads.length}</span>
                      </div>
                      <div className="border-x border-neutral-900">
                        <span className="block text-[10px] text-neutral-600 uppercase">TIER S ($100K+)</span>
                        <span className="text-red-500 font-bold text-sm">{getCountByRev("over-100k")}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-neutral-600 uppercase">STEALTH SECURE</span>
                        <span className="text-emerald-500 font-bold text-sm">ACTIVE</span>
                      </div>
                    </div>

                  </div>

                  {/* Right Column: Lead Detail View Drawer */}
                  <div className="w-full lg:w-[400px] bg-[#070707] flex flex-col justify-between overflow-y-auto">
                    {selectedLead ? (
                      <div className="p-6 md:p-8 space-y-8">
                        <div>
                          <div className="flex justify-between items-center mb-4">
                            <span className="font-mono text-[10px] text-red-500 uppercase tracking-widest font-bold">
                              [ DOSSIER RECORD ]
                            </span>
                            <span className="text-[10px] font-mono text-neutral-500">ID: {selectedLead.id}</span>
                          </div>
                          
                          <h4 className="font-display text-2xl font-bold text-white tracking-tight">
                            {selectedLead.name}
                          </h4>
                          
                          {selectedLead.handle && (
                            <a
                              href={`https://social.com/@${selectedLead.handle}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 font-mono text-xs text-neutral-400 hover:text-red-500 transition-colors mt-2"
                            >
                              <span>@{selectedLead.handle}</span>
                            </a>
                          )}
                        </div>

                        {/* Param Attributes */}
                        <div className="space-y-5 font-mono text-xs border-y border-neutral-900 py-6">
                          <div className="grid grid-cols-12 gap-2">
                            <span className="col-span-4 text-neutral-600">EMAIL:</span>
                            <span className="col-span-8 text-neutral-200 select-all font-sans break-all">{selectedLead.email}</span>
                          </div>
                          <div className="grid grid-cols-12 gap-2">
                            <span className="col-span-4 text-neutral-600">REVENUE:</span>
                            <span className="col-span-8 text-neutral-200">{REVENUE_LABELS[selectedLead.revenue] || selectedLead.revenue}</span>
                          </div>
                          <div className="grid grid-cols-12 gap-2">
                            <span className="col-span-4 text-neutral-600">SUBMITTED:</span>
                            <span className="col-span-8 text-neutral-400 flex items-center gap-1 font-sans">
                              <Calendar className="w-3.5 h-3.5 text-neutral-650" />
                              <span>{new Date(selectedLead.timestamp).toLocaleString()}</span>
                            </span>
                          </div>
                        </div>

                        {/* Brief Message Body */}
                        <div className="space-y-3">
                          <span className="block font-mono text-[10px] text-neutral-600 uppercase">
                            CREATOR STRATEGY INTAKE BRIEF
                          </span>
                          <div className="bg-[#0b0b0b] border border-neutral-900 p-4 rounded-sm text-sm text-neutral-300 font-sans leading-relaxed whitespace-pre-wrap font-light max-h-[300px] overflow-y-auto">
                            {selectedLead.message || "The user did not provide any custom analysis information."}
                          </div>
                        </div>

                        {/* Operational Actions */}
                        <div className="pt-6 border-t border-neutral-900 space-y-3">
                          <a
                            href={`mailto:${selectedLead.email}?subject=Secure Stealth Growth Audit - Initiative Protocol`}
                            className="w-full py-3 bg-red-650/85 hover:bg-neutral-100 text-white hover:text-black font-semibold text-xs tracking-wider transition-colors uppercase rounded-sm flex items-center justify-center gap-2"
                          >
                            <UserCheck className="w-4 h-4" />
                            <span>Respond to Lead</span>
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="p-8 h-full flex flex-col items-center justify-center text-center text-neutral-600 space-y-4">
                        <Layers className="w-12 h-12 text-neutral-900" />
                        <span className="font-mono text-xs uppercase text-neutral-500">Dossier Workspace Active</span>
                        <p className="text-[11px] font-sans max-w-[250px] leading-relaxed mx-auto">
                          Select a creator contact file from the ledger queue list to analyze metrics, messages, and dispatch responses.
                        </p>
                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>

            {/* Bottom mini diagnostics ribbon */}
            <div className="p-3 bg-[#030303] border-t border-neutral-900 text-center font-mono text-[9px] text-neutral-600 flex justify-between items-center px-6">
              <span>SECURITY TOKEN STATUS: ENCRYPTED_VERIFIED</span>
              <span>© STEALTH SYSTEMS CONSOLE v2.06</span>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
