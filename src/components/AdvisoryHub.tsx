import { useState } from 'react';
import { Cpu, HelpCircle, FileText, UserCheck, Calendar, DollarSign, ArrowRight, ShieldCheck, ChevronRight, CheckCircle2, AlertTriangle, Lightbulb, Workflow, ShieldAlert, Sparkles } from 'lucide-react';
import type { ProjectBrief } from '../types';
import { supabase, isSupabaseConfigured } from '../supabaseClient';

interface AdvisoryHubProps {
  onNavigateToMarketplace: (filters: { skills: string[]; budget: number }) => void;
}

// YC-Level Advisor Local Compiler
const compileAdvisoryReport = (inputQuery: string): ProjectBrief => {
  const queryLower = inputQuery.toLowerCase();
  
  // Extract and clean name
  const cleanTitle = inputQuery.trim()
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  const titleClean = cleanTitle.length > 50 ? cleanTitle.substring(0, 50) + '...' : cleanTitle;

  // Default values
  let title = `${titleClean} — Advisory Report`;
  let overview = `A specialized technical architecture custom-tailored for the "${titleClean}" platform request. The system implements a modern, secure microservice blueprint designed to support robust domain-specific workflows and transaction flows.`;
  let techStack = ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'Redis'];
  let estimatedCost = '$22,000 - $38,000';
  let estimatedTimeline = '6 - 10 weeks';
  
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

  // Archetype 1: Secure Deal Chambers / WebRTC / Encryption
  if (queryLower.includes('deal room') || queryLower.includes('encrypted') || queryLower.includes('webrtc') || queryLower.includes('signature') || queryLower.includes('nda')) {
    title = 'Zero-Knowledge B2B Deal Chamber';
    overview = 'An ephemeral B2B negotiation room allowing corporate partners to sign NDAs, exchange versioned files, and discuss agreements securely via browser-native WebRTC signal tunnels without any server-side database logging.';
    techStack = ['React', 'TypeScript', 'WebRTC', 'Supabase', 'WebCrypto API', 'Node.js'];
    estimatedCost = '$35,000 - $55,000';
    estimatedTimeline = '10 - 12 weeks';
    
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
  }
  
  // Archetype 2: AI Support Agent / Chatbots / RAG / Machine Learning
  else if (queryLower.includes('ai') || queryLower.includes('bot') || queryLower.includes('chatbot') || queryLower.includes('rag') || queryLower.includes('learning')) {
    title = 'AI Knowledge Support Agent';
    overview = 'A high-performance Retrieval-Augmented Generation (RAG) agent that ingests unstructured PDF manuals, embeds them into a semantic vector index, and serves accurate support answers to customer prompt feeds.';
    techStack = ['Python', 'FastAPI', 'React', 'Pinecone', 'LangChain', 'Claude API', 'PostgreSQL'];
    estimatedCost = '$28,000 - $45,000';
    estimatedTimeline = '6 - 8 weeks';
    
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
  }
  
  // Archetype 3: E-Commerce / Subscriptions / Stripe / Marketplaces
  else if (queryLower.includes('shop') || queryLower.includes('commerce') || queryLower.includes('stripe') || queryLower.includes('subscription') || queryLower.includes('marketplace')) {
    title = 'B2B Marketplace & Subscription Platform';
    overview = 'A multi-vendor digital e-commerce marketplace featuring member subscriptions, automated vendor onboarding, and secure split payouts powered by Stripe Connect.';
    techStack = ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Stripe API', 'Supabase'];
    estimatedCost = '$18,000 - $30,000';
    estimatedTimeline = '6 - 8 weeks';
    
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

  return {
    id: `brief-${Math.floor(Math.random() * 1000)}`,
    title,
    description: inputQuery,
    techStack,
    estimatedCost,
    estimatedTimeline,
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
  };
};

