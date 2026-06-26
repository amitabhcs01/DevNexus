import React, { useState } from 'react';
import { TrendingUp, DollarSign, Users, ShieldAlert, CheckCircle, BarChart3, PieChart, Activity } from 'lucide-react';

interface DashboardProps {
  user?: any;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const userEmail = user?.email || '';
  const initialRole = userEmail === 'admin@devnexus.local' 
    ? 'admin' 
    : userEmail === 'developer@devnexus.local' || user?.user_metadata?.role === 'developer'
      ? 'developer'
      : 'client';

  const [roleMode, setRoleMode] = useState<'admin' | 'client' | 'developer'>(initialRole);

  // Milestone data from Pitch Deck Section 8.2
  const milestones = [
    { month: 'Month 1', target: '$290', milestone: 'First 10 paying developer subscriptions ($29/mo)' },
    { month: 'Month 1', target: '$500', milestone: 'First 5 advisory sessions sold ($100 avg)' },
    { month: 'Month 2', target: '$2,250', milestone: 'First 3 project commissions (avg $5K project, 15% fee)' },
    { month: 'Month 3', target: '$4,450', milestone: '50 developer subscriptions + 20 advisory sessions' },
    { month: 'Month 4', target: '$1,990', milestone: 'Deal room launch — first 10 secure sessions ($199 tier)' },
    { month: 'Month 6', target: '$18,000+', milestone: '100 active developers + consistent B2B deal rooms' },
    { month: 'Month 8', target: '$35,000+', milestone: 'First Enterprise client licensing (deal room + API)' },
    { month: 'Month 12', target: '$80,000+', milestone: 'Series A readiness benchmark ($1M ARR)' }
  ];

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
            <BarChart3 size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '28px', marginBottom: '4px' }}>Analytics & Revenue Dashboard</h1>
            <p style={{ color: '#94a3b8', fontSize: '14px' }}>Track platform metrics, revenue streams, and projected 12-month MRR growth milestones.</p>
          </div>
        </div>

        {/* Role Toggle Selector */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          padding: '4px',
          borderRadius: '8px',
          display: 'flex',
          gap: '4px'
        }}>
          {['admin', 'client', 'developer'].map((role) => (
            <button
              key={role}
              onClick={() => setRoleMode(role as any)}
              style={{
                background: roleMode === role ? '#3b82f6' : 'transparent',
                border: 'none',
                color: roleMode === role ? '#fff' : '#64748b',
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                textTransform: 'uppercase',
                transition: 'var(--transition-smooth)'
              }}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* 1. PLATFORM ADMIN DASHBOARD */}
      {roleMode === 'admin' && (
        <div style={{ display: 'grid', gap: '32px' }}>
          {/* Admin Cards Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px'
          }}>
            <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid #10b981' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '12px', marginBottom: '8px', fontWeight: 600 }}>
                <span>PLATFORM GMV</span>
                <TrendingUp size={14} color="#10b981" />
              </div>
              <h3 style={{ fontSize: '28px', color: '#10b981', fontWeight: 800 }}>$142,500</h3>
              <p style={{ color: '#94a3b8', fontSize: '11px', marginTop: '6px' }}>+18% growth month-over-month</p>
            </div>

            <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid #3b82f6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '12px', marginBottom: '8px', fontWeight: 600 }}>
                <span>MONTHLY RECURRING (MRR)</span>
                <DollarSign size={14} color="#3b82f6" />
              </div>
              <h3 style={{ fontSize: '28px', color: '#60a5fa', fontWeight: 800 }}>$18,450</h3>
              <p style={{ color: '#94a3b8', fontSize: '11px', marginTop: '6px' }}>Target: $80,000 by Month 12</p>
            </div>

            <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid #8b5cf6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '12px', marginBottom: '8px', fontWeight: 600 }}>
                <span>VETTED DEVELOPERS</span>
                <Users size={14} color="#8b5cf6" />
              </div>
              <h3 style={{ fontSize: '28px', color: '#a78bfa', fontWeight: 800 }}>102</h3>
              <p style={{ color: '#94a3b8', fontSize: '11px', marginTop: '6px' }}>24 applications in review pipeline</p>
            </div>

            <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid #f97316' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '12px', marginBottom: '8px', fontWeight: 600 }}>
                <span>COMPLETED DEAL ROOMS</span>
                <ShieldAlert size={14} color="#f97316" />
              </div>
              <h3 style={{ fontSize: '28px', color: '#fb923c', fontWeight: 800 }}>54</h3>
              <p style={{ color: '#94a3b8', fontSize: '11px', marginTop: '6px' }}>Zero security issues reported</p>
            </div>
          </div>

          {/* Graphs Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px', alignItems: 'start' }}>
            
            {/* Project MRR Target Graph */}
            <div className="glass-card" style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={16} color="#3b82f6" /> 12-Month Milestone Targets (MRR)
              </h3>
              
              {/* Custom bar chart */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '200px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
                
                {/* Horizontal Guide Lines */}
                <div style={{ position: 'absolute', left: 0, right: 0, top: '25%', borderTop: '1px dashed rgba(255,255,255,0.03)' }} />
                <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', borderTop: '1px dashed rgba(255,255,255,0.03)' }} />
                <div style={{ position: 'absolute', left: 0, right: 0, top: '75%', borderTop: '1px dashed rgba(255,255,255,0.03)' }} />

                {/* Bars */}
                {[
                  { month: 'M1', val: 290, pct: 5, label: '$290' },
                  { month: 'M1.2', val: 790, pct: 10, label: '$790' },
                  { month: 'M2', val: 2250, pct: 25, label: '$2.2K' },
                  { month: 'M3', val: 4450, pct: 40, label: '$4.4K' },
                  { month: 'M4', val: 6440, pct: 55, label: '$6.4K' },
                  { month: 'M6', val: 18000, pct: 75, label: '$18K' },
                  { month: 'M8', val: 35000, pct: 85, label: '$35K' },
                  { month: 'M12', val: 80000, pct: 100, label: '$80K' }
                ].map((bar, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '10%', height: '100%', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: '10px', color: '#60a5fa', fontWeight: 600, marginBottom: '6px' }}>{bar.label}</span>
                    <div style={{
                      width: '100%',
                      height: `${bar.pct}%`,
                      background: 'linear-gradient(180deg, #3b82f6 0%, rgba(59, 130, 246, 0.1) 100%)',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.8s ease-out'
                    }} />
                    <span style={{ fontSize: '11px', color: '#64748b', marginTop: '8px' }}>{bar.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue Splits */}
            <div className="glass-card" style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PieChart size={16} color="#8b5cf6" /> Revenue Splits
              </h3>
              
              <div style={{ display: 'grid', gap: '20px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                    <span>Developer Subscriptions ($29/mo)</span>
                    <span style={{ fontWeight: 600, color: '#60a5fa' }}>42%</span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: '42%', background: '#3b82f6' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                    <span>Developer Commissions (15%)</span>
                    <span style={{ fontWeight: 600, color: '#34d399' }}>35%</span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: '35%', background: '#10b981' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                    <span>Advisory Session Fees</span>
                    <span style={{ fontWeight: 600, color: '#a78bfa' }}>23%</span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: '23%', background: '#8b5cf6' }} />
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '24px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '11px', color: '#64748b', lineHeight: 1.4 }}>
                Platform operations are auto-managed via Stripe Connect splits, reducing administrative billing overhead to near zero.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. CLIENT ANALYTICS */}
      {roleMode === 'client' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>
          {/* Main client info */}
          <div className="glass-card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '20px' }}>Active Contract Engagements</h3>
            
            <div style={{ display: 'grid', gap: '16px' }}>
              <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '10px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h4 style={{ fontSize: '15px', color: '#cbd5e1' }}>Alex Rivers — E2E Encrypted Deal Room</h4>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Phase 3 Milestones: WebRTC Secure Signaling</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#10b981' }}>$115/hr</div>
                  <span style={{ fontSize: '11px', background: 'rgba(16,185,129,0.1)', color: '#34d399', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>Active</span>
                </div>
              </div>
              
              <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '10px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h4 style={{ fontSize: '15px', color: '#cbd5e1' }}>Priya Sharma — AI Legal NDA Template Analyzer</h4>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Completed Session: 2 hours</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#cbd5e1' }}>$270 paid</div>
                  <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.05)', color: '#94a3b8', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>Settled</span>
                </div>
              </div>
            </div>
          </div>

          {/* Client right side */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '15px', marginBottom: '16px' }}>Spend Metrics</h3>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b' }}>TOTAL OUTLAY</span>
                <h4 style={{ fontSize: '24px', color: '#fff', fontWeight: 700 }}>$14,580</h4>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b' }}>ACTIVE BUDGET POOLS</span>
                <h4 style={{ fontSize: '24px', color: '#3b82f6', fontWeight: 700 }}>$20,000</h4>
              </div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
                <span style={{ fontSize: '11px', color: '#64748b' }}>AI MATCH EFFICIENCY</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <Activity size={16} color="#10b981" />
                  <span style={{ fontSize: '14px', color: '#10b981', fontWeight: 600 }}>98.4% Match Rate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. DEVELOPER ANALYTICS */}
      {roleMode === 'developer' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>
          
          <div className="glass-card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '20px' }}>Your Earnings Summary</h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '20px',
              marginBottom: '32px'
            }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: '11px', color: '#64748b' }}>EARNED THIS MONTH</span>
                <h4 style={{ fontSize: '22px', color: '#10b981', marginTop: '4px' }}>$8,240</h4>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: '11px', color: '#64748b' }}>BILLABLE HOURS</span>
                <h4 style={{ fontSize: '22px', color: '#60a5fa', marginTop: '4px' }}>72.5 hrs</h4>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: '11px', color: '#64748b' }}>COMMISSIONS MET</span>
                <h4 style={{ fontSize: '22px', color: '#a78bfa', marginTop: '4px' }}>$1,236</h4>
              </div>
            </div>

            <h3 style={{ fontSize: '15px', marginBottom: '16px' }}>Registry Exposure Statistics</h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span>Profile views in last 7 days:</span>
                <span style={{ fontWeight: 600 }}>182 views</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span>AI matches occurred:</span>
                <span style={{ fontWeight: 600 }}>24 matches</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span>Average Match Score weight:</span>
                <span style={{ fontWeight: 600, color: '#34d399' }}>92.4%</span>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '15px', marginBottom: '16px' }}>Featured Subscriptions</h3>
            <div style={{ background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                <span style={{ color: '#60a5fa' }}>Featured Developer Plan</span>
                <span>$29/mo</span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '11px', lineHeight: 1.4 }}>
                Your profile gets priority matching in AI query results (additional 5% visibility weight index).
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '12px' }}>
              <CheckCircle size={14} /> Subscription Active (Renews July 26, 2026)
            </div>
          </div>
        </div>
      )}

      {/* Projections Milestone Grid */}
      <div className="glass-card" style={{ padding: '32px', marginTop: '40px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp color="#3b82f6" size={18} /> DevNexus 12-Month MRR Projections
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', fontSize: '13px' }}>
                <th style={{ padding: '10px 16px' }}>Milestone Target</th>
                <th style={{ padding: '10px 16px' }}>Expected MRR</th>
                <th style={{ padding: '10px 16px' }}>Description of Target Activity</th>
              </tr>
            </thead>
            <tbody>
              {milestones.map((ms, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '13px' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: '#cbd5e1' }}>{ms.month}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: '#34d399' }}>{ms.target}</td>
                  <td style={{ padding: '12px 16px', color: '#94a3b8' }}>{ms.milestone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
