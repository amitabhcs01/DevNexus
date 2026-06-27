import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Initialize Anthropic Client
let anthropicClient = null;
if (process.env.ANTHROPIC_API_KEY) {
  try {
    anthropicClient = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
    console.log('Anthropic Claude Client initialized successfully.');
  } catch (err) {
    console.error('Failed to initialize Anthropic client:', err.message);
  }
} else {
  console.log('No ANTHROPIC_API_KEY found. Running in high-fidelity simulated backend mode.');
}

// ----------------------------------------------------
// REST API ENDPOINTS
// ----------------------------------------------------

// 1. Analyze Project Brief via Claude (v2)
app.post('/api/analyze', async (req, res) => {
  const { description } = req.body;
  if (!description) {
    return res.status(400).json({ error: 'Description is required' });
  }

  // If Claude client is available, execute a real API prompt
  if (anthropicClient) {
    try {
      console.log('Sending project brief description to Claude API...');
      const response = await anthropicClient.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1500,
        temperature: 0.2,
        system: `You are the DevNexus Lead AI Software Architect. Your job is to analyze plain English software requests and return a comprehensive 360° technical and strategic analysis brief as a valid JSON object matching this TypeScript interface:
        interface ProjectBrief {
          id: string;
          title: string;
          description: string;
          techStack: string[];
          estimatedCost: string;
          estimatedTimeline: string;
          overview: string;
          pros: string[];
          cons: string[];
          crossIdeas: { title: string; explanation: string }[];
          implementationPlan: {
            phase1: { title: string; features: string[]; techStack: string[] };
            phase2: { title: string; features: string[]; techStack: string[] };
            phase3: { title: string; features: string[]; techStack: string[] };
          };
          implementationRoadmap: {
            stages: { stage: string; timeframe: string; deliverable: string; owner: string }[];
            criticalPath: string;
            riskFlags: string[];
            recommendedTeamSize: string;
          };
          functionalRequirements: string[];
          nonFunctionalRequirements: {
            performance: string;
            security: string;
            scalability: string;
            availability: string;
            compliance: string;
          };
          spinoff: {
            name: string;
            description: string;
            useCase: string;
            uniqueness: string;
          };
        }
        Be direct, technical, insightful, and act like a YC-level advisor. Do not add markdown formatting, do not write 'Here is your JSON', return ONLY the raw JSON string.`,
        messages: [{ role: 'user', content: `Please analyze this software request and generate all sections specifically tailored to this idea: "${description}"` }]
      });

      const rawJson = response.content[0].text;
      const parsedData = JSON.parse(rawJson.trim());
      parsedData.id = `brief-${Math.floor(Math.random() * 1000)}`;
      return res.json(parsedData);
    } catch (apiErr) {
      console.error('Claude API call failed. Falling back to local analysis compiler.', apiErr.message);
    }
  }

  // Fallback High-Fidelity Local Compiler matching the new v2 schema
  const lowerQuery = description.toLowerCase();
  
  // Extract and clean name
  const cleanTitle = description.trim()
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  const titleClean = cleanTitle.length > 50 ? cleanTitle.substring(0, 50) + '...' : cleanTitle;

  // Default values
  let title = `${titleClean} — Advisory Report`;
  let overview = `A specialized technical architecture custom-tailored for the "${titleClean}" platform request. The system implements a modern, secure microservice blueprint designed to support robust domain-specific workflows and transaction flows.`;
  let stack = ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'Redis'];
  let cost = '$22,000 - $38,000';
  let timeline = '6 - 10 weeks';
  
  let pros = [
    `Highly scalable domain model specifically optimized for ${titleClean} operations.`,
    'Modern React + TypeScript frontend structure guarantees high developer velocity and interface performance.',
    'Decoupled client-server architecture allows independent horizontal scaling of frontend assets and database writes.'
  ];
  
  let cons = [
    `Requires highly granular access control checks to protect sensitive ${titleClean} user profiles.`,
    'System-wide reporting workflows require optimized secondary read-replicas to prevent main database locks.',
    'Establishing clean cross-component state updates introduces front-end complexity.'
  ];
  
  let crossIdeas = [
    { title: `Serverless ${titleClean.replace(/\s+/g, '')} Workers`, explanation: `Deploying key gateway handlers to edge workers to minimize global RTT and latency for all ${titleClean} locations.` },
    { title: 'Zero-Knowledge Compliance Vault', explanation: 'Using client-side cryptosystems to store sensitive customer payloads without exposing them to database files.' },
    { title: 'OpenAPI-Driven API Clients', explanation: 'Generating type-safe client fetching packages directly from shared spec files to ensure API alignment.' }
  ];
  
  let phase1 = {
    title: `Phase 1 — MVP & Core ${titleClean} Scaffold`,
    features: [
      `Implement basic role-based user logins and secure workspace controls.`,
      `Design Postgres tables mapping core workflows for ${titleClean}.`,
      `Establish primary database reads and write gateways.`
    ],
    techStack: ['React', 'TypeScript', 'Express', 'Supabase']
  };
  
  let phase2 = {
    title: 'Phase 2 — Real-time Events & Cache Optimizations',
    features: [
      `Setup Redis caches to offload common query calls.`,
      'Build real-time socket connections to broadcast live workflow alerts.',
      'Deploy async background worker queues to process export datasets.'
    ],
    techStack: ['Redis', 'Socket.io', 'Node.js', 'Docker']
  };
  
  let phase3 = {
    title: 'Phase 3 — Multi-Tenant Features & Integrations',
    features: [
      'Integrate Stripe Connect to handle vendor commissions and subscriptions.',
      `Build responsive dashboards visualizing transactional KPIs.`,
      'Deploy SOC2-compliant system monitoring logs and diagnostics.'
    ],
    techStack: ['Stripe', 'Chart.js', 'AWS ECS', 'CloudWatch']
  };

  let implementationRoadmap = {
    stages: [
      { stage: 'Discovery & Planning', timeframe: 'Weeks 1–2', deliverable: `Requirements specifications, tech stack lock, wireframe drafts for ${titleClean}.`, owner: 'PM + Architect' },
      { stage: 'Backend Schema Design', timeframe: 'Weeks 3–4', deliverable: `PostgreSQL databases layout, RLS security configurations, API gateway maps.`, owner: 'Backend Dev' },
      { stage: 'Frontend Component Build', timeframe: 'Weeks 5–6', deliverable: `Core UI component mockups, router mappings, state variables setup.`, owner: 'Frontend Dev' },
      { stage: 'Core Feature Integration', timeframe: 'Weeks 7–10', deliverable: `All Phase 1 features fully live in remote staging environment.`, owner: 'Full-stack Team' },
      { stage: 'QA & Vulnerability Audits', timeframe: 'Week 11', deliverable: `Functional testing checks, load testing, security scans.`, owner: 'QA Engineer' },
      { stage: 'MVP Launch', timeframe: 'Week 12', deliverable: `Production launch, active logging metrics setup.`, owner: 'DevOps + PM' },
      { stage: 'Phase 2 Enhancements', timeframe: 'Month 4+', deliverable: `Adding custom integrations and feedback iterations.`, owner: 'Full Team' }
    ],
    criticalPath: 'Database schema design and core API routing configuration. Front-end developers are blocked until these APIs are live in staging.',
    riskFlags: [
      'Scope creep concerning advanced multi-tenant specifications.',
      'API rate-limit blockages from third-party vendor check providers.',
      'Database lockups under high simultaneous write loads.'
    ],
    recommendedTeamSize: '1 Product Manager, 1 Software Architect, 1 Backend Engineer, 1 Frontend Engineer, 1 QA Specialist.'
  };
  
  let functionalRequirements = [
    `Users must be able to log in securely and customize profile settings.`,
    `Administrators must be able to audit and update all platform records.`,
    `The API must expose clean REST endpoints with JWT authorization checks.`,
    'Users must be able to export historical reports in CSV or PDF formats.',
    `The platform must synchronize status feeds in real-time across active sessions.`,
    `Automated triggers must dispatch notification messages on specific state triggers.`
  ];
  
  let nonFunctionalRequirements = {
    performance: 'API endpoints must return responses within 200ms; sub-50ms query speeds via cache pools.',
    security: 'All network paths must enforce TLS 1.3; data at rest must use AES-256-GCM encryption.',
    scalability: 'Gateway infrastructure must support up to 5,000 concurrent active connections.',
    availability: 'The service must maintain 99.9% uptime SLA metrics.',
    compliance: 'Fully GDPR compliant for user data erasure and SOC2 ready.'
  };
  
  let spinoff = {
    name: `${titleClean.replace(/[^a-zA-Z0-9]/g, '')}Sync`,
    description: `A standalone event-driven synchronization gateway designed to link ${titleClean} records with external CRM systems.`,
    useCase: `Syncing live operations with external back-office accounting platforms.`,
    uniqueness: `Employs real-time deduplication and retry queues to resolve transactional conflicts on the fly.`
  };

  if (lowerQuery.includes('deal room') || lowerQuery.includes('encrypted') || lowerQuery.includes('webrtc') || lowerQuery.includes('signature') || lowerQuery.includes('nda')) {
    title = 'Zero-Knowledge B2B Deal Chamber';
    overview = 'An ephemeral B2B negotiation room allowing corporate partners to sign NDAs, exchange versioned files, and discuss agreements securely via browser-native WebRTC signal tunnels without any server-side database logging.';
    stack = ['React', 'TypeScript', 'WebRTC', 'Supabase', 'WebCrypto API', 'Node.js'];
    cost = '$35,000 - $55,000';
    timeline = '10 - 12 weeks';
    
    pros = [
      'Eliminating persistent database storage blocks corporate espionage and server data breaches completely.',
      'Client-side Diffie-Hellman handshakes ensure that the hosting server never learns the room encryption keys.',
      'Interactive canvas signing creates compliance-ready digital NDA prints immediately.'
    ];
    
    cons = [
      'Restrictive enterprise firewall policies require maintaining expensive TURN server relay nodes.',
      'Browser memory space limitations restrict single file uploads to around 100MB buffers.',
      'Accidental browser reload actions shred active keys, requiring representatives to reconnect.'
    ];
    
    crossIdeas = [
      { title: 'Decentralized W3C DIDs', explanation: 'Using corporate decentralized identities instead of standard emails to eliminate credentials logging.' },
      { title: 'Secure Nitro Enclaves', explanation: 'Executing server-side document indexing inside AWS Nitro Enclaves to allow searches without exposing plain text.' },
      { title: 'Double Ratchet Messaging', explanation: 'Applying the Signal Protocol ratcheting mechanisms to rotate session keys per text bubble.' }
    ];
    
    phase1 = {
      title: 'Phase 1 — Ephemeral Connection MVP',
      features: [
        'Deploy Socket.io signaling server to coordinate peer-to-peer handshakes.',
        'Build dual-signature canvas component to draw and capture agreement approvals.',
        'Scaffold unlogged active chat boxes inside local React states.'
      ],
      techStack: ['React', 'Socket.io', 'Node.js', 'Vite']
    };
    
    phase2 = {
      title: 'Phase 2 — Encrypted Document Vaults & TURN Relays',
      features: [
        'Implement browser-native AES-GCM file chunking encryptor tools.',
        'Setup Coturn relays to negotiate firewalls.',
        'Construct cryptographic audit receipt generators displaying SHA-256 file hashes.'
      ],
      techStack: ['Coturn', 'WebCrypto API', 'AWS EC2', 'Tailwind']
    };
    
    phase3 = {
      title: 'Phase 3 — SSO Vetting & Enclaves',
      features: [
        'Integrate SAML/OIDC enterprise credentials validation templates.',
        'Establish document preview render pipelines inside isolated sandbox workers.',
        'Deploy automated room termination timers.'
      ],
      techStack: ['AWS Nitro Enclaves', 'Auth0', 'S3', 'Docker']
    };

    implementationRoadmap = {
      stages: [
        { stage: 'Security Scope & ECDH planning', timeframe: 'Weeks 1–2', deliverable: 'Cryptographic threat model, WebCrypto handshake protocol flow validation.', owner: 'Security Architect' },
        { stage: 'Signaling Server Deployment', timeframe: 'Weeks 3–4', deliverable: 'Socket.io signaling server active on AWS, room code generator live.', owner: 'Backend Dev' },
        { stage: 'E2E Crypto & Canvas Signature', timeframe: 'Weeks 5–6', deliverable: 'Client-side AES-GCM file chunk encryptor logic, canvas drawing captures.', owner: 'Crypto Dev' },
        { stage: 'WebRTC Video Streams Sync', timeframe: 'Weeks 7–10', deliverable: 'Direct peer video channels live, COTURN firewall traversal active.', owner: 'WebRTC Expert' },
        { stage: 'Penetration Testing & Purging QA', timeframe: 'Week 11', deliverable: 'Memory leak inspections, script-injection checks, socket crash audits.', owner: 'QA Engineer' },
        { stage: 'Secure Chamber Launch', timeframe: 'Week 12', deliverable: 'Production deployment, tamper-proof JSON integrity receipts live.', owner: 'DevOps + PM' },
        { stage: 'SSO Integrations & Nitro Enclaves', timeframe: 'Month 4+', deliverable: 'SAML enterprise logins, secure enclave indexing.', owner: 'Full Team' }
      ],
      criticalPath: 'Signaling server socket handshakes and COTURN traversal configurations. Ephemeral file vault is blocked until peer tunnels are verified.',
      riskFlags: [
        'Enterprise firewall blockages on WebRTC port bindings.',
        'Asymmetric key performance drops on legacy mobile browsers.',
        'File indexing lag in browser memory slots.'
      ],
      recommendedTeamSize: '1 PM, 1 Security/Crypto Lead, 1 WebRTC Engineer, 1 Frontend Engineer, 1 QA Engineer.'
    };
    
    functionalRequirements = [
      'Representatives must log in using passwordless magic links verifying business domains.',
      'Partners must be able to sign NDAs using interactive touchscreen canvas pads.',
      'Chat messages must be encrypted client-side using AES-GCM before transport.',
      'Users must be able to upload, encrypt, and view versioned PDF draft proposals.',
      'Closing the room must trigger memory purging routines across both clients.',
      'System must compile a downloadable SHA-256 integrity receipt upon completed signings.',
      'WebRTC tracks (camera, mic, screenshare) must toggle in real-time.'
    ];
    
    nonFunctionalRequirements = {
      performance: 'Signal socket handshake latency must remain under 300ms; TURN relay streams must target 30fps video feed rates.',
      security: 'Zero key data or plaintext file payloads must ever touch local databases or server disks.',
      scalability: 'Signaling server clusters must auto-scale up to 5,000 active rooms via Redis adapters.',
      availability: 'TURN relay servers must target 99.99% availability bounds to satisfy enterprise connection requirements.',
      compliance: 'Fully compliant with GDPR right-to-be-forgotten rules and SOC2 encryption standards.'
    };
    
    spinoff = {
      name: 'SignTunnel',
      description: 'An embeddable API that abstracts WebRTC signaling and browser-native key management.',
      useCase: 'Injecting secure video meetings and contract signatures into third-party CRM systems.',
      uniqueness: 'No database storage of files or messages, providing zero-liability security pipelines.'
    };
  } else if (lowerQuery.includes('ai') || lowerQuery.includes('bot') || lowerQuery.includes('chatbot') || lowerQuery.includes('rag') || lowerQuery.includes('learning')) {
    title = 'AI Knowledge Support Agent';
    overview = 'A high-performance Retrieval-Augmented Generation (RAG) agent that ingests unstructured PDF manuals, embeds them into a semantic vector index, and serves accurate support answers to customer prompt feeds.';
    stack = ['Python', 'FastAPI', 'React', 'Pinecone', 'LangChain', 'Claude API', 'PostgreSQL'];
    cost = '$28,000 - $45,000';
    timeline = '6 - 8 weeks';
    
    pros = [
      'RAG pipeline reduces AI hallucinations by bounding the LLM context to verified documents.',
      'Vector semantic search matches user questions regardless of matching keywords.',
      'Real-time token monitoring trackers prevent unexpected API invoice spikes.'
    ];
    
    cons = [
      'Complex document parsing requirements (e.g. interpreting multi-column tables and flow diagrams).',
      'High latency during LLM prompt compilation and stream responses.',
      'Requires frequent vector indexing sync routines as internal manuals update.'
    ];
    
    crossIdeas = [
      { title: 'Graph-RAG Knowledge Nets', explanation: 'Building entity relationship maps to answer complex, cross-document queries.' },
      { title: 'Local LLM Deployment', explanation: 'Running Llama3 models locally within enterprise networks to ensure complete privacy.' },
      { title: 'Hybrid Keyword Semantic Search', explanation: 'Combining BM25 keyword matching with vector cosine similarity for precise results.' }
    ];
    
    phase1 = {
      title: 'Phase 1 — MVP Vector Ingestion Pipeline',
      features: [
        'Build document PDF chunking and preprocessing scripts.',
        'Setup Pinecone index tables and populate embeddings.',
        'Create simple API backend to handle prompt handshakes.'
      ],
      techStack: ['Python', 'FastAPI', 'Pinecone', 'LangChain']
    };
    
    phase2 = {
      title: 'Phase 2 — UI Dialogs & Caching Layer',
      features: [
        'Deploy React dashboard containing historical conversation logs.',
        'Setup Server-Sent Events (SSE) to stream chatbot response strings.',
        'Configure Redis cache layers to store frequent query prompts.'
      ],
      techStack: ['React', 'SSE', 'Redis', 'PostgreSQL']
    };
    
    phase3 = {
      title: 'Phase 3 — Enterprise Role Vetting & Fine-tuning',
      features: [
        'Integrate role-based document access controls.',
        'Fine-tune small open-source models on specialized customer datasets.',
        'Deploy analytical dashboards monitoring resolution ratings.'
      ],
      techStack: ['PyTorch', 'Docker', 'AWS ECS', 'Grafana']
    };

    implementationRoadmap = {
      stages: [
        { stage: 'AI Scope & Ingestion Planning', timeframe: 'Weeks 1–2', deliverable: 'Chunking parameter mapping, Pinecone vector schema draft.', owner: 'AI PM + Architect' },
        { stage: 'Vector Ingestion Pipeline', timeframe: 'Weeks 3–4', deliverable: 'Automated chunking scripts, index uploads to Pinecone database.', owner: 'Data Engineer' },
        { stage: 'RAG API Handshakes', timeframe: 'Weeks 5–6', deliverable: 'LangChain prompt orchestrations, Claude API models sync.', owner: 'Backend Dev' },
        { stage: 'Stream UI Dashboard', timeframe: 'Weeks 7–10', deliverable: 'React conversational window, streaming (SSE) support chat feed.', owner: 'Frontend Dev' },
        { stage: 'Hallucination & Token Audits', timeframe: 'Week 11', deliverable: 'Model accuracy profiling, token quota controls verification.', owner: 'AI QA Engineer' },
        { stage: 'AI Agent MVP Launch', timeframe: 'Week 12', deliverable: 'Production chatbot live, feedback loop indicators.', owner: 'DevOps + PM' },
        { stage: 'Fine-tuning & Local Models', timeframe: 'Month 4+', deliverable: 'Local Llama model hosting, custom model tuning.', owner: 'ML Ops Team' }
      ],
      criticalPath: 'Document indexing pipeline and chunking accuracy checks. Conversational stream UI is blocked until the RAG API returns valid context vectors.',
      riskFlags: [
        'AI prompt hallucinations on highly specific technical charts.',
        'Unexpected token billing overhead under mass query loads.',
        'Document parsing limitations on scans and handwritten files.'
      ],
      recommendedTeamSize: '1 Product Manager, 1 Data/LLM Engineer, 1 Python API Dev, 1 React UI Dev, 1 QA Specialist.'
    };
    
    functionalRequirements = [
      'System must parse uploaded PDF, TXT, and DOCX files into indexed text chunks.',
      'Chatbots must respond to queries by referencing specific source documents.',
      'Users must be able to rate chat responses with thumbs-up/down indicators.',
      'The platform must stream responses in real-time using server-sent events.',
      'Administrators must be able to view and manage token consumption quotas.',
      'System must trigger fallback workflows to notify human agents if rating is low.',
      'System must maintain conversation history context blocks across active dialogs.'
    ];
    
    nonFunctionalRequirements = {
      performance: 'Prompt semantic lookup must return responses within 1.5 seconds under peak loads.',
      security: 'Customer data must be segregated; LLM calls must not train public models.',
      scalability: 'FastAPI gateway must handle 2,000 concurrent stream connections.',
      availability: 'Pinecone and model APIs must target 99.9% uptime levels.',
      compliance: 'Fully compliant with GDPR privacy clauses and SOC2 compliance certifications.'
    };
    
    spinoff = {
      name: 'ChunkGroomer',
      description: 'A pre-processing API that automatically cleans, summarizes, and optimizes PDF text before indexing.',
      useCase: 'Improving search accuracy in enterprise LLM and RAG installations.',
      uniqueness: 'Handles layout-aware structural chunking, keeping tables and figures unified.'
    };
  } else if (lowerQuery.includes('shop') || lowerQuery.includes('commerce') || lowerQuery.includes('stripe') || lowerQuery.includes('subscription') || lowerQuery.includes('marketplace')) {
    title = 'B2B Marketplace & Subscription Platform';
    overview = 'A multi-vendor digital e-commerce marketplace featuring member subscriptions, automated vendor onboarding, and secure split payouts powered by Stripe Connect.';
    stack = ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Stripe API', 'Supabase'];
    cost = '$18,000 - $30,000';
    timeline = '6 - 8 weeks';
    
    pros = [
      'Stripe Connect automatically splits fees, reducing accounting overhead to zero.',
      'Subscription model guarantees predictable Monthly Recurring Revenue (MRR).',
      'Dynamic billing elements simplify card and regional payment compliance.'
    ];
    
    cons = [
      'High chargeback liabilities on digital asset downloads.',
      'Complex payout structures require managing regional tax rules.',
      'Stripe onboarding onboarding drop-offs require custom follow-up pipelines.'
    ];
    
    crossIdeas = [
      { title: 'Sub-ledger Billing Nets', explanation: 'Implementing token-based sub-ledger systems to track API usage and charge users metered fees.' },
      { title: 'Automated VAT Compliance', explanation: 'Integrating tax computation networks to automatically calculate regional taxes.' },
      { title: 'Decentralized Escrow Contracts', explanation: 'Using smart contracts for escrow payouts instead of central payment processors.' }
    ];
    
    phase1 = {
      title: 'Phase 1 — MVP Catalog & Checkout',
      features: [
        'Build digital asset catalogs with search filters.',
        'Setup Stripe Checkout elements for card payments.',
        'Establish basic seller upload dashboards.'
      ],
      techStack: ['React', 'Express', 'PostgreSQL', 'Stripe']
    };
    
    phase2 = {
      title: 'Phase 2 — Stripe Connect & Seller Onboarding',
      features: [
        'Implement Stripe Connect onboarding flows for vendor identity verification.',
        'Setup Webhook handlers to catch subscription renewal/cancel actions.',
        'Create invoice pdf generators.'
      ],
      techStack: ['Node.js', 'Stripe Connect', 'Supabase RLS']
    };
    
    phase3 = {
      title: 'Phase 3 — Metered Billing & Affiliates',
      features: [
        'Deploy metered usage reporting hooks.',
        'Scaffold automated affiliate referral networks.',
        'Provide advanced sales analytics with churn alerts.'
      ],
      techStack: ['TypeScript', 'Redis Cron', 'Chart.js']
    };

    implementationRoadmap = {
      stages: [
        { stage: 'Marketplace Flow Planning', timeframe: 'Weeks 1–2', deliverable: 'Product catalog diagrams, Stripe split commission flows maps.', owner: 'Product Manager' },
        { stage: 'DB Schema & Stripe Connect', timeframe: 'Weeks 3–4', deliverable: 'Postgres tables setup, Stripe Connect account registration live.', owner: 'Backend Dev' },
        { stage: 'Product Catalog & Elements', timeframe: 'Weeks 5–6', deliverable: 'React product grids, Stripe checkout elements payment boxes.', owner: 'Frontend Dev' },
        { stage: 'Webhooks & Order Processing', timeframe: 'Weeks 7–10', deliverable: 'Stripe webhook triggers, dynamic seller ledger splits, emails.', owner: 'Full-stack Dev' },
        { stage: 'KYC Verification & Refund QA', timeframe: 'Week 11', deliverable: 'Onboarding decline workflows testing, payout conflict checks.', owner: 'QA Engineer' },
        { stage: 'B2B Marketplace Launch', timeframe: 'Week 12', deliverable: 'Live payments enabled, platform analytics dashboard active.', owner: 'DevOps + PM' },
        { stage: 'Metered Billing & Churn Analytics', timeframe: 'Month 4+', deliverable: 'Dynamic metered usage updates, retention charts.', owner: 'Full Team' }
      ],
      criticalPath: 'Stripe Connect merchant KYC verification mapping. Seller uploads and checkouts are blocked until payout ledger splits are fully verified.',
      riskFlags: [
        'Vendor onboarding drop-offs during identity verification checks.',
        'Regional sales tax calculations complexity.',
        'Vendor chargeback liability holds.'
      ],
      recommendedTeamSize: '1 Product Manager, 1 Payment Backend Engineer, 1 React UI Engineer, 1 QA Auditor.'
    };
    
    functionalRequirements = [
      'Customers must be able to search and buy digital goods.',
      'Sellers must onboard and link bank accounts via Stripe Connect.',
      'System must process monthly subscriptions and handle charge declines.',
      'Sellers must receive payouts minus platform fees automatically.',
      'Customers must receive email receipts with secure download links.',
      'System must track platform-wide MRR, ARR, and vendor sales metrics.',
      'Users must be able to rate and review purchased items.'
    ];
    
    nonFunctionalRequirements = {
      performance: 'Catalog search results must return in under 150ms; payment flows must execute under 2 seconds.',
      security: 'PCI-DSS compliance; no credit card details must ever touch platform servers.',
      scalability: 'Database schema must support 50,000 products and 1,000 checkout events/sec.',
      availability: 'Payment webhooks and checkout services must maintain 99.99% uptime.',
      compliance: 'Fully compliant with PCI-DSS standards, GDPR rules, and regional tax laws.'
    };
    
    spinoff = {
      name: 'FeeSplitter',
      description: 'A developer SDK that simplifies custom commission splits across Stripe and PayPal.',
      useCase: 'Enabling marketplace platforms to define custom fee distributions.',
      uniqueness: 'Calculates dynamic taxes and splits in real-time, reducing custom accounting coding.'
    };
  }

  return res.json({
    id: `brief-${Math.floor(Math.random() * 1000)}`,
    title,
    description,
    techStack: stack,
    estimatedCost: cost,
    estimatedTimeline: timeline,
    overview,
    pros,
    cons,
    crossIdeas,
    implementationPlan: {
      phase1,
      phase2,
      phase3
    },
    implementationRoadmap,
    functionalRequirements,
    nonFunctionalRequirements,
    spinoff
  });
});

