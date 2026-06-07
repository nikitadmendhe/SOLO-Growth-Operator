import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import admin from "firebase-admin";
import { getApps as getAdminApps, initializeApp as initAdminApp } from "firebase-admin/app";
import { getFirestore as getAdminFirestore } from "firebase-admin/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, setDoc, getDocs, doc, deleteDoc, query, orderBy } from "firebase/firestore";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const LEADS_FILE = path.join(process.cwd(), "leads.json");

  // Multi-tier Secure Cloud Database Sync Handlers
  let saveLeadToCloud = async (lead: any) => {};
  let getLeadsFromCloud = async (): Promise<any[] | null> => { return null; };
  let deleteLeadFromCloud = async (id: string) => {};

  // Initialize Firebase Web or Admin SDK
  try {
    const configPath = path.join(process.cwd(), "firebase-applet-config.json");
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      
      // In production/Cloud Run containers, try to initialize Firebase Admin SDK to bypass security rules
      let adminSuccess = false;
      try {
        let credential;
        if (process.env.FIREBASE_SERVICE_ACCOUNT) {
          try {
            let parsed: any = process.env.FIREBASE_SERVICE_ACCOUNT.trim();
            // Handle double-serialized JSON or quotes around the string recursively
            let previousParsed = "";
            while (typeof parsed === "string" && parsed !== previousParsed) {
              previousParsed = parsed;
              if ((parsed.startsWith('"') && parsed.endsWith('"')) || (parsed.startsWith("'") && parsed.endsWith("'"))) {
                parsed = parsed.slice(1, -1).trim();
              }
              if (parsed.startsWith("{")) {
                parsed = JSON.parse(parsed);
              }
            }
            
            if (parsed && typeof parsed === "object") {
              credential = admin.credential.cert(parsed);
            } else {
              throw new Error("Service account is not a valid JSON object after parsing. Got: " + typeof parsed);
            }
          } catch (jsonErr) {
            console.error("Failed parsing FIREBASE_SERVICE_ACCOUNT environment variable:", jsonErr);
          }
        }

        const adminOptions: any = {
          projectId: config.projectId,
        };
        if (credential) {
          adminOptions.credential = credential;
        }

        const existingAdminApps = getAdminApps();
        const adminApp = existingAdminApps.length > 0 
          ? existingAdminApps[0]
          : initAdminApp(adminOptions);

        const dbAdmin = getAdminFirestore(adminApp, config.firestoreDatabaseId);

        // Dynamic Connection Verification: Verify IAM & Credentials by testing a light read.
        // If the workspace has empty/unauthorized default credentials, this will trigger the fallback chain.
        await dbAdmin.collection("leads").limit(1).get();

        console.log("Firebase Admin SDK verified and loaded successfully for project:", config.projectId);

        saveLeadToCloud = async (lead: any) => {
          await dbAdmin.collection("leads").doc(lead.id).set(lead);
        };

        getLeadsFromCloud = async (): Promise<any[]> => {
          const snapshot = await dbAdmin.collection("leads").orderBy("timestamp", "desc").get();
          const results: any[] = [];
          snapshot.forEach((docRef: any) => {
            results.push(docRef.data());
          });
          return results;
        };

        deleteLeadFromCloud = async (id: string) => {
          await dbAdmin.collection("leads").doc(id).delete();
        };

        adminSuccess = true;
      } catch (adminErr) {
        console.warn("Could not load Firebase Admin SDK credentials, falling back to Web Client SDK:", adminErr);
      }

      if (!adminSuccess) {
        const firebaseApp = initializeApp(config);
        const db = getFirestore(firebaseApp, config.firestoreDatabaseId);
        console.log("Firebase Web SDK initialized as backup fallback:", config.projectId);

        saveLeadToCloud = async (lead: any) => {
          await setDoc(doc(db, "leads", lead.id), lead);
        };

        getLeadsFromCloud = async (): Promise<any[]> => {
          const q = query(collection(db, "leads"), orderBy("timestamp", "desc"));
          const snapshot = await getDocs(q);
          const results: any[] = [];
          snapshot.forEach((d) => {
            results.push(d.data());
          });
          return results;
        };

        deleteLeadFromCloud = async (id: string) => {
          await deleteDoc(doc(db, "leads", id));
        };
      }
    } else {
      console.warn("No firebase-applet-config.json found, running in local-only fallback mode.");
    }
  } catch (err) {
    console.error("Firebase startup integration failed:", err);
  }

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
  app.post("/api/leads", async (req, res) => {
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

    // Save locally first
    const leads = readLeads();
    leads.unshift(newLead);
    writeLeads(leads);

    // Sync to Cloud Firestore if connected
    try {
      await saveLeadToCloud(newLead);
      console.log(`Lead ${newLead.id} synced to cloud Firebase database successfully.`);
    } catch (err) {
      console.error("Failed to sync lead to Firestore:", err);
    }

    // Send email notification securely via FormSubmit
    try {
      const recipientEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "ndmendhe1999@gmail.com";
      const subjectLine = `New Contact Form Submission: ${name} [${newLead.id}]`;
      
      const emailPayload = {
        _subject: subjectLine,
        "Lead ID": newLead.id,
        "Name / Brand Identity": name,
        "Email Address": email,
        "Social Handle / Channel": handle ? `@${handle.replace(/^@/, '')}` : "None Provided",
        "Monthly Revenue Level": revenue,
        "Message / Scale Bottlenecks": message || "No description provided",
        "Registered Timestamp": newLead.timestamp,
        "_captcha": "false", // Tells FormSubmit to bypass the annoying captcha confirmation page
        "_honey": "" // Antispam honeypot field
      };

      await fetch(`https://formsubmit.co/ajax/${recipientEmail}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(emailPayload)
      });
      console.log(`Automated Email notification initiated via FormSubmit for recipient: ${recipientEmail}`);
    } catch (emailErr) {
      console.error("Error sending email notification via FormSubmit in server:", emailErr);
    }

    res.status(201).json(newLead);
  });

  // Secure endpoint: Read all leads (validated via header key passcode)
  app.get("/api/leads", async (req, res) => {
    if (!validateAdmin(req)) {
      return res.status(401).json({ error: "SECURE CHANNEL CLOSED. INVALID AUTHORIZATION TOKEN." });
    }

    // Try fetching from Cloud Firestore
    try {
      const serverLeads = await getLeadsFromCloud();
      if (serverLeads !== null) {
        // Update local file cache for offline/resilience backup
        writeLeads(serverLeads);
        return res.json(serverLeads);
      }
    } catch (err) {
      console.error("Failed fetching leads from cloud Firestore, loading local backup:", err);
    }

    res.json(readLeads());
  });

  // Secure endpoint: Delete lead record
  app.delete("/api/leads/:id", async (req, res) => {
    if (!validateAdmin(req)) {
      return res.status(401).json({ error: "SECURE CHANNEL CLOSED. INVALID AUTHORIZATION TOKEN." });
    }

    const { id } = req.params;

    // Remove from local cache
    const leads = readLeads();
    const filtered = leads.filter(l => l.id !== id);
    writeLeads(filtered);

    // Sync deletion to Cloud Firestore
    try {
      await deleteLeadFromCloud(id);
      console.log(`Lead ${id} permanently removed from cloud database.`);
    } catch (err) {
      console.error("Failed to delete lead from Firestore:", err);
    }

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
