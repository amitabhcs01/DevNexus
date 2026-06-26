import React from 'react';
import { Target, TrendingUp, Shield, Cpu, Users, Calendar, ArrowRight, Award, Zap, EyeOff } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (module: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="landing-container" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: '48px', position: 'relative' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '20px',
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          color: '#60a5fa',
          fontSize: '14px',
          fontWeight: 500,
          marginBottom: '16px'
        }}>
          <Zap size={14} /> Version 1.0 • Investor Pitch Platform
        </div>
        <h1 style={{
          fontSize: '48px',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #ffffff 40%, #a5b4fc 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '12px',
          letterSpacing: '-0.03em'
        }}>
          DEVNEXUS
        </h1>
        <p style={{
          fontSize: '20px',
          color: '#3b82f6',
          fontStyle: 'italic',
          fontWeight: 400,
          marginBottom: '32px'
        }}>
          The Intelligence Layer Between Businesses & Builders
        </p>

        {/* 3 Metrics Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          maxWidth: '900px',
          margin: '0 auto 40px auto'
        }}>
          <div className="glass-card" style={{ padding: '24px', textAlign: 'center', borderLeft: '4px solid #3b82f6' }}>
            <h3 style={{ fontSize: '32px', color: '#60a5fa', fontWeight: 800, marginBottom: '4px' }}>3-in-1</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>Unified SaaS Platform</p>
          </div>
          <div className="glass-card" style={{ padding: '24px', textAlign: 'center', borderLeft: '4px solid #10b981' }}>
            <h3 style={{ fontSize: '32px', color: '#34d399', fontWeight: 800, marginBottom: '4px' }}>$240B+</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>Addressable Market</p>
          </div>
          <div className="glass-card" style={{ padding: '24px', textAlign: 'center', borderLeft: '4px solid #f97316' }}>
            <h3 style={{ fontSize: '32px', color: '#fb923c', fontWeight: 800, marginBottom: '4px' }}>Month 1</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>Revenue Ready Architecture</p>
          </div>
        </div>
      </div>

      {/* Main Core Modules Call-To-Action Cards */}
      <div style={{ marginBottom: '56px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '24px', textAlign: 'center' }}>Explore Platform Capabilities</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {/* Module 1 Card */}
          <div className="glass-card shimmer" style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'inline-flex', padding: '12px', borderRadius: '12px', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', marginBottom: '20px' }}>
                <Cpu size={24} />
              </div>
              <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Module 1: Software Advisory Hub</h3>
              <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
                Founders input product ideas in plain English. Our AI Solution Architect instantly scopes, compiles standard tech stacks, generates estimated budgets and timelines, and recommends paths forward.
              </p>
            </div>
            <button
              onClick={() => onNavigate('advisory')}
              className="btn-glow-blue"
              style={{
                background: '#3b82f6',
                color: '#fff',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Consult AI Architect <ArrowRight size={16} />
            </button>
          </div>

          {/* Module 2 Card */}
          <div className="glass-card shimmer" style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'inline-flex', padding: '12px', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', color: '#10b981', marginBottom: '20px' }}>
                <Users size={24} />
              </div>
              <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Module 2: Developer Network</h3>
              <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
                LinkedIn-style verified talent ecosystem. Explore developer profiles, visualize skill graphs, and run the 4-part scoring algorithm to match developers based on skills, availability, and budgets.
              </p>
            </div>
            <button
              onClick={() => onNavigate('marketplace')}
              className="btn-glow-green"
              style={{
                background: '#10b981',
                color: '#fff',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Explore Network <ArrowRight size={16} />
            </button>
          </div>

          {/* Module 3 Card */}
          <div className="glass-card shimmer" style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'inline-flex', padding: '12px', borderRadius: '12px', background: 'rgba(139,92,246,0.1)', color: '#8b5cf6', marginBottom: '20px' }}>
                <EyeOff size={24} />
              </div>
              <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Module 3: Private B2B Deal Room</h3>
              <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
                Zero-knowledge, end-to-end encrypted rooms for client-contractor negotiations. Auto-generate customized NDAs, sign digitally, share documents, call peers, and execute a cryptographic data purge on close.
              </p>
            </div>
            <button
              onClick={() => onNavigate('dealroom')}
              className="btn-glow-purple"
              style={{
                background: '#8b5cf6',
                color: '#fff',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Initialize Deal Room <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Problem We Solve Grid */}
      <div className="glass-card" style={{ padding: '32px', marginBottom: '56px' }}>
        <h2 style={{ fontSize: '22px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Target size={20} color="#3b82f6" /> The Problem We Solve
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>The Problem</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Who Suffers</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: '#60a5fa' }}>DevNexus Solution</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '16px', fontSize: '14px' }}>No trusted way to find vetted developers</td>
                <td style={{ padding: '16px', fontSize: '14px', color: '#94a3b8' }}>Startups, SMBs, Enterprises</td>
                <td style={{ padding: '16px', fontSize: '14px', fontWeight: 500, color: '#34d399' }}>AI-matched developer marketplace with verified profiles</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '16px', fontSize: '14px' }}>Tech advice is expensive & inaccessible</td>
                <td style={{ padding: '16px', fontSize: '14px', color: '#94a3b8' }}>Non-tech founders, small businesses</td>
                <td style={{ padding: '16px', fontSize: '14px', fontWeight: 500, color: '#34d399' }}>On-demand software advisory hub with AI + human experts</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '16px', fontSize: '14px' }}>B2B deals lack privacy & data security</td>
                <td style={{ padding: '16px', fontSize: '14px', color: '#94a3b8' }}>Enterprises, agencies, corporates</td>
                <td style={{ padding: '16px', fontSize: '14px', fontWeight: 500, color: '#34d399' }}>End-to-end encrypted zero-data private deal rooms</td>
              </tr>
              <tr>
                <td style={{ padding: '16px', fontSize: '14px' }}>Developers have no niche-focused network</td>
                <td style={{ padding: '16px', fontSize: '14px', color: '#94a3b8' }}>Freelancers, dev agencies</td>
                <td style={{ padding: '16px', fontSize: '14px', fontWeight: 500, color: '#34d399' }}>LinkedIn-style network with project history & skill graph</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Core Values */}
      <div style={{ marginBottom: '56px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '24px', textAlign: 'center' }}>Our Core Pillars</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'inline-flex', padding: '10px', borderRadius: '10px', background: 'rgba(16,185,129,0.1)', color: '#10b981', marginBottom: '16px' }}>
              <Shield size={20} />
            </div>
            <h4 style={{ fontSize: '16px', marginBottom: '8px' }}>Trust First</h4>
            <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: 1.5 }}>Every developer is verified, portfolios are audited, and deal rooms are secure.</p>
          </div>
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'inline-flex', padding: '10px', borderRadius: '10px', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', marginBottom: '16px' }}>
              <Zap size={20} />
            </div>
            <h4 style={{ fontSize: '16px', marginBottom: '8px' }}>Speed Over Complexity</h4>
            <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: 1.5 }}>AI-matching in under 60 seconds. Plain English query to full project design instantly.</p>
          </div>
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'inline-flex', padding: '10px', borderRadius: '10px', background: 'rgba(139,92,246,0.1)', color: '#8b5cf6', marginBottom: '16px' }}>
              <EyeOff size={20} />
            </div>
            <h4 style={{ fontSize: '16px', marginBottom: '8px' }}>Privacy by Design</h4>
            <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: 1.5 }}>Session logs and files are destroyed cryptographically immediately on close.</p>
          </div>
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'inline-flex', padding: '10px', borderRadius: '10px', background: 'rgba(249,115,22,0.1)', color: '#f97316', marginBottom: '16px' }}>
              <Award size={20} />
            </div>
            <h4 style={{ fontSize: '16px', marginBottom: '8px' }}>Developer Dignity</h4>
            <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: 1.5 }}>Vetted developers set their own rates. No bidding races, transparent pricing models.</p>
          </div>
        </div>
      </div>

      {/* Competitive Landscape */}
      <div className="glass-card" style={{ padding: '32px', marginBottom: '56px' }}>
        <h2 style={{ fontSize: '22px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={20} color="#10b981" /> Competitive Landscape
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>
                <th style={{ padding: '12px 16px' }}>Platform</th>
                <th style={{ padding: '12px 16px' }}>Dev Marketplace</th>
                <th style={{ padding: '12px 16px' }}>AI Advisory</th>
                <th style={{ padding: '12px 16px' }}>Private Deal Room</th>
                <th style={{ padding: '12px 16px' }}>Developer Network</th>
                <th style={{ padding: '12px 16px' }}>Pricing Model</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ background: 'rgba(59, 130, 246, 0.05)', borderBottom: '1px solid rgba(59, 130, 246, 0.2)' }}>
                <td style={{ padding: '16px', fontWeight: 600, color: '#60a5fa' }}>DevNexus</td>
                <td style={{ padding: '16px', color: '#10b981', fontWeight: 500 }}>✓ AI-Matched (Verified)</td>
                <td style={{ padding: '16px', color: '#10b981', fontWeight: 500 }}>✓ Full AI + Human</td>
                <td style={{ padding: '16px', color: '#10b981', fontWeight: 500 }}>✓ Zero-Knowledge</td>
                <td style={{ padding: '16px', color: '#10b981', fontWeight: 500 }}>✓ Full Skill Graph</td>
                <td style={{ padding: '16px', fontWeight: 500 }}>15% Comm + SaaS</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '16px', color: '#94a3b8' }}>Upwork</td>
                <td style={{ padding: '16px', color: '#e11d48' }}>Basic / Non-Vetted</td>
                <td style={{ padding: '16px', color: '#e11d48' }}>✗ None</td>
                <td style={{ padding: '16px', color: '#e11d48' }}>✗ None</td>
                <td style={{ padding: '16px', color: '#e11d48' }}>✗ Limited (Gigs only)</td>
                <td style={{ padding: '16px' }}>Commission only</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '16px', color: '#94a3b8' }}>Toptal</td>
                <td style={{ padding: '16px', color: '#10b981' }}>✓ Vetted Only</td>
                <td style={{ padding: '16px', color: '#e11d48' }}>✗ None</td>
                <td style={{ padding: '16px', color: '#e11d48' }}>✗ None</td>
                <td style={{ padding: '16px', color: '#e11d48' }}>✗ None</td>
                <td style={{ padding: '16px' }}>High commission</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '16px', color: '#94a3b8' }}>LinkedIn</td>
                <td style={{ padding: '16px', color: '#e11d48' }}>✗ No matching engine</td>
                <td style={{ padding: '16px', color: '#e11d48' }}>✗ None</td>
                <td style={{ padding: '16px', color: '#e11d48' }}>✗ None</td>
                <td style={{ padding: '16px', color: '#f59e0b' }}>✓ Partial Social</td>
                <td style={{ padding: '16px' }}>Subscription</td>
              </tr>
              <tr>
                <td style={{ padding: '16px', color: '#94a3b8' }}>Clarity.fm</td>
                <td style={{ padding: '16px', color: '#e11d48' }}>✗ None</td>
                <td style={{ padding: '16px', color: '#f59e0b' }}>✓ Partial Human</td>
                <td style={{ padding: '16px', color: '#e11d48' }}>✗ None</td>
                <td style={{ padding: '16px', color: '#e11d48' }}>✗ None</td>
                <td style={{ padding: '16px' }}>Per minute fee</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Roadmap */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '32px', textAlign: 'center' }}>Development Roadmap</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px'
        }}>
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ color: '#3b82f6', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
              <Calendar size={14} /> PHASE 1 • Weeks 1-4
            </div>
            <h4 style={{ fontSize: '16px', marginBottom: '8px' }}>Foundation & Launch</h4>
            <ul style={{ color: '#94a3b8', fontSize: '13px', paddingLeft: '16px', lineHeight: 1.6 }}>
              <li>Initialize Next.js / Supabase Schema</li>
              <li>Developer Profile & Tagging Engine</li>
              <li>AI Estimator and Basic Matching</li>
              <li>Stripe Payouts & Subscriptions</li>
            </ul>
          </div>
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ color: '#10b981', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
              <Calendar size={14} /> PHASE 2 • Weeks 5-8
            </div>
            <h4 style={{ fontSize: '16px', marginBottom: '8px' }}>Advisory & Reviews</h4>
            <ul style={{ color: '#94a3b8', fontSize: '13px', paddingLeft: '16px', lineHeight: 1.6 }}>
              <li>Claude-powered advisory chat</li>
              <li>Verified human expert schedule fallback</li>
              <li>Developer connection feed</li>
              <li>Verified client review badges</li>
            </ul>
          </div>
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ color: '#8b5cf6', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
              <Calendar size={14} /> PHASE 3 • Weeks 9-12
            </div>
            <h4 style={{ fontSize: '16px', marginBottom: '8px' }}>B2B Private Deal Room</h4>
            <ul style={{ color: '#94a3b8', fontSize: '13px', paddingLeft: '16px', lineHeight: 1.6 }}>
              <li>WebRTC E2E encrypted rooms</li>
              <li>AI NDA template generator & signature</li>
              <li>Ephemeral files & screen sharing</li>
              <li>Cryptographic log generation</li>
            </ul>
          </div>
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ color: '#f97316', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
              <Calendar size={14} /> PHASE 4 • Weeks 13-16
            </div>
            <h4 style={{ fontSize: '16px', marginBottom: '8px' }}>Scale & Mobile</h4>
            <ul style={{ color: '#94a3b8', fontSize: '13px', paddingLeft: '16px', lineHeight: 1.6 }}>
              <li>Earnings & project analytics dashboard</li>
              <li>Mobile React Native app shell</li>
              <li>Client & Dev referral loops</li>
              <li>Public launch & Series A prep</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
