import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const LEADS_FILE = path.join(process.cwd(), "leads.json");

  // Helper to read leads from JSON file
  const readLeads = (): any[] => {
    try {
      if (!fs.existsSync(LEADS_FILE)) {
        return [];
      }
      const data = fs.readFileSync(LEADS_FILE, "utf-8");
      return JSON.parse(data);
    } catch (e) {
      console.error("Error reading leads file", e);
      return [];
    }
  };

  // Helper to write leads to JSON file
  const writeLeads = (leads: any[]) => {
    try {
      fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), "utf-8");
    } catch (e) {
      console.error("Error writing leads file", e);
    }
  };

  // Validate admin authorization
  const validateAdmin = (req: express.Request): boolean => {
    const incomingPasscode = (req.headers["x-admin-passcode"] as string || "").trim();
    if (!incomingPasscode) return false;

    // Check custom environment variable password if configured in hosting / Vercel
    const envPasscode = process.env.ADMIN_PASSCODE || process.env.VITE_ADMIN_PASSCODE;
    if (envPasscode && incomingPasscode.toLowerCase() === envPasscode.trim().toLowerCase()) {
      return true;
    }

    // Default fallback: cryptographically verified check against SHA-256 of "ndmendhe1999"
    const hashed = crypto.createHash("sha256").update(incomingPasscode.toLowerCase()).digest("hex");
    const targetHash = "032a9a825c63c481cf992d6adb7a02572a6c1df7a0a006fcbe81f8495eea5e78";
    if (hashed === targetHash) {
      return true;
    }

    return false;
  };

  // Public endpoint: Submit new lead
  app.post("/api/leads", (req, res) => {
    const { name, email, handle, revenue, message } = req.body;
    
    if (!name || !email || !revenue) {
      return res.status(400).json({ error: "Missing required core parameters." });
    }

    const newLead = {
      id: "OP-" + Math.floor(100000 + Math.random() * 900000),
      name,
      email,
      handle: handle || "",
      revenue,
      message: message || "",
      timestamp: new Date().toISOString()
    };

    const leads = readLeads();
    leads.unshift(newLead);
    writeLeads(leads);

    res.status(201).json(newLead);
  });

  // Secure endpoint: Read all leads (validated via header key passcode)
  app.get("/api/leads", (req, res) => {
    if (!validateAdmin(req)) {
      return res.status(401).json({ error: "SECURE CHANNEL CLOSED. INVALID AUTHORIZATION TOKEN." });
    }
    res.json(readLeads());
  });

  // Secure endpoint: Delete lead record
  app.delete("/api/leads/:id", (req, res) => {
    if (!validateAdmin(req)) {
      return res.status(401).json({ error: "SECURE CHANNEL CLOSED. INVALID AUTHORIZATION TOKEN." });
    }

    const { id } = req.params;
    const leads = readLeads();
    const filtered = leads.filter(l => l.id !== id);
    writeLeads(filtered);
    res.json({ success: true });
  });

  // Serve static assets or mount Vite server depending on environment
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server loaded and listening on port ${PORT}`);
  });
}

startServer();
