-- ====================================================
-- DEVNEXUS DATABASE SCHEMA & SEED DATA
-- Run this in your Supabase SQL Editor to set up.
-- ====================================================

-- 1. DEVELOPERS REGISTRY TABLE
CREATE TABLE IF NOT EXISTS public.developers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    avatar TEXT NOT NULL,
    bio TEXT NOT NULL,
    skills TEXT[] NOT NULL,
    hourly_rate INTEGER NOT NULL,
    availability TEXT NOT NULL,
    rating NUMERIC(3, 2) NOT NULL,
    reviews_count INTEGER NOT NULL,
    git_username TEXT NOT NULL,
    niche TEXT NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.developers ENABLE ROW LEVEL SECURITY;

-- Select policy (Public read access)
CREATE POLICY "Allow public read access to developers" 
ON public.developers FOR SELECT 
USING (true);

-- 2. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    developer_id TEXT REFERENCES public.developers(id) ON DELETE CASCADE,
    reviewer TEXT NOT NULL,
    rating NUMERIC(2, 1) NOT NULL,
    comment TEXT NOT NULL,
    date TEXT NOT NULL
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to reviews" 
ON public.reviews FOR SELECT 
USING (true);

-- 3. GITHUB REPOS TABLE
CREATE TABLE IF NOT EXISTS public.github_repos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    developer_id TEXT REFERENCES public.developers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    stars INTEGER NOT NULL DEFAULT 0,
    forks INTEGER NOT NULL DEFAULT 0,
    language TEXT NOT NULL
);

ALTER TABLE public.github_repos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to github repos" 
ON public.github_repos FOR SELECT 
USING (true);

-- 4. PROJECT HISTORY TABLE
CREATE TABLE IF NOT EXISTS public.project_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    developer_id TEXT REFERENCES public.developers(id) ON DELETE CASCADE,
    client TEXT NOT NULL,
    project_name TEXT NOT NULL,
    duration TEXT NOT NULL,
    rating NUMERIC(2,1) NOT NULL,
    feedback TEXT NOT NULL
);

ALTER TABLE public.project_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to history" 
ON public.project_history FOR SELECT 
USING (true);

