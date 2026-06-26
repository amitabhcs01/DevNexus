import type { Developer } from '../types';

export const mockDevelopers: Developer[] = [
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
    githubRepos: [
      { name: 'webrtc-secure-mesh', stars: 142, forks: 28, language: 'TypeScript' },
      { name: 'react-ephemeral-chat', stars: 98, forks: 12, language: 'React' },
      { name: 'supabase-auth-hooks', stars: 54, forks: 6, language: 'JavaScript' }
    ],
    projectHistory: [
      {
        client: 'DocuTrust Inc.',
        projectName: 'E2E Document Deal Room',
        duration: '3 months',
        rating: 5,
        feedback: 'Alex delivered our encrypted contract signature room ahead of schedule. Exceptional WebRTC knowledge.'
      },
      {
        client: 'HypeStream Inc.',
        projectName: 'Realtime Multi-party Video Hub',
        duration: '5 months',
        rating: 4.8,
        feedback: 'Great communication and robust architecture. Solved tricky audio echo issues with ease.'
      }
    ],
    reviews: [
      { reviewer: 'Sarah K., CTO DocuTrust', rating: 5, comment: 'Phenomenal work on our secure rooms. A rare engineer who understands both WebRTC complexity and clean React frontend design.', date: '2026-05-12' },
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
    githubRepos: [
      { name: 'agentic-rag-router', stars: 324, forks: 52, language: 'Python' },
      { name: 'claude-context-optimizer', stars: 215, forks: 19, language: 'Python' },
      { name: 'fastapi-llm-boilerplate', stars: 87, forks: 11, language: 'Python' }
    ],
    projectHistory: [
      {
        client: 'LegalBriefs LLC',
        projectName: 'Automated NDA Contract Analyzer',
        duration: '2 months',
        rating: 5,
        feedback: 'Priya helped us automate analysis of commercial NDAs. Our review speed increased by 300%.'
      },
      {
        client: 'EduCore SaaS',
        projectName: 'AI Tutor Bot Engine',
        duration: '4 months',
        rating: 5,
        feedback: 'Amazing RAG pipeline setup. Accuracy is top notch and token usage was optimized brilliantly.'
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
    githubRepos: [
      { name: 'zk-proofs-rust-wasm', stars: 412, forks: 34, language: 'Rust' },
      { name: 'express-secure-shield', stars: 189, forks: 22, language: 'JavaScript' },
      { name: 'key-rotator-go', stars: 95, forks: 8, language: 'Go' }
    ],
    projectHistory: [
      {
        client: 'SafeVault Financial',
        projectName: 'SOC2 Security Audit & Remediation',
        duration: '4 months',
        rating: 4.9,
        feedback: 'Marcus successfully guided us through our SOC2 audit, patching multiple microservice leaks.'
      },
      {
        client: 'PrivyMail',
        projectName: 'Encrypted Message Store',
        duration: '2 months',
        rating: 4.8,
        feedback: 'Solid implementation of asymmetric key exchange for offline mail storage.'
      }
    ],
    reviews: [
      { reviewer: 'Robert C., CISO SafeVault', rating: 4.9, comment: 'Exceptional security mindset. Marcus did not just advise, he wrote robust Rust wrappers that eliminated memory leaks and potential buffer overflows.', date: '2026-04-18' }
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
    githubRepos: [
      { name: 'framer-motion-presets', stars: 1205, forks: 94, language: 'TypeScript' },
      { name: 'interactive-charts-canvas', stars: 243, forks: 19, language: 'TypeScript' },
      { name: 'css-glassmorphic-builder', stars: 178, forks: 14, language: 'React' }
    ],
    projectHistory: [
      {
        client: 'Velo Dashboard',
        projectName: 'SaaS Business Analytics Portal',
        duration: '3 months',
        rating: 5,
        feedback: 'Chloe completely redesigned our analytics UI. Customer satisfaction scores jumped by 40%.'
      },
      {
        client: 'FitQuest App',
        projectName: 'Gamified Fitness User Interface',
        duration: '6 months',
        rating: 4.9,
        feedback: 'Beautiful animations, perfect mobile responsiveness, and clean modular code structure.'
      }
    ],
    reviews: [
      { reviewer: 'Emily T., Lead Designer Velo', rating: 5, comment: 'Chloe translates Figma prototypes into React code pixel-for-pixel, and her motion choreographies are absolutely beautiful.', date: '2026-05-30' }
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
    githubRepos: [
      { name: 'go-distributed-cache', stars: 489, forks: 61, language: 'Go' },
      { name: 'k8s-pod-monitor', stars: 182, forks: 14, language: 'Go' },
      { name: 'postgres-auto-sharder', stars: 395, forks: 45, language: 'Go' }
    ],
    projectHistory: [
      {
        client: 'TradeSphere Corp',
        projectName: 'Realtime Stock Ledger Backend',
        duration: '5 months',
        rating: 5,
        feedback: 'Kenji migrated our legacy ledger to a Go-based microservice architecture, handling 50k requests/sec.'
      },
      {
        client: 'LogiRoute',
        projectName: 'Fleet Dispatch Websocket API',
        duration: '3 months',
        rating: 4.8,
        feedback: 'Highly reliable Redis-backed system that handles 10,000 active truck coordinates synchronously.'
      }
    ],
    reviews: [
      { reviewer: 'Marcus A., VP of Eng TradeSphere', rating: 5, comment: 'A brilliant systems programmer. His database query optimizations saved us thousands in monthly cloud bills.', date: '2026-02-14' }
    ]
  }
];
