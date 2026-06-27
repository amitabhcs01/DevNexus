import React from 'react';
import { Cpu, Users, EyeOff, BarChart3, User, ArrowRight } from 'lucide-react';

interface LoggedInHomeProps {
  user: any;
  role: 'admin' | 'client' | 'developer';
  onNavigate: (tab: any) => void;
}

export const LoggedInHome: React.FC<LoggedInHomeProps> = ({ user, role, onNavigate }) => {
  const email = user?.email || 'user@devnexus.com';
  const name = email.split('@')[0];

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
        border: '1px solid rgba(59, 130, 246, 0.25)',
        borderRadius: '16px',
        padding: '32px',
        marginBottom: '32px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', right: '4%', top: '-20%', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 75%)', filter: 'blur(20px)', pointerEvents: 'none' }} />
        
        <span style={{ fontSize: '12px', fontWeight: 600, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>
          Portal Control Center
        </span>
        <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px', background: 'linear-gradient(90deg, #fff, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Welcome Back, {name.charAt(0).toUpperCase() + name.slice(1)}!
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '15px', maxWidth: '600px', lineHeight: 1.5 }}>
          You are currently logged in as a <strong style={{ color: '#60a5fa', textTransform: 'capitalize' }}>{role}</strong>. Access your secure workspace, agreements, and analytics using the control nodes below.
        </p>
      </div>

      {/* Role-Specific Workspaces */}
      {role === 'client' && (
        <div style={{ display: 'grid', gap: '32px' }}>
          {/* Quick Actions Row */}
          <div>
            <h2 style={{ fontSize: '20px', marginBottom: '16px', color: '#f8fafc' }}>Quick Client Workspaces</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div className="glass-card shimmer" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'inline-flex', padding: '10px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', marginBottom: '16px' }}>
                    <Cpu size={20} />
                  </div>
                  <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Scope with AI Architect</h3>
                  <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: 1.5, marginBottom: '16px' }}>
                    Describe your software vision in plain English. The AI generates tech stacks, detailed features list, timelines, and budgets.
                  </p>
                </div>
                <button onClick={() => onNavigate('advisory')} className="btn-glow-blue" style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}>
                  Open Advisory Hub <ArrowRight size={14} />
                </button>
              </div>

              <div className="glass-card shimmer" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'inline-flex', padding: '10px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', marginBottom: '16px' }}>
                    <Users size={20} />
                  </div>
                  <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Developer Registry</h3>
                  <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: 1.5, marginBottom: '16px' }}>
                    Browse through pre-screened developers, analyze skill graphs, and run the matching algorithm to match budgets and requirements.
                  </p>
                </div>
                <button onClick={() => onNavigate('marketplace')} className="btn-glow-green" style={{ background: '#10b981', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}>
                  Explore Registry <ArrowRight size={14} />
                </button>
              </div>

              <div className="glass-card shimmer" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'inline-flex', padding: '10px', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', marginBottom: '16px' }}>
                    <EyeOff size={20} />
                  </div>
                  <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Launch General Deal Room</h3>
                  <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: 1.5, marginBottom: '16px' }}>
                    Initialize or join zero-knowledge, end-to-end encrypted rooms to draft legal NDAs, share documents, and collaborate securely.
                  </p>
                </div>
                <button onClick={() => onNavigate('dealroom')} className="btn-glow-purple" style={{ background: '#8b5cf6', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}>
                  Enter Deal Rooms <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {role === 'developer' && (
        <div style={{ display: 'grid', gap: '32px' }}>
          {/* Quick Actions Row */}
          <div>
            <h2 style={{ fontSize: '20px', marginBottom: '16px', color: '#f8fafc' }}>Quick Developer Workspaces</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div className="glass-card shimmer" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'inline-flex', padding: '10px', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', marginBottom: '16px' }}>
                    <EyeOff size={20} />
                  </div>
                  <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Active Deal Rooms</h3>
                  <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: 1.5, marginBottom: '16px' }}>
                    Enter encrypted client chambers to negotiate agreements, securely upload project files, and chat with corporate peers.
                  </p>
                </div>
                <button onClick={() => onNavigate('dealroom')} className="btn-glow-purple" style={{ background: '#8b5cf6', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}>
                  Go to Deal Rooms <ArrowRight size={14} />
                </button>
              </div>

              <div className="glass-card shimmer" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'inline-flex', padding: '10px', borderRadius: '10px', background: 'rgba(249, 115, 22, 0.1)', color: '#f97316', marginBottom: '16px' }}>
                    <BarChart3 size={20} />
                  </div>
                  <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Earnings & Analytics</h3>
                  <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: 1.5, marginBottom: '16px' }}>
                    Check your billing dashboard, track platform exposure stats, and review active subscription tiers.
                  </p>
                </div>
                <button onClick={() => onNavigate('dashboard')} className="btn-glow-blue" style={{ background: '#f97316', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}>
                  View Analytics <ArrowRight size={14} />
                </button>
              </div>

              <div className="glass-card shimmer" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'inline-flex', padding: '10px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', marginBottom: '16px' }}>
                    <User size={20} />
                  </div>
                  <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Developer Profile</h3>
                  <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: 1.5, marginBottom: '16px' }}>
                    Configure your registry cards, highlight hourly billing fees, edit key technologies, and adjust your contract availability index.
                  </p>
                </div>
                <button onClick={() => onNavigate('profile')} className="btn-glow-blue" style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}>
                  Manage Profile <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {role === 'admin' && (
        <div style={{ display: 'grid', gap: '32px' }}>
          {/* Quick Actions Row */}
          <div>
            <h2 style={{ fontSize: '20px', marginBottom: '16px', color: '#f8fafc' }}>Quick Administrative Workspaces</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'inline-flex', padding: '10px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', marginBottom: '16px' }}>
                    <Users size={20} />
                  </div>
                  <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Verification Queue</h3>
                  <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: 1.5, marginBottom: '16px' }}>
                    Moderate applicant developers seeking entry into the verified pool. Conduct portfolio checks and compliance audits.
                  </p>
                </div>
                <button onClick={() => onNavigate('marketplace')} className="btn-glow-green" style={{ background: '#10b981', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}>
                  Go to Verification <ArrowRight size={14} />
                </button>
              </div>

              <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'inline-flex', padding: '10px', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', marginBottom: '16px' }}>
                    <EyeOff size={20} />
                  </div>
                  <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Active Room Audit</h3>
                  <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: 1.5, marginBottom: '16px' }}>
                    Audit active B2B Deal Rooms for cryptographic channel compliance, checking socket integrity and signal metrics.
                  </p>
                </div>
                <button onClick={() => onNavigate('dealroom')} className="btn-glow-purple" style={{ background: '#8b5cf6', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}>
                  Open Audit Panel <ArrowRight size={14} />
                </button>
              </div>

              <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'inline-flex', padding: '10px', borderRadius: '10px', background: 'rgba(249, 115, 22, 0.1)', color: '#f97316', marginBottom: '16px' }}>
                    <BarChart3 size={20} />
                  </div>
                  <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Platform Performance</h3>
                  <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: 1.5, marginBottom: '16px' }}>
                    Review platform GMV growth, monthly recurring revenue metrics, and project transaction analytics.
                  </p>
                </div>
                <button onClick={() => onNavigate('dashboard')} className="btn-glow-blue" style={{ background: '#f97316', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}>
                  Analyze Revenue <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
