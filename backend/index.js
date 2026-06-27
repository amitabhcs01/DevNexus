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

// 1. Analyze Project Brief via Claude
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
        messages: [{ role: 'user', content: `Please analyze this software request: "${description}"` }]
      });

      const rawJson = response.content[0].text;
      const parsedData = JSON.parse(rawJson.trim());
      parsedData.id = `brief-${Math.floor(Math.random() * 1000)}`;
      return res.json(parsedData);
    } catch (apiErr) {
      console.error('Claude API call failed. Falling back to local analysis compiler.', apiErr.message);
    }
  }

  // Fallback High-Fidelity Local Compiler matching the new schema
  const lowerQuery = description.toLowerCase();
  let title = 'Custom Enterprise SaaS Solution';
  let overview = 'A scalable, microservices-oriented B2B SaaS application designed to automate business workflows, handle authenticated user workspaces, and provide real-time transaction tracking.';
  let stack = ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'Redis'];
  let cost = '$20,000 - $35,000';
  let timeline = '6 - 8 weeks';
  
  let pros = [
    'Highly modular microservices architecture allows individual service scaling and high availability.',
    'Modern React + TypeScript frontend guarantees exceptional developer velocity and component reusability.',
    'PostgreSQL relational schema ensures strict transactional integrity for business-critical ledger actions.'
  ];
  
  let cons = [
    'Increased initial development overhead compared to a traditional monolithic framework deployment.',
    'Requires robust end-to-end integration test suites to monitor distributed API handshake latencies.',
    'Continuous caching layer (Redis) synchronization is required to prevent data stale indicators.'
  ];
  
  let crossIdeas = [
    { title: 'Serverless Edge Orchestrator', explanation: 'Deploying latency-sensitive validation code to Cloudflare Workers to drop worldwide RTT under 30ms.' },
    { title: 'Decoupled Client-Side Vaults', explanation: 'Applying browser-native WebCrypto modules to encrypt sensitive customer payloads before network transmission.' },
    { title: 'OpenAPI Schema Synchronization', explanation: 'Defining contract-first REST endpoints to auto-generate client-side fetch clients and TypeScript declarations.' }
  ];
  
  let phase1 = {
    title: 'Phase 1 — MVP & Core Database Scaffold',
    features: [
      'Implement JWT/OAuth user authentication and session cookies.',
      'Scaffold Postgres tables with RLS (Row Level Security) rules.',
      'Establish primary API gateways and REST routing layers.'
    ],
    techStack: ['React', 'TypeScript', 'Express', 'Supabase']
  };
  
  let phase2 = {
    title: 'Phase 2 — Real-time Sockets & Cache Buffers',
    features: [
      'Integrate Redis memory stores to cache database query volumes.',
      'Establish real-time signaling channels for active user updates.',
      'Build background job queues to process async reporting requests.'
    ],
    techStack: ['Redis', 'Socket.io', 'Node.js', 'Docker']
  };
  
  let phase3 = {
    title: 'Phase 3 — Monetization & Multi-Tenant Analytics',
    features: [
      'Integrate Stripe Connect logic to split vendor transaction payouts.',
      'Establish automated tenant provisioning and isolated configurations.',
      'Deploy visual analytics charts mapping monthly platform MRR.'
    ],
    techStack: ['Stripe', 'Chart.js', 'AWS ECS', 'CloudWatch']
  };
  
  let functionalRequirements = [
    'Users must be able to log in securely and customize profile dashboards.',
    'Administrators must retain read/write controls to monitor all tenant spaces.',
    'The system must expose RESTful API endpoints secured by OAuth tokens.',
    'Users must be able to export active data tables into CSV or PDF structures.',
    'Automated email dispatchers must fire alerts upon threshold notifications.',
    'The platform must provide real-time feed synchronization for active teams.'
  ];
  
  let nonFunctionalRequirements = {
    performance: 'API responses must compile under 200ms; sub-50ms query speeds via Redis cache pools.',
    security: 'All network paths must enforce TLS 1.3; data at rest must use AES-256-GCM encryption.',
    scalability: 'Auto-scaling gateways must scale up to 10,000 concurrent websocket connections.',
    availability: 'System availability must exceed 99.9% uptime metrics, backed by automated status pings.',
    compliance: 'Fully compliant with GDPR right-to-be-forgotten rules and SOC2 data auditing guidelines.'
  };
  
  let spinoff = {
    name: 'LogScrub.io',
    description: 'A lightweight serverless microservice that strips PII from server logs in real-time.',
    useCase: 'Sanitizing production logs before they are indexed into Datadog or Loggly.',
    uniqueness: 'Interposes at the stream layer, running regex comparisons inside edge compute buffers before logs touch physical disks.'
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
  // Simple JSON API endpoint to fetch developers list
  res.json({ success: true });
});

// ----------------------------------------------------
// WEBSOCKET SIGNALING & ROOM CHANNELS
// ----------------------------------------------------
io.on('connection', (socket) => {
  console.log(`Socket client connected: ${socket.id}`);

  // Join a secure private deal room namespace
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined secure room: ${roomId}`);
    
    // Notify peer in the room
    socket.to(roomId).emit('peer-connected', { peerId: socket.id });
  });

  // Relay WebRTC SDP signal offer/answer/ICE candidates
  socket.on('signal', ({ roomId, data }) => {
    socket.to(roomId).emit('signal-receive', data);
  });

  // Broadcast encrypted chat message
  socket.on('chat-message', ({ roomId, message }) => {
    socket.to(roomId).emit('chat-message-receive', message);
  });

  // Broadcast uploaded file meta attachments
  socket.on('file-upload', ({ roomId, file }) => {
    socket.to(roomId).emit('file-upload-receive', file);
  });

  // Sync peer state toggles (Camera, Mic, Screen Share)
  socket.on('peer-state-change', ({ roomId, state }) => {
    socket.to(roomId).emit('peer-state-change-receive', state);
  });

  // Trigger Ephemeral Session Wipe
  socket.on('wipe-session', ({ roomId, auditLog }) => {
    console.log(`Cryptographic wipe command executed for room: ${roomId}`);
    // Broadcast matrix scrub command and audit receipt log to both peers
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
