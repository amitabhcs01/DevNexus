import { useState } from 'react';
import { Cpu, HelpCircle, FileText, UserCheck, Calendar, DollarSign, ArrowRight, ShieldCheck, ChevronRight, CheckCircle2, AlertTriangle, Lightbulb, Workflow, ShieldAlert, Sparkles, Key } from 'lucide-react';
import type { ProjectBrief } from '../types';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import { getAdvisoryArchetype } from '../data/advisoryArchetypes';

interface AdvisoryHubProps {
  onNavigateToMarketplace: (filters: { skills: string[]; budget: number }) => void;
}

// YC-Level Advisor Local Compiler (v2) calling clean dynamic archetypes
const compileAdvisoryReport = (inputQuery: string): ProjectBrief => {
  return getAdvisoryArchetype(inputQuery);
};

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

    // Simulate backend handshake or hit API, then parse into high fidelity YC advisor format
    try {
      const res = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: inputQuery })
      });
      
      if (!res.ok) throw new Error('API server down');
      
      const data = await res.json();
      
      // Inject YC advisor sections if the backend returns the old legacy schema
      if (!data.overview) {
        const compiled = compileAdvisoryReport(inputQuery);
        // Override with backend estimations if available
        compiled.title = data.title || compiled.title;
        compiled.techStack = data.techStack || compiled.techStack;
        compiled.estimatedCost = data.estimatedCost || compiled.estimatedCost;
        compiled.estimatedTimeline = data.estimatedTimeline || compiled.estimatedTimeline;
        setBrief(compiled);
      } else {
        setBrief(data);
      }

      // Save to Supabase Database if credentials are set
      if (isSupabaseConfigured) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const compiledReport = compileAdvisoryReport(inputQuery);
          const { error } = await supabase.from('briefs').insert({
            id: data.id || compiledReport.id,
            user_id: user.id,
            title: data.title || compiledReport.title,
            description: inputQuery,
            tech_stack: data.techStack || compiledReport.techStack,
            estimated_cost: data.estimatedCost || compiledReport.estimatedCost,
            estimated_timeline: data.estimatedTimeline || compiledReport.estimatedTimeline,
            architecture: compiledReport.overview,
            features: compiledReport.functionalRequirements,
            risks: compiledReport.spinoff
          });
          if (error) console.error('Failed to store brief in Supabase DB:', error.message);
          else console.log('Successfully saved project brief in Supabase DB.');
        }
      }
    } catch (err) {
      console.warn('Backend server down. Compiling high-fidelity brief locally:', err);
      // Compile the report locally with YC advisor standards
      const localReport = compileAdvisoryReport(inputQuery);
      setBrief(localReport);
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

      <div style={{ display: 'grid', gap: '32px' }}>
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
              {isAnalyzing ? 'Analyzing architecture...' : 'Generate 360° Report'}
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
            <p style={{ color: '#94a3b8', fontSize: '14px' }}>Compiling YC advisory brief, tech stack options, and system requirements...</p>
          </div>
        )}

        {/* Results Solution Brief Panel */}
        {brief && !isAnalyzing && (
          <div style={{ display: 'grid', gap: '32px', animation: 'fadeIn 0.5s ease-out' }}>
            
            {/* Header brief info */}
            <div className="glass-card" style={{ padding: '32px', borderLeft: '4px solid #3b82f6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '20px' }}>
                <div>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Advisory Report</span>
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
                    <FileText size={14} /> Export Report
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

              {/* Cost Timeline Info Row */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
                marginBottom: '32px'
              }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.01)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '13px', marginBottom: '8px' }}>
                    <DollarSign size={14} color="#10b981" /> Estimated Cost
                  </div>
                  <h3 style={{ fontSize: '20px', color: '#10b981', fontWeight: 700 }}>{brief.estimatedCost}</h3>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.01)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '13px', marginBottom: '8px' }}>
                    <Calendar size={14} color="#3b82f6" /> Estimated Timeline
                  </div>
                  <h3 style={{ fontSize: '20px', color: '#60a5fa', fontWeight: 700 }}>{brief.estimatedTimeline}</h3>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.01)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '13px', marginBottom: '8px' }}>
                    <ShieldCheck size={14} color="#8b5cf6" /> Vetting Compliance
                  </div>
                  <h3 style={{ fontSize: '20px', color: '#8b5cf6', fontWeight: 700 }}>ISO & SOC2 Ready</h3>
                </div>
              </div>

              {/* 1. Idea Overview */}
              <div>
                <h3 style={{ fontSize: '16px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Lightbulb size={16} color="#3b82f6" /> 1. Idea Overview
                </h3>
                <div style={{ background: 'rgba(59, 130, 246, 0.02)', border: '1px solid rgba(59, 130, 246, 0.1)', padding: '18px', borderRadius: '8px', color: '#cbd5e1', fontSize: '14px', lineHeight: 1.6 }}>
                  {brief.overview}
                </div>
              </div>
            </div>

            {/* 2. Technical Pros & Cons */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid #10b981' }}>
                <h3 style={{ fontSize: '15px', marginBottom: '16px', color: '#34d399', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} /> Technical Pros / Feasibility
                </h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {brief.pros.map((pro, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'start', fontSize: '13px', color: '#94a3b8', lineHeight: 1.5 }}>
                      <span style={{ color: '#10b981', fontWeight: 'bold' }}>•</span>
                      <span>{pro}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid #ef4444' }}>
                <h3 style={{ fontSize: '15px', marginBottom: '16px', color: '#f87171', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={16} /> Technical Cons / Risks
                </h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {brief.cons.map((con, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'start', fontSize: '13px', color: '#94a3b8', lineHeight: 1.5 }}>
                      <span style={{ color: '#ef4444', fontWeight: 'bold' }}>•</span>
                      <span>{con}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Cross Ideas & Adjacent Concepts */}
            <div className="glass-card" style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Workflow size={16} color="#8b5cf6" /> 3. Cross Ideas / Related Concepts
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {brief.crossIdeas.map((idea, idx) => (
                  <div key={idx} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', padding: '20px', borderRadius: '10px' }}>
                    <h4 style={{ fontSize: '14px', color: '#a78bfa', marginBottom: '8px', fontWeight: 600 }}>{idea.title}</h4>
                    <p style={{ fontSize: '12.5px', color: '#94a3b8', lineHeight: 1.5 }}>{idea.explanation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Implementation Plan */}
            <div className="glass-card" style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={16} color="#3b82f6" /> 4. Implementation Plan
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                
                {/* Phase 1 */}
                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '10px', padding: '20px' }}>
                  <h4 style={{ fontSize: '14px', color: '#cbd5e1', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                    {brief.implementationPlan.phase1.title}
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                    {brief.implementationPlan.phase1.techStack.map((tech, idx) => (
                      <span key={idx} style={{ fontSize: '10px', background: 'rgba(59,130,246,0.1)', color: '#60a5fa', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    {brief.implementationPlan.phase1.features.map((feat, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '8px', fontSize: '12px', color: '#94a3b8', lineHeight: 1.4 }}>
                        <span style={{ color: '#3b82f6' }}>✔</span>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Phase 2 */}
                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '10px', padding: '20px' }}>
                  <h4 style={{ fontSize: '14px', color: '#cbd5e1', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                    {brief.implementationPlan.phase2.title}
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                    {brief.implementationPlan.phase2.techStack.map((tech, idx) => (
                      <span key={idx} style={{ fontSize: '10px', background: 'rgba(139,92,246,0.1)', color: '#a78bfa', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    {brief.implementationPlan.phase2.features.map((feat, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '8px', fontSize: '12px', color: '#94a3b8', lineHeight: 1.4 }}>
                        <span style={{ color: '#8b5cf6' }}>✔</span>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Phase 3 */}
                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '10px', padding: '20px' }}>
                  <h4 style={{ fontSize: '14px', color: '#cbd5e1', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                    {brief.implementationPlan.phase3.title}
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                    {brief.implementationPlan.phase3.techStack.map((tech, idx) => (
                      <span key={idx} style={{ fontSize: '10px', background: 'rgba(16,185,129,0.1)', color: '#34d399', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    {brief.implementationPlan.phase3.features.map((feat, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '8px', fontSize: '12px', color: '#94a3b8', lineHeight: 1.4 }}>
                        <span style={{ color: '#10b981' }}>✔</span>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Timeline Implementation Roadmap */}
            <div className="glass-card" style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Workflow size={16} color="#fb923c" /> 5. Timeline Implementation Roadmap
              </h3>
              
              {/* Stages Table */}
              <div style={{ overflowX: 'auto', marginBottom: '28px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', fontSize: '13px' }}>
                      <th style={{ padding: '10px 16px', fontWeight: 600 }}>Stage</th>
                      <th style={{ padding: '10px 16px', fontWeight: 600 }}>Timeframe</th>
                      <th style={{ padding: '10px 16px', fontWeight: 600 }}>Key Deliverable</th>
                      <th style={{ padding: '10px 16px', fontWeight: 600 }}>Owner</th>
                    </tr>
                  </thead>
                  <tbody>
                    {brief.implementationRoadmap?.stages.map((stg, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '13px', transition: 'var(--transition-smooth)' }}>
                        <td style={{ padding: '12px 16px', color: '#f8fafc', fontWeight: 600 }}>{stg.stage}</td>
                        <td style={{ padding: '12px 16px', color: '#60a5fa', fontWeight: 500 }}>{stg.timeframe}</td>
                        <td style={{ padding: '12px 16px', color: '#94a3b8', lineHeight: 1.4 }}>{stg.deliverable}</td>
                        <td style={{ padding: '12px 16px', color: '#fb923c', fontWeight: 500 }}>{stg.owner}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Critical Path, Risk Flags, Team Size Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', padding: '20px', borderRadius: '10px' }}>
                  <h4 style={{ fontSize: '12.5px', color: '#cbd5e1', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <Key size={13} color="#fb923c" /> CRITICAL PATH
                  </h4>
                  <p style={{ fontSize: '12.5px', color: '#94a3b8', lineHeight: 1.5 }}>
                    {brief.implementationRoadmap?.criticalPath}
                  </p>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', padding: '20px', borderRadius: '10px' }}>
                  <h4 style={{ fontSize: '12.5px', color: '#cbd5e1', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <AlertTriangle size={13} color="#ef4444" /> RISK FLAGS
                  </h4>
                  <div style={{ display: 'grid', gap: '6px' }}>
                    {brief.implementationRoadmap?.riskFlags.map((risk, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '6px', fontSize: '12px', color: '#94a3b8', lineHeight: 1.4 }}>
                        <span style={{ color: '#ef4444' }}>•</span>
                        <span>{risk}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', padding: '20px', borderRadius: '10px' }}>
                  <h4 style={{ fontSize: '12.5px', color: '#cbd5e1', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <UserCheck size={13} color="#10b981" /> RECOMMENDED TEAM SIZE
                  </h4>
                  <p style={{ fontSize: '12.5px', color: '#94a3b8', lineHeight: 1.5 }}>
                    {brief.implementationRoadmap?.recommendedTeamSize}
                  </p>
                </div>
              </div>
            </div>

            {/* 6. Functional & 7. Non-Functional Requirements */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              
              {/* Functional Requirements */}
              <div className="glass-card" style={{ padding: '28px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '16px', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={16} color="#3b82f6" /> 6. Functional Requirements
                </h3>
                <div style={{ display: 'grid', gap: '10px' }}>
                  {brief.functionalRequirements.map((req, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '10px', fontSize: '13px', color: '#94a3b8', lineHeight: 1.4 }}>
                      <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>{idx + 1}.</span>
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Non-Functional Requirements */}
              <div className="glass-card" style={{ padding: '28px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '16px', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldAlert size={16} color="#ef4444" /> 7. Non-Functional Requirements
                </h3>
                <div style={{ display: 'grid', gap: '14px' }}>
                  <div>
                    <h5 style={{ fontSize: '11px', color: '#ef4444', fontWeight: 600, letterSpacing: '0.05em' }}>PERFORMANCE</h5>
                    <p style={{ fontSize: '12.5px', color: '#94a3b8', marginTop: '2px', lineHeight: 1.4 }}>{brief.nonFunctionalRequirements.performance}</p>
                  </div>
                  <div>
                    <h5 style={{ fontSize: '11px', color: '#34d399', fontWeight: 600, letterSpacing: '0.05em' }}>SECURITY</h5>
                    <p style={{ fontSize: '12.5px', color: '#94a3b8', marginTop: '2px', lineHeight: 1.4 }}>{brief.nonFunctionalRequirements.security}</p>
                  </div>
                  <div>
                    <h5 style={{ fontSize: '11px', color: '#60a5fa', fontWeight: 600, letterSpacing: '0.05em' }}>SCALABILITY</h5>
                    <p style={{ fontSize: '12.5px', color: '#94a3b8', marginTop: '2px', lineHeight: 1.4 }}>{brief.nonFunctionalRequirements.scalability}</p>
                  </div>
                  <div>
                    <h5 style={{ fontSize: '11px', color: '#a78bfa', fontWeight: 600, letterSpacing: '0.05em' }}>AVAILABILITY</h5>
                    <p style={{ fontSize: '12.5px', color: '#94a3b8', marginTop: '2px', lineHeight: 1.4 }}>{brief.nonFunctionalRequirements.availability}</p>
                  </div>
                  <div>
                    <h5 style={{ fontSize: '11px', color: '#fb923c', fontWeight: 600, letterSpacing: '0.05em' }}>COMPLIANCE</h5>
                    <p style={{ fontSize: '12.5px', color: '#94a3b8', marginTop: '2px', lineHeight: 1.4 }}>{brief.nonFunctionalRequirements.compliance}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 8. Unique Spin-off Tool Idea */}
            <div className="glass-card" style={{ padding: '32px', background: 'radial-gradient(circle at 100% 100%, rgba(139, 92, 246, 0.05) 0%, transparent 60%)', border: '1px solid rgba(139, 92, 246, 0.15)' }}>
              <div style={{ display: 'inline-flex', padding: '8px', borderRadius: '8px', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', marginBottom: '16px' }}>
                <Sparkles size={18} />
              </div>
              <span style={{ fontSize: '11px', color: '#a78bfa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>Standalone Innovation Spinoff</span>
              
              <h3 style={{ fontSize: '18px', color: '#fff', marginBottom: '12px' }}>{brief.spinoff.name}</h3>
              <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: 1.5, marginBottom: '20px' }}>{brief.spinoff.description}</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                <div>
                  <h5 style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>CORE USE CASE</h5>
                  <p style={{ fontSize: '12.5px', color: '#94a3b8', marginTop: '4px', lineHeight: 1.4 }}>{brief.spinoff.useCase}</p>
                </div>
                <div>
                  <h5 style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>MARKET GAP / UNIQUENESS</h5>
                  <p style={{ fontSize: '12.5px', color: '#94a3b8', marginTop: '4px', lineHeight: 1.4 }}>{brief.spinoff.uniqueness}</p>
                </div>
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
