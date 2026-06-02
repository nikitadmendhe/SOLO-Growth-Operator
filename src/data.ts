import { Service, Step, TargetClient, Testimonial } from "./types";

export const SERVICES: Service[] = [
  {
    id: "audience-monetisation",
    title: "Audience Monetisation",
    shortDescription: "Transform silent impressions and casual social followers into a robust, high-yielding intellectual asset.",
    deliverables: [
      "Bespoke premium community architecture",
      "Tiered subscription & membership design",
      "High-value digital product blueprints",
      "Audience segment optimization strategy"
    ]
  },
  {
    id: "product-launches",
    title: "Product Launches",
    shortDescription: "Turn ideas into events. Full-stack sprint campaigns executed behind the scenes with minimal drag on your time.",
    deliverables: [
      "End-to-end launch plan & coordinate calendar",
      "Scripting, positioning, and offer formulation",
      "Optimized pricing models & cart setups",
      "Post-launch customer onboarding playbooks"
    ]
  },
  {
    id: "funnel-buildout",
    title: "Funnel Build-Out",
    shortDescription: "Bespoke high-conversion pathways engineered to convert cold attention into dedicated, recurring buyers.",
    deliverables: [
      "Ultra-fast custom landing and checkout pages",
      "Automated multi-stage email nurturing triggers",
      "Optimized post-purchase upsell structures",
      "Clean integration with Stripe and modern tools"
    ]
  },
  {
    id: "growth-strategy",
    title: "Growth Strategy",
    shortDescription: "Systems-level planning to scale audience monetization margins without adding corporate bloat or support teams.",
    deliverables: [
      "Streamlined tech stack recommendation",
      "Pricing-tier leverage consultation",
      "Audience conversion audit & tracking panels",
      "Self-sustaining backend operations setup"
    ]
  }
];

export const STEPS: Step[] = [
  {
    number: "01",
    title: "Gap Audit",
    description: "We map the precise delta between your current attention metrics and your actual revenue potential.",
    detail: "Through deep data auditing, we find leaks in your current funnel and design a razor-sharp positioning roadmap."
  },
  {
    number: "02",
    title: "Background Build",
    description: "I build, design, code, and execute the entire framework behind the scenes—the offer, email sequences, and launch.",
    detail: "No meetings that could have been emails. No requests for content updates. I pull the levers in the dark while you focus on creating."
  },
  {
    number: "03",
    title: "Silent Harvest",
    description: "You collect the returns. Enjoy a fully built digital revenue stream while I remain completely anonymous.",
    detail: "No agency overhead. No complex slack channels. Clean results matching your personal brand philosophy."
  }
];

export const TARGETS: TargetClient[] = [
  {
    id: "ready-yet-unmonetized",
    title: "The Unmonetised Pioneer",
    description: "You have built a loyal, highly-engaged audience of 100k+ but haven't developed a premium offer, digital product, or community to serve them.",
    painPoint: "Leaving high-margin revenue on the table while feeling overwhelmed by the technical setup of funnels.",
    solution: "A bespoke monetization engine built and managed for you, integrating seamlessly with your current content routine."
  },
  {
    id: "first-product-launch",
    title: "The Authority Brand",
    description: "You have an established brand or newsletter and are ready to execute your first major digital product or course launch.",
    painPoint: "High risk of project fatigue and poor conversion due to lack of a high-end conversion funnel and launch operator.",
    solution: "A fully turn-key background launch campaign, running from copywriting to checkout, ensuring maximum conversion."
  },
  {
    id: "bloat-free-scale",
    title: "The Solopreneur Visionary",
    description: "You need an execution partner who runs the backend, writes high-converting copy, and coordinates your funnels—not a bloated agency or hands-off consultant.",
    painPoint: "Spending your creative energy managing freelancers, fixing Stripe bugs, or editing landing pages.",
    solution: "A single, highly-focused engineering and growth operator who runs your backends invisibly. Zero-team scaling."
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "tester-1",
    quote: "By far the cleanest execution partner we have worked with. They quietly built a membership funnel that added $28,000 in monthly recurring revenue in under 45 days. Complete transparency, zero overhead.",
    author: "Austin M.",
    role: "Founder, Peak Intelligence (850k+ Newsletter)",
    metrics: "+$28k MRR"
  },
  {
    id: "tester-2",
    quote: "I am a creator, not an operations guy. Having someone step in, design the entire community strategy, write the copy, and build the custom checkouts was like magic. I literally just focused on my videos.",
    author: "Elena R.",
    role: "Youtuber & Educator (1.4M Subscribers)",
    metrics: "$110k Launch"
  },
  {
    id: "tester-3",
    quote: "They took our existing under-performing course launch, completely re-indexed the pricing structure, rebuilt the landing systems from scratch, and doubled our historical conversion rate to 4.8%.",
    author: "James K.",
    role: "Lead Creator, The Syntax Syndicate",
    metrics: "2.4x ROI"
  }
];
