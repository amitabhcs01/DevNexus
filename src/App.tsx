import { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { AdvisoryHub } from './components/AdvisoryHub';
import { Marketplace } from './components/Marketplace';
import { DealRoom } from './components/DealRoom';
import { Dashboard } from './components/Dashboard';
import { Auth } from './components/Auth';
import { supabase } from './supabaseClient';
import { Cpu, Users, EyeOff, BarChart3, Home, Shield, Clock, LogOut } from 'lucide-react';

type TabType = 'landing' | 'advisory' | 'marketplace' | 'dealroom' | 'dashboard';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('landing');
  const [advisoryFilters, setAdvisoryFilters] = useState<{ skills: string[]; budget: number } | null>(null);
  const [dealRoomPartner, setDealRoomPartner] = useState<string>('Alex Rivers');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [session, setSession] = useState<any>(null);
  const [authLoaded, setAuthLoaded] = useState(false);

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
    return <Auth onAuthSuccess={(s) => setSession(s)} />;
  }

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
        transition: 'transform 0.3s ease',
        transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(0)' // standard desktop
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
          {[
            { id: 'landing', label: 'Dashboard Home', icon: <Home size={18} />, color: '#3b82f6' },
            { id: 'advisory', label: 'AI Advisory Hub', icon: <Cpu size={18} />, color: '#3b82f6' },
            { id: 'marketplace', label: 'Developer Registry', icon: <Users size={18} />, color: '#10b981' },
            { id: 'dealroom', label: 'Private Deal Room', icon: <EyeOff size={18} />, color: '#8b5cf6' },
            { id: 'dashboard', label: 'SaaS Analytics', icon: <BarChart3 size={18} />, color: '#f97316' }
          ].map((item) => {
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
            <span>Session: {session.user?.email ? (session.user.email.length > 18 ? session.user.email.substring(0, 18) + '...' : session.user.email) : 'Local Guest'}</span>
          </div>
          <button
            onClick={handleSignOut}
            style={{
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.15)',
              color: '#f87171',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'var(--transition-smooth)'
            }}
          >
            <LogOut size={12} /> Sign Out Session
          </button>
          <div>© 2026 DevNexus Inc.</div>
        </div>
      </aside>

      {/* Main Container */}
      <div style={{
        marginLeft: 'var(--sidebar-width)',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: `calc(100% - var(--sidebar-width))`
      }}>
        
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
          {/* Header Left (Breadcrumbs) */}
          <div style={{ fontSize: '14px', fontWeight: 500, color: '#94a3b8' }}>
            Active View: <strong style={{ color: '#fff', textTransform: 'capitalize' }}>
              {activeTab === 'landing' ? 'Home Overview' : activeTab}
            </strong>
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
            
            {/* User Profile Info Mock */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              borderLeft: '1px solid rgba(255,255,255,0.1)',
              paddingLeft: '16px'
            }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc' }}>
                  {session.user?.email ? session.user.email.split('@')[0] : 'Guest User'}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>
                  {session.user?.email?.endsWith('.local') ? 'Guest Sandbox Account' : 'Client Account'}
                </div>
              </div>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#1e293b',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                fontWeight: 700,
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                {session.user?.email ? session.user.email.substring(0, 2).toUpperCase() : 'GU'}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic View Wrapper */}
        <main className="main-content" style={{ padding: '32px', minHeight: 'calc(100vh - 70px)' }}>
          {activeTab === 'landing' && (
            <LandingPage onNavigate={navigateToTab as any} />
          )}

          {activeTab === 'advisory' && (
            <AdvisoryHub onNavigateToMarketplace={handleNavigateToMarketplace} />
          )}

          {activeTab === 'marketplace' && (
            <Marketplace
              initialFilters={advisoryFilters}
              onOpenDealRoom={handleOpenDealRoom}
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
        </main>
      </div>

      {/* Basic Responsive Styling overrides */}
      <style>{`
        @media (max-width: 991px) {
          .sidebar {
            transform: translateX(-100%);
          }
          .main-content {
            margin-left: 0 !important;
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
