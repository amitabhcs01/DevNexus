export const getAdvisoryArchetype = (query) => {
  const queryLower = query.toLowerCase();

  // Extract and clean name
  const cleanTitle = query.trim()
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  const titleClean = cleanTitle.length > 55 ? cleanTitle.substring(0, 55) + '...' : cleanTitle;

  // 1. PropTech / Hostel / Hotel / PG Management / Real Estate
  if (
    queryLower.includes('hostel') ||
    queryLower.includes('hotel') ||
    queryLower.includes('pg') ||
    queryLower.includes('property') ||
    queryLower.includes('room') ||
    queryLower.includes('tenant') ||
    queryLower.includes('rent') ||
    queryLower.includes('real estate')
  ) {
    return {
      id: `brief-${Math.floor(Math.random() * 1000)}`,
      title: `${titleClean} — PropTech Advisory Report`,
      description: query,
      techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Twilio'],
      estimatedCost: '$25,000 - $38,000',
      estimatedTimeline: '8 - 12 weeks',
      overview: `A specialized property management architecture designed for "${titleClean}". It automates room allocations, tenant boarding, lease agreements, rent payments, maintenance logs, and staff assignments.`,
      pros: [
        'Automated allocation models reduce vacant room cycles and maximize property yield.',
        'Twilio SMS integrations send automated alerts to improve on-time rent collection rates.',
        'Centralized relational database structure simplifies scaling to multi-property management.'
      ],
      cons: [
        'High administrative overhead related to initial tenant identity and lease vetting.',
        'Complex payment logic required to compute prorated checkouts, utility splits, and deposit returns.',
        'Requires browser offline fallback caching to prevent check-in gridlocks if facility Wi-Fi fails.'
      ],
      crossIdeas: [
        { title: 'IoT Smart Lock Integrations', explanation: 'Generating remote, time-bound Bluetooth lock codes for rooms directly from active check-in sessions.' },
        { title: 'Utility Meter Telemetry', explanation: 'Installing smart electric sensors that report utility consumption directly to tenant monthly rent ledgers.' },
        { title: 'Tenant Risk scoring', explanation: 'Using public record APIs to verify rental history and perform instant background checks.' }
      ],
      implementationPlan: {
        phase1: {
          title: 'Phase 1 — Tenant Leases & Allocation MVP',
          features: [
            'Interactive room configuration and occupancy grids.',
            'Tenant onboarding forms and lease agreement creators.',
            'Basic rent bookkeeping ledgers.'
          ],
          techStack: ['React', 'TypeScript', 'Supabase']
        },
        phase2: {
          title: 'Phase 2 — SMS Reminders & Maintenance Tickets',
          features: [
            'Twilio SMS notifications for rent warnings and payments confirmation.',
            'Ticketing module with file attachment support for repair staff.',
            'Automated PDF invoice generation routines.'
          ],
          techStack: ['Node.js', 'Express', 'Twilio API']
        },
        phase3: {
          title: 'Phase 3 — Stripe split & Multi-Property dashboards',
          features: [
            'Stripe payments checkout for credit card and ACH rent transfers.',
            'Platform dashboard displaying yield and collection status across properties.',
            'Integrated smart lock activation APIs.'
          ],
          techStack: ['Stripe', 'AWS IoT Core', 'Chart.js']
        }
      },
      implementationRoadmap: {
        stages: [
          { stage: 'Lease & Flow Planning', timeframe: 'Weeks 1–2', deliverable: 'Lease contract templates, room grid wireframes.', owner: 'PM + Architect' },
          { stage: 'DB Schema Scaffold', timeframe: 'Weeks 3–4', deliverable: 'Tenant occupancy, lease logs, payment tables layout.', owner: 'Backend Dev' },
          { stage: 'Frontend Grid UI', timeframe: 'Weeks 5–6', deliverable: 'Occupancy grid interface, check-in dialog forms.', owner: 'Frontend Dev' },
          { stage: 'Core Feature Build', timeframe: 'Weeks 7–10', deliverable: 'Check-in, rent ledgers, lease generation live in staging.', owner: 'Full-stack Team' },
          { stage: 'Background Jobs & QA', timeframe: 'Week 11', deliverable: 'SMS reminder queue checks, security audit for tenant files.', owner: 'QA Engineer' },
          { stage: 'Production Pilot Launch', timeframe: 'Week 12', deliverable: 'Production deployment, live pilot launch in 1st hostel.', owner: 'DevOps + PM' },
          { stage: 'Stripe & IoT Integrations', timeframe: 'Month 4+', deliverable: 'Payment gateway sync, smart locks API setup.', owner: 'Full Team' }
        ],
        criticalPath: 'Tenant-to-Room relational schema. Leases generation and check-in updates are blocked until the allocation grid state is verified.',
        riskFlags: [
          'Tenant identity validation drop-offs.',
          'Prorated rent decimal calculation overlaps.',
          'SMS gateway delivery blocks.'
        ],
        recommendedTeamSize: '1 Product Manager, 1 Software Architect, 1 Backend Developer, 1 Frontend Developer, 1 QA Specialist.'
      },
      functionalRequirements: [
        'Admins must be able to configure room pricing tiers, amenities, and floor structures.',
        'Tenants must be able to log in, view lease terms, and check rent payment histories.',
        'System must auto-generate monthly invoices and send text notifications.',
        'Maintenance tickets must support staff dispatch logs and tenant alerts.',
        'System must prevent room double-bookings during concurrent check-in sessions.',
        'Admins must be able to process security deposit refunds and checkouts.',
        'Staff must be able to upload guest identity documents securely.',
        'Platform must support multi-tenant franchise accounts for franchise managers.'
      ],
      nonFunctionalRequirements: {
        performance: 'Allocation grids must render state updates under 150ms; API response limits must compile under 200ms.',
        security: 'Encrypt tenant identity files at rest via AES-256; mask bank details in the database.',
        scalability: 'Database structure must support 50,000 rooms and 100 properties without query degradation.',
        availability: 'Target 99.9% system uptime to ensure facility check-in systems remain operational.',
        compliance: 'Fully GDPR compliant for tenant personal details erasure.'
      },
      spinoff: {
        name: 'LeaseLock',
        description: 'A standalone microservice that auto-generates state-compliant residential lease PDF contracts.',
        useCase: 'Embedding legally-sound leases into real estate platforms.',
        uniqueness: 'Integrates directly with regional legislative feeds to update lease terms automatically when local laws change.'
      }
    };
  }

  // 2. HealthTech / Telemedicine / Patient Records
  if (
    queryLower.includes('health') ||
    queryLower.includes('patient') ||
    queryLower.includes('doctor') ||
    queryLower.includes('clinic') ||
    queryLower.includes('telemedicine') ||
    queryLower.includes('medical') ||
    queryLower.includes('hospital')
  ) {
    return {
      id: `brief-${Math.floor(Math.random() * 1000)}`,
      title: `${titleClean} — HealthTech Advisory Report`,
      description: query,
      techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'WebRTC', 'HL7/FHIR'],
      estimatedCost: '$35,000 - $60,000',
      estimatedTimeline: '10 - 14 weeks',
      overview: `A high-security healthcare framework custom-built for "${titleClean}". It implements HL7/FHIR patient health records formatting, role-based doctor/patient authorization portals, and encrypted appointment consultation links.`,
      pros: [
        'Decoupled HIPAA-compliant patient profile slots shield confidential records.',
        'Structured FHIR API mappings guarantee smooth interoperability with external hospital systems.',
        'WebRTC video consultation feeds increase doctor-to-patient consultation efficiencies.'
      ],
      cons: [
        'Strict regulatory compliance audits (HIPAA/SOC2) significantly extend development timeframes.',
        'Complex HL7 data translation structures require custom parser libraries.',
        'High security dependencies for encrypting real-time video/audio signal lines.'
      ],
      crossIdeas: [
        { title: 'AI Symptom Pre-screener', explanation: 'Using secure LLMs to analyze patient symptom inputs and route them to appropriate doctors before sessions.' },
        { title: 'FHIR Data Mapper Sync', explanation: 'A standalone connector utility to sync client-side vitals with Epic Systems databases.' },
        { title: 'Smart Wearables Telemetry', explanation: 'Real-time sync of patient heart rates and blood pressures from IoT wearables into EHR logs.' }
      ],
      implementationPlan: {
        phase1: {
          title: 'Phase 1 — HIPAA EHR Scaffold',
          features: [
            'Secure patient/doctor profile creation.',
            'Encrypted database records mapping medical histories.',
            'Basic consultation appointment bookings calendar.'
          ],
          techStack: ['React', 'TypeScript', 'PostgreSQL']
        },
        phase2: {
          title: 'Phase 2 — WebRTC Consultations & E-Prescriptions',
          features: [
            'Secure peer-to-peer WebRTC video signaling server.',
            'Encrypted digital prescription generators with SHA signatures.',
            'Automated SMS appointment alerts.'
          ],
          techStack: ['Node.js', 'Socket.io', 'WebCrypto API']
        },
        phase3: {
          title: 'Phase 3 — HL7 Integration & Billing Pipelines',
          features: [
            'HL7/FHIR database adapters to synchronize records.',
            'Stripe payment collection and insurance claim tracking.',
            'Doctor dashboard detailing billing rates and availability schedules.'
          ],
          techStack: ['HL7 FHIR API', 'Stripe', 'AWS Nitro Enclaves']
        }
      },
      implementationRoadmap: {
        stages: [
          { stage: 'HIPAA Compliance Scope', timeframe: 'Weeks 1–2', deliverable: 'EHR schema plans, data security protocols layout.', owner: 'Security Architect' },
          { stage: 'EHR DB Scaffold', timeframe: 'Weeks 3–4', deliverable: 'Encrypted patient database schemas, access control tables.', owner: 'Backend Dev' },
          { stage: 'Patient UI Portals', timeframe: 'Weeks 5–6', deliverable: 'Record viewers, doctor directory lists, calendar UI.', owner: 'Frontend Dev' },
          { stage: 'Video Call Integrations', timeframe: 'Weeks 7–10', deliverable: 'WebRTC calls, encrypted digital prescriptions live.', owner: 'Full-stack Team' },
          { stage: 'Security Audit & Pen Tests', timeframe: 'Week 11', deliverable: 'HIPAA verification scan reports, database security reviews.', owner: 'QA Specialist' },
          { stage: 'Production Beta Launch', timeframe: 'Week 12', deliverable: 'E2EE launch with pilot clinics, monitoring setups.', owner: 'DevOps + PM' },
          { stage: 'FHIR Integration scaling', timeframe: 'Month 4+', deliverable: 'Epic/Cerner system connectors setup, insurance integrations.', owner: 'Full Team' }
        ],
        criticalPath: 'Patient records database encryption. EHR view permissions must block any frontend calls until doctor role keys are validated.',
        riskFlags: [
          'Regulatory compliance verification bottlenecks.',
          'HL7/FHIR data translation mismatch errors.',
          'Video streaming latency on mobile nodes.'
        ],
        recommendedTeamSize: '1 PM, 1 Security Architect, 1 Senior Backend Developer, 1 Frontend Developer, 1 QA Security Specialist.'
      },
      functionalRequirements: [
        'Patients must be able to view their medical history records via a secure portal.',
        'Doctors must be able to log diagnosis findings and dispense digital prescriptions.',
        'System must establish peer-to-peer encrypted video consultations.',
        'E-prescriptions must carry verification signatures from prescribing doctors.',
        'Patients must receive text reminders ahead of upcoming consultations.',
        'Billing modules must process credit cards and compile insurance claim details.',
        'The system must record tamper-proof audit trails for every access event.',
        'Administrators must be able to manage doctor credentials verification logs.'
      ],
      nonFunctionalRequirements: {
        performance: 'Video feed latency must not exceed 100ms RTT; EHR record loads must execute under 300ms.',
        security: 'EHR database must enforce row-level AES-256 encryption; token keys must rotate every hour.',
        scalability: 'Infrastructure must scale up to 10,000 concurrent patient video streams.',
        availability: 'Maintain a 99.99% system availability SLA given critical patient care requirements.',
        compliance: 'Fully certified for HIPAA, SOC2 Type II, and HITECH requirements.'
      },
      spinoff: {
        name: 'PrescribeSign',
        description: 'A cryptographic document signing API for doctors to authenticate digital prescriptions.',
        useCase: 'Securing prescription verification in external clinic portals.',
        uniqueness: 'Uses browser-native hardware key elements to generate signatures, preventing credential forgery.'
      }
    };
  }

  // 3. FinTech / Payments / Web3
  if (
    queryLower.includes('finance') ||
    queryLower.includes('payment') ||
    queryLower.includes('trading') ||
    queryLower.includes('crypto') ||
    queryLower.includes('wallet') ||
    queryLower.includes('stock') ||
    queryLower.includes('ledger') ||
    queryLower.includes('bank')
  ) {
    return {
      id: `brief-${Math.floor(Math.random() * 1000)}`,
      title: `${titleClean} — FinTech Advisory Report`,
      description: query,
      techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Stripe Connect', 'PCI-DSS Framework'],
      estimatedCost: '$30,000 - $55,000',
      estimatedTimeline: '8 - 12 weeks',
      overview: `A high-throughput financial framework built for "${titleClean}". It implements double-entry bookkeeping, Stripe Connect payout integrations, multi-tenant billing elements, and PCI-compliant database layouts.`,
      pros: [
        'Double-entry ledgers eliminate balance reconciliation errors.',
        'Stripe Connect automates split fees and payouts for vendor ecosystems.',
        'Strict transaction isolations protect against concurrent billing collisions.'
      ],
      cons: [
        'High chargeback and fraud liabilities on live payment networks.',
        'Complex regional tax calculations require external tax engine syncs.',
        'PCI-DSS compliance requires isolated hosting networks.'
      ],
      crossIdeas: [
        { title: 'AI Fraud Detector', explanation: 'Using real-time telemetry to check transaction patterns and automatically flag suspicious activities.' },
        { title: 'TaxEngine Link', explanation: 'A standalone service that calculates VAT/Sales Tax on checkouts depending on buyer locations.' },
        { title: 'Decentralized Escrow Contract', explanation: 'Using smart contracts to hold funds in escrow until digital deliverables are verified.' }
      ],
      implementationPlan: {
        phase1: {
          title: 'Phase 1 — MVP double-entry Ledger',
          features: [
            'Strict double-entry database schemas.',
            'User profiles with secure balance tracking.',
            'Internal transaction API routes.'
          ],
          techStack: ['React', 'PostgreSQL', 'Express']
        },
        phase2: {
          title: 'Phase 2 — Payment Gateway Integration',
          features: [
            'Stripe Checkout card payment elements.',
            'Webhook processors for payment success/declines.',
            'PDF invoice generators.'
          ],
          techStack: ['Stripe API', 'Node.js', 'AWS Lambda']
        },
        phase3: {
          title: 'Phase 3 — Stripe Connect splits',
          features: [
            'Onboard vendors using Stripe Connect onboarding.',
            'Split fees dynamically and automate seller payouts.',
            'Advanced financial analytics dashboards.'
          ],
          techStack: ['Stripe Connect', 'Redis', 'Chart.js']
        }
      },
      implementationRoadmap: {
        stages: [
          { stage: 'Financial Logic Mapping', timeframe: 'Weeks 1–2', deliverable: 'Bookkeeping ledger layouts, payment transaction schemas.', owner: 'FinTech PM + Architect' },
          { stage: 'Ledger DB Scaffold', timeframe: 'Weeks 3–4', deliverable: 'Double-entry transaction tables, balance constraint logs.', owner: 'Backend Dev' },
          { stage: 'Checkout UI Portals', timeframe: 'Weeks 5–6', deliverable: 'Stripe elements checkout form, transactions history list.', owner: 'Frontend Dev' },
          { stage: 'Connect splits Build', timeframe: 'Weeks 7–10', deliverable: 'Stripe Connect sync, webhook queue, automated splits live.', owner: 'Full-stack Team' },
          { stage: 'Stress & Fraud Tests', timeframe: 'Week 11', deliverable: 'Double-spend concurrency tests, payment retry queue audits.', owner: 'QA Engineer' },
          { stage: 'Production Launch', timeframe: 'Week 12', deliverable: 'PCI-compliant production launch, live gateway monitoring.', owner: 'DevOps + PM' },
          { stage: 'Tax Sync & Localizations', timeframe: 'Month 4+', deliverable: 'Tax engine integrations, international currency payouts.', owner: 'Full Team' }
        ],
        criticalPath: 'Double-entry database balance constraints. Stripe checkout and webhook updates are blocked until the core ledger database validations pass.',
        riskFlags: [
          'Concurrrent balance update deadlocks.',
          'Merchant onboarding verification friction.',
          'Chargeback charge reserves thresholds.'
        ],
        recommendedTeamSize: '1 Product Manager, 1 Senior Payment Engineer, 1 React Developer, 1 Financial compliance QA.'
      },
      functionalRequirements: [
        'Users must be able to link cards and execute checkout transactions.',
        'Sellers must be able to register and receive payouts via Stripe Connect.',
        'System must handle double-entry ledger bookkeeping for all movements.',
        'Platform must listen to payment webhook events and handle failures.',
        'Customers must receive automated PDF transaction invoices.',
        'Sellers must be able to view gross sales, net earnings, and platform fee metrics.',
        'System must allow partial or complete refunds with automatic ledger adjustments.',
        'The system must automatically flag transactions exceeding custom fraud values.'
      ],
      nonFunctionalRequirements: {
        performance: 'Transactions ledger writes must compile under 100ms; checkout elements must load under 1s.',
        security: 'PCI-DSS Level 1 compliance; encrypt bank account and routing logs in DB.',
        scalability: 'System must handle up to 1,000 billing requests per second without ledger latency.',
        availability: 'Uptime for billing pipelines must target 99.99% operational goals.',
        compliance: 'Fully compliant with AML, KYC regulations, and PCI standards.'
      },
      spinoff: {
        name: 'SplitFlow',
        description: 'An API SDK that simplifies dynamic commission splits across credit card and ACH gateways.',
        useCase: 'Adding complex seller payouts to custom marketplaces.',
        uniqueness: 'Automatically handles dynamic splits, escrow holds, and payment retries under one simplified dashboard.'
      }
    };
  }

  // 4. EdTech / LMS / Learning Systems
  if (
    queryLower.includes('education') ||
    queryLower.includes('learning') ||
    queryLower.includes('student') ||
    queryLower.includes('classroom') ||
    queryLower.includes('school') ||
    queryLower.includes('course')
  ) {
    return {
      id: `brief-${Math.floor(Math.random() * 1000)}`,
      title: `${titleClean} — EdTech Advisory Report`,
      description: query,
      techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Mux Video', 'GraphQL'],
      estimatedCost: '$20,000 - $32,000',
      estimatedTimeline: '6 - 10 weeks',
      overview: `A high-performance educational portal architecture designed for "${titleClean}". It features video lecture encoding streaming (via Mux Video), student progress tracking, interactive quizzes, and course completion certificate builders.`,
      pros: [
        'Adaptive HLS video streaming adjusts video quality to prevent buffering on slow student connections.',
        'Granular student progress tracking stores exact lecture stop times.',
        'Interactive quiz configurations test student understanding dynamically.'
      ],
      cons: [
        'High video hosting and bandwidth delivery expenses.',
        'Complex UI requirements for interactive classroom components.',
        'Ensuring secure data isolation between student and teacher dashboards.'
      ],
      crossIdeas: [
        { title: 'AI Quiz Builder', explanation: 'Using AI to parse transcripts of video lectures and auto-generate student quizzes.' },
        { title: 'Secure Certificate Minting', explanation: 'Issuing verifiable, tamper-proof completion certificates using digital cryptosystems.' },
        { title: 'Student engagement tracker', explanation: 'Analyzing click patterns to monitor student focus during online courses.' }
      ],
      implementationPlan: {
        phase1: {
          title: 'Phase 1 — Course Catalogs & Onboarding',
          features: [
            'Student/Teacher registration portals.',
            'Course creation pipelines with text layout updates.',
            'Simple module lists and catalog searches.'
          ],
          techStack: ['React', 'TypeScript', 'PostgreSQL']
        },
        phase2: {
          title: 'Phase 2 — Video Streaming & Progress Sync',
          features: [
            'Mux Video API integration to upload and encode video files.',
            'Student progress tracker mapping watch times in real-time.',
            'Responsive quiz widgets.'
          ],
          techStack: ['Mux API', 'Node.js', 'Express']
        },
        phase3: {
          title: 'Phase 3 — Certificates & Billing Hubs',
          features: [
            'Course completion certificate generation.',
            'Stripe subscription checkout for premium course access.',
            'Teacher revenue-share analytics dashboard.'
          ],
          techStack: ['Stripe', 'PDFKit', 'Chart.js']
        }
      },
      implementationRoadmap: {
        stages: [
          { stage: 'Course Flow Planning', timeframe: 'Weeks 1–2', deliverable: 'Quiz schemas, video streaming pipeline architecture.', owner: 'LMS Specialist' },
          { stage: 'DB Schema Scaffold', timeframe: 'Weeks 3–4', deliverable: 'Course logs, student progress, quiz database tables.', owner: 'Backend Dev' },
          { stage: 'Student Dashboard UI', timeframe: 'Weeks 5–6', deliverable: 'Interactive course players, catalog cards, progress UI.', owner: 'Frontend Dev' },
          { stage: 'Video & Quiz build', timeframe: 'Weeks 7–10', deliverable: 'Mux stream player, quiz widgets, progress auto-sync live.', owner: 'Full-stack Team' },
          { stage: 'HLS Load & Video Testing', timeframe: 'Week 11', deliverable: 'Buffering test logs on 3G networks, quiz validation audits.', owner: 'QA Engineer' },
          { stage: 'MVP Course Launch', timeframe: 'Week 12', deliverable: 'Production deployment, live pilot launch with initial courses.', owner: 'DevOps + PM' },
          { stage: 'Certificates & Subscriptions', timeframe: 'Month 4+', deliverable: 'PDF cert builders, Stripe subscription payment gateway.', owner: 'Full Team' }
        ],
        criticalPath: 'Student progress watch-time database constraints. Course completion triggers are blocked until the video watch logs are validated.',
        riskFlags: [
          'Bandwidth cost spikes during video delivery.',
          'State sync drop-offs on mobile connection failures.',
          'Video transcoding queue backlogs.'
        ],
        recommendedTeamSize: '1 Product Manager, 1 Video Pipeline Developer, 1 React Developer, 1 QA Specialist.'
      },
      functionalRequirements: [
        'Students must be able to search for courses and enroll in catalogs.',
        'Teachers must be able to upload video lectures and draft course content.',
        'System must track student progress (watch times) in video files.',
        'Students must complete interactive quizzes to unlock subsequent modules.',
        'System must auto-generate completion certificates with verification QR codes.',
        'Students must be able to buy courses via credit card or subscriptions.',
        'The platform must stream video adapting to user network speeds.',
        'Teachers must be able to view course ratings and gross revenue metrics.'
      ],
      nonFunctionalRequirements: {
        performance: 'Video stream initialization must load under 1.5 seconds; quiz responses must evaluate under 100ms.',
        security: 'Secure media paths to prevent unauthorized video scraping or downloads.',
        scalability: 'Support up to 20,000 active students streaming HLS video concurrently.',
        availability: 'LMS dashboard availability must maintain 99.9% uptime SLA.',
        compliance: 'GDPR compliant for student progress records; COPPA compliant if targeting children.'
      },
      spinoff: {
        name: 'StreamProof',
        description: 'An embeddable API widget that tracks and verifies active viewer watch logs in streaming video.',
        useCase: 'Adding certified video training tracking to compliance platforms.',
        uniqueness: 'Detects active window tab focus and keyboard telemetry to verify the student is actually watching.'
      }
    };
  }

  // Generic SaaS Platform (Fallback)
  return {
    id: `brief-${Math.floor(Math.random() * 1000)}`,
    title: `${titleClean} — Enterprise SaaS Brief`,
    description: query,
    techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'Redis'],
    estimatedCost: '$22,000 - $38,000',
    estimatedTimeline: '6 - 10 weeks',
    overview: `A specialized technical architecture custom-tailored for the "${titleClean}" platform request. The system implements a modern, secure microservice blueprint designed to support robust domain-specific workflows and transaction flows.`,
    pros: [
      `Highly scalable domain model specifically optimized for ${titleClean} operations.`,
      'Modern React + TypeScript frontend structure guarantees high developer velocity and interface performance.',
      'Decoupled client-server architecture allows independent horizontal scaling of frontend assets and database writes.'
    ],
    cons: [
      `Requires highly granular access control checks to protect sensitive ${titleClean} user profiles.`,
      'System-wide reporting workflows require optimized secondary read-replicas to prevent main database locks.',
      'Establishing clean cross-component state updates introduces front-end complexity.'
    ],
    crossIdeas: [
      { title: `Serverless ${titleClean.replace(/\s+/g, '')} Workers`, explanation: `Deploying key gateway handlers to edge workers to minimize global RTT and latency for all ${titleClean} locations.` },
      { title: 'Zero-Knowledge Compliance Vault', explanation: 'Using client-side cryptosystems to store sensitive customer payloads without exposing them to database files.' },
      { title: 'OpenAPI-Driven API Clients', explanation: 'Generating type-safe client fetching packages directly from shared spec files to ensure API alignment.' }
    ],
    implementationPlan: {
      phase1: {
        title: `Phase 1 — MVP & Core ${titleClean} Scaffold`,
        features: [
          `Implement basic role-based user logins and secure workspace controls.`,
          `Design Postgres tables mapping core workflows for ${titleClean}.`,
          `Establish primary database reads and write gateways.`
        ],
        techStack: ['React', 'TypeScript', 'Express', 'Supabase']
      },
      phase2: {
        title: 'Phase 2 — Real-time Events & Cache Optimizations',
        features: [
          `Setup Redis caches to offload common query calls.`,
          'Build real-time socket connections to broadcast live workflow alerts.',
          'Deploy async background worker queues to process export datasets.'
        ],
        techStack: ['Redis', 'Socket.io', 'Node.js', 'Docker']
      },
      phase3: {
        title: 'Phase 3 — Multi-Tenant Features & Integrations',
        features: [
          'Integrate Stripe Connect to handle vendor commissions and subscriptions.',
          `Build responsive dashboards visualizing transactional KPIs.`,
          'Deploy SOC2-compliant system monitoring logs and diagnostics.'
        ],
        techStack: ['Stripe', 'Chart.js', 'AWS ECS', 'CloudWatch']
      }
    },
    implementationRoadmap: {
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
    },
    functionalRequirements: [
      `Users must be able to log in securely and customize profile settings.`,
      `Administrators must be able to audit and update all platform records.`,
      `The API must expose clean REST endpoints with JWT authorization checks.`,
      'Users must be able to export historical reports in CSV or PDF formats.',
      `The platform must synchronize status feeds in real-time across active sessions.`,
      `Automated triggers must dispatch notification messages on specific state triggers.`
    ],
    nonFunctionalRequirements: {
      performance: 'API endpoints must return responses within 200ms; sub-50ms query speeds via cache pools.',
      security: 'All network paths must enforce TLS 1.3; data at rest must use AES-256-GCM encryption.',
      scalability: 'Gateway infrastructure must support up to 5,000 concurrent active connections.',
      availability: 'The service must maintain 99.9% uptime SLA metrics.',
      compliance: 'Fully GDPR compliant for user data erasure and SOC2 ready.'
    },
    spinoff: {
      name: `${titleClean.replace(/[^a-zA-Z0-9]/g, '')}Sync`,
      description: `A standalone event-driven synchronization gateway designed to link ${titleClean} records with external CRM systems.`,
      useCase: `Syncing live operations with external back-office accounting platforms.`,
      uniqueness: `Employs real-time deduplication and retry queues to resolve transactional conflicts on the fly.`
    }
  };
};
