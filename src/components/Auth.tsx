import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import { Shield, Mail, ArrowRight, KeyRound, Building, Code, User, DollarSign, Layers, Globe } from 'lucide-react';

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

  const hashPassword = async (pwd: string): Promise<string> => {
    const msgBuffer = new TextEncoder().encode(pwd);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

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
      setTimeout(async () => {
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
      const computedHash = await hashPassword(password);

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

        // Write user profile data to public.profiles table for visibility in Supabase Table Editor
        if (data.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              email: email,
              role: selectedRole,
              company_name: selectedRole === 'client' ? companyName : null,
              corporate_title: selectedRole === 'client' ? corporateTitle : null,
              project_budget: selectedRole === 'client' ? (parseFloat(projectBudget) || null) : null,
              full_name: selectedRole === 'developer' ? fullName : null,
              key_skills: selectedRole === 'developer' ? keySkills : null,
              experience_level: selectedRole === 'developer' ? experienceLevel : null,
              portfolio_link: selectedRole === 'developer' ? portfolioLink : null,
              password_hash: computedHash
            });
          if (profileError) {
            console.error('Error creating public profile entry:', profileError.message);
          }

          if (selectedRole === 'developer') {
            const parsedSkills = keySkills
              ? keySkills.split(',').map(s => s.trim()).filter(Boolean)
              : [];
            const { error: devError } = await supabase
              .from('developers')
              .insert({
                id: data.user.id,
                name: fullName || 'Anonymous Developer',
                title: experienceLevel === 'senior' ? 'Senior Full Stack Engineer' : 'Full Stack Developer',
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
                bio: 'Registered developer on DevNexus network.',
                skills: parsedSkills,
                hourly_rate: 120,
                availability: 'Available Now',
                rating: 5.0,
                reviews_count: 0,
                git_username: (fullName || 'dev').toLowerCase().replace(/\s+/g, '-'),
                niche: 'SaaS Software Development',
                verified: true
              });
            if (devError) {
              console.error('Error creating developer entry:', devError.message);
            } else {
              const savedDev = { techStack: parsedSkills };
              console.log("Developer saved skills:", savedDev.techStack);
            }
          }
        }
        
        if (data.session) {
          onAuthSuccess(data.session);
        } else {
          setSuccessMsg('Registration successful! Please check your email inbox to confirm registration.');
        }
      } else {
        let sessionData = null;
        let authError = null;

        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          if (error) {
            authError = error;
          } else {
            sessionData = data.session;
          }
        } catch (err: any) {
          authError = err;
        }

        // If sign-in fails, check if database profile matches for auto-sync registration
        if (authError || !sessionData) {
          console.log('Production auth failed. Verifying profile password hash fallback...');
          const { data: profile, error: dbError } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', email)
            .maybeSingle();

          if (!dbError && profile && profile.password_hash === computedHash) {
            console.log('Profile password verified. Dynamically creating Auth credentials in production...');
            
            // Sign up in auth on-the-fly
            const { error: signUpError } = await supabase.auth.signUp({
              email,
              password,
              options: {
                data: {
                  role: profile.role,
                  companyName: profile.company_name,
                  corporateTitle: profile.corporate_title,
                  projectBudget: profile.project_budget ? String(profile.project_budget) : undefined,
                  fullName: profile.full_name,
                  keySkills: profile.key_skills,
                  experienceLevel: profile.experience_level,
                  portfolioLink: profile.portfolio_link
                }
              }
            });

            if (!signUpError) {
              console.log('Auto-registration successful. Completing session sign-in...');
              const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
                email,
                password
              });

              if (!retryError && retryData.session) {
                const newUserId = retryData.session.user.id;
                console.log(`Synchronizing profile UUID to match newly generated auth key: ${newUserId}`);
                
                // Keep the record but switch IDs
                await supabase.from('profiles').delete().eq('id', profile.id);
                
                const { error: reInsertError } = await supabase.from('profiles').insert({
                  ...profile,
                  id: newUserId
                });
                
                if (reInsertError) {
                  console.error('Error re-inserting synced profile:', reInsertError.message);
                }

                sessionData = retryData.session;
              } else {
                throw retryError || new Error('Auth retry login failed.');
              }
            } else {
              throw signUpError;
            }
          } else {
            throw authError || new Error('Invalid login credentials.');
          }
        }

        if (sessionData) {
          onAuthSuccess(sessionData);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
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
