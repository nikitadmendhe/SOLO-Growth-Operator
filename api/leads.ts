import fs from "fs";
import path from "path";
import crypto from "crypto";
import admin from "firebase-admin";
import { getApps as getAdminApps, initializeApp as initAdminApp } from "firebase-admin/app";
import { getFirestore as getAdminFirestore } from "firebase-admin/firestore";
import { initializeApp as initWebApp, getApps as getWebApps } from "firebase/app";
import { getFirestore as getWebFirestore, collection, setDoc, getDocs, doc, deleteDoc, query, orderBy } from "firebase/firestore";

// Cache variables for serverless execution
let saveLeadToCloud = async (lead: any) => {};
let getLeadsFromCloud = async (): Promise<any[] | null> => { return null; };
let deleteLeadFromCloud = async (id: string) => {};
let firebaseInitialized = false;

async function initFirebase() {
  if (firebaseInitialized) return;
  
  try {
    const configPath = path.join(process.cwd(), "firebase-applet-config.json");
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      
      let adminSuccess = false;
      try {
        let customCredential;
        if (process.env.FIREBASE_SERVICE_ACCOUNT) {
          try {
            let parsed: any = process.env.FIREBASE_SERVICE_ACCOUNT.trim();
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
              customCredential = admin.credential.cert(parsed);
            } else {
              throw new Error("Service account is not a valid JSON object after parsing. Got: " + typeof parsed);
            }
          } catch (jsonErr) {
            console.error("Failed parsing FIREBASE_SERVICE_ACCOUNT environment variable inside Vercel serverless:", jsonErr);
          }
        }

        const adminOptions: any = {
          projectId: config.projectId,
        };
        if (customCredential) {
          adminOptions.credential = customCredential;
        }

        // Handle existing admin apps in serverless context to prevent App named [DEFAULT] already exists error
        const existingAdminApps = getAdminApps();
        const adminApp = existingAdminApps.length > 0 
          ? existingAdminApps[0]
          : initAdminApp(adminOptions);

        const dbAdmin = getAdminFirestore(adminApp, config.firestoreDatabaseId);

        // Dynamic Connection Verification: Verify IAM & Credentials by testing a light read.
        // If the workspace has empty/unauthorized default credentials, this will trigger the fallback chain.
        await dbAdmin.collection("leads").limit(1).get();

        console.log("Firebase Admin SDK verified and loaded successfully in Serverless for project:", config.projectId);

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
        console.warn("Could not load Firebase Admin SDK in serverless function, falling back to Web Client SDK:", adminErr);
      }

      if (!adminSuccess) {
        const existingWebApps = getWebApps();
        const firebaseApp = existingWebApps.length > 0
          ? existingWebApps[0]
          : initWebApp(config);

        const db = getWebFirestore(firebaseApp, config.firestoreDatabaseId);
        console.log("Firebase Web SDK initialized as backup fallback in Serverless:", config.projectId);

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
      
      firebaseInitialized = true;
    } else {
      console.warn("No firebase-applet-config.json found in serverless function, running in local fallback mode.");
    }
  } catch (err) {
    console.error("Firebase serverless startup integration failed:", err);
  }
}

// Local cache backup helpers
const LEADS_FILE = path.join(process.cwd(), "leads.json");

const readLeads = (): any[] => {
  try {
    if (!fs.existsSync(LEADS_FILE)) {
      return [];
    }
    const data = fs.readFileSync(LEADS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    console.error("Error reading leads file in serverless:", e);
    return [];
  }
};

const writeLeads = (leads: any[]) => {
  try {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing leads file in serverless:", e);
  }
};

const validateAdmin = (req: any): boolean => {
  const incomingPasscode = (req.headers["x-admin-passcode"] as string || "").trim();
  if (!incomingPasscode) return false;

  const envPasscode = process.env.ADMIN_PASSCODE || process.env.VITE_ADMIN_PASSCODE;
  if (envPasscode && incomingPasscode.toLowerCase() === envPasscode.trim().toLowerCase()) {
    return true;
  }

  const hashed = crypto.createHash("sha256").update(incomingPasscode.toLowerCase()).digest("hex");
  const targetHash = "032a9a825c63c481cf992d6adb7a02572a6c1df7a0a006fcbe81f8495eea5e78";
  if (hashed === targetHash) {
    return true;
  }

  return false;
};

export default async function handler(req: any, res: any) {
  // Initialize Firebase first
  await initFirebase();

  const { method } = req;

  // Handle GET /api/leads
  if (method === "GET") {
    if (!validateAdmin(req)) {
      return res.status(401).json({ error: "SECURE CHANNEL CLOSED. INVALID AUTHORIZATION TOKEN." });
    }

    try {
      const serverLeads = await getLeadsFromCloud();
      if (serverLeads !== null) {
        writeLeads(serverLeads);
        return res.status(200).json(serverLeads);
      }
    } catch (err) {
      console.error("Failed fetching leads from cloud Firestore in serverless, loading local backup:", err);
    }

    return res.status(200).json(readLeads());
  }

  // Handle POST /api/leads
  if (method === "POST") {
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

    try {
      await saveLeadToCloud(newLead);
      console.log(`Lead ${newLead.id} synced to cloud Firebase database from serverless successfully.`);
    } catch (err) {
      console.error("Failed to sync lead to Firestore in serverless:", err);
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
      console.log(`Automated Email notification initiated via FormSubmit in Serverless for recipient: ${recipientEmail}`);
    } catch (emailErr) {
      console.error("Error sending email notification via FormSubmit in serverless:", emailErr);
    }

    return res.status(201).json(newLead);
  }

  // Handle DELETE /api/leads?id=:id
  if (method === "DELETE") {
    if (!validateAdmin(req)) {
      return res.status(401).json({ error: "SECURE CHANNEL CLOSED. INVALID AUTHORIZATION TOKEN." });
    }

    // Get ID from query parameter (provided via vercel.json rewrite `?id=:id`)
    const id = req.query.id;
    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Missing or invalid lead ID parameter." });
    }

    const leads = readLeads();
    const filtered = leads.filter(l => l.id !== id);
    writeLeads(filtered);

    try {
      await deleteLeadFromCloud(id);
      console.log(`Lead ${id} permanently removed from cloud database from serverless.`);
    } catch (err) {
      console.error("Failed to delete lead from Firestore in serverless:", err);
    }

    return res.status(200).json({ success: true });
  }

  // Fallback for unhandled methods
  res.setHeader("Allow", ["GET", "POST", "DELETE"]);
  return res.status(405).json({ error: `Method ${method} Not Allowed` });
}
