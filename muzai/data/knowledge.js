/**
 * MUZAI KNOWLEDGE BASE
 * Structured static intelligence data about Rohit (muzguy), his projects,
 * technical architecture, skills, current builds, and portfolio system.
 * 
 * STRICT COMPLIANCE RULES:
 * 1. Only verified facts from the live portfolio.
 * 2. Explicitly distinguishes CURRENT vs ROADMAP features.
 * 3. Never invents companies, awards, users, or revenue metrics.
 */

const MUZAI_KNOWLEDGE = {
  person: {
    name: "Rohit",
    handle: "muzguy",
    title: "Computer Science Student & Software Builder",
    age: "18",
    education: "Computer Science (CSE)",
    location: "India",
    domain: "muzguy.in",
    tagline: "I build things with code, experiment with AI, and turn random ideas into something real.",
    summary: "Rohit is an 18-year-old Computer Science student in India obsessed with software engineering, artificial intelligence, and the web. He focuses on taking raw conceptual ideas and translating them into high-speed, intuitive digital tools and AI systems.",
    mindset: [
      "Translating ideas into high-speed, intuitive digital tools.",
      "Hands-on AI experimentation with structured, explainable architectures.",
      "Obsessive attention to tactile UI craft, glassmorphism, and performance.",
      "Learning through building real, deployed systems rather than static theory."
    ]
  },

  skills: {
    coreLanguages: ["JavaScript (ESNext)", "TypeScript", "HTML5", "CSS3 / Modern Vanilla CSS", "Python"],
    frameworksAndLibraries: [
      "React 19",
      "Next.js 16",
      "Three.js (WebGL Particle Systems)",
      "Tailwind CSS v4",
      "Lenis Smooth Scroll"
    ],
    aiAndLLMEngineering: [
      "Google Gemini API (Gemini 2.5 Flash)",
      "Groq API (Llama 3.3 70B Versatile)",
      "Multi-Provider AI Routing & Automatic Failover",
      "Deterministic Sequential State Machines",
      "Strict TypeScript / JSON Runtime Schema Validation",
      "Prompt Deconstruction & Adversarial Brand Battles",
      "Explainable AI (Why This Decision Architecture)"
    ],
    systemsAndArchitecture: [
      "Client-Side First Processing",
      "Web Speech API (Browser-Native Speech Synthesis)",
      "Zero-Loss Local Persistence (localStorage State Management)",
      "Responsive Glassmorphic UI Engineering",
      "Design Systems & Tokenized CSS Variables",
      "Git & GitHub Version Control",
      "Vercel Edge & GitHub Pages Deployment"
    ]
  },

  projects: [
    {
      id: "nexus",
      name: "NEXUS.ai",
      headline: "Autonomous 7-Stage Brand Strategy & Identity Studio",
      description: "A comprehensive seven-stage autonomous AI brand strategy, identity synthesis, and consistency governance studio. Built to transform loose concept drafts into production-ready positioning, visual briefs, voice guardrails, and launch kits with full explainability.",
      liveUrl: "https://nexus-ai.muzguy.in",
      githubUrl: "https://github.com/muzguy/nexus-ai",
      detailPath: "../projects/nexus/",
      videoUrl: "https://youtu.be/Dbd_XSbxnaI",
      
      identity: {
        name: "NEXUS.ai",
        purpose: "Autonomous 7-Stage Brand Strategy, Identity Synthesis & Consistency Governance Studio",
        problem: "Brand strategy and identity creation traditionally require fragmented agency handoffs, slow manual feedback loops, and lack verifiable mathematical consistency or explainability. Loose concept drafts struggle to evolve into production-ready positioning, visual briefs, and voice guardrails.",
        targetUseCase: "Early-stage founders, product creators, design agencies, and brand strategists needing production-grade brand positioning, visual design systems, and voice guardrails from raw concept drafts with full explainability.",
        whyRohitBuiltIt: "Rohit built NEXUS to transform raw conceptual ideas into deterministic, production-grade brand intelligence. Rather than building a shallow prompt wrapper around an LLM, he engineered a 7-stage sequential state machine with multi-provider resilience, adversarial stress-testing, and real-time Brand DNA modeling."
      },

      stack: {
        framework: "Next.js 15.1.0 (App Router)",
        ui: "React 19",
        language: "TypeScript",
        styling: "Tailwind CSS 3.4.17",
        aiSdks: ["@google/genai", "groq-sdk"],
        icons: "lucide-react",
        deployment: "Vercel Edge",
        audio: "Browser-native Web Speech API (speech-manager.ts)",
        persistence: "Zero-loss localStorage (nexus_brand_project_v1)",
        summary: "Next.js 15.1.0, React 19, TypeScript, Tailwind CSS 3.4.17, @google/genai, groq-sdk, and lucide-react."
      },

      architecture: {
        model: "7-Stage Sequential State Machine with Multi-Provider Failover",
        primaryAi: "Google Gemini 2.5 Flash",
        fallbackAi: "Groq (llama-3.3-70b-versatile)",
        resilience: "Primary generation executes via Google Gemini 2.5 Flash. If Gemini encounters rate limits (HTTP 429), high demand (HTTP 503), or network timeouts, the router executes exponential backoff retries. If primary retries fail, it transparently fails over to Groq.",
        validation: "Strict TypeScript runtime JSON schema validation guarantees zero malformed payload corruption before updating client state.",
        cancellation: "Native AbortController integration for clean request cancellation.",
        persistence: "All 7 stages, locked strategic vectors, and custom form inputs persist continuously to localStorage (nexus_brand_project_v1).",
        narration: "Integrated global speech synthesizer (speech-manager.ts) using Web Speech API to narrate pitches and brand voices."
      },

      ai: {
        primary: "Google Gemini 2.5 Flash",
        fallback: "Groq (llama-3.3-70b-versatile)",
        routingPolicy: "Deterministic failover with exponential backoff retries on 429/503/timeout",
        schemaValidation: "Strict runtime JSON schema validation on every stage response"
      },

      endpoints: [
        { route: "POST /api/ai/discover", stage: "Stage 01 · Discover", purpose: "Extracts audience pains, constraints, and foundational intelligence via Gemini." },
        { route: "POST /api/ai/position", stage: "Stage 02 · Position", purpose: "Synthesizes 3 radically divergent strategic market positioning vectors via Gemini." },
        { route: "POST /api/ai/shape", stage: "Stage 04 · Shape", purpose: "Forges brand archetypes, naming candidates, taglines, and voice rules via Gemini." },
        { route: "POST /api/ai/visualize", stage: "Stage 05 · Visualize", purpose: "Generates executive visual design briefs, color palettes, and typography tokens via Gemini." },
        { route: "POST /api/ai/guardian", stage: "Stage 06 · Guardian", purpose: "Executes 5D consistency scoring and draft copy audits via Gemini." },
        { route: "POST /api/ai/launch", stage: "Stage 07 · Launch", purpose: "Generates PR release, social campaigns, and launch kit assets via Gemini." }
      ],

      pipeline: [
        {
          stage: 1,
          name: "Discover",
          tagline: "Foundational Intelligence",
          endpoint: "POST /api/ai/discover",
          output: "DiscoveryData Schema",
          whatAiDoes: "Deconstructs raw user idea inputs into deep market insights, primary audience segments, urgent pain points, core problems, operational constraints, and critical open questions.",
          whatItProduces: "Structured foundational intelligence establishing brand essence, problem taxonomy, and audience psychographics while initializing the 9D Brand DNA state model.",
          status: "implemented"
        },
        {
          stage: 2,
          name: "Position",
          tagline: "Strategic Divergence",
          endpoint: "POST /api/ai/position",
          output: "3-Vector Position Matrix",
          whatAiDoes: "Synthesizes 3 radically divergent, defensible market positioning directions with explicit value propositions, archetypes, and strategic trade-offs.",
          whatItProduces: "3-Vector Position Matrix: Vector A (The Friction Slayer / High Utility), Vector B (The Autonomous Foundry / Category Creator), and Vector C (The Design Vanguard / Pure Craft), with explicit 'Sacrifices' vs 'Wins' trade-offs.",
          status: "implemented"
        },
        {
          stage: 3,
          name: "Challenge & Select",
          tagline: "Adversarial Stress-Test / Brand Battle",
          endpoint: "Human Strategist in the Loop + Adversarial Engine",
          output: "Locked Strategic Direction",
          whatAiDoes: "Executes an adversarial 'Brand Battle' pitting the 3 divergent positioning vectors against each other. It stress-tests each vector for cliché vulnerabilities, market risks, audience skepticism, and competitive moats.",
          whatItProduces: "Adversarial critique scorecard and side-by-side battle breakdown, allowing the human strategist to review vulnerabilities before locking the winning strategic vector.",
          status: "implemented"
        },
        {
          stage: 4,
          name: "Shape",
          tagline: "Brand Identity & Persona",
          endpoint: "POST /api/ai/shape",
          output: "ShapeData & Voice Rules",
          whatAiDoes: "Forges the human persona and verbal identity of the brand based on the locked strategic vector.",
          whatItProduces: "Primary & secondary personality archetypes, behavioral traits, 5 categorized naming candidates with rationale and domain availability, taglines, one-line elevator pitch, narrative tone attributes, and forbidden taboo terms.",
          status: "implemented"
        },
        {
          stage: 5,
          name: "Visualize",
          tagline: "Visual Design Brief",
          endpoint: "POST /api/ai/visualize",
          output: "VisualDirection Brief",
          whatAiDoes: "Translates the brand strategy and persona into an executive visual design system.",
          whatItProduces: "Aesthetic thesis, named color mood palettes with exact hex tokens (primary, secondary, accent, surface), typography pairings (header/body font families and weights), and imagery principles.",
          status: "implemented"
        },
        {
          stage: 6,
          name: "Consistency Guardian",
          tagline: "System Alignment Audit",
          endpoint: "POST /api/ai/guardian",
          output: "5D Consistency Report & Brand DNA Audit",
          whatAiDoes: "Audits all generated brand outputs or arbitrary draft copy against the foundational positioning and locked strategy to verify zero drift.",
          whatItProduces: "Automated 5-dimension integrity scoring (0–100 score, PASS/FLAG/FAIL verdict), flags strategic drift, audits arbitrary draft copy in a live sandbox, and updates the 9D Brand DNA signal matrix.",
          status: "implemented"
        },
        {
          stage: 7,
          name: "Launch Kit",
          tagline: "Go-To-Market Assets",
          endpoint: "POST /api/ai/launch",
          output: "LaunchKit + JSON Export",
          whatAiDoes: "Assembles production-ready go-to-market launch assets based on the complete brand intelligence pipeline.",
          whatItProduces: "Landing page hero copy, 3-part social campaign rollout (Twitter/X threads, LinkedIn posts, Product Hunt hooks), audience-tailored elevator pitches, actionable launch checklist, and complete JSON dossier export.",
          status: "implemented"
        }
      ],

      brandDna: {
        maturityLevels: ["Emerging", "Defined", "Refined"],
        dimensions: [
          "01. Brand Essence (Stage 01)",
          "02. Target Audience (Stage 01)",
          "03. Positioning (Stage 02)",
          "04. Value Promise (Stage 03)",
          "05. Personality (Stage 04)",
          "06. Brand Voice (Stage 04)",
          "07. Competitive Moat (Stage 03 & 07)",
          "08. Visual Direction (Stage 05)",
          "09. Guardian Alignment (Stage 06)"
        ],
        description: "A unified real-time state model that computes maturity across 9 strategic brand dimensions as the user progresses through the pipeline."
      },

      subsystems: [
        "Brand DNA Flyout: Real-time 9-dimension signal state tracker measuring mathematical alignment.",
        "Why This Explainability Architecture: Interactive inspection trigger explaining inputs considered, strategic rationale, and sacrificed trade-offs for every AI decision.",
        "Multi-Provider Failover: Google Gemini 2.5 Flash primary generation with automatic failover to Groq (Llama 3.3 70B).",
        "Strict TypeScript Schema Validation: Runtime JSON schema verification ensuring zero malformed payload corruption.",
        "Web Speech Audio Narration: Browser-native speech synthesis (speech-manager.ts) with synchronized audio playback.",
        "Zero-Loss Local Persistence: Instant state hydration from localStorage (nexus_brand_project_v1).",
        "AbortController Cancellation: Native request aborting to avoid orphaned network requests.",
        "Aether OS Reference Project: Pre-computed reference case study for instant zero-credit exploration."
      ],

      implemented: [
        { feature: "7-Stage Sequential State Machine Workflow", status: "implemented" },
        { feature: "Adversarial Brand Battle (Stage 03)", status: "implemented" },
        { feature: "Consistency Guardian Audit & Sandbox (Stage 06)", status: "implemented" },
        { feature: "Real-time 9D Brand DNA Matrix", status: "implemented" },
        { feature: "'Why This' Explainable AI Decision Architecture", status: "implemented" },
        { feature: "Dual Gemini 2.5 Flash + Groq Failover Router", status: "implemented" },
        { feature: "Strict TypeScript Runtime Schema Validation", status: "implemented" },
        { feature: "Exponential Backoff & Retry Handling", status: "implemented" },
        { feature: "Native AbortController Request Cancellation", status: "implemented" },
        { feature: "Web Speech API Narration (speech-manager.ts)", status: "implemented" },
        { feature: "Zero-Loss Local Persistence (nexus_brand_project_v1)", status: "implemented" },
        { feature: "Aether OS Reference Case Study", status: "implemented" },
        { feature: "Walkthrough Video Reel Embed", status: "implemented" }
      ],

      roadmap: [
        { feature: "Multi-Project Workspaces", status: "planned", description: "Multi-tenant cloud databases with project switching, team sharing, and version history." },
        { feature: "Vector Brand Memory", status: "planned", description: "Embeddings-based semantic search querying previous brand decisions and past campaigns." },
        { feature: "Direct Figma Token Exporter", status: "planned", description: "Automated Figma plugin exporting generated color palettes and typography tokens directly into design files." },
        { feature: "CMS & Webflow Direct Sync", status: "planned", description: "Direct synchronization of generated landing page copy and tokens into Webflow and headless CMSs." },
        { feature: "Autonomous Image Generation", status: "planned", description: "Integrated Imagen 3 and FLUX endpoints rendering bespoke logo concepts and visual mood boards." },
        { feature: "Team Collaboration & Permissions", status: "planned", description: "Role-based access control, collaborative feedback pins, and multi-seat workspaces." },
        { feature: "Custom Fine-Tuned Voice Models", status: "planned", description: "Fine-tuned LLM checkpoints trained specifically on a company's historical editorial archives." }
      ],

      keyDistinction: "NEXUS.ai is live in production with its 7-stage engine, Brand Battle, Brand DNA matrix, Gemini+Groq failover, and audio narration. Multi-project workspaces, vector brand memory, and Figma export are planned horizon extensions."
    },

    {
      id: "asaptools",
      name: "ASAPTools",
      headline: "Privacy-First Digital Utility Platform",
      description: "A fast, privacy-focused utility suite designed to process files and developer workflows client-side without sending private user data to third-party servers.",
      liveUrl: "https://asaptools.in",
      githubUrl: "https://github.com/muzguy/asaptools",
      detailPath: "../projects/asaptools/",
      
      identity: {
        name: "ASAPTools",
        headline: "Privacy-First Digital Utility Platform",
        corePhilosophy: "'Need a tool? ASAP, use it.' Browser-first processing where private files and sensitive data are never transmitted to third-party cloud servers.",
        intendedUserProblem: "Everyday web utilities (JSON formatters, image compressors, PDF splitters) are cluttered with intrusive ads, paywalls, and suspicious server uploads that compromise user privacy and leak sensitive files.",
        targetUseCase: "Developers, designers, writers, and power users who need instant everyday utilities without privacy trade-offs or ad bloat."
      },

      stack: {
        framework: "Next.js 16.3.6 (App Router)",
        ui: "React 19.2.8",
        language: "TypeScript 5",
        styling: "Tailwind CSS v4",
        deployment: "Vercel Edge CDN",
        registry: "Decoupled single-source-of-truth in lib/tools-registry.ts",
        summary: "Next.js 16.3.6, React 19.2.8, TypeScript 5, Tailwind CSS v4, Vercel Edge, and centralized registry in lib/tools-registry.ts."
      },

      architecture: {
        model: "Client-Side First Processing with Zero-FOUT Theme Pre-hydration",
        registryArchitecture: "Decoupled registry architecture in lib/tools-registry.ts isolates tool metadata, icon mappings, categorization, and roadmap tags from UI components. This allows real-time keyword indexing and category counts to compute dynamically without re-rendering unnecessary layout subtrees.",
        searchEngine: "Real-time keyword & fuzzy search discovery engine querying titles, descriptions, categories, and keyword tags client-side.",
        themeEngine: "Zero-FOUT light/dark theme switching with localStorage hydration."
      },

      categories: [
        {
          name: "Developer Tools",
          icon: "💻",
          count: "3 Tools",
          description: "Format, validate, encode, and debug raw code payloads with instant syntax error highlighting.",
          tools: [
            { name: "JSON Formatter & Validator", phase: "Phase 02 (In Progress)" },
            { name: "Base64 Encoder / Decoder", phase: "Phase 02 (In Progress)" },
            { name: "UUID / GUID Generator", phase: "Phase 02 (In Progress)" }
          ]
        },
        {
          name: "Text & Content",
          icon: "📝",
          count: "2 Tools",
          description: "Clean, count, convert cases, and inspect prose metrics in real-time with zero latency.",
          tools: [
            { name: "Word & Character Counter", phase: "Phase 02 (In Progress)" },
            { name: "Case Converter (camel, snake, kebab)", phase: "Phase 02 (In Progress)" }
          ]
        },
        {
          name: "Image Utilities",
          icon: "🖼️",
          count: "2 Tools",
          description: "In-browser Canvas and WebWorker compression and modern format transcoding (WebP/AVIF).",
          tools: [
            { name: "Image Compressor (JPG/PNG/WebP)", phase: "Phase 03 (Planned)" },
            { name: "Image Format Converter", phase: "Phase 03 (Planned)" }
          ]
        },
        {
          name: "PDF Documents",
          icon: "📄",
          count: "2 Tools",
          description: "Merge, split, and extract document pages locally using browser-based PDF rendering.",
          tools: [
            { name: "Merge PDF", phase: "Phase 04 (Planned)" },
            { name: "PDF to Images", phase: "Phase 04 (Planned)" }
          ]
        },
        {
          name: "Calculators",
          icon: "🔢",
          count: "2 Tools",
          description: "Instant mathematical, financial, discount, and scientific conversion formulas.",
          tools: [
            { name: "Percentage Calculator", phase: "Phase 02 (In Progress)" },
            { name: "Unit Converter", phase: "Phase 02 (In Progress)" }
          ]
        }
      ],

      currentVerifiedState: {
        phase: "Phase 1 Production Release (Live)",
        isBuilt: true,
        registrySize: "11 planned utilities specified across 5 core verticals in lib/tools-registry.ts",
        features: [
          "Interactive Tool Registry & Catalog System (11 utilities)",
          "Real-time keyword & fuzzy search across utilities",
          "Category filtering across 5 core domains (Developer, Text, Image, PDF, Calculators)",
          "Interactive specification and processing roadmap modals for each utility",
          "Zero-FOUT light/dark theme switching with localStorage hydration",
          "Full mobile responsive drawers and touch controls"
        ]
      },

      implemented: [
        { feature: "Production website on asaptools.in", status: "implemented" },
        { feature: "Centralized tools registry (lib/tools-registry.ts)", status: "implemented" },
        { feature: "5 Core Domain Categories (11 planned tools specified)", status: "implemented" },
        { feature: "Real-time keyword & fuzzy search discovery engine", status: "implemented" },
        { feature: "Category filtering and dynamic badge counts", status: "implemented" },
        { feature: "Interactive specification and roadmap dialogs", status: "implemented" },
        { feature: "Zero-FOUT light/dark theme switching with localStorage hydration", status: "implemented" },
        { feature: "Mobile-responsive navigation drawers", status: "implemented" }
      ],

      aiRoadmap: [
        {
          feature: "AI Document Summarizer & Q&A",
          status: "planned",
          phase: "Phase 05",
          description: "Directly query and extract structured bullet takeaways from multi-page PDFs and research papers without uploading to untrusted third-party training pipelines."
        },
        {
          feature: "AI OCR & Data Extraction",
          status: "planned",
          phase: "Phase 05",
          description: "Convert low-resolution screenshots, receipts, and scanned document images directly into clean, structured JSON schemas or Markdown tables."
        },
        {
          feature: "Context-Aware Text Rewriter",
          status: "planned",
          phase: "Phase 05",
          description: "Targeted prose refactoring (technical clarity, concise summaries, tone adjustments) while preserving specific mathematical formulas and code snippets intact."
        }
      ],

      roadmap: [
        { phase: "Phase 02 // ENGINES", status: "in progress", feature: "First standalone working tool routes (/tools/*) with client-side execution (JSON, Base64, UUID, Word Counter, Case Converter, Percentage)." },
        { phase: "Phase 03 // MEDIA & PDF", status: "planned", feature: "Client-side image compression (WebP/AVIF) and PDF manipulation (Merge/Extract) using in-browser WebAssembly and Web Worker pipelines." },
        { phase: "Phase 04 // ACCOUNTS", status: "planned", feature: "Saved presets, custom formatting profiles, and local/cloud user history." },
        { phase: "Phase 05 // AI & API", status: "planned", feature: "Contextual AI document summarization, receipt OCR, and programmatic REST API endpoints with usage controls." }
      ],

      keyDistinction: "ASAPTools is currently live in its Phase 1 Production Release with its visual design system, fuzzy search engine, and interactive specifications. Standalone WASM file manipulation and AI document features are on the Phase 2 & Phase 5 roadmaps."
    },

    {
      id: "campushub",
      name: "Campus Hub",
      headline: "Digital Student Resource & Navigation Portal",
      description: "A comprehensive digital portal designed for college students, streamlining campus resources, real-time map navigation, and academic essentials.",
      liveUrl: "https://github.com/muzguy",
      githubUrl: "https://github.com/muzguy",
      detailPath: "../#projects",
      
      identity: {
        name: "Campus Hub",
        purpose: "College student resource consolidation and navigation platform",
        problem: "Scattered university resources, fragmented academic schedules, and lack of streamlined campus navigation.",
        targetUseCase: "University students seeking centralized access to academic links and campus facilities."
      },

      stack: {
        core: "HTML5, Modern CSS3, JavaScript (ES6+)",
        summary: "Modern Vanilla HTML5, CSS3, and JavaScript (ES6+ Web App)."
      },

      currentVerifiedState: {
        phase: "Active Portfolio Showcase (03 // PLATFORM)",
        isBuilt: true,
        features: [
          "Centralized campus resources index",
          "Real-time campus map navigation guide",
          "Academic essentials and student workflow tools"
        ]
      },

      implemented: [
        { feature: "Campus resources index", status: "implemented" },
        { feature: "Campus navigation interfaces", status: "implemented" },
        { feature: "Responsive web application layout", status: "implemented" }
      ],

      roadmap: [
        { feature: "Live university API integration", status: "planned" },
        { feature: "Real-time campus event feeds", status: "planned" }
      ],

      keyDistinction: "Campus Hub is featured on the main muzguy.in portfolio as an active web application platform."
    }
  ],

  currentBuilds: [
    {
      title: "MuzAI — Personal Intelligence Layer",
      status: "Active / Current Build",
      description: "An interactive, client-side conversational AI terminal built natively into muzguy.in, allowing visitors to ask questions about Rohit's background, architectures, and projects."
    },
    {
      title: "NEXUS.ai System Polish & Case Study",
      status: "Live & Continuously Iterated",
      description: "Enhancing the 7-stage Brand Intelligence pipeline with production resilience, failover telemetry, and interactive case study demonstrations."
    },
    {
      title: "ASAPTools Phase 1 Production",
      status: "Live & Preparing Phase 2",
      description: "Live utility catalog platform with fuzzy discovery; actively architecting the Phase 2 WebAssembly processing engines."
    }
  ],

  portfolio: {
    name: "muzguy.in",
    version: "v2.6 // LAB",
    technologies: ["Vanilla HTML5", "Modern Vanilla CSS3", "JavaScript (ES6+)", "Three.js (WebGL)", "Lenis Smooth Scroll"],
    designAesthetics: [
      "Glassmorphism with specular ambient reflections",
      "Interactive Three.js particle constellation reacting to mouse movement",
      "Dynamic Atmosphere Theme Engine: WebGL (Cyan), Desert (Amber), Driveby (Crimson), Flow (Emerald)",
      "Zero-FOUT Light & Dark Mode with frosted glass text readability surfaces in light mode",
      "Custom dual-stage cursor with inertial tracking",
      "Cyber HUD Navbar and tactile grain overlay"
    ]
  },

  casual: {
    hobbies: [
      "Building web applications, developer utilities, and AI platforms (like ASAPTools and NEXUS.ai)",
      "Creative coding with WebGL shaders, Three.js particle systems, and glassmorphic micro-animations",
      "Exploring deterministic LLM state machines and multi-provider failover architectures",
      "Late-night prototyping and turning conceptual ideas into production web software"
    ],
    gaming: [
      "Casual gaming (no competitive esports logs or specific titles are tracked — his screen time is mostly dedicated to code and AI)"
    ],
    fitness: [
      "Regular fitness routine & gym training (high-level fitness enthusiast, but specific workout logs are kept private)"
    ],
    personality: [
      "Curious, ambitious, and slightly obsessive about tactile UI craft and performance.",
      "The kind of builder who finishes a feature and immediately starts drafting the next one.",
      "Prefers shipping real, production-deployed systems over staying in theoretical discussions.",
      "Late-night builder energy — turns random thoughts into deployed digital tools."
    ],
    interests: [
      "Autonomous AI state machines and multi-provider failover architectures",
      "Creative coding, WebGL shaders, Three.js particle systems, and glassmorphic interfaces",
      "Privacy-first client-side web utility engineering",
      "Building high-speed developer tools that remove digital friction"
    ],
    funFacts: [
      "18 years old and engineered an entire 7-stage autonomous AI brand studio (NEXUS.ai) with dual Gemini/Groq failover.",
      "muzguy.in is built with 100% Vanilla HTML, CSS, and JavaScript with Three.js — no heavy framework runtime overhead on the main domain.",
      "Built a custom dual-stage cursor with inertial tracking and live audio SFX toggles for the portfolio.",
      "Has a habit of turning conceptual thoughts into live production GitHub Pages within days."
    ]
  },

  contact: {
    github: "https://github.com/muzguy",
    portfolio: "https://muzguy.in",
    overview: "Reach out via GitHub or the contact section on the main portfolio overview.",
    contactSectionUrl: "../#contact"
  }
};

// Export for browser global and module environments
if (typeof module !== "undefined" && module.exports) {
  module.exports = { MUZAI_KNOWLEDGE };
}
