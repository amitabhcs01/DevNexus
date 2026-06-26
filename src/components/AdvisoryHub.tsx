import { useState } from 'react';
import { Cpu, HelpCircle, FileText, UserCheck, Calendar, DollarSign, ArrowRight, ShieldCheck, ChevronRight, CheckCircle2 } from 'lucide-react';
import type { ProjectBrief } from '../types';
import { supabase, isSupabaseConfigured } from '../supabaseClient';

interface AdvisoryHubProps {
  onNavigateToMarketplace: (filters: { skills: string[]; budget: number }) => void;
}

export const AdvisoryHub: React.FC<AdvisoryHubProps> = ({ onNavigateToMarketplace }) => {
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [brief, setBrief] = useState<ProjectBrief | null>(null);
  const [selectedExpert, setSelectedExpert] = useState<string | null>(null);

  const presets = [
    {
      title: 'Encrypted B2B Deal Room',
      desc: 'Real-time WebRTC chat room with NDA signer and file attachments.',
      query: 'I need a secure, end-to-end encrypted deal room platform where two businesses can log in with a code, sign a digital NDA, text in real-time, share files, and close the session such that all documents and chat histories are completely wiped from memory.'
    },
    {
      title: 'AI Customer Support Bot',
      desc: 'Smart RAG agent integrated into a SaaS customer dashboard.',
      query: 'I want to build an AI chatbot for our customer support dashboard that answers user questions based on our internal documentation. It needs a FastAPI backend, vector database (Pinecone), and React dashboard.'
    },
    {
      title: 'E-Commerce with Subscription',
      desc: 'Online marketplace with member retainers and Stripe Connect.',
      query: 'An online marketplace platform where customers can purchase digital assets and subscribe to monthly membership plans. Developers should receive their payouts via Stripe Connect with a 15% platform fee.'
    }
  ];

  const handleAnalyze = async (inputQuery: string) => {
    if (!inputQuery.trim()) return;
    setIsAnalyzing(true);
    setBrief(null);

    try {
      const res = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: inputQuery })
      });
      const data = await res.json();
      setBrief(data);

      // Save to Supabase Database if credentials are set
      if (isSupabaseConfigured) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { error } = await supabase.from('briefs').insert({
            id: data.id,
            user_id: user.id,
            title: data.title,
            description: inputQuery,
            tech_stack: data.techStack,
            estimated_cost: data.estimatedCost,
            estimated_timeline: data.estimatedTimeline,
            architecture: data.architecture,
            features: data.features,
            risks: data.risks
          });
          if (error) console.error('Failed to store brief in Supabase DB:', error.message);
          else console.log('Successfully saved project brief in Supabase DB.');
        }
      }
    } catch (err) {
      console.error('Failed to communicate with backend:', err);
      // Local fallback compilation if server is down
      setBrief({
        id: `brief-${Math.floor(Math.random() * 1000)}`,
        title: 'Local Fallback Architect Brief',
        description: inputQuery,
        techStack: ['React', 'TypeScript', 'Node.js', 'Supabase'],
        estimatedCost: '$15,000 - $22,000',
        estimatedTimeline: '6 - 8 weeks',
        architecture: 'Local compilation because the Express backend on port 5000 is unreachable.',
        features: [
          'Modular client-side interactive forms',
          'Client-side key generation models',
          'Self-contained developer registry matcher logs'
        ],
        risks: [
          { risk: 'Backend connection unreachable', mitigation: 'Please run npm run dev in project root to start the Express server.' }
        ]
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
          <Cpu size={24} />
        </div>
        <div>
          <h1 style={{ fontSize: '28px', marginBottom: '4px' }}>AI Software Advisory Hub</h1>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>Describe your software requirements in plain English to generate a structured architecture brief.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px', alignItems: 'start' }}>
        {/* Input Panel */}
        <div className="glass-card" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Describe your app idea</h2>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. I need a real-time contract signing dashboard where clients and vendors can negotiate privately without any data saved on the server..."
            rows={5}
            style={{
              width: '100%',
              background: '#080c14',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '16px',
              color: '#f8fafc',
              fontSize: '14px',
              lineHeight: 1.5,
              outline: 'none',
              marginBottom: '20px',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          />

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#94a3b8', fontSize: '13px' }}>
              <HelpCircle size={14} /> Need ideas? Click a preset below
            </div>
            <button
              onClick={() => handleAnalyze(query)}
              disabled={isAnalyzing || !query.trim()}
              className="btn-glow-blue"
              style={{
                background: '#3b82f6',
                color: '#fff',
                border: 'none',
                padding: '12px 28px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: isAnalyzing || !query.trim() ? 0.6 : 1
              }}
            >
              {isAnalyzing ? 'Claude is analyzing...' : 'Generate Brief'}
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Preset Buttons */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            marginTop: '32px',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            paddingTop: '24px'
          }}>
            {presets.map((preset, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setQuery(preset.query);
                  handleAnalyze(preset.query);
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'var(--transition-smooth)'
                }}
                className="glass-card"
              >
                <h4 style={{ fontSize: '14px', color: '#60a5fa', marginBottom: '6px' }}>{preset.title}</h4>
                <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.4 }}>{preset.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isAnalyzing && (
          <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid rgba(59, 130, 246, 0.1)',
              borderTopColor: '#3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px auto'
            }} />
            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Claude AI Solution Architect</h3>
            <p style={{ color: '#94a3b8', fontSize: '14px' }}>Parsing intent, designing component schemas, and evaluating budget models...</p>
          </div>
        )}

        {/* Results Solution Brief Panel */}
        {brief && !isAnalyzing && (
          <div className="glass-card" style={{ padding: '32px', borderLeft: '4px solid #3b82f6', animation: 'fadeIn 0.5s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Generated Architect Brief</span>
                <h2 style={{ fontSize: '24px', marginTop: '4px' }}>{brief.title}</h2>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={handlePrint}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <FileText size={14} /> Export Brief
                </button>
                <button
                  onClick={() => onNavigateToMarketplace({ skills: brief.techStack, budget: 150 })}
                  className="btn-glow-green"
                  style={{
                    background: '#10b981',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <UserCheck size={14} /> Match Developers
                </button>
              </div>
            </div>

            {/* Estimations row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              marginBottom: '32px'
            }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '13px', marginBottom: '8px' }}>
                  <DollarSign size={14} color="#10b981" /> Estimated Cost
                </div>
                <h3 style={{ fontSize: '20px', color: '#10b981' }}>{brief.estimatedCost}</h3>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '13px', marginBottom: '8px' }}>
                  <Calendar size={14} color="#3b82f6" /> Estimated Timeline
                </div>
                <h3 style={{ fontSize: '20px', color: '#60a5fa' }}>{brief.estimatedTimeline}</h3>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '13px', marginBottom: '8px' }}>
                  <ShieldCheck size={14} color="#8b5cf6" /> Vetting Compliance
                </div>
                <h3 style={{ fontSize: '20px', color: '#8b5cf6' }}>ISO & SOC2 Ready</h3>
              </div>
            </div>

            {/* Architecture stack */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>1. System Architecture Overview</h3>
              <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6, marginBottom: '16px' }}>{brief.architecture}</p>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {brief.techStack.map((tech: string, idx: number) => (
                  <span
                    key={idx}
                    style={{
                      background: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                      color: '#60a5fa',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 500
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Core Features */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>2. Core Feature Specifications</h3>
              <div style={{ display: 'grid', gap: '10px' }}>
                {brief.features.map((feat: string, idx: number) => (
                  <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', color: '#cbd5e1', fontSize: '14px' }}>
                    <CheckCircle2 size={16} color="#10b981" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Assessment */}
            <div>
              <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>3. Risk Assessment & Mitigations</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', fontSize: '13px' }}>
                      <th style={{ padding: '8px 12px' }}>Identified Risk</th>
                      <th style={{ padding: '8px 12px' }}>Severity</th>
                      <th style={{ padding: '8px 12px', color: '#10b981' }}>DevNexus Recommended Mitigation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {brief.risks.map((risk: any, idx: number) => (
                      <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '13px' }}>
                        <td style={{ padding: '12px', color: '#f8fafc', fontWeight: 500 }}>{risk.risk}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            color: '#f87171',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 600
                          }}>
                            HIGH
                          </span>
                        </td>
                        <td style={{ padding: '12px', color: '#34d399', lineHeight: 1.4 }}>{risk.mitigation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Human Advisor fallback */}
      <div className="glass-card" style={{ padding: '32px', marginTop: '48px', borderLeft: '4px solid #8b5cf6' }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '18px', marginBottom: '6px' }}>Expert Human Advisor Fallback</h3>
            <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: 1.5 }}>
              If your software request contains highly specialized cryptographic requirements, custom SOC2 auditing needs, or requires a custom WebRTC integration, book an on-demand consultation.
            </p>
          </div>
          <button
            onClick={() => setSelectedExpert('sarah')}
            style={{
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              color: '#a78bfa',
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            Consult Expert Network <ChevronRight size={16} />
          </button>
        </div>

        {selectedExpert && (
          <div style={{
            background: 'rgba(0,0,0,0.2)',
            padding: '20px',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.05)',
            marginTop: '20px',
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            flexWrap: 'wrap',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=80&q=80"
              alt="Sarah"
              style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '15px' }}>Sarah Vance, Senior Solutions Engineer</h4>
              <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '8px' }}>Security & Asymmetric Cryptography • 12 years exp</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>Rate: $180/hr</span>
                <span style={{ fontSize: '11px', background: 'rgba(16,185,129,0.1)', color: '#34d399', padding: '2px 6px', borderRadius: '4px' }}>Available Today</span>
              </div>
            </div>
            <button
              onClick={() => {
                alert('Demo: Redirecting to booking calendar (via Cal.com integration). Expert notified of your scope brief.');
                setSelectedExpert(null);
              }}
              style={{
                background: '#8b5cf6',
                border: 'none',
                color: '#fff',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Book 30m Session
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
