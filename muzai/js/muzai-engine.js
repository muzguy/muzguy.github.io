/**
 * MUZAI INTELLIGENCE ENGINE (v3.0 PROJECT KNOWLEDGE UPGRADE)
 * 
 * THREE RESPONSE MODES:
 * 1. PROFESSIONAL: Detailed, structured, technically credible project and architecture intelligence.
 * 2. CASUAL: Friendly, conversational, slightly witty for personal/lifestyle questions grounded in knowledge.
 * 3. UNKNOWN: Playful, honest fallbacks from a randomized pool for questions outside knowledge.
 * 
 * CORE PRINCIPLES:
 * - Accuracy always wins over personality.
 * - Never hallucinates facts, metrics, relationships, or private details.
 * - Explicitly separates IMPLEMENTED features from ROADMAP features.
 * - Follow-up and context memory for multi-turn conversation.
 */

class MuzAIEngine {
  constructor(knowledge, options = {}) {
    this.knowledge = knowledge || (typeof MUZAI_KNOWLEDGE !== "undefined" ? MUZAI_KNOWLEDGE : null);
    this.mode = options.mode || "local"; // 'local' or 'remote'
    this.apiEndpoint = options.apiEndpoint || null;

    // Follow-up context memory across conversational turns
    this.context = {
      lastProject: null, // 'nexus' | 'asaptools' | 'campushub'
      lastTopic: null,   // 'nexus' | 'guardian' | 'brand_battle' | '7_stages' | 'why_this' | 'brand_dna' | 'asaptools' | 'asap_search' | 'asap_ai' | 'compare'
      lastStage: null,
      history: []
    };

    // Fallback pool for out-of-knowledge queries
    this.unknownFallbacks = [
      "That's outside my current knowledge base 😭",
      "I know the projects. The lore hasn't been uploaded yet.",
      "Nice question. Unfortunately, that file is still missing from my brain.",
      "404: Rohit lore not found.",
      "I could make something up... but we're trying this whole honesty thing.",
      "That's classified by the extremely sophisticated MuzAI security department. (It's just not in my data.)",
      "I know what he builds. I don't know what he orders for dinner. Yet."
    ];
  }