export const AdvisoryHub: React.FC<AdvisoryHubProps> = ({ onNavigateToMarketplace }) => {
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [brief, setBrief] = useState<ProjectBrief | null>(null);
  const [selectedExpert, setSelectedExpert] = useState<string | null>(null);

  const presets = [
    {
      title: 'Encrypted B2B Deal Room',
      desc: 'Real-time WebRTC chat room with NDA signer and file attachments.',
      query: 'I need a secure, end-to-end encrypted deal room platform where two businesses can log in with a code, sign a digital NDA, text in real-time, share files, and close the session such that all documents and chat histories are completely wiped from memory.'
    },
    {
      title: 'AI Customer Support Bot',
      desc: 'Smart RAG agent integrated into a SaaS customer dashboard.',
      query: 'I want to build an AI chatbot for our customer support dashboard that answers user questions based on our internal documentation. It needs a FastAPI backend, vector database (Pinecone), and React dashboard.'
    },
    {
      title: 'E-Commerce with Subscription',
      desc: 'Online marketplace with member retainers and Stripe Connect.',
      query: 'An online marketplace platform where customers can purchase digital assets and subscribe to monthly membership plans. Developers should receive their payouts via Stripe Connect with a 15% platform fee.'
    }
  ];

  const handleAnalyze = async (inputQuery: string) => {
    if (!inputQuery.trim()) return;
    setIsAnalyzing(true);
    setBrief(null);

    // Simulate backend handshake or hit API, then parse into high fidelity YC advisor format
    try {
      const res = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: inputQuery })
      });
      
      if (!res.ok) throw new Error('API server down');
      
      const data = await res.json();
      
      // Inject YC advisor sections if the backend returns the old legacy schema
      if (!data.overview) {
        const compiled = compileAdvisoryReport(inputQuery);
        // Override with backend estimations if available
        compiled.title = data.title || compiled.title;
        compiled.techStack = data.techStack || compiled.techStack;
        compiled.estimatedCost = data.estimatedCost || compiled.estimatedCost;
        compiled.estimatedTimeline = data.estimatedTimeline || compiled.estimatedTimeline;
        setBrief(compiled);
      } else {
        setBrief(data);
      }

      // Save to Supabase Database if credentials are set
      if (isSupabaseConfigured) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const compiledReport = compileAdvisoryReport(inputQuery);
          const { error } = await supabase.from('briefs').insert({
            id: data.id || compiledReport.id,
            user_id: user.id,
            title: data.title || compiledReport.title,
            description: inputQuery,
            tech_stack: data.techStack || compiledReport.techStack,
            estimated_cost: data.estimatedCost || compiledReport.estimatedCost,
            estimated_timeline: data.estimatedTimeline || compiledReport.estimatedTimeline,
            architecture: compiledReport.overview,
            features: compiledReport.functionalRequirements,
            risks: compiledReport.spinoff
          });
          if (error) console.error('Failed to store brief in Supabase DB:', error.message);
          else console.log('Successfully saved project brief in Supabase DB.');
        }
      }
    } catch (err) {
      console.warn('Backend server down. Compiling high-fidelity brief locally:', err);
      // Compile the report locally with YC advisor standards
      const localReport = compileAdvisoryReport(inputQuery);
      setBrief(localReport);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
          <Cpu size={24} />
        </div>
        <div>
          <h1 style={{ fontSize: '28px', marginBottom: '4px' }}>AI Software Advisory Hub</h1>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>Describe your software requirements in plain English to generate a structured architecture brief.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '32px' }}>
        {/* Input Panel */}
        <div className="glass-card" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Describe your app idea</h2>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. I need a real-time contract signing dashboard where clients and vendors can negotiate privately without any data saved on the server..."
            rows={5}
            style={{
              width: '100%',
              background: '#080c14',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '16px',
              color: '#f8fafc',
              fontSize: '14px',
              lineHeight: 1.5,
              outline: 'none',
              marginBottom: '20px',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          />

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#94a3b8', fontSize: '13px' }}>
              <HelpCircle size={14} /> Need ideas? Click a preset below
            </div>
            <button
              onClick={() => handleAnalyze(query)}
              disabled={isAnalyzing || !query.trim()}
              className="btn-glow-blue"
              style={{
                background: '#3b82f6',
                color: '#fff',
                border: 'none',
                padding: '12px 28px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: isAnalyzing || !query.trim() ? 0.6 : 1
              }}
            >
              {isAnalyzing ? 'Analyzing architecture...' : 'Generate 360° Report'}
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Preset Buttons */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            marginTop: '32px',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            paddingTop: '24px'
          }}>
            {presets.map((preset, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setQuery(preset.query);
                  handleAnalyze(preset.query);
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'var(--transition-smooth)'
                }}
                className="glass-card"
              >
                <h4 style={{ fontSize: '14px', color: '#60a5fa', marginBottom: '6px' }}>{preset.title}</h4>
                <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.4 }}>{preset.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isAnalyzing && (
          <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid rgba(59, 130, 246, 0.1)',
              borderTopColor: '#3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px auto'
            }} />
            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Claude AI Solution Architect</h3>
            <p style={{ color: '#94a3b8', fontSize: '14px' }}>Compiling YC advisory brief, tech stack options, and system requirements...</p>
          </div>
        )}

        {/* Results Solution Brief Panel */}
        {brief && !isAnalyzing && (
          <div style={{ display: 'grid', gap: '32px', animation: 'fadeIn 0.5s ease-out' }}>
            
            {/* Header brief info */}
            <div className="glass-card" style={{ padding: '32px', borderLeft: '4px solid #3b82f6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '20px' }}>
                <div>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Advisory Report</span>
                  <h2 style={{ fontSize: '24px', marginTop: '4px' }}>{brief.title}</h2>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={handlePrint}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '13px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <FileText size={14} /> Export Report
                  </button>
                  <button
                    onClick={() => onNavigateToMarketplace({ skills: brief.techStack, budget: 150 })}
                    className="btn-glow-green"
                    style={{
                      background: '#10b981',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <UserCheck size={14} /> Match Developers
                  </button>
                </div>
              </div>

              {/* Cost Timeline Info Row */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
                marginBottom: '32px'
              }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.01)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '13px', marginBottom: '8px' }}>
                    <DollarSign size={14} color="#10b981" /> Estimated Cost
                  </div>
                  <h3 style={{ fontSize: '20px', color: '#10b981', fontWeight: 700 }}>{brief.estimatedCost}</h3>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.01)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '13px', marginBottom: '8px' }}>
                    <Calendar size={14} color="#3b82f6" /> Estimated Timeline
                  </div>
                  <h3 style={{ fontSize: '20px', color: '#60a5fa', fontWeight: 700 }}>{brief.estimatedTimeline}</h3>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.01)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '13px', marginBottom: '8px' }}>
                    <ShieldCheck size={14} color="#8b5cf6" /> Vetting Compliance
                  </div>
                  <h3 style={{ fontSize: '20px', color: '#8b5cf6', fontWeight: 700 }}>ISO & SOC2 Ready</h3>
                </div>
              </div>

              {/* 1. Idea Overview */}
              <div>
                <h3 style={{ fontSize: '16px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Lightbulb size={16} color="#3b82f6" /> 1. Idea Overview
                </h3>
                <div style={{ background: 'rgba(59, 130, 246, 0.02)', border: '1px solid rgba(59, 130, 246, 0.1)', padding: '18px', borderRadius: '8px', color: '#cbd5e1', fontSize: '14px', lineHeight: 1.6 }}>
                  {brief.overview}
                </div>
              </div>
            </div>

            {/* 2. Technical Pros & Cons */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid #10b981' }}>
                <h3 style={{ fontSize: '15px', marginBottom: '16px', color: '#34d399', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} /> Technical Pros / Feasibility
                </h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {brief.pros.map((pro, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'start', fontSize: '13px', color: '#94a3b8', lineHeight: 1.5 }}>
                      <span style={{ color: '#10b981', fontWeight: 'bold' }}>•</span>
                      <span>{pro}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid #ef4444' }}>
                <h3 style={{ fontSize: '15px', marginBottom: '16px', color: '#f87171', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={16} /> Technical Cons / Risks
                </h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {brief.cons.map((con, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'start', fontSize: '13px', color: '#94a3b8', lineHeight: 1.5 }}>
                      <span style={{ color: '#ef4444', fontWeight: 'bold' }}>•</span>
                      <span>{con}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Cross Ideas & Adjacent Concepts */}
            <div className="glass-card" style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Workflow size={16} color="#8b5cf6" /> 3. Cross Ideas / Related Concepts
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {brief.crossIdeas.map((idea, idx) => (
                  <div key={idx} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', padding: '20px', borderRadius: '10px' }}>
                    <h4 style={{ fontSize: '14px', color: '#a78bfa', marginBottom: '8px', fontWeight: 600 }}>{idea.title}</h4>
                    <p style={{ fontSize: '12.5px', color: '#94a3b8', lineHeight: 1.5 }}>{idea.explanation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Implementation Plan */}
            <div className="glass-card" style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={16} color="#3b82f6" /> 4. Implementation Roadmap
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                
                {/* Phase 1 */}
                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '10px', padding: '20px' }}>
                  <h4 style={{ fontSize: '14px', color: '#cbd5e1', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                    {brief.implementationPlan.phase1.title}
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                    {brief.implementationPlan.phase1.techStack.map((tech, idx) => (
                      <span key={idx} style={{ fontSize: '10px', background: 'rgba(59,130,246,0.1)', color: '#60a5fa', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    {brief.implementationPlan.phase1.features.map((feat, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '8px', fontSize: '12px', color: '#94a3b8', lineHeight: 1.4 }}>
                        <span style={{ color: '#3b82f6' }}>✔</span>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Phase 2 */}
                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '10px', padding: '20px' }}>
                  <h4 style={{ fontSize: '14px', color: '#cbd5e1', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                    {brief.implementationPlan.phase2.title}
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                    {brief.implementationPlan.phase2.techStack.map((tech, idx) => (
                      <span key={idx} style={{ fontSize: '10px', background: 'rgba(139,92,246,0.1)', color: '#a78bfa', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    {brief.implementationPlan.phase2.features.map((feat, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '8px', fontSize: '12px', color: '#94a3b8', lineHeight: 1.4 }}>
                        <span style={{ color: '#8b5cf6' }}>✔</span>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Phase 3 */}
                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '10px', padding: '20px' }}>
                  <h4 style={{ fontSize: '14px', color: '#cbd5e1', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                    {brief.implementationPlan.phase3.title}
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                    {brief.implementationPlan.phase3.techStack.map((tech, idx) => (
                      <span key={idx} style={{ fontSize: '10px', background: 'rgba(16,185,129,0.1)', color: '#34d399', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    {brief.implementationPlan.phase3.features.map((feat, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '8px', fontSize: '12px', color: '#94a3b8', lineHeight: 1.4 }}>
                        <span style={{ color: '#10b981' }}>✔</span>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Functional & 6. Non-Functional Requirements */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              
              {/* Functional Requirements */}
              <div className="glass-card" style={{ padding: '28px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '16px', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={16} color="#3b82f6" /> 5. Functional Requirements
                </h3>
                <div style={{ display: 'grid', gap: '10px' }}>
                  {brief.functionalRequirements.map((req, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '10px', fontSize: '13px', color: '#94a3b8', lineHeight: 1.4 }}>
                      <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>{idx + 1}.</span>
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Non-Functional Requirements */}
              <div className="glass-card" style={{ padding: '28px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '16px', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldAlert size={16} color="#ef4444" /> 6. Non-Functional Requirements
                </h3>
                <div style={{ display: 'grid', gap: '14px' }}>
                  <div>
                    <h5 style={{ fontSize: '11px', color: '#ef4444', fontWeight: 600, letterSpacing: '0.05em' }}>PERFORMANCE</h5>
                    <p style={{ fontSize: '12.5px', color: '#94a3b8', marginTop: '2px', lineHeight: 1.4 }}>{brief.nonFunctionalRequirements.performance}</p>
                  </div>
                  <div>
                    <h5 style={{ fontSize: '11px', color: '#34d399', fontWeight: 600, letterSpacing: '0.05em' }}>SECURITY</h5>
                    <p style={{ fontSize: '12.5px', color: '#94a3b8', marginTop: '2px', lineHeight: 1.4 }}>{brief.nonFunctionalRequirements.security}</p>
                  </div>
                  <div>
                    <h5 style={{ fontSize: '11px', color: '#60a5fa', fontWeight: 600, letterSpacing: '0.05em' }}>SCALABILITY</h5>
                    <p style={{ fontSize: '12.5px', color: '#94a3b8', marginTop: '2px', lineHeight: 1.4 }}>{brief.nonFunctionalRequirements.scalability}</p>
                  </div>
                  <div>
                    <h5 style={{ fontSize: '11px', color: '#a78bfa', fontWeight: 600, letterSpacing: '0.05em' }}>AVAILABILITY</h5>
                    <p style={{ fontSize: '12.5px', color: '#94a3b8', marginTop: '2px', lineHeight: 1.4 }}>{brief.nonFunctionalRequirements.availability}</p>
                  </div>
                  <div>
                    <h5 style={{ fontSize: '11px', color: '#fb923c', fontWeight: 600, letterSpacing: '0.05em' }}>COMPLIANCE</h5>
                    <p style={{ fontSize: '12.5px', color: '#94a3b8', marginTop: '2px', lineHeight: 1.4 }}>{brief.nonFunctionalRequirements.compliance}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 7. Unique Spin-off Tool Idea */}
            <div className="glass-card" style={{ padding: '32px', background: 'radial-gradient(circle at 100% 100%, rgba(139, 92, 246, 0.05) 0%, transparent 60%)', border: '1px solid rgba(139, 92, 246, 0.15)' }}>
              <div style={{ display: 'inline-flex', padding: '8px', borderRadius: '8px', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', marginBottom: '16px' }}>
                <Sparkles size={18} />
              </div>
              <span style={{ fontSize: '11px', color: '#a78bfa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>Standalone Innovation Spinoff</span>
              
              <h3 style={{ fontSize: '18px', color: '#fff', marginBottom: '12px' }}>{brief.spinoff.name}</h3>
              <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: 1.5, marginBottom: '20px' }}>{brief.spinoff.description}</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                <div>
                  <h5 style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>CORE USE CASE</h5>
                  <p style={{ fontSize: '12.5px', color: '#94a3b8', marginTop: '4px', lineHeight: 1.4 }}>{brief.spinoff.useCase}</p>
                </div>
                <div>
                  <h5 style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>MARKET GAP / UNIQUENESS</h5>
                  <p style={{ fontSize: '12.5px', color: '#94a3b8', marginTop: '4px', lineHeight: 1.4 }}>{brief.spinoff.uniqueness}</p>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Human Advisor fallback */}
      <div className="glass-card" style={{ padding: '32px', marginTop: '48px', borderLeft: '4px solid #8b5cf6' }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '18px', marginBottom: '6px' }}>Expert Human Advisor Fallback</h3>
            <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: 1.5 }}>
              If your software request contains highly specialized cryptographic requirements, custom SOC2 auditing needs, or requires a custom WebRTC integration, book an on-demand consultation.
            </p>
          </div>
          <button
            onClick={() => setSelectedExpert('sarah')}
            style={{
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              color: '#a78bfa',
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            Consult Expert Network <ChevronRight size={16} />
          </button>
        </div>

        {selectedExpert && (
          <div style={{
            background: 'rgba(0,0,0,0.2)',
            padding: '20px',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.05)',
            marginTop: '20px',
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            flexWrap: 'wrap',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=80&q=80"
              alt="Sarah"
              style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '15px' }}>Sarah Vance, Senior Solutions Engineer</h4>
              <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '8px' }}>Security & Asymmetric Cryptography • 12 years exp</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>Rate: $180/hr</span>
                <span style={{ fontSize: '11px', background: 'rgba(16,185,129,0.1)', color: '#34d399', padding: '2px 6px', borderRadius: '4px' }}>Available Today</span>
              </div>
            </div>
            <button
              onClick={() => {
                alert('Demo: Redirecting to booking calendar (via Cal.com integration). Expert notified of your scope brief.');
                setSelectedExpert(null);
              }}
              style={{
                background: '#8b5cf6',
                border: 'none',
                color: '#fff',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Book 30m Session
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
