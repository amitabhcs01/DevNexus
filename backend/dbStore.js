import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROFILES_FILE = path.join(__dirname, 'database_profiles.json');
const DEALROOMS_FILE = path.join(__dirname, 'database_dealrooms.json');

// Default Seed Developers
const defaultDevelopers = [
  {
    id: 'dev-001',
    name: 'Alex Rivers',
    title: 'Full Stack & WebRTC Expert',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
    bio: 'Specialist in real-time collaboration applications, WebRTC communication channels, and secure document sharing rooms. Over 8 years of experience building secure B2B SaaS platforms.',
    skills: ['React', 'Node.js', 'WebRTC', 'TypeScript', 'Supabase', 'Socket.io', 'Tailwind', 'PostgreSQL'],
    hourlyRate: 115,
    availability: 'Available Now',
    rating: 4.9,
    reviewsCount: 24,
    gitHubUsername: 'alexrivers-dev',
    niche: 'WebRTC & SaaS Infrastructure',
    verified: true,
    location: 'San Francisco, CA',
    education: [
      { degree: 'B.S. in Computer Science', institution: 'UC Berkeley', year: '2018' }
    ],
    certifications: [
      { name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', year: '2021', link: 'https://aws.amazon.com' }
    ],
    projectPortfolio: [
      {
        projectName: 'webrtc-secure-mesh',
        description: 'End-to-end encrypted video and audio conferencing grid using vanilla WebRTC APIs.',
        techStack: 'TypeScript, React, Node.js',
        liveUrl: 'https://webrtc-secure-mesh.example.com',
        repoUrl: 'https://github.com/alexrivers-dev/webrtc-secure-mesh',
        role: 'Solo Creator',
        duration: 'Jan 2024 - Apr 2024',
        achievements: 'Handled 100+ concurrent peers with zero server load; optimized media bitrates for mobile networks.'
      }
    ],
    workHistory: [
      {
        companyName: 'DocuTrust Inc.',
        role: 'Senior WebRTC Engineer',
        duration: '2021 - Present',
        description: 'Lead developer for high-security negotiation rooms. Integrated zero-trace ephemeral chat architectures and canvas-based e-signature features.',
        techStack: 'React, Socket.io, TypeScript'
      }
    ],
    reviews: [
      { reviewer: 'Sarah K., CTO DocuTrust', rating: 5, comment: 'Phenomenal work on our secure rooms. A rare engineer who understands both WebRTC complexity and clean React design.', date: '2026-05-12' },
      { reviewer: 'David L., Director of Eng at HypeStream', rating: 4.8, comment: 'Very skilled with WebSocket architectures and low latency connections. Highly recommended.', date: '2026-03-24' }
    ]
  },
  {
    id: 'dev-002',
    name: 'Priya Sharma',
    title: 'AI Architect & RAG Integrator',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    bio: 'Passionate about integrating Large Language Models into enterprise workflows. Expertise in Retrieval-Augmented Generation (RAG), vector databases, and custom Claude/GPT application nodes.',
    skills: ['Python', 'FastAPI', 'React', 'LangChain', 'PostgreSQL', 'TypeScript', 'Pinecone', 'Anthropic API', 'OpenAI API'],
    hourlyRate: 135,
    availability: 'In 1 Week',
    rating: 5.0,
    reviewsCount: 18,
    gitHubUsername: 'priyasharma-ai',
    niche: 'AI Agents & LLM Integrations',
    verified: true,
    location: 'Boston, MA',
    education: [
      { degree: 'M.S. in Artificial Intelligence', institution: 'MIT', year: '2021' }
    ],
    certifications: [
      { name: 'Google Cloud Professional Machine Learning Engineer', issuer: 'Google Cloud', year: '2022', link: 'https://cloud.google.com' }
    ],
    projectPortfolio: [
      {
        projectName: 'agentic-rag-router',
        description: 'Dynamic semantic routing engine matching query intent to vector indexes or database calls.',
        techStack: 'Python, FastAPI, LangChain, Pinecone',
        liveUrl: 'https://rag-router.example.com',
        repoUrl: 'https://github.com/priyasharma-ai/agentic-rag-router',
        role: 'Solo Creator',
        duration: 'Nov 2024 - Feb 2025',
        achievements: 'Decreased LLM token costs by 42% by filtering irrelevant chunks; improved response accuracy by 35%.'
      }
    ],
    workHistory: [
      {
        companyName: 'LegalBriefs LLC',
        role: 'AI Architect',
        duration: '2022 - Present',
        description: 'Engineered automatic NDA parsing and vulnerability flagging microservices. Handled secure enterprise datasets under strict privacy regulations.',
        techStack: 'Python, FastAPI, Claude API'
      }
    ],
    reviews: [
      { reviewer: 'Jason W., Founder LegalBriefs', rating: 5, comment: 'Priya has deep knowledge of vector search and prompt engineering. She helped us build a highly compliant contract analysis agent.', date: '2026-06-02' }
    ]
  },
  {
    id: 'dev-003',
    name: 'Marcus Vance',
    title: 'Security & Cryptography Architect',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    bio: 'Security researcher and backend engineer focusing on zero-knowledge systems, data privacy compliance (SOC2/GDPR), and highly secure enterprise authentication layers.',
    skills: ['Rust', 'Node.js', 'Go', 'Cryptography', 'AWS Security', 'Docker', 'PostgreSQL', 'Redis'],
    hourlyRate: 150,
    availability: 'In 2 Weeks',
    rating: 4.85,
    reviewsCount: 31,
    gitHubUsername: 'marcus-v-security',
    niche: 'Security Auditing & Private Backends',
    verified: true,
    location: 'Austin, TX',
    education: [
      { degree: 'B.S. in Cybersecurity', institution: 'UT Austin', year: '2016' }
    ],
    certifications: [
      { name: 'Certified Information Systems Security Professional (CISSP)', issuer: 'ISC2', year: '2020', link: 'https://www.isc2.org' }
    ],
    projectPortfolio: [
      {
        projectName: 'zk-proofs-rust-wasm',
        description: 'Zero-knowledge verification modules compiled to WASM for privacy-first browser forms.',
        techStack: 'Rust, WebAssembly, JavaScript',
        liveUrl: 'https://zk-proofs.example.com',
        repoUrl: 'https://github.com/marcus-v-security/zk-proofs-rust-wasm',
        role: 'Creator',
        duration: 'May 2024 - Aug 2024',
        achievements: 'Implemented non-interactive zero-knowledge proofs locally in-browser with sub-100ms processing overhead.'
      }
    ],
    workHistory: [
      {
        companyName: 'SafeVault Financial',
        role: 'Lead Cryptographer',
        duration: '2019 - Present',
        description: 'Re-architected cloud HSM integrations. Audited internal API routes and achieved clean SOC2 Type II certifications across three major lines.',
        techStack: 'Rust, Docker, AWS Security'
      }
    ],
    reviews: [
      { reviewer: 'Robert C., CISO SafeVault', rating: 4.9, comment: 'Exceptional security mindset. Marcus wrote robust Rust wrappers that eliminated memory leaks and potential buffer overflows.', date: '2026-04-18' }
    ]
  },
  {
    id: 'dev-004',
    name: 'Chloe Zhao',
    title: 'Senior UI/UX & React Engineer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    bio: 'Focused on creating high-performance, visually stunning React interfaces with smooth transitions, interactive data charts, and consistent token-based design systems.',
    skills: ['React', 'Next.js', 'TypeScript', 'Framer Motion', 'Tailwind', 'CSS Modules', 'Figma', 'GraphQL'],
    hourlyRate: 95,
    availability: 'Available Now',
    rating: 4.95,
    reviewsCount: 42,
    gitHubUsername: 'chloez-design',
    niche: 'High-Fidelity UI & Frontend Animation',
    verified: false,
    location: 'Seattle, WA',
    education: [
      { degree: 'B.F.A. in Interaction Design', institution: 'Savannah College of Art and Design', year: '2019' }
    ],
    certifications: [
      { name: 'Interaction Design Certification', issuer: 'Interaction Design Foundation', year: '2020', link: 'https://www.interaction-design.org' }
    ],
    projectPortfolio: [
      {
        projectName: 'framer-motion-presets',
        description: 'Curated, drop-in React animations for business dashboards and complex state updates.',
        techStack: 'TypeScript, React, Framer Motion',
        liveUrl: 'https://motion-presets.example.com',
        repoUrl: 'https://github.com/chloez-design/framer-motion-presets',
        role: 'Solo Creator',
        duration: 'Jul 2024 - Oct 2024',
        achievements: 'Gained 1,200+ stars on GitHub; integrated physics-based scroll animations with sub-pixel alignment.'
      }
    ],
    workHistory: [
      {
        companyName: 'Velo Dashboard',
        role: 'Principal Designer & React Engineer',
        duration: '2020 - Present',
        description: 'Oversee UI design guidelines. Translated Figma design tokens into scalable theme assets. Sped up page transition load speeds by 60%.',
        techStack: 'React, Figma, Next.js'
      }
    ],
    reviews: [
      { reviewer: 'Emily T., Lead Designer Velo', rating: 5.0, comment: 'Chloe translates Figma prototypes into React code pixel-for-pixel, and her motion choreographies are absolutely beautiful.', date: '2026-05-30' }
    ]
  },
  {
    id: 'dev-005',
    name: 'Kenji Sato',
    title: 'Cloud Architect & Backend Lead',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    bio: 'Specialist in scaling database operations, high-throughput APIs, Docker/Kubernetes container orchestration, and real-time state synchronizations.',
    skills: ['Go', 'Docker', 'Kubernetes', 'PostgreSQL', 'Redis', 'GraphQL', 'gRPC', 'Supabase', 'Node.js'],
    hourlyRate: 125,
    availability: 'Available Now',
    rating: 4.92,
    reviewsCount: 29,
    gitHubUsername: 'kenji-sato-dev',
    niche: 'Scalable Backends & Cloud Infrastructure',
    verified: true,
    location: 'Tokyo, Japan',
    education: [
      { degree: 'B.S. in Information Systems', institution: 'Waseda University', year: '2017' }
    ],
    certifications: [
      { name: 'Certified Kubernetes Administrator (CKA)', issuer: 'The Linux Foundation', year: '2022', link: 'https://training.linuxfoundation.org' }
    ],
    projectPortfolio: [
      {
        projectName: 'go-distributed-cache',
        description: 'High-throughput in-memory caching system written in Go featuring consistent hashing.',
        techStack: 'Go, Docker, Redis',
        liveUrl: 'https://go-cache.example.com',
        repoUrl: 'https://github.com/kenji-sato-dev/go-distributed-cache',
        role: 'Solo Creator',
        duration: 'Jan 2024 - May 2024',
        achievements: 'Maintained 50k+ QPS with under 5ms latency metrics; integrated automated cluster sharding.'
      }
    ],
    workHistory: [
      {
        companyName: 'TradeSphere Corp',
        role: 'Principal Cloud Systems Engineer',
        duration: '2018 - Present',
        description: 'Migrated monolithic trading servers to Go microservices. Optimized PostgreSQL indexes and enabled multi-region replication.',
        techStack: 'Go, PostgreSQL, Kubernetes, Redis'
      }
    ],
    reviews: []
  }
];

// Default Seed Deal Rooms
const defaultDealrooms = {
  'NEX-MSFT-AMZN': {
    id: 'NEX-MSFT-AMZN',
    title: 'Cloud Infrastructure Service Agreement',
    createdBy: 'client@devnexus.local',
    parties: [
      { userId: '00000000-0000-0000-0000-000000000002', companyName: 'Microsoft Corporation', role: 'PartyA' },
      { userId: '00000000-0000-0000-0000-000000000003', companyName: 'Amazon Web Services', role: 'PartyB' }
    ],
    status: 'active',
    messages: [
      { senderId: '00000000-0000-0000-0000-000000000002', senderName: 'Satya Nadella (Microsoft Corporation)', content: 'Hello team, looking forward to negotiating our dedicated server supply arrangement.', timestamp: '14:24', attachments: [] }
    ],
    ndaStatus: 'pending',
    files: [
      { name: 'partnership_proposal_v1.pdf', size: '1.8 MB', type: 'application/pdf', contentMock: 'Draft terms for cloud migration collaboration. Budget: $1,200,000', uploadedBy: 'Microsoft Corporation', timestamp: '14:20' }
    ],
    dealTerms: { value: 1200000, currency: 'USD', deadline: '2026-12-31', conditions: 'Provision of dedicated servers with SLA target 99.99% monthly availability.' },
    createdAt: new Date('2026-06-25T14:00:00Z').toISOString(),
    updatedAt: new Date('2026-06-25T14:30:00Z').toISOString()
  },
  'NEX-APPL-TSMC': {
    id: 'NEX-APPL-TSMC',
    title: 'Semiconductor Supply Chain Agreement',
    createdBy: 'client@devnexus.local',
    parties: [
      { userId: '00000000-0000-0000-0000-000000000002', companyName: 'Apple Inc.', role: 'PartyA' },
      { userId: '00000000-0000-0000-0000-000000000005', companyName: 'TSMC Ltd.', role: 'PartyB' }
    ],
    status: 'signed',
    messages: [
      { senderId: '00000000-0000-0000-0000-000000000002', senderName: 'Tim Cook (Apple Inc.)', content: 'The supply contract has been co-signed. Let us proceed with production schedules.', timestamp: '10:05', attachments: [] }
    ],
    ndaStatus: 'signed',
    files: [
      { name: 'semiconductor_supply_agreement_signed.pdf', size: '3.2 MB', type: 'application/pdf', contentMock: 'Co-signed supply chain agreement.', uploadedBy: 'Apple Inc.', timestamp: '10:02' }
    ],
    dealTerms: { value: 4500000000, currency: 'USD', deadline: '2027-06-30', conditions: 'Production of 2nm Apple Silicon processors.' },
    createdAt: new Date('2026-06-20T09:00:00Z').toISOString(),
    updatedAt: new Date('2026-06-20T10:05:00Z').toISOString()
  }
};

// --- Helper Functions for Database Read/Write ---

export function getDevelopers() {
  try {
    if (!fs.existsSync(PROFILES_FILE)) {
      fs.writeFileSync(PROFILES_FILE, JSON.stringify(defaultDevelopers, null, 2));
      return defaultDevelopers;
    }
    const data = fs.readFileSync(PROFILES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error loading profiles database:', err.message);
    return defaultDevelopers;
  }
}

export function saveDevelopers(developers) {
  try {
    fs.writeFileSync(PROFILES_FILE, JSON.stringify(developers, null, 2));
    return true;
  } catch (err) {
    console.error('Error saving profiles database:', err.message);
    return false;
  }
}

export function getDealrooms() {
  try {
    if (!fs.existsSync(DEALROOMS_FILE)) {
      fs.writeFileSync(DEALROOMS_FILE, JSON.stringify(defaultDealrooms, null, 2));
      return defaultDealrooms;
    }
    const data = fs.readFileSync(DEALROOMS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error loading dealrooms database:', err.message);
    return defaultDealrooms;
  }
}

export function saveDealrooms(dealrooms) {
  try {
    fs.writeFileSync(DEALROOMS_FILE, JSON.stringify(dealrooms, null, 2));
    return true;
  } catch (err) {
    console.error('Error saving dealrooms database:', err.message);
    return false;
  }
}
