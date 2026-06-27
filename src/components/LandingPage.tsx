import React from 'react';
import { Shield, Cpu, Users, ArrowRight, EyeOff, Lock, RefreshCw } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (module: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div style={{ background: '#080c14', color: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      {/* Top Navbar */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 4%',
        background: 'rgba(8, 12, 20, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            color: '#fff',
            borderRadius: '8px',
            padding: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Shield size={18} />
          </div>
          <span style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            DevNexus
          </span>
        </div>
        
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }} className="nav-links">
          <a href="#features" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px', fontWeight: 500, transition: '0.2s' }}>Features</a>
          <a href="#security" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px', fontWeight: 500, transition: '0.2s' }}>Security</a>
          <button 
            onClick={() => onNavigate('auth')}
            style={{
              background: 'transparent',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              color: '#60a5fa',
              padding: '8px 18px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '13.5px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            className="login-btn-nav"
          >
            Sign In
          </button>
          <button 
            onClick={() => onNavigate('auth')}
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              border: 'none',
              color: '#fff',
              padding: '8px 20px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '13.5px',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.2)'
            }}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header style={{
        padding: '100px 4% 80px 4%',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow orbs background */}
        <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '400px', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)', filter: 'blur(30px)', pointerEvents: 'none', zIndex: 0 }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '20px',
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            color: '#60a5fa',
            fontSize: '13px',
            fontWeight: 600,
            marginBottom: '24px'
          }}>
            <Lock size={12} /> Ephemeral Zero-Knowledge Enterprise Architecture
          </div>
          
          <h1 style={{
            fontSize: '56px',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.04em',
            background: 'linear-gradient(135deg, #ffffff 30%, #a5b4fc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '20px'
          }}>
            The Secure Agreement & Advisory Layer for Enterprise Collaboration
          </h1>
          
          <p style={{
            fontSize: '18px',
            color: '#94a3b8',
            maxWidth: '720px',
            margin: '0 auto 40px auto',
            lineHeight: 1.6
          }}>
            Collaborate on high-value B2B projects with complete peace of mind. Instantly scope stack architectures using AI, match with verified builders, and execute agreements inside zero-trace encrypted deal rooms.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => onNavigate('auth')}
              className="btn-glow-blue"
              style={{
                background: '#3b82f6',
                color: '#fff',
                border: 'none',
                padding: '14px 28px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              Initialize Deal Chamber <ArrowRight size={18} />
            </button>
            <button
              onClick={() => onNavigate('auth')}
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#cbd5e1',
                padding: '14px 28px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '15px',
                cursor: 'pointer',
                transition: '0.2s'
              }}
              className="btn-secondary-hero"
            >
              Consult AI Architect
            </button>
          </div>
        </div>
      </header>

      {/* Value Proposition Grid */}
      <section id="features" style={{ padding: '80px 4%', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '12px' }}>Platform Capabilities</h2>
          <p style={{ color: '#94a3b8', fontSize: '16px' }}>Three tightly integrated workspaces to construct, match, and close deals securely.</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '30px'
        }}>
          {/* Card 1 */}
          <div className="glass-card shimmer" style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '320px' }}>
            <div>
              <div style={{ display: 'inline-flex', padding: '12px', borderRadius: '12px', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', marginBottom: '20px' }}>
                <Cpu size={24} />
              </div>
              <h3 style={{ fontSize: '20px', marginBottom: '12px', color: '#f8fafc' }}>AI Software Advisory Hub</h3>
              <p style={{ color: '#94a3b8', fontSize: '14.5px', lineHeight: 1.6 }}>
                Translate plain English project descriptions into standard technical architectural layouts. Generate estimated budgets, microservice schemas, timeline intervals, and potential risk mitigator sheets instantly.
              </p>
            </div>
            <button onClick={() => onNavigate('auth')} style={{ background: 'transparent', border: 'none', color: '#60a5fa', fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', padding: 0, marginTop: '20px' }}>
              Consult AI Architect <ArrowRight size={16} />
            </button>
          </div>

          {/* Card 2 */}
          <div className="glass-card shimmer" style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '320px' }}>
            <div>
              <div style={{ display: 'inline-flex', padding: '12px', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', color: '#10b981', marginBottom: '20px' }}>
                <Users size={24} />
              </div>
              <h3 style={{ fontSize: '20px', marginBottom: '12px', color: '#f8fafc' }}>Verified Developer network</h3>
              <p style={{ color: '#94a3b8', fontSize: '14.5px', lineHeight: 1.6 }}>
                Access our audited repository of specialized builders. Explore interactive tech stack skill graphs, review verified client feedback trails, and evaluate developer billing rates.
              </p>
            </div>
            <button onClick={() => onNavigate('auth')} style={{ background: 'transparent', border: 'none', color: '#34d399', fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', padding: 0, marginTop: '20px' }}>
              Explore Network <ArrowRight size={16} />
            </button>
          </div>

          {/* Card 3 */}
          <div className="glass-card shimmer" style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '320px' }}>
            <div>
              <div style={{ display: 'inline-flex', padding: '12px', borderRadius: '12px', background: 'rgba(139,92,246,0.1)', color: '#8b5cf6', marginBottom: '20px' }}>
                <EyeOff size={24} />
              </div>
              <h3 style={{ fontSize: '20px', marginBottom: '12px', color: '#f8fafc' }}>Zero-Knowledge Deal Chambers</h3>
              <p style={{ color: '#94a3b8', fontSize: '14.5px', lineHeight: 1.6 }}>
                Collaborate inside secure rooms featuring dual digital signature verification, real-time WebRTC audio/video feeds, and version-controlled document uploads. Leaves zero databases trails.
              </p>
            </div>
            <button onClick={() => onNavigate('auth')} style={{ background: 'transparent', border: 'none', color: '#a78bfa', fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', padding: 0, marginTop: '20px' }}>
              Open Deal Chamber <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Security Deep Dive Section */}
      <section id="security" style={{ padding: '80px 4%', borderTop: '1px solid rgba(255,255,255,0.03)', background: 'rgba(14,20,34,0.3)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '50px', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', padding: '10px', borderRadius: '10px', background: 'rgba(139,92,246,0.1)', color: '#8b5cf6', marginBottom: '16px' }}>
              <Lock size={20} />
            </div>
            <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px', lineHeight: 1.2 }}>Zero-Trace Cryptographic Security Pillars</h2>
            <p style={{ color: '#94a3b8', fontSize: '15.5px', lineHeight: 1.6, marginBottom: '24px' }}>
              Standard SaaS systems record every message, invoice, and design file inside cloud databases permanently. DevNexus reframes security by providing secure chambers designed to self-destruct upon completion.
            </p>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
                <CheckCircleIcon color="#10b981" />
                <div>
                  <h4 style={{ fontSize: '15px', color: '#f8fafc', marginBottom: '4px' }}>ECDH Tunnel Encryption</h4>
                  <p style={{ color: '#94a3b8', fontSize: '13px' }}>Asymmetric key exchanges establish client-side encryption tunnels via AES-256-GCM.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
                <CheckCircleIcon color="#10b981" />
                <div>
                  <h4 style={{ fontSize: '15px', color: '#f8fafc', marginBottom: '4px' }}>Cryptographic Log Purge</h4>
                  <p style={{ color: '#94a3b8', fontSize: '13px' }}>Closing the session triggers system memory dumps, scrubbing files and chat lists instantly.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
                <CheckCircleIcon color="#10b981" />
                <div>
                  <h4 style={{ fontSize: '15px', color: '#f8fafc', marginBottom: '4px' }}>Verifiable Audit Receipts</h4>
                  <p style={{ color: '#94a3b8', fontSize: '13px' }}>Generates a structured tamper-proof verification receipt containing SHA-256 integrity proofs.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="glass-card" style={{ padding: '32px', background: '#0b0f19', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RefreshCw size={16} className="spin-slow" color="#a78bfa" /> Purge Simulation Monitor
            </h3>
            <div style={{ background: '#04060a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '16px', fontFamily: 'monospace', fontSize: '12px', color: '#34d399', lineHeight: 1.6, minHeight: '200px' }}>
              <div>&gt; Initializing B2B deal session termination...</div>
              <div>&gt; Halting WebRTC peer streams...</div>
              <div>&gt; Injecting client-side memory dump scrub buffers...</div>
              <div>&gt; Garbage collecting active chat message arrays...</div>
              <div>&gt; Scrubbing ephemeral file buffer blobs...</div>
              <div>&gt; Destroying Diffie-Hellman cryptographic key registers...</div>
              <div style={{ color: '#a78bfa', fontWeight: 'bold', marginTop: '12px', textAlign: 'center' }}>★★★ SECURE SCRUB COMPLETED ★★★</div>
            </div>
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#64748b' }}>
              <span>Proof Hash: SHA-256:c05d76d499427670...</span>
              <span>Sanitized</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '40px 4%',
        background: '#04060a',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        textAlign: 'center',
        fontSize: '13px',
        color: '#64748b'
      }}>
        <p style={{ marginBottom: '12px' }}>© 2026 DevNexus Inc. All rights reserved. Platform architecture protected under SOC2 & E2EE guidelines.</p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <a href="#" style={{ color: '#64748b', textDecoration: 'none' }}>Privacy Policy</a>
          <span>•</span>
          <a href="#" style={{ color: '#64748b', textDecoration: 'none' }}>Terms of Service</a>
          <span>•</span>
          <a href="#" style={{ color: '#64748b', textDecoration: 'none' }}>Security Audit</a>
        </div>
      </footer>

      {/* CSS Hover Styling overrides */}
      <style>{`
        .nav-links a:hover {
          color: #fff !important;
        }
        .login-btn-nav:hover {
          background: rgba(59, 130, 246, 0.05) !important;
          border-color: #3b82f6 !important;
        }
        .btn-secondary-hero:hover {
          background: rgba(255,255,255,0.05) !important;
          border-color: rgba(255,255,255,0.2) !important;
        }
        .spin-slow {
          animation: spin 6s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// Helper CheckCircle Icon to replace lucide import nesting
const CheckCircleIcon = ({ color }: { color: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
