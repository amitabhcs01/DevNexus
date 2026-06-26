import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import { Shield, Lock, Mail, ArrowRight, KeyRound, AlertTriangle, Building, Code, User, DollarSign, Layers, Globe } from 'lucide-react';

interface AuthProps {
  onAuthSuccess: (session: any) => void;
}

export const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Role details
  const [selectedRole, setSelectedRole] = useState<'client' | 'developer'>('client');
  // Client specific fields
  const [companyName, setCompanyName] = useState('');
  const [projectBudget, setProjectBudget] = useState('');
  const [corporateTitle, setCorporateTitle] = useState('');
  // Developer specific fields
  const [fullName, setFullName] = useState('');
  const [keySkills, setKeySkills] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('senior');
  const [portfolioLink, setPortfolioLink] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Email and password are required.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    // 1. LOCAL MODE FALLBACK
    if (!isSupabaseConfigured) {
      setTimeout(() => {
        // Pre-created credentials simulation or fallback
        let resolvedRole = 'client';
        let resolvedEmail = email;
        
        if (email === 'admin@devnexus.local' && password === 'AdminPasswordSecure123!') {
          resolvedRole = 'admin';
        } else if (email === 'client@devnexus.local' && password === 'ClientPasswordSecure123!') {
          resolvedRole = 'client';
        } else if (email === 'developer@devnexus.local' && password === 'DeveloperPasswordSecure123!') {
          resolvedRole = 'developer';
        } else if (isSignUp) {
          resolvedRole = selectedRole;
        } else {
          resolvedRole = 'client';
        }

        const mockUser = {
          id: `mock-${resolvedRole}-${Math.random().toString(36).substr(2, 9)}`,
          email: resolvedEmail,
          user_metadata: {
            role: resolvedRole,
            companyName: resolvedRole === 'client' ? companyName || 'Demo Corp' : undefined,
            projectBudget: resolvedRole === 'client' ? projectBudget || '10000' : undefined,
            corporateTitle: resolvedRole === 'client' ? corporateTitle || 'CEO' : undefined,
            fullName: resolvedRole === 'developer' ? fullName || 'Developer Jane' : undefined,
            keySkills: resolvedRole === 'developer' ? keySkills || 'React, TS' : undefined,
            experienceLevel: resolvedRole === 'developer' ? experienceLevel || 'senior' : undefined,
            portfolioLink: resolvedRole === 'developer' ? portfolioLink || 'https://github.com' : undefined,
          }
        };

        const mockSession = { user: mockUser, access_token: 'mock-token-xyz' };
        localStorage.setItem('devnexus-auth-session', JSON.stringify(mockSession));
        onAuthSuccess(mockSession);
        setLoading(false);
      }, 1000);
      return;
    }

    // 2. PRODUCTION SUPABASE MODE
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role: selectedRole,
              companyName: selectedRole === 'client' ? companyName : undefined,
              projectBudget: selectedRole === 'client' ? projectBudget : undefined,
              corporateTitle: selectedRole === 'client' ? corporateTitle : undefined,
              fullName: selectedRole === 'developer' ? fullName : undefined,
              keySkills: selectedRole === 'developer' ? keySkills : undefined,
              experienceLevel: selectedRole === 'developer' ? experienceLevel : undefined,
              portfolioLink: selectedRole === 'developer' ? portfolioLink : undefined
            }
          }
        });
        if (error) throw error;
        
        if (data.session) {
          onAuthSuccess(data.session);
        } else {
          setSuccessMsg('Registration successful! Please check your email inbox to confirm registration.');
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        if (data.session) {
          onAuthSuccess(data.session);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestAccess = () => {
    // Authenticate as a temporary local guest
    const guestSession = { user: { id: 'guest-id', email: 'guest@devnexus.local', user_metadata: { role: 'client' } }, access_token: 'guest-token' };
    localStorage.setItem('devnexus-auth-session', JSON.stringify(guestSession));
    onAuthSuccess(guestSession);
  };

  const inputStyle = {
    width: '100%',
    background: '#080c14',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    padding: '12px 12px 12px 38px',
    color: '#fff',
    fontSize: '13.5px',
    outline: 'none',
    transition: 'border-color 0.2s ease'
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      background: '#080c14'
    }}>
      {/* Decorative Blur Orbs */}
      <div style={{ position: 'fixed', top: '20%', left: '30%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '15%', right: '25%', width: '450px', height: '450px', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.06) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div className="glass-card" style={{
        maxWidth: '500px',
        width: '100%',
        padding: '40px',
        boxShadow: '0 20px 50px -15px rgba(0, 0, 0, 0.6)',
        position: 'relative',
        zIndex: 10,
        animation: 'fadeIn 0.5s ease-out'
      }}>
        {/* Title Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            padding: '12px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            color: '#60a5fa',
            marginBottom: '16px'
          }}>
            <Shield size={28} />
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.03em', background: 'linear-gradient(90deg, #ffffff 40%, #a5b4fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' }}>
            DEVNEXUS
          </h1>
          <p style={{ color: '#64748b', fontSize: '13px', lineHeight: 1.4 }}>
            The Secured Intelligence Layer Between Businesses & Builders
          </p>
        </div>

        {/* Local warning banner */}
        {!isSupabaseConfigured && (
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '24px',
            fontSize: '12px',
            color: '#f59e0b',
            lineHeight: 1.4
          }}>
            <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '1px' }} />
            <div>
              <strong>Local Sandbox Mode Active</strong>
              <p style={{ opacity: 0.8, marginTop: '2px' }}>Supabase variables are missing. Logins will simulate locally. Use Guest Access to test.</p>
            </div>
          </div>
        )}

        {/* Error / Success Notifications */}
        {errorMsg && (
          <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#f87171', padding: '12px', borderRadius: '8px', fontSize: '13px', marginBottom: '20px', textAlign: 'center' }}>
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '12px', borderRadius: '8px', fontSize: '13px', marginBottom: '20px', textAlign: 'center' }}>
            {successMsg}
          </div>
        )}

        {/* Forms */}
        <form onSubmit={handleAuth} style={{ display: 'grid', gap: '20px' }}>
          
          {/* Role selection tab during Sign Up */}
          {isSignUp && (
            <div style={{ marginBottom: '4px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Choose Your Role</label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                padding: '4px',
                borderRadius: '10px'
              }}>
                <button
                  type="button"
                  onClick={() => setSelectedRole('client')}
                  style={{
                    background: selectedRole === 'client' ? '#3b82f6' : 'transparent',
                    color: selectedRole === 'client' ? '#fff' : '#64748b',
                    border: 'none',
                    padding: '10px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'border-color 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Building size={14} /> Client / Founder
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('developer')}
                  style={{
                    background: selectedRole === 'developer' ? '#3b82f6' : 'transparent',
                    color: selectedRole === 'developer' ? '#fff' : '#64748b',
                    border: 'none',
                    padding: '10px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'border-color 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Code size={14} /> Vetted Developer
                </button>
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', fontWeight: 600, marginBottom: '6px' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', fontWeight: 600, marginBottom: '6px' }}>Secret Password</label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Client fields */}
          {isSignUp && selectedRole === 'client' && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', fontWeight: 600, marginBottom: '6px' }}>Company Name</label>
                <div style={{ position: 'relative' }}>
                  <Building size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Acme Corp"
                    style={inputStyle}
                  />
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', fontWeight: 600, marginBottom: '6px' }}>Corporate Title</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    required
                    value={corporateTitle}
                    onChange={(e) => setCorporateTitle(e.target.value)}
                    placeholder="e.g. Founder, CEO, PM"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', fontWeight: 600, marginBottom: '6px' }}>Estimated Project Budget ($)</label>
                <div style={{ position: 'relative' }}>
                  <DollarSign size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="number"
                    required
                    value={projectBudget}
                    onChange={(e) => setProjectBudget(e.target.value)}
                    placeholder="e.g. 15000"
                    style={inputStyle}
                  />
                </div>
              </div>
            </>
          )}

          {/* Developer fields */}
          {isSignUp && selectedRole === 'developer' && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', fontWeight: 600, marginBottom: '6px' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Jane Doe"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', fontWeight: 600, marginBottom: '6px' }}>Key Skills (Comma separated)</label>
                <div style={{ position: 'relative' }}>
                  <Layers size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    required
                    value={keySkills}
                    onChange={(e) => setKeySkills(e.target.value)}
                    placeholder="e.g. React, WebRTC, Node, Python"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', fontWeight: 600, marginBottom: '6px' }}>Experience Level</label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    style={{
                      ...inputStyle,
                      paddingLeft: '12px',
                      appearance: 'none',
                      backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2364748b\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 12px center',
                      backgroundSize: '16px'
                    }}
                  >
                    <option value="junior" style={{ background: '#080c14' }}>Junior (1-3 yrs)</option>
                    <option value="mid" style={{ background: '#080c14' }}>Mid-Level (3-5 yrs)</option>
                    <option value="senior" style={{ background: '#080c14' }}>Senior (5-8 yrs)</option>
                    <option value="lead" style={{ background: '#080c14' }}>Lead / Architect (8+ yrs)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', fontWeight: 600, marginBottom: '6px' }}>Portfolio / GitHub URL</label>
                <div style={{ position: 'relative' }}>
                  <Globe size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="url"
                    required
                    value={portfolioLink}
                    onChange={(e) => setPortfolioLink(e.target.value)}
                    placeholder="https://github.com/yourusername"
                    style={inputStyle}
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-glow-blue"
            style={{
              background: '#3b82f6',
              color: '#fff',
              border: 'none',
              padding: '12px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '10px',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Validating credentials...' : isSignUp ? 'Create Secured Account' : 'Authenticate Sign In'}
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Separator */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0', color: '#64748b', fontSize: '11px' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.05)' }} />
          <span style={{ padding: '0 12px' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.05)' }} />
        </div>

        {/* Guest access */}
        <button
          onClick={handleGuestAccess}
          style={{
            width: '100%',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#cbd5e1',
            padding: '10px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'border-color 0.2s ease'
          }}
        >
          <Lock size={14} /> Explore in Guest Mode
        </button>

        {/* Pre-created Credentials Panel */}
        <div style={{
          marginTop: '24px',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '10px',
          padding: '16px',
          fontSize: '12px',
          color: '#94a3b8'
        }}>
          <div style={{ fontWeight: 600, color: '#f8fafc', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '11px' }}>Pre-Created Test Accounts:</div>
          <div style={{ display: 'grid', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>🔑 <strong>Admin</strong>: admin@devnexus.local</span>
              <button type="button" onClick={() => { setEmail('admin@devnexus.local'); setPassword('AdminPasswordSecure123!'); }} style={{ background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer', fontSize: '11.5px', textDecoration: 'underline', fontWeight: 600 }}>Auto-Fill</button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>🏢 <strong>Client</strong>: client@devnexus.local</span>
              <button type="button" onClick={() => { setEmail('client@devnexus.local'); setPassword('ClientPasswordSecure123!'); }} style={{ background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer', fontSize: '11.5px', textDecoration: 'underline', fontWeight: 600 }}>Auto-Fill</button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>💻 <strong>Developer</strong>: developer@devnexus.local</span>
              <button type="button" onClick={() => { setEmail('developer@devnexus.local'); setPassword('DeveloperPasswordSecure123!'); }} style={{ background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer', fontSize: '11.5px', textDecoration: 'underline', fontWeight: 600 }}>Auto-Fill</button>
            </div>
          </div>
          <div style={{ marginTop: '10px', fontSize: '10.5px', color: '#64748b', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '8px' }}>
            Passwords respectively: <br />
            <code style={{ color: '#a5b4fc', display: 'block', marginTop: '3px' }}>AdminPasswordSecure123!</code>
            <code style={{ color: '#a5b4fc', display: 'block' }}>ClientPasswordSecure123!</code>
            <code style={{ color: '#a5b4fc', display: 'block' }}>DeveloperPasswordSecure123!</code>
          </div>
        </div>

        {/* View Switcher */}
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#64748b' }}>
          {isSignUp ? (
            <span>Already have an account?{' '}
              <button onClick={() => setIsSignUp(false)} style={{ background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer', fontWeight: 500 }}>
                Sign In
              </button>
            </span>
          ) : (
            <span>New to the platform?{' '}
              <button onClick={() => setIsSignUp(true)} style={{ background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer', fontWeight: 500 }}>
                Create Account
              </button>
            </span>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