-- 5. AI SOFTWARE BRIEFS TABLE
CREATE TABLE IF NOT EXISTS public.briefs (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    tech_stack TEXT[] NOT NULL,
    estimated_cost TEXT NOT NULL,
    estimated_timeline TEXT NOT NULL,
    architecture TEXT NOT NULL,
    features TEXT[] NOT NULL,
    risks JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.briefs ENABLE ROW LEVEL SECURITY;

-- Owner security policy: Only the authenticated creator can view and manage their briefs
CREATE POLICY "Users can manage their own briefs" 
ON public.briefs FOR ALL 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 6. SECURE ROOMS HANDSHAKE METADATA
CREATE TABLE IF NOT EXISTS public.rooms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    access_code TEXT UNIQUE NOT NULL,
    party_a TEXT NOT NULL,
    party_b TEXT NOT NULL,
    nda_signed_a BOOLEAN DEFAULT false,
    nda_signed_b BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

-- Rooms read/write policy (Required for WebRTC handshake signaling)
CREATE POLICY "Allow authenticated rooms management"
ON public.rooms FOR ALL
USING (true)
WITH CHECK (true);

-- ====================================================
-- SEED DATA POPULATIONS
-- ====================================================

-- 1. Insert Developers
INSERT INTO public.developers (id, name, title, avatar, bio, skills, hourly_rate, availability, rating, reviews_count, git_username, niche, verified)
VALUES 
('dev-001', 'Alex Rivers', 'Full Stack & WebRTC Expert', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80', 'Specialist in real-time collaboration applications, WebRTC communication channels, and secure document sharing rooms. Over 8 years of experience building secure B2B SaaS platforms.', ARRAY['React', 'Node.js', 'WebRTC', 'TypeScript', 'Supabase', 'Socket.io', 'Tailwind', 'PostgreSQL'], 115, 'Available Now', 4.90, 24, 'alexrivers-dev', 'WebRTC & SaaS Infrastructure', true),
('dev-002', 'Priya Sharma', 'AI Architect & RAG Integrator', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80', 'Passionate about integrating Large Language Models into enterprise workflows. Expertise in Retrieval-Augmented Generation (RAG), vector databases, and custom Claude/GPT application nodes.', ARRAY['Python', 'FastAPI', 'React', 'LangChain', 'PostgreSQL', 'TypeScript', 'Pinecone', 'Anthropic API', 'OpenAI API'], 135, 'In 1 Week', 5.00, 18, 'priyasharma-ai', 'AI Agents & LLM Integrations', true),
('dev-003', 'Marcus Vance', 'Security & Cryptography Architect', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', 'Security researcher and backend engineer focusing on zero-knowledge systems, data privacy compliance (SOC2/GDPR), and highly secure enterprise authentication layers.', ARRAY['Rust', 'Node.js', 'Go', 'Cryptography', 'AWS Security', 'Docker', 'PostgreSQL', 'Redis'], 150, 'In 2 Weeks', 4.85, 31, 'marcus-v-security', 'Security Auditing & Private Backends', true),
('dev-004', 'Chloe Zhao', 'Senior UI/UX & React Engineer', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', 'Focused on creating high-performance, visually stunning React interfaces with smooth transitions, interactive data charts, and consistent token-based design systems.', ARRAY['React', 'Next.js', 'TypeScript', 'Framer Motion', 'Tailwind', 'CSS Modules', 'Figma', 'GraphQL'], 95, 'Available Now', 4.95, 42, 'chloez-design', 'High-Fidelity UI & Frontend Animation', false),
('dev-005', 'Kenji Sato', 'Cloud Architect & Backend Lead', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', 'Specialist in scaling database operations, high-throughput APIs, Docker/Kubernetes container orchestration, and real-time state synchronizations.', ARRAY['Go', 'Docker', 'Kubernetes', 'PostgreSQL', 'Redis', 'GraphQL', 'gRPC', 'Supabase', 'Node.js'], 125, 'Available Now', 4.92, 29, 'kenji-sato-dev', 'Scalable Backends & Cloud Infrastructure', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Seed Repo details
INSERT INTO public.github_repos (developer_id, name, stars, forks, language)
VALUES
('dev-001', 'webrtc-secure-mesh', 142, 28, 'TypeScript'),
('dev-001', 'react-ephemeral-chat', 98, 12, 'React'),
('dev-001', 'supabase-auth-hooks', 54, 6, 'JavaScript'),
('dev-002', 'agentic-rag-router', 324, 52, 'Python'),
('dev-002', 'claude-context-optimizer', 215, 19, 'Python'),
('dev-003', 'zk-proofs-rust-wasm', 412, 34, 'Rust'),
('dev-003', 'express-secure-shield', 189, 22, 'JavaScript'),
('dev-004', 'framer-motion-presets', 1205, 94, 'TypeScript'),
('dev-004', 'interactive-charts-canvas', 243, 19, 'TypeScript'),
('dev-005', 'go-distributed-cache', 489, 61, 'Go'),
('dev-005', 'postgres-auto-sharder', 395, 45, 'Go')
ON CONFLICT DO NOTHING;

-- 3. Seed History
INSERT INTO public.project_history (developer_id, client, project_name, duration, rating, feedback)
VALUES
('dev-001', 'DocuTrust Inc.', 'E2E Document Deal Room', '3 months', 5.0, 'Alex delivered our encrypted contract signature room ahead of schedule. Exceptional WebRTC knowledge.'),
('dev-001', 'HypeStream Inc.', 'Realtime Multi-party Video Hub', '5 months', 4.8, 'Great communication and robust architecture. Solved tricky audio echo issues with ease.'),
('dev-002', 'LegalBriefs LLC', 'Automated NDA Contract Analyzer', '2 months', 5.0, 'Priya helped us automate analysis of commercial NDAs. Our review speed increased by 300%.'),
('dev-003', 'SafeVault Financial', 'SOC2 Security Audit & Remediation', '4 months', 4.9, 'Marcus successfully guided us through our SOC2 audit, patching multiple microservice leaks.'),
('dev-004', 'Velo Dashboard', 'SaaS Business Analytics Portal', '3 months', 5.0, 'Chloe completely redesigned our analytics UI. Customer satisfaction scores jumped by 40%.'),
('dev-005', 'TradeSphere Corp', 'Realtime Stock Ledger Backend', '5 months', 5.0, 'Kenji migrated our legacy ledger to a Go-based microservice architecture, handling 50k requests/sec.')
ON CONFLICT DO NOTHING;

-- 4. Seed Reviews
INSERT INTO public.reviews (developer_id, reviewer, rating, comment, date)
VALUES
('dev-001', 'Sarah K., CTO DocuTrust', 5.0, 'Phenomenal work on our secure rooms. A rare engineer who understands both WebRTC complexity and clean React frontend design.', '2026-05-12'),
('dev-001', 'David L., Director of Eng at HypeStream', 4.8, 'Very skilled with WebSocket architectures and low latency connections. Highly recommended.', '2026-03-24'),
('dev-002', 'Jason W., Founder LegalBriefs', 5.0, 'Priya has deep knowledge of vector search and prompt engineering. She helped us build a compliant contract analysis agent.', '2026-06-02'),
('dev-003', 'Robert C., CISO SafeVault', 4.9, 'Exceptional security mindset. Marcus did not just advise, he wrote robust Rust wrappers that eliminated memory leaks and potential buffer overflows.', '2026-04-18'),
('dev-004', 'Emily T., Lead Designer Velo', 5.0, 'Chloe translates Figma prototypes into React code pixel-for-pixel, and her motion choreographies are absolutely beautiful.', '2026-05-30')
ON CONFLICT DO NOTHING;

-- 5. Profiles Table (Stores user signup details)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY,
    email TEXT NOT NULL,
    role TEXT NOT NULL,
    company_name TEXT,
    corporate_title TEXT,
    project_budget NUMERIC,
    full_name TEXT,
    key_skills TEXT,
    experience_level TEXT,
    portfolio_link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert to profiles" 
ON public.profiles FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public read access to profiles" 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "Allow update for profile owners" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Seed default profiles for demonstration
INSERT INTO public.profiles (id, email, role, company_name, corporate_title, project_budget, full_name, key_skills, experience_level, portfolio_link)
VALUES
('00000000-0000-0000-0000-000000000001', 'admin@devnexus.local', 'admin', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('00000000-0000-0000-0000-000000000002', 'client@devnexus.local', 'client', 'Nexus Capital', 'Managing Partner', 150000, NULL, NULL, NULL, NULL),
('00000000-0000-0000-0000-000000000003', 'developer@devnexus.local', 'developer', NULL, NULL, NULL, 'Alex Rivers', 'React, WebRTC, Node.js', 'senior', 'https://github.com/alexrivers'),
('00000000-0000-0000-0000-000000000004', 'chloe.zhao@devnexus.local', 'developer', NULL, NULL, NULL, 'Chloe Zhao', 'React, Next.js, Framer Motion', 'senior', 'https://github.com/chloez-design'),
('00000000-0000-0000-0000-000000000005', 'john.founder@acme.com', 'client', 'Acme Corp', 'CEO & Founder', 35000, NULL, NULL, NULL, NULL)
ON CONFLICT (id) DO NOTHING;