  /**
   * Helper: pick random element from array
   */
  pickRandom(arr) {
    if (!arr || arr.length === 0) return "";
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /**
   * Set provider mode: allows future transition to remote backend API
   */
  setProviderMode(mode, options = {}) {
    this.mode = mode;
    if (options.apiEndpoint) {
      this.apiEndpoint = options.apiEndpoint;
    }
  }

  /**
   * Primary entry point for asking MuzAI a question.
   */
  async ask(prompt) {
    if (!prompt || typeof prompt !== "string") {
      return {
        mode: "casual",
        text: "Please provide a question or topic you'd like to explore.",
        links: [],
        suggestedFollowUps: ["Who is Rohit?", "What has he built?"]
      };
    }

    const cleanPrompt = prompt.trim();

    // If configured for remote AI backend in future phase:
    if (this.mode === "remote" && this.apiEndpoint) {
      return await this.askRemoteBackend(cleanPrompt);
    }

    // Default: Fast, secure client-side knowledge retrieval engine
    const result = this.askLocalKnowledge(cleanPrompt);

    // Save turn in history
    this.context.history.push({
      prompt: cleanPrompt,
      topic: this.context.lastTopic,
      project: this.context.lastProject
    });

    return result;
  }

  /**
   * Remote backend placeholder (for future phase when secure backend is added)
   */
  async askRemoteBackend(prompt) {
    try {
      const response = await fetch(this.apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      return await response.json();
    } catch (err) {
      console.error("[MuzAI] Remote provider error, falling back to local knowledge:", err);
      return this.askLocalKnowledge(prompt);
    }
  }

  /**
   * Main Local Knowledge & Intent Dispatcher
   */
  askLocalKnowledge(prompt) {
    const q = prompt.toLowerCase().replace(/[^\w\s\.-]/g, " ").replace(/\s+/g, " ").trim();
    const k = this.knowledge;

    if (!k) {
      return {
        mode: "unknown",
        text: "Knowledge base not loaded. Please ensure knowledge.js is included.",
        links: [],
        suggestedFollowUps: []
      };
    }

    // Helper to find project from knowledge
    const nexus = (k.projects && k.projects.find(p => p.id === "nexus")) || {};
    const asap = (k.projects && k.projects.find(p => p.id === "asaptools")) || {};
    const campus = (k.projects && k.projects.find(p => p.id === "campushub")) || {};

    // =========================================================================
    // EXPLICIT OUT-OF-KNOWLEDGE PROMPT CHECK
    // =========================================================================
    const isExplicitUnknown = /\b(?:favorite|favourite|crush|girlfriend|wife|salary|net\s*worth|phone\s*number|home\s*address|secret|blood\s*type|bank\s*account|bank|pizza|movie|food|drink)\b/i.test(q) ||
      /\b(?:tell\s+me\s+something\s+(?:about\s+rohit\s+)?that\s+isn\s*t\s+in\s+your\s+knowledge|what\s+don\s*t\s+you\s+know)\b/i.test(q);

    if (isExplicitUnknown) {
      return {
        mode: "unknown",
        text: this.pickRandom(this.unknownFallbacks),
        links: [
          { label: "Ask about NEXUS.ai", url: "../projects/nexus/", external: false },
          { label: "Ask about ASAPTools", url: "../projects/asaptools/", external: false },
          { label: "Ask about Skills", url: "../#skills", external: false }
        ],
        suggestedFollowUps: ["What is NEXUS?", "What is ASAPTools?", "How old is Rohit?"]
      };
    }

    // =========================================================================
    // 0. CONTEXTUAL FOLLOW-UP HANDLER ("Is that live?", "Is it already live?", "Is that built?")
    // =========================================================================
    const isLiveFollowUp = /\b(?:is\s+(?:that|it|this)\s+(?:already\s+)?live|is\s+(?:that|it|this)\s+(?:built|implemented|ready|working)|can\s+i\s+use\s+(?:it|this|that))\b/i.test(q);

    if (isLiveFollowUp) {
      if (this.context.lastTopic === "guardian") {
        return {
          mode: "professional",
          text: `Yes! **Consistency Guardian** is **live and fully implemented** as **Stage 06** in the production NEXUS pipeline at [nexus-ai.muzguy.in](https://nexus-ai.muzguy.in).\n\nIt runs automated 5-dimension mathematical integrity scoring, live copy auditing in an interactive sandbox, and updates the real-time 9D Brand DNA signal matrix.`,
          links: [
            { label: "Launch NEXUS Studio", url: "https://nexus-ai.muzguy.in", external: true },
            { label: "NEXUS Case Study", url: "../projects/nexus/", external: false }
          ],
          suggestedFollowUps: ["How does Guardian work?", "Did Rohit use Gemini?", "What is Brand Battle?"]
        };
      }

      if (this.context.lastTopic === "brand_battle") {
        return {
          mode: "professional",
          text: `Yes! **Brand Battle** is **live and fully implemented** as **Stage 03** in the production NEXUS studio at [nexus-ai.muzguy.in](https://nexus-ai.muzguy.in).\n\nIt pits 3 divergent strategic vectors against each other in an adversarial critique before the human strategist locks the winning direction.`,
          links: [
            { label: "Launch NEXUS Studio", url: "https://nexus-ai.muzguy.in", external: true },
            { label: "NEXUS Case Study", url: "../projects/nexus/", external: false }
          ],
          suggestedFollowUps: ["What is Guardian?", "What are the 7 stages?", "Did Rohit use Gemini?"]
        };
      }

      if (this.context.lastTopic === "why_this") {
        return {
          mode: "professional",
          text: `Yes! The **'Why This' Explainability Architecture** is **live and implemented** in NEXUS. Clicking the inspect trigger reveals inputs analyzed, decision rationale, and sacrificed trade-offs for each AI action.`,
          links: [
            { label: "Launch NEXUS Studio", url: "https://nexus-ai.muzguy.in", external: true }
          ],
          suggestedFollowUps: ["What is Brand Battle?", "What is Guardian?", "What is planned for NEXUS?"]
        };
      }

      if (this.context.lastTopic === "asap_ai" || this.context.lastTopic === "asap_roadmap") {
        return {
          mode: "professional",
          text: `No, the AI features for ASAPTools (Document Summarizer, OCR, Context-Aware Rewriter) are **planned for Phase 05** on the verified roadmap. They are not yet live in the current Phase 1 release.`,
          links: [
            { label: "ASAPTools Live", url: "https://asaptools.in", external: true },
            { label: "ASAPTools Spec", url: "../projects/asaptools/", external: false }
          ],
          suggestedFollowUps: ["What is ASAPTools?", "What technologies does ASAPTools use?", "How does ASAPTools search work?"]
        };
      }

      if (this.context.lastProject === "nexus") {
        return {
          mode: "professional",
          text: `NEXUS.ai is **live in production** at [nexus-ai.muzguy.in](https://nexus-ai.muzguy.in) with its core 7-stage pipeline, Brand Battle, Consistency Guardian, and dual-provider Gemini/Groq failover router.\n\nAdvanced extensions like multi-project cloud workspaces, vector brand memory, and Figma export are planned roadmap items.`,
          links: [
            { label: "Launch NEXUS Studio", url: "https://nexus-ai.muzguy.in", external: true },
            { label: "NEXUS Case Study", url: "../projects/nexus/", external: false }
          ],
          suggestedFollowUps: ["What are the 7 stages?", "What is Guardian?", "What is planned for NEXUS?"]
        };
      }

      if (this.context.lastProject === "asaptools") {
        return {
          mode: "professional",
          text: `ASAPTools is **live in production** in its Phase 1 release at [asaptools.in](https://asaptools.in) (featuring the 11-utility catalog, fuzzy search, and spec modals). Standalone client-side WASM routes (Phase 2) and AI utilities (Phase 5) are planned.`,
          links: [
            { label: "Visit ASAPTools", url: "https://asaptools.in", external: true },
            { label: "ASAPTools Case Study", url: "../projects/asaptools/", external: false }
          ],
          suggestedFollowUps: ["What technologies does ASAPTools use?", "How does ASAPTools search work?", "What AI features are planned?"]
        };
      }
    }

    // =========================================================================
    // 1. COMPARISON INTENT ("Compare NEXUS and ASAPTools", "NEXUS vs ASAPTools")
    // =========================================================================
    const isCompare = /\b(?:compare|comparison|versus|vs|diff|difference)\b/i.test(q) &&
      (/\b(?:nexus|asap|asaptools)\b/i.test(q) || (this.context.lastProject && /\b(?:both|the two|projects)\b/i.test(q)));

    if (isCompare) {
      this.context.lastTopic = "compare";
      return {
        mode: "professional",
        text: `Here is a side-by-side comparison of Rohit's two flagship builds:

| Dimension | NEXUS.ai | ASAPTools |
| :--- | :--- | :--- |
| **Core Purpose** | Autonomous 7-Stage Brand Strategy & Identity Studio | Privacy-First Digital Utility Platform |
| **Philosophy** | Deterministic sequential AI state machine with explainability | *"Need a tool? ASAP, use it."* Ad-free, client-side utility speed |
| **Tech Stack** | Next.js 15.1.0, React 19, TypeScript, Tailwind 3.4.17 | Next.js 16.3.6, React 19.2.8, TypeScript 5, Tailwind v4 |
| **AI System** | Dual-provider: Google Gemini 2.5 Flash primary + Groq failover | Phase 5 planned: Local/Edge AI Summarizer, OCR & Rewriter |
| **Architecture** | 7 stages, Brand Battle, Consistency Guardian, 9D Brand DNA | Centralized \`lib/tools-registry.ts\`, fuzzy search, spec modals |
| **Live Status** | Production at [nexus-ai.muzguy.in](https://nexus-ai.muzguy.in) | Production Phase 1 at [asaptools.in](https://asaptools.in) |
| **Roadmap** | Multi-project workspaces, Vector DB, Figma token sync | Standalone WASM tools (Phase 2), in-browser PDF/Image engines |`,
        links: [
          { label: "Launch NEXUS Studio", url: "https://nexus-ai.muzguy.in", external: true },
          { label: "Visit ASAPTools", url: "https://asaptools.in", external: true }
        ],
        suggestedFollowUps: ["How does NEXUS work?", "What is ASAPTools?", "Did Rohit use Gemini?"]
      };
    }

    // =========================================================================
    // 2. NEXUS.ai SPECIFIC INTENTS & STAGES
    // =========================================================================

    // Brand Battle / Adversarial Stage
    const isBrandBattle = /\b(?:brand\s*battle|adversarial|stress\s*test|3\s*vectors?|vector\s*a|divergen(?:ce|t))\b/i.test(q) ||
      (this.context.lastProject === "nexus" && /\b(?:battle|challenge|stage\s*0?3)\b/i.test(q));

    if (isBrandBattle) {
      this.context.lastProject = "nexus";
      this.context.lastTopic = "brand_battle";
      this.context.lastStage = 3;
      return {
        mode: "professional",
        text: `**Brand Battle** is NEXUS's adversarial stress-test engine in **Stage 03 (Challenge & Select)**.

Instead of blindly accepting a single AI response, NEXUS synthesizes 3 radically divergent positioning vectors:
- **Vector A: The Friction Slayer** (Utility & high-speed execution)
- **Vector B: The Autonomous Foundry** (Category creator & radical automation)
- **Vector C: The Design Vanguard** (Pure craft & uncompromising prestige)

**How it works:**
The engine pits these vectors against each other in an adversarial critique—stress-testing each direction for cliché vulnerabilities, market risks, audience skepticism, and competitive moats. This provides the human strategist with an objective vulnerability scorecard before locking the winning strategic vector.`,
        links: [
          { label: "Explore NEXUS Studio", url: "https://nexus-ai.muzguy.in", external: true },
          { label: "Read Case Study", url: "../projects/nexus/", external: false }
        ],
        suggestedFollowUps: ["What is Guardian?", "What are the 7 stages?", "Is that already live?"]
      };
    }

    // Consistency Guardian / Alignment Stage
    const isGuardian = /\b(?:guardian|consistency\s*(?:audit|check|guardian)|5d|system\s*alignment|brand\s*drift)\b/i.test(q) ||
      (this.context.lastProject === "nexus" && /\b(?:stage\s*0?6|consistency)\b/i.test(q));

    if (isGuardian) {
      this.context.lastProject = "nexus";
      this.context.lastTopic = "guardian";
      this.context.lastStage = 6;
      return {
        mode: "professional",
        text: `**Consistency Guardian** is **Stage 06** of the NEXUS pipeline—an automated brand consistency audit and governance system.

**Core Capabilities:**
1. **5-Dimension Mathematical Scoring:** Computes an integrity score (0–100) with a PASS / FLAG / FAIL verdict across Tone, Positioning, Target Alignment, Moat Defensibility, and Visual Harmony.
2. **Live Copy Audit Sandbox:** Strategists can input arbitrary draft copy (landing pages, emails, social posts) into an interactive sandbox to test for brand drift against the locked positioning before publishing.
3. **Real-time 9D Brand DNA Synchronization:** Feeds audit results directly into NEXUS's real-time 9-dimensional Brand DNA state matrix.

It is powered by the \`/api/ai/guardian\` endpoint using Google Gemini 2.5 Flash with Groq fallback.`,
        links: [
          { label: "Launch NEXUS Studio", url: "https://nexus-ai.muzguy.in", external: true },
          { label: "NEXUS Case Study", url: "../projects/nexus/", external: false }
        ],
        suggestedFollowUps: ["Is that already live?", "Did Rohit use Gemini?", "What are the 7 stages?"]
      };
    }

    // 7 Stages / How NEXUS Works
    const is7Stages = /\b(?:7\s*stages?|seven\s*stages?|stages\s*of\s*nexus|how\s+does\s+nexus\s+work|nexus\s+work|nexus\s+pipeline|pipeline\s+stages?)\b/i.test(q) ||
      (this.context.lastProject === "nexus" && /\b(?:how\s+does\s+it\s+work|how\s+it\s+works|all\s+stages|explain\s+pipeline)\b/i.test(q));

    if (is7Stages) {
      this.context.lastProject = "nexus";
      this.context.lastTopic = "7_stages";
      return {
        mode: "professional",
        text: `NEXUS operates as a deterministic **7-stage sequential state machine** where each stage synthesizes intelligence that feeds the next:

1. **01 · Discover (Foundational Intelligence):** Deconstructs raw idea inputs into core audience pain points, problem taxonomies, and psychographics via \`/api/ai/discover\`.
2. **02 · Position (Strategic Divergence):** Synthesizes 3 radically divergent market positioning vectors with explicit sacrifices and wins via \`/api/ai/position\`.
3. **03 · Challenge & Select (Brand Battle):** Adversarial stress-test where the 3 positioning vectors critique each other before the human strategist locks the winning vector.
4. **04 · Shape (Brand Identity & Persona):** Forges archetypes, voice rules, 5 categorized naming candidates, elevator pitch, and forbidden taboo terms via \`/api/ai/shape\`.
5. **05 · Visualize (Visual Design Brief):** Translates strategy into an executive design brief with named color tokens (primary/accent/surface) and typography pairings via \`/api/ai/visualize\`.
6. **06 · Consistency Guardian (Alignment Audit):** Audits brand outputs or live draft copy with 5D mathematical integrity scoring (0–100) and updates the 9D Brand DNA matrix via \`/api/ai/guardian\`.
7. **07 · Launch Kit (Go-To-Market Assets):** Generates landing page hero copy, 3-part social rollouts, audience pitches, and complete JSON dossier export via \`/api/ai/launch\`.`,
        links: [
          { label: "Launch NEXUS Studio", url: "https://nexus-ai.muzguy.in", external: true },
          { label: "Read Case Study", url: "../projects/nexus/", external: false }
        ],
        suggestedFollowUps: ["What is Brand Battle?", "What is Guardian?", "Did Rohit use Gemini?"]
      };
    }

    // Gemini / AI Providers & Failover
    const isGeminiAi = /\b(?:gemini|groq|llama|failover|ai\s*provider|dual\s*provider|abortcontroller|speech\s*manager|web\s*speech)\b/i.test(q) ||
      (/\b(?:did\s+rohit\s+use\s+gemini|use\s+gemini|gemini\s+in\s+nexus)\b/i.test(q));

    if (isGeminiAi) {
      this.context.lastProject = "nexus";
      this.context.lastTopic = "ai_architecture";
      return {
        mode: "professional",
        text: `**Yes — Google Gemini is the primary AI model** powering NEXUS.ai, backed by **Groq as an automatic fallback provider**.

**Architecture & Resilience:**
- **Primary AI:** **Google Gemini 2.5 Flash** (via \`@google/genai\`) drives all 6 core generation endpoints (\`/api/ai/discover\`, \`/position\`, \`/shape\`, \`/visualize\`, \`/guardian\`, \`/launch\`).
- **Fallback AI:** **Groq Llama 3.3 70B Versatile** (via \`groq-sdk\`) acts as an immediate failover target.
- **Failover Logic:** If Gemini hits rate limits (HTTP 429), high load (HTTP 503), or network timeouts, the system triggers exponential backoff retries. If primary retries fail, it automatically routes the prompt to Groq.
- **Safety & Cancellation:** Strict TypeScript runtime JSON schema validation guarantees zero malformed payload corruption, while native \`AbortController\` handles request cancellation.`,
        links: [
          { label: "Launch NEXUS Studio", url: "https://nexus-ai.muzguy.in", external: true },
          { label: "NEXUS Case Study", url: "../projects/nexus/", external: false }
        ],
        suggestedFollowUps: ["What technologies does NEXUS use?", "What is Guardian?", "What is actually implemented in NEXUS?"]
      };
    }

    // NEXUS Stack & Engineering
    const isNexusStack = (/\b(?:nexus)\b/i.test(q) && /\b(?:stack|technolog(?:y|ies)|framework|tech|libraries|built\s+with)\b/i.test(q)) ||
      (this.context.lastProject === "nexus" && /\b(?:what\s+technologies|what\s+stack|what\s+is\s+the\s+stack|tech\s+stack)\b/i.test(q));

    if (isNexusStack) {
      this.context.lastProject = "nexus";
      this.context.lastTopic = "nexus_stack";
      return {
        mode: "professional",
        text: `NEXUS.ai is built on a verified, modern, full-stack architecture:

- **Core Framework:** Next.js 15.1.0 (App Router)
- **Frontend UI:** React 19 & TypeScript
- **Styling:** Tailwind CSS 3.4.17
- **AI SDKs:** \`@google/genai\` (Gemini 2.5 Flash) & \`groq-sdk\` (Llama 3.3 70B)
- **Icons:** \`lucide-react\`
- **Audio:** Browser-native Web Speech API (\`speech-manager.ts\`)
- **State & Persistence:** Zero-loss \`localStorage\` (\`nexus_brand_project_v1\`)
- **Resilience:** Runtime JSON schema validation, exponential retry/backoff, and native \`AbortController\` cancellation
- **Deployment:** Vercel Edge`,
        links: [
          { label: "Launch NEXUS Studio", url: "https://nexus-ai.muzguy.in", external: true },
          { label: "View GitHub Source", url: "https://github.com/muzguy/nexus-ai", external: true }
        ],
        suggestedFollowUps: ["Did Rohit use Gemini?", "What is actually implemented in NEXUS?", "What is planned for NEXUS?"]
      };
    }

    // NEXUS Implemented vs Live
    const isNexusImplemented = (/\b(?:nexus)\b/i.test(q) && /\b(?:implemented|actually\s+built|what\s+is\s+live|currently\s+working|done)\b/i.test(q)) ||
      (this.context.lastProject === "nexus" && /\b(?:what\s+is\s+actually\s+implemented|what\s+has\s+he\s+built|what\s+is\s+live)\b/i.test(q));

    if (isNexusImplemented) {
      this.context.lastProject = "nexus";
      this.context.lastTopic = "nexus_implemented";
      return {
        mode: "professional",
        text: `Rohit has **fully implemented and deployed** the following systems in NEXUS.ai (live at [nexus-ai.muzguy.in](https://nexus-ai.muzguy.in)):

- **7-Stage Sequential State Machine:** All 7 pipeline stages (Discover, Position, Challenge, Shape, Visualize, Guardian, Launch) with 6 dedicated \`/api/ai/*\` endpoints.
- **Adversarial Brand Battle (Stage 03):** 3-vector divergence and stress-testing engine.
- **Consistency Guardian (Stage 06):** 5D mathematical integrity scoring and live copy audit sandbox.
- **9D Brand DNA Signal Matrix:** Real-time flyout drawer tracking brand maturity.
- **'Why This' Explainability (XAI):** Decision rationale drawer exposing inputs, reasoning, and sacrifices.
- **Dual Gemini + Groq AI Failover Router:** Exponential backoff and automated failover.
- **Runtime Schema Validation:** Strict TypeScript validation preventing corrupted state.
- **Web Speech Audio Narration:** Synchronized voice playback via \`speech-manager.ts\`.
- **Local Persistence & Cancellation:** Instant hydration from \`localStorage\` and \`AbortController\` cancellation.
- **Aether OS Case Study:** Pre-computed reference project for zero-credit testing.`,
        links: [
          { label: "Launch NEXUS Studio", url: "https://nexus-ai.muzguy.in", external: true },
          { label: "NEXUS Case Study", url: "../projects/nexus/", external: false }
        ],
        suggestedFollowUps: ["What is planned for NEXUS?", "What is Guardian?", "Did Rohit use Gemini?"]
      };
    }

    // NEXUS Planned / Roadmap
    const isNexusRoadmap = (/\b(?:nexus)\b/i.test(q) && /\b(?:planned|roadmap|future|next\s*horizon|todo|upcoming)\b/i.test(q)) ||
      (this.context.lastProject === "nexus" && /\b(?:what\s+is\s+planned|roadmap|future\s+plans|does\s+nexus\s+have\s+(?:figma|vector|cloud|workspaces))\b/i.test(q));

    if (isNexusRoadmap) {
      this.context.lastProject = "nexus";
      this.context.lastTopic = "nexus_roadmap";
      return {
        mode: "professional",
        text: `The following features are **strictly on the planned roadmap** and **not yet implemented** in NEXUS.ai:

- **Multi-Project Workspaces:** Multi-tenant cloud project switcher with team sharing and versioning.
- **Vector Brand Memory:** Embeddings-based long-term brand memory querying historical decisions.
- **Direct Figma Token Exporter:** Plugin pushing color hex tokens and typography into Figma.
- **CMS & Webflow Direct Sync:** Publishing generated copy directly into headless CMSs.
- **Autonomous Image Generation:** Dedicated Imagen 3 / FLUX pipelines for visual asset generation.
- **Team Collaboration & Permissions:** Multi-seat role-based access control.
- **Custom Fine-Tuned Voice Models:** Brand voice checkpoints fine-tuned on client archives.`,
        links: [
          { label: "NEXUS Case Study", url: "../projects/nexus/", external: false },
          { label: "Launch NEXUS Studio", url: "https://nexus-ai.muzguy.in", external: true }
        ],
        suggestedFollowUps: ["What is actually implemented in NEXUS?", "How does NEXUS work?", "Did Rohit use Gemini?"]
      };
    }

    // NEXUS General Overview ("What is NEXUS?", "Tell me about NEXUS")
    const isNexusGeneral = /\b(?:nexus|nexus\.ai)\b/i.test(q) && !/\b(?:asap|campus)\b/i.test(q);

    if (isNexusGeneral) {
      this.context.lastProject = "nexus";
      this.context.lastTopic = "nexus";
      return {
        mode: "professional",
        text: `**NEXUS.ai** is an autonomous 7-stage brand strategy, identity synthesis, and consistency governance studio designed and built by Rohit.

**What makes it different:**
Rather than acting as a shallow prompt wrapper, NEXUS operates as a deterministic 7-stage sequential state machine. It solves the fragmentation and subjective guesswork of traditional branding agencies by generating production-ready positioning, visual briefs, voice guardrails, and launch kits with full mathematical consistency and explainability.

**Why Rohit built it:**
To transform loose conceptual ideas into production-grade brand intelligence backed by multi-provider AI resilience (Gemini 2.5 Flash + Groq), adversarial stress-testing (Brand Battle), and real-time Brand DNA modeling.`,
        links: [
          { label: "Launch NEXUS Studio", url: "https://nexus-ai.muzguy.in", external: true },
          { label: "Detailed Case Study", url: "../projects/nexus/", external: false },
          { label: "GitHub Source", url: "https://github.com/muzguy/nexus-ai", external: true }
        ],
        suggestedFollowUps: ["How does NEXUS work?", "What are the 7 stages?", "Did Rohit use Gemini?", "What is Guardian?"]
      };
    }

    // =========================================================================
    // 3. ASAPTOOLS SPECIFIC INTENTS
    // =========================================================================

    // ASAPTools Search Architecture
    const isAsapSearch = (/\b(?:asap|asaptools)\b/i.test(q) && /\b(?:search|fuzzy|filter|category|categories|find)\b/i.test(q)) ||
      (this.context.lastProject === "asaptools" && /\b(?:how\s+does\s+search\s+work|search|fuzzy\s*match(?:ing)?)\b/i.test(q));

    if (isAsapSearch) {
      this.context.lastProject = "asaptools";
      this.context.lastTopic = "asap_search";
      return {
        mode: "professional",
        text: `ASAPTools uses a **real-time client-side keyword and fuzzy search engine**:

- **Centralized Registry:** All 11 utilities are registered in \`lib/tools-registry.ts\` with searchable titles, descriptions, category keys, and semantic tags.
- **Instant Querying:** As the user types, the search engine indexes across keywords and tags in real time without network requests or layout re-renders.
- **Category Filtering:** Users can filter across 5 domains (Developer, Text, Image, PDF, Calculators) with dynamic badge counters.
- **Interactive Spec Dialogs:** Clicking any tool launches an interactive specification and processing roadmap modal.`,
        links: [
          { label: "Try ASAPTools Search", url: "https://asaptools.in", external: true },
          { label: "ASAPTools Case Study", url: "../projects/asaptools/", external: false }
        ],
        suggestedFollowUps: ["What technologies does ASAPTools use?", "What AI features are planned?", "What is ASAPTools?"]
      };
    }

    // ASAPTools Stack & Architecture
    const isAsapStack = (/\b(?:asap|asaptools)\b/i.test(q) && /\b(?:stack|technolog(?:y|ies)|framework|tech|registry|architecture|built\s+with)\b/i.test(q)) ||
      (this.context.lastProject === "asaptools" && /\b(?:what\s+technologies|what\s+stack|what\s+is\s+the\s+stack|tech\s+stack)\b/i.test(q));

    if (isAsapStack) {
      this.context.lastProject = "asaptools";
      this.context.lastTopic = "asap_stack";
      return {
        mode: "professional",
        text: `ASAPTools is built on a verified modern stack:

- **Framework:** Next.js 16.3.6 (App Router)
- **Frontend UI:** React 19.2.8
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS v4
- **Deployment:** Vercel Edge CDN
- **Architecture:** Centralized decoupled tools registry in \`lib/tools-registry.ts\` isolating metadata, search indexing, and category counts from layout re-renders.
- **Theme Engine:** Zero-FOUT light/dark theme switching with localStorage hydration.`,
        links: [
          { label: "Visit ASAPTools", url: "https://asaptools.in", external: true },
          { label: "GitHub Source", url: "https://github.com/muzguy/asaptools", external: true }
        ],
        suggestedFollowUps: ["How does ASAPTools search work?", "What AI features are planned?", "What is ASAPTools?"]
      };
    }

    // ASAPTools AI Roadmap
    const isAsapAi = (/\b(?:asap|asaptools)\b/i.test(q) && /\b(?:ai|ocr|summariz(?:e|er)|rewrit(?:e|er)|artificial\s*intelligence)\b/i.test(q)) ||
      (this.context.lastProject === "asaptools" && /\b(?:what\s+ai\s+features|ai\s+planned|ai\s+roadmap|ocr)\b/i.test(q));

    if (isAsapAi) {
      this.context.lastProject = "asaptools";
      this.context.lastTopic = "asap_ai";
      return {
        mode: "professional",
        text: `AI features in ASAPTools are **planned for Phase 05** on the verified roadmap (they are not in the current Phase 1 release). The planned AI utilities include:

1. **AI Document Summarizer & Q&A:** Query and extract structured bullet summaries from multi-page PDFs and research papers directly in-browser.
2. **AI OCR & Data Extraction:** Convert low-resolution receipts, scans, and screenshots into clean JSON or Markdown tables.
3. **Context-Aware Text Rewriter:** Refactor tone, technical clarity, and syntax while preserving code snippets and math formulas intact.

*Status: Planned for Phase 05.*`,
        links: [
          { label: "ASAPTools Spec", url: "../projects/asaptools/", external: false },
          { label: "ASAPTools Live", url: "https://asaptools.in", external: true }
        ],
        suggestedFollowUps: ["Is that already live?", "What is ASAPTools?", "What technologies does ASAPTools use?"]
      };
    }

    // ASAPTools General Overview ("What is ASAPTools?", "Tell me about ASAPTools")
    const isAsapGeneral = /\b(?:asap|asaptools|asap\s*tools)\b/i.test(q);

    if (isAsapGeneral) {
      this.context.lastProject = "asaptools";
      this.context.lastTopic = "asaptools";
      return {
        mode: "professional",
        text: `**ASAPTools** is a privacy-first, zero-ad digital utility platform engineered by Rohit, hosted at [asaptools.in](https://asaptools.in).

**Core Philosophy:** *"Need a tool? ASAP, use it."*

**Problem It Solves:**
Most web utilities (formatters, image compressors, PDF tools) are filled with spammy ads, paywalls, slow loading times, and untrusted cloud server uploads that leak user files. ASAPTools provides an instant, clutter-free alternative focused on browser-first processing where files never leave the user's machine.

**Current Implementation (Phase 1):**
- 11 planned utilities specified across 5 core verticals (Developer, Text, Image, PDF, Calculators)
- Real-time keyword & fuzzy search discovery
- Interactive specification and roadmap modals
- Zero-FOUT dark/light theme engine`,
        links: [
          { label: "Visit ASAPTools", url: "https://asaptools.in", external: true },
          { label: "ASAPTools Case Study", url: "../projects/asaptools/", external: false },
          { label: "GitHub Source", url: "https://github.com/muzguy/asaptools", external: true }
        ],
        suggestedFollowUps: ["What technologies does ASAPTools use?", "How does ASAPTools search work?", "What AI features are planned?"]
      };
    }

    // =========================================================================
    // 4. CAMPUS HUB SPECIFIC INTENTS
    // =========================================================================
    const isCampusHub = /\b(?:campus\s*hub|campushub|college\s*portal|student\s*portal)\b/i.test(q);

    if (isCampusHub) {
      this.context.lastProject = "campushub";
      this.context.lastTopic = "campushub";
      return {
        mode: "professional",
        text: `**Campus Hub** is a digital student resource and navigation portal built by Rohit.

- **Purpose:** Streamlines college essentials—centralizing student resources, real-time map navigation, and academic links.
- **Tech Stack:** HTML5, CSS3, Modern JavaScript.
- **Status:** Verified portfolio project referenced on Rohit's homepage at [muzguy.in](https://muzguy.in/#projects).`,
        links: [
          { label: "View on Portfolio", url: "../#projects", external: false }
        ],
        suggestedFollowUps: ["What is NEXUS?", "What is ASAPTools?", "What are Rohit's skills?"]
      };
    }

    // =========================================================================
    // 5. PERSONAL INFORMATION INTENTS (Grounded in knowledge.js)
    // =========================================================================

    // Age
    const isAge = /\b(?:how\s+old|age|what(?:'s|\s+is)\s+(?:rohit(?:'s)?\s+)?age|his\s+age)\b/i.test(q);
    if (isAge) {
      const age = k.person.age || "18";
      const responses = [
        `Rohit is **${age}** years old.`,
        `He is currently **${age}** years old.`,
        `Rohit is **${age}**, currently studying Computer Science and shipping software.`
      ];
      return {
        mode: "casual",
        text: this.pickRandom(responses),
        links: [],
        suggestedFollowUps: ["Where is he from?", "What does he study?", "What has he built?"]
      };
    }

    // Origin / Location
    const isOrigin = /\b(?:where\s+(?:is\s+rohit\s+from|does\s+rohit\s+come\s+from|does\s+rohit\s+live|is\s+he\s+from)|rohit\s+location|origin|country|live|location)\b/i.test(q);
    if (isOrigin) {
      const location = k.person.location || "India";
      const responses = [
        `Rohit is based in **${location}**.`,
        `He's from **${location}**, building web applications and AI systems.`,
        `Rohit lives in **${location}**.`
      ];
      return {
        mode: "casual",
        text: this.pickRandom(responses),
        links: [],
        suggestedFollowUps: ["How old is Rohit?", "What does he study?", "What has he built?"]
      };
    }

    // Education
    const isEducation = /\b(?:what\s+does\s+rohit\s+study|what\s+is\s+his\s+degree|what\s+is\s+his\s+education|college|major|university|study|education|student)\b/i.test(q);
    if (isEducation) {
      const education = k.person.education || "Computer Science (CSE)";
      const responses = [
        `Rohit is pursuing a degree in **${education}**.`,
        `He studies **${education}**, combining academic foundations with building real software.`,
        `He is a **${education}** student.`
      ];
      return {
        mode: "casual",
        text: this.pickRandom(responses),
        links: [],
        suggestedFollowUps: ["How old is Rohit?", "What are his core skills?", "What has he built?"]
      };
    }

    // Hobbies / Interests / Lifestyle
    const isHobbies = /\b(?:hobbies|hobby|interests|free\s*time|what\s+does\s+(?:he|rohit)\s+do\s+for\s+fun|do\s+for\s+fun|spare\s*time|pastime)\b/i.test(q);
    if (isHobbies) {
      return {
        mode: "casual",
        text: `When he isn't writing code or experimenting with web technologies and Three.js, Rohit is usually working out, gaming, listening to music, or crafting sleek interface designs.`,
        links: [],
        suggestedFollowUps: ["What games does he play?", "How old is Rohit?", "What has he built?"]
      };
    }

    // Gaming
    const isGaming = /\b(?:game|gaming|games|gamer|does\s+he\s+game|play\s+games)\b/i.test(q);
    if (isGaming) {
      return {
        mode: "casual",
        text: `Yes, Rohit is definitely into gaming! He plays during downtime to decompress after long coding sessions.`,
        links: [],
        suggestedFollowUps: ["What are his other hobbies?", "What does he study?", "What has he built?"]
      };
    }

    // Fitness / Workout
    const isFitness = /\b(?:gym|fitness|workout|working\s*out|exercise|training)\b/i.test(q);
    if (isFitness) {
      return {
        mode: "casual",
        text: `Rohit hits the gym regularly. He considers staying physically active essential for maintaining focus during intense programming sessions.`,
        links: [],
        suggestedFollowUps: ["What are his hobbies?", "How old is Rohit?", "What has he built?"]
      };
    }

    // Personality / Mindset
    const isPersonality = /\b(?:personality|mindset|philosophy|how\s+would\s+you\s+describe\s+him|what\s+is\s+he\s+like|values)\b/i.test(q);
    if (isPersonality) {
      return {
        mode: "casual",
        text: `Rohit is a pragmatic builder. His philosophy revolves around learning through shipping real software rather than getting bogged down in static theory. He is obsessed with tactile UI craft, speed, and structured AI engineering.`,
        links: [],
        suggestedFollowUps: ["What has he built?", "What are his skills?", "How old is Rohit?"]
      };
    }

    // Fun facts
    const isFunFact = /\b(?:fun\s*fact|interesting\s*fact|tell\s+me\s+something\s+cool\s+about\s+him|trivia)\b/i.test(q);
    if (isFunFact) {
      return {
        mode: "casual",
        text: `Fun fact: Rohit built this entire portfolio from scratch with custom vanilla CSS glassmorphism, WebGL particle shaders, and zero bloated component libraries—and then gave me (MuzAI) complete technical knowledge over his builds!`,
        links: [],
        suggestedFollowUps: ["What has he built?", "How does NEXUS work?", "How old is Rohit?"]
      };
    }

    // Tagline / Summary
    const isTagline = /\b(?:tagline|bio|about\s+rohit|who\s+is\s+rohit)\b/i.test(q);
    if (isTagline) {
      return {
        mode: "casual",
        text: `Rohit is an 18-year-old Computer Science student and software builder from India. In his own words:\n\n*"${k.person.tagline}"*`,
        links: [
          { label: "Portfolio Home", url: "../#about", external: false },
          { label: "Projects", url: "../#projects", external: false }
        ],
        suggestedFollowUps: ["What has he built?", "What are his skills?", "How does NEXUS work?"]
      };
    }

    // =========================================================================
    // 6. GENERAL PORTFOLIO & SKILLS INTENTS
    // =========================================================================

    // What has he built / Projects overview
    const isProjectsOverview = /\b(?:projects|portfolio|what\s+has\s+(?:he|rohit)\s+built|what\s+did\s+(?:he|rohit)\s+build|what\s+has\s+rohit\s+built|what\s+built|show\s+me\s+his\s+work|creations)\b/i.test(q);
    if (isProjectsOverview) {
      return {
        mode: "professional",
        text: `Rohit has architected and shipped several notable builds:

1. **NEXUS.ai:** Autonomous 7-stage brand strategy, identity synthesis, and consistency governance studio with dual Gemini/Groq failover, Brand Battle, and Consistency Guardian.
2. **ASAPTools:** Privacy-first digital utility suite (Next.js 16, Tailwind v4) with client-side execution and zero third-party tracking.
3. **Campus Hub:** Digital student resource and campus navigation portal.

All builds emphasize high-speed client-side processing, tactile glassmorphic UI, and structured engineering.`,
        links: [
          { label: "Explore NEXUS.ai", url: "../projects/nexus/", external: false },
          { label: "Explore ASAPTools", url: "../projects/asaptools/", external: false },
          { label: "All Projects", url: "../#projects", external: false }
        ],
        suggestedFollowUps: ["What is NEXUS?", "What is ASAPTools?", "Compare NEXUS and ASAPTools"]
      };
    }

    // Skills
    const isSkills = /\b(?:skills|technologies|languages|frameworks|what\s+can\s+he\s+do|tech\s+stack|what\s+does\s+he\s+know)\b/i.test(q);
    if (isSkills) {
      return {
        mode: "professional",
        text: `Rohit specializes across modern frontend, full-stack, and AI systems engineering:

- **Languages:** JavaScript (ESNext), TypeScript, HTML5, CSS3 (Modern Vanilla CSS), Python
- **Frameworks & Libraries:** React 19, Next.js 16/15, Tailwind CSS v4, Three.js (WebGL Particle Systems), Lenis Smooth Scroll
- **AI & Systems:** Google Gemini 2.5 Flash, Groq (Llama 3.3), Multi-Provider Failover, Runtime Schema Validation, Web Speech API
- **Architecture:** Client-side first processing, Zero-loss \`localStorage\` state machines, tokenized CSS design systems`,
        links: [
          { label: "View Skills Section", url: "../#skills", external: false }
        ],
        suggestedFollowUps: ["What has he built?", "Did Rohit use Gemini?", "How does NEXUS work?"]
      };
    }

    // Contact
    const isContact = /\b(?:contact|reach|email|message|hire|github|twitter|linkedin|social)\b/i.test(q);
    if (isContact) {
      return {
        mode: "professional",
        text: `You can connect with Rohit directly through his public channels:

- **Domain:** [muzguy.in](https://muzguy.in)
- **GitHub:** [github.com/muzguy](https://github.com/muzguy)
- **Email / Socials:** Accessible on the portfolio contact drawer.`,
        links: [
          { label: "Contact Rohit", url: "../#contact", external: false },
          { label: "GitHub Profile", url: "https://github.com/muzguy", external: true }
        ],
        suggestedFollowUps: ["Who is Rohit?", "What has he built?"]
      };
    }

    // Resume / CV
    const isResume = /\b(?:resume|cv|curriculum\s*vitae)\b/i.test(q);
    if (isResume) {
      return {
        mode: "professional",
        text: `Rohit's resume summarizes his engineering projects, technical stack (React 19, Next.js, TypeScript, Gemini/Groq), and Computer Science background. You can download it directly from the portfolio.`,
        links: [
          { label: "Download Resume", url: "../resume.pdf", external: true }
        ],
        suggestedFollowUps: ["What are his skills?", "What has he built?"]
      };
    }

    // Theme / Design system
    const isTheme = /\b(?:theme|dark\s*mode|light\s*mode|desert|driveby|flow|visual\s*style|glassmorphism)\b/i.test(q);
    if (isTheme) {
      return {
        mode: "casual",
        text: `The portfolio features 4 atmospheric themes: **Cosmic** (deep space particle field), **Desert** (warm amber horizon), **Driveby** (neon synthwave night), and **Flow** (ethereal gradient flux). You can toggle them live using the atmosphere controls in the header.`,
        links: [
          { label: "Return to Home", url: "../", external: false }
        ],
        suggestedFollowUps: ["What has he built?", "What are his skills?"]
      };
    }

    // =========================================================================
    // 7. UNKNOWN / OUTSIDE KNOWLEDGE FALLBACK
    // =========================================================================
    const fallbackMessage = this.pickRandom(this.unknownFallbacks);

    return {
      mode: "unknown",
      text: fallbackMessage,
      links: [
        { label: "Ask about NEXUS.ai", url: "../projects/nexus/", external: false },
        { label: "Ask about ASAPTools", url: "../projects/asaptools/", external: false },
        { label: "Ask about Skills", url: "../#skills", external: false }
      ],
      suggestedFollowUps: [
        "What is NEXUS?",
        "What is ASAPTools?",
        "How old is Rohit?",
        "What technologies does he use?"
      ]
    };
  }
}

// Export for Node.js test environments or global browser window
if (typeof module !== "undefined" && module.exports) {
  MuzAIEngine.MuzAIEngine = MuzAIEngine;
  module.exports = MuzAIEngine;
}
if (typeof window !== "undefined") {
  window.MuzAIEngine = MuzAIEngine;
}