// 2. Draft NDA Agreement
app.post('/api/nda/generate', async (req, res) => {
  const { partyA, partyB, ndaType, ipClauses, duration, jurisdiction } = req.body;
  
  if (anthropicClient) {
    try {
      console.log('Calling Claude to generate customized NDA text...');
      const response = await anthropicClient.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1500,
        temperature: 0.3,
        messages: [{
          role: 'user',
          content: `Write a customized, legal-grade Non-Disclosure Agreement (NDA) with the following parameters:
          - Client Disclosing Party: ${partyA}
          - Builder Receiving Party: ${partyB}
          - Business Purpose: ${ndaType}
          - Intellectual Property terms: ${ipClauses}
          - Confidentiality period: ${duration}
          - Governing jurisdiction: ${jurisdiction}
          Return only the legal text document. Use clean paragraph layouts.`
        }]
      });
      return res.json({ documentText: response.content[0].text });
    } catch (apiErr) {
      console.error('Claude API NDA generation failed. Using default template.', apiErr.message);
    }
  }

  // Fallback Template
  const defaultText = `
MUTUAL NON-DISCLOSURE & PROPRIETARY INFORMATION AGREEMENT

This Agreement is entered into on this Effective Date by and between Client Party: ${partyA} and Builder Party: ${partyB}.

1. BUSINESS PURPOSE. The parties wish to explore opportunities regarding ${ndaType}.
2. INTELLECTUAL PROPERTY. Custom source code transfers under the clause: ${ipClauses}.
3. CONFIDENTIALITY. All shared credentials, specifications, and files must be held in strict confidence for a duration of ${duration} following room closure.
4. GOVERNING LAW. This agreement is governed by the laws of the jurisdiction of ${jurisdiction}.
  `.trim();

  return res.json({ documentText: defaultText });
});

