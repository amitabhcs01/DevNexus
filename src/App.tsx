import { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { AdvisoryHub } from './components/AdvisoryHub';
import { Marketplace } from './components/Marketplace';
import { DealRoom } from './components/DealRoom';
import { Dashboard } from './components/Dashboard';
import { Auth } from './components/Auth';
import { LoggedInHome } from './components/LoggedInHome';
import { ProfileManager } from './components/ProfileManager';
import { supabase } from './supabaseClient';
import { Cpu, Users, EyeOff, BarChart3, Home, Shield, Clock, LogOut, Menu, X, User } from 'lucide-react';

type TabType = 'landing' | 'advisory' | 'marketplace' | 'dealroom' | 'dashboard' | 'profile';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('landing');
  const [advisoryFilters, setAdvisoryFilters] = useState<{ skills: string[]; budget: number } | null>(null);
  const [dealRoomPartner, setDealRoomPartner] = useState<string>('Alex Rivers');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const [session, setSession] = useState<any>(null);
  const [authLoaded, setAuthLoaded] = useState(false);

  // Determine user role if session exists
  const userEmail = session?.user?.email || '';
  const userRole = userEmail === 'admin@devnexus.local' 
    ? 'admin' 
    : userEmail === 'developer@devnexus.local' || session?.user?.user_metadata?.role === 'developer'
      ? 'developer'
      : 'client';

  const [developers, setDevelopers] = useState<any[]>([]);
  const [currentDeveloper, setCurrentDeveloper] = useState<any | null>(null);

  const getBackendUrl = () => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:5000';
    }
    return window.location.origin + '/_/backend';
  };
  const BACKEND_URL = getBackendUrl();

  const fetchDevelopers = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/developers`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.developers) {
          setDevelopers(data.developers);
        }
      }
    } catch (err) {
      console.error('Failed to fetch developers list:', err);
    }
  };

  useEffect(() => {
    fetchDevelopers();
  }, []);

  // Update currentDeveloper when developers list or session changes
  useEffect(() => {
    if (session && session.user) {
      const email = session.user.email || '';
      const fullName = session.user.user_metadata?.fullName || '';

      // Try to find matching developer in registry
      let matched = developers.find((d: any) => 
        d.id === session.user.id || 
        d.name.toLowerCase() === fullName.toLowerCase() ||
        (d.gitHubUsername && email.toLowerCase().includes(d.gitHubUsername.toLowerCase()))
      );

      if (!matched && (userRole === 'developer' || email === 'developer@devnexus.local')) {
        // Fallback stub for new developer
        matched = {
          id: session.user.id || 'dev-001',
          name: fullName || 'Alex Rivers',
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
          reviews: []
        };
      }

      setCurrentDeveloper(matched || null);
    }
  }, [developers, session, userRole]);

  const handleProfileUpdated = (updatedDev: any) => {
    setCurrentDeveloper(updatedDev);
    setDevelopers(prev => prev.map(d => d.id === updatedDev.id ? updatedDev : d));
  };



  useEffect(() => {
    // Check local storage session fallback
    const localSession = localStorage.getItem('devnexus-auth-session');
    if (localSession) {
      setSession(JSON.parse(localSession));
      setAuthLoaded(true);
      return;
    }

    // Supabase auth check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoaded(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    localStorage.removeItem('devnexus-auth-session');
    await supabase.auth.signOut();
    setSession(null);
  };

  // Router handler
  const navigateToTab = (tab: TabType) => {
    setActiveTab(tab);
    window.scrollTo(0, 0);
    setMobileMenuOpen(false);
  };

  // Advisory Hub actions
  const handleNavigateToMarketplace = (filters: { skills: string[]; budget: number }) => {
    setAdvisoryFilters(filters);
    navigateToTab('marketplace');
  };

  // Marketplace actions
  const handleOpenDealRoom = (developerName: string) => {
    setDealRoomPartner(developerName);
    navigateToTab('dealroom');
  };

  if (!authLoaded) {
    return (
      <div style={{ minHeight: '100vh', background: '#080c14', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontFamily: 'monospace' }}>
        <div>Securing session keys...</div>
      </div>
    );
  }



  if (!session) {
    if (showAuth) {
      return (
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowAuth(false)}
            style={{
              position: 'absolute',
              top: '24px',
              left: '24px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#94a3b8',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              zIndex: 100,
              fontSize: '13px',
              fontWeight: 500,
              transition: 'var(--transition-smooth)'
            }}
          >
            ← Back to Home
          </button>
          <Auth onAuthSuccess={(s) => { setSession(s); setShowAuth(false); }} />
        </div>
      );
    }
    return <LandingPage onNavigate={(tab) => { if (tab === 'auth') { setShowAuth(true); } else { setShowAuth(true); } }} />;
  }

  // Filter navigation tabs by role
  const allNavItems = [
    { id: 'landing', label: 'Dashboard Home', icon: <Home size={18} />, color: '#3b82f6', roles: ['client', 'developer', 'admin'] },
    { id: 'advisory', label: 'AI Advisory Hub', icon: <Cpu size={18} />, color: '#3b82f6', roles: ['client'] },
    { id: 'marketplace', label: 'Developer Registry', icon: <Users size={18} />, color: '#10b981', roles: ['client', 'admin'] },
    { id: 'dealroom', label: 'Private Deal Room', icon: <EyeOff size={18} />, color: '#8b5cf6', roles: ['client', 'developer', 'admin'] },
    { id: 'dashboard', label: 'SaaS Analytics', icon: <BarChart3 size={18} />, color: '#f97316', roles: ['client', 'developer', 'admin'] },
    { id: 'profile', label: 'Profile Manager', icon: <User size={18} />, color: '#10b981', roles: ['developer'] }
  ];

  const navItems = allNavItems.filter(item => item.roles.includes(userRole));

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Decorative BG Grid & Radiants */}
      <div className="bg-grid" />
      <div className="bg-radial" />

      {/* Sidebar Navigation */}
      <aside style={{
        width: 'var(--sidebar-width)',
        background: 'rgba(14, 20, 34, 0.95)',
        borderRight: '1px solid var(--card-border)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 100,
        transition: 'transform 0.3s ease'
      }} className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        
        {/* Logo Brand */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid var(--card-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            color: '#fff',
            borderRadius: '10px',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
          }}>
            <Shield size={20} />
          </div>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              DevNexus
            </h1>
            <span style={{ fontSize: '10px', color: '#3b82f6', fontWeight: 600, textTransform: 'uppercase' }}>Security Layer</span>
          </div>
        </div>

        {/* Navigation List */}
        <nav style={{ padding: '24px 16px', flex: 1, display: 'grid', gap: '8px', alignContent: 'start' }}>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigateToTab(item.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '1px solid transparent',
                  background: isActive ? 'rgba(255,255,255,0.03)' : 'transparent',
                  borderColor: isActive ? 'rgba(255,255,255,0.05)' : 'transparent',
                  color: isActive ? '#fff' : '#94a3b8',
                  fontSize: '14px',
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'var(--transition-smooth)'
                }}
                className="nav-btn"
              >
                <span style={{ color: isActive ? item.color : 'inherit' }}>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div style={{
          padding: '24px',
          borderTop: '1px solid var(--card-border)',
          fontSize: '11px',
          color: '#64748b',
          display: 'grid',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={12} />
            <span>Session: Active</span>
          </div>
          <div>© 2026 DevNexus Inc.</div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="main-container">
        
        {/* Header bar */}
        <header style={{
          height: '70px',
          borderBottom: '1px solid var(--card-border)',
          background: 'rgba(8, 12, 20, 0.7)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 32px',
          position: 'sticky',
          top: 0,
          zIndex: 90
        }}>
          {/* Header Left (Breadcrumbs & Mobile Menu Toggle) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-menu-toggle"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#fff',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '8px',
                display: 'none', // shown via media query on mobile
                alignItems: 'center',
                justifyContent: 'center',
                outline: 'none'
              }}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <div style={{ fontSize: '14px', fontWeight: 500, color: '#94a3b8' }}>
              Active View: <strong style={{ color: '#fff', textTransform: 'capitalize' }}>
                {activeTab === 'landing' ? 'Home Overview' : activeTab}
              </strong>
            </div>
          </div>

          {/* Header Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              color: '#34d399',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 600
            }}>
              <Shield size={12} /> E2E Shield Active
            </div>
            
            {/* User Profile Info Interactive Dropdown */}
            <div style={{
              position: 'relative',
              borderLeft: '1px solid rgba(255,255,255,0.1)',
              paddingLeft: '16px',
              zIndex: 999
            }}>
              <div 
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc' }}>
                    {session.user?.email ? session.user.email.split('@')[0] : 'User'}
                  </div>
                  <div style={{ fontSize: '11px', color: '#3b82f6', textTransform: 'capitalize', fontWeight: 600 }}>
                    {userRole}
                  </div>
                </div>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: 700,
                  border: '1px solid rgba(255,255,255,0.2)'
                }}>
                  {session.user?.email ? session.user.email.substring(0, 2).toUpperCase() : 'US'}
                </div>
              </div>

              {profileDropdownOpen && (
                <div className="glass-card" style={{
                  position: 'absolute',
                  top: '42px',
                  right: 0,
                  width: '240px',
                  padding: '16px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  zIndex: 9999,
                  display: 'grid',
                  gap: '12px'
                }}>
                  <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Connected Account:</div>
                    <div style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: 500, wordBreak: 'break-all' }}>{session.user?.email}</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>Platform Role:</span>
                    <span style={{
                      fontSize: '10px',
                      background: userRole === 'admin' ? 'rgba(239, 68, 68, 0.1)' : userRole === 'developer' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                      color: userRole === 'admin' ? '#f87171' : userRole === 'developer' ? '#34d399' : '#60a5fa',
                      border: userRole === 'admin' ? '1px solid rgba(239, 68, 68, 0.2)' : userRole === 'developer' ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(59, 130, 246, 0.2)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontWeight: 600,
                      textTransform: 'uppercase'
                    }}>{userRole}</span>
                  </div>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      handleSignOut();
                    }}
                    style={{
                      background: 'rgba(239, 68, 68, 0.08)',
                      border: '1px solid rgba(239, 68, 68, 0.15)',
                      color: '#f87171',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      width: '100%',
                      transition: 'var(--transition-smooth)'
                    }}
                    className="logout-btn"
                  >
                    <LogOut size={12} /> Sign Out Session
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic View Wrapper */}
        <main className="main-content" style={{ padding: '32px', minHeight: 'calc(100vh - 70px)' }}>
          {activeTab === 'landing' && (
            <LoggedInHome user={session?.user} role={userRole} onNavigate={navigateToTab as any} />
          )}

          {activeTab === 'advisory' && userRole === 'client' && (
            <AdvisoryHub onNavigateToMarketplace={handleNavigateToMarketplace} />
          )}

          {activeTab === 'marketplace' && (userRole === 'client' || userRole === 'admin') && (
            <Marketplace
              initialFilters={advisoryFilters}
              onOpenDealRoom={handleOpenDealRoom}
              developersList={developers}
              onRefetchDevelopers={fetchDevelopers}
            />
          )}

          {activeTab === 'dealroom' && (
            <DealRoom
              defaultPartner={dealRoomPartner}
              onNavigateToDashboard={() => {
                setAdvisoryFilters(null);
                navigateToTab('landing');
              }}
            />
          )}

          {activeTab === 'dashboard' && (
            <Dashboard user={session?.user} />
          )}

          {activeTab === 'profile' && userRole === 'developer' && currentDeveloper && (
            <ProfileManager 
              currentDeveloper={currentDeveloper} 
              onProfileUpdated={handleProfileUpdated} 
            />
          )}
        </main>
      </div>

      {/* Basic Responsive Styling overrides */}
      <style>{`
        .main-container {
          margin-left: var(--sidebar-width);
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          width: calc(100% - var(--sidebar-width));
          transition: margin-left 0.3s ease, width 0.3s ease;
        }

        .sidebar {
          transform: translateX(0);
        }

        @media (max-width: 991px) {
          .sidebar {
            transform: translateX(-100%) !important;
          }
          .sidebar.mobile-open {
            transform: translateX(0) !important;
            box-shadow: 0 0 30px rgba(0,0,0,0.8) !important;
          }
          .main-container {
            margin-left: 0 !important;
            width: 100% !important;
          }
          .mobile-menu-toggle {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