// 3. Expose Developers Registry
app.get('/api/developers', (req, res) => {
  res.json({ success: true });
});

// ----------------------------------------------------
// WEBSOCKET SIGNALING & ROOM CHANNELS
// ----------------------------------------------------
io.on('connection', (socket) => {
  console.log(`Socket client connected: ${socket.id}`);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined secure room: ${roomId}`);
    socket.to(roomId).emit('peer-connected', { peerId: socket.id });
  });

  socket.on('signal', ({ roomId, data }) => {
    socket.to(roomId).emit('signal-receive', data);
  });

  socket.on('chat-message', ({ roomId, message }) => {
    socket.to(roomId).emit('chat-message-receive', message);
  });

  socket.on('file-upload', ({ roomId, file }) => {
    socket.to(roomId).emit('file-upload-receive', file);
  });

  socket.on('peer-state-change', ({ roomId, state }) => {
    socket.to(roomId).emit('peer-state-change-receive', state);
  });

  socket.on('wipe-session', ({ roomId, auditLog }) => {
    console.log(`Cryptographic wipe command executed for room: ${roomId}`);
    io.to(roomId).emit('session-wiped', auditLog);
  });

  socket.on('disconnect', () => {
    console.log(`Socket client disconnected: ${socket.id}`);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`DevNexus Backend Server running on http://localhost:${PORT}`);
});
