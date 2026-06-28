import React, { useState, useEffect } from 'react';
import { 
  User, Trash2, Edit3, Save, 
  Briefcase, GraduationCap, Check, AlertCircle, 
  X, DollarSign, Globe, Activity, Loader2
} from 'lucide-react';
import type { Developer } from '../types';
import { supabase, isSupabaseConfigured } from '../supabaseClient';

const Github = (props: React.SVGProps<SVGSVGElement> & { size?: number }) => {
  const { size = 24, ...rest } = props;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
};

interface ProfileManagerProps {
  currentDeveloper: Developer;
  onProfileUpdated: (updatedDev: Developer) => void;
}

interface ToastMessage {
  id: string;
  type: 'success' | 'error';
  text: string;
}

export const ProfileManager: React.FC<ProfileManagerProps> = ({ 
  currentDeveloper, 
  onProfileUpdated 
}) => {
  // Developer state
  const [name, setName] = useState(currentDeveloper.name || '');
  const [title, setTitle] = useState(currentDeveloper.title || '');
  const [bio, setBio] = useState(currentDeveloper.bio || '');
  const [avatar, setAvatar] = useState(currentDeveloper.avatar || '');
  const [location, setLocation] = useState((currentDeveloper as any).location || '');
  const [gitHubUsername, setGitHubUsername] = useState(currentDeveloper.gitHubUsername || '');
  const [hourlyRate, setHourlyRate] = useState(currentDeveloper.hourlyRate || 100);
  const [availability, setAvailability] = useState<string>(currentDeveloper.availability || 'Available Now');
  const [niche, setNiche] = useState(currentDeveloper.niche || 'SaaS Software Development');
  
  // Skills tags
  const [skills, setSkills] = useState<string[]>(currentDeveloper.skills || []);
  const [newSkill, setNewSkill] = useState('');

  // Portfolios
  const [projectPortfolio, setProjectPortfolio] = useState<any[]>(
    (currentDeveloper as any).projectPortfolio || []
  );
  const [workHistory, setWorkHistory] = useState<any[]>(
    (currentDeveloper as any).workHistory || []
  );
  const [education, setEducation] = useState<any[]>(
    (currentDeveloper as any).education || []
  );
  const [certifications, setCertifications] = useState<any[]>(
    (currentDeveloper as any).certifications || []
  );

  // Modal / Form States for sub-elements
  const [activeTab, setActiveTab] = useState<'basic' | 'skills' | 'portfolio' | 'work' | 'education'>('basic');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Temporary forms for lists
  const [editingProjectIndex, setEditingProjectIndex] = useState<number | null>(null);
  const [projectForm, setProjectForm] = useState({
    projectName: '', description: '', techStack: '', liveUrl: '', repoUrl: '', role: 'Solo Creator', duration: '', achievements: ''
  });

  const [editingWorkIndex, setEditingWorkIndex] = useState<number | null>(null);
  const [workForm, setWorkForm] = useState({
    companyName: '', role: '', duration: '', description: '', techStack: ''
  });

  const [editingEducationIndex, setEditingEducationIndex] = useState<number | null>(null);
  const [eduForm, setEduForm] = useState({
    degree: '', institution: '', year: ''
  });

  const [editingCertIndex, setEditingCertIndex] = useState<number | null>(null);
  const [certForm, setCertForm] = useState({
    name: '', issuer: '', year: '', link: ''
  });

  // Add toast function
  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    const id = Math.random().toString();
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Sync state if developer prop changes
  useEffect(() => {
    setName(currentDeveloper.name || '');
    setTitle(currentDeveloper.title || '');
    setBio(currentDeveloper.bio || '');
    setAvatar(currentDeveloper.avatar || '');
    setLocation((currentDeveloper as any).location || '');
    setGitHubUsername(currentDeveloper.gitHubUsername || '');
    setHourlyRate(currentDeveloper.hourlyRate || 100);
    setAvailability(currentDeveloper.availability || 'Available Now');
    setNiche(currentDeveloper.niche || 'SaaS Software Development');
    setSkills(currentDeveloper.skills || []);
    setProjectPortfolio((currentDeveloper as any).projectPortfolio || []);
    setWorkHistory((currentDeveloper as any).workHistory || []);
    setEducation((currentDeveloper as any).education || []);
    setCertifications((currentDeveloper as any).certifications || []);
  }, [currentDeveloper]);

  // Main Save Handler
  const handleSaveProfile = async (silent = false) => {
    setIsSaving(true);
    
    // Construct updated developer object
    const updatedDev: Developer = {
      ...currentDeveloper,
      name,
      title,
      bio,
      avatar,
      skills,
      hourlyRate: Number(hourlyRate),
      availability: availability as any,
      gitHubUsername,
      niche,
      techStack: skills,
      projectHistory: currentDeveloper.projectHistory || []
    };

    // Attach custom portfolio fields
    (updatedDev as any).location = location;
    (updatedDev as any).projectPortfolio = projectPortfolio;
    (updatedDev as any).workHistory = workHistory;
    (updatedDev as any).education = education;
    (updatedDev as any).certifications = certifications;

    try {
      // 1. Save to Backend Database API
      const response = await fetch('http://localhost:5000/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: currentDeveloper.id,
          developer: updatedDev
        })
      });

      if (!response.ok) throw new Error('Backend failed to update profile');
      await response.json();

      // 2. Save to Supabase if configured
      if (isSupabaseConfigured) {
        // Prepare bio string with serialized portfolio data to bypass schema limitations
        const serializedMetadata = JSON.stringify({
          location,
          projectPortfolio,
          workHistory,
          education,
          certifications
        });
        const combinedBio = `${bio}\n\n===METADATA===\n${serializedMetadata}`;

        const { error: devError } = await supabase
          .from('developers')
          .update({
            name,
            title,
            bio: combinedBio,
            skills,
            hourly_rate: Number(hourlyRate),
            availability,
            git_username: gitHubUsername,
            niche
          })
          .eq('id', currentDeveloper.id);

        if (devError) {
          console.warn('Supabase developers update skipped/failed, fallback to API:', devError.message);
        }

        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            full_name: name,
            key_skills: skills.join(', '),
            portfolio_link: gitHubUsername ? `https://github.com/${gitHubUsername}` : '',
            hourly_rate: Number(hourlyRate)
          })
          .eq('id', currentDeveloper.id);
          
        if (profileError) console.warn('Supabase profiles update skipped:', profileError.message);
      }

      onProfileUpdated(updatedDev);
      if (!silent) {
        showToast('Profile parameters synchronized and updated successfully!', 'success');
      }
    } catch (err: any) {
      console.error(err);
      showToast(`Failed to sync profile: ${err.message}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Skill Tags Management
  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  // Project Portfolio Add/Edit/Delete
  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.projectName.trim()) return;

    if (editingProjectIndex !== null) {
      const updated = [...projectPortfolio];
      updated[editingProjectIndex] = projectForm;
      setProjectPortfolio(updated);
      setEditingProjectIndex(null);
      showToast('Project updated. Remember to Save Changes.');
    } else {
      setProjectPortfolio([...projectPortfolio, projectForm]);
      showToast('Project added to portfolio. Remember to Save Changes.');
    }
    setProjectForm({
      projectName: '', description: '', techStack: '', liveUrl: '', repoUrl: '', role: 'Solo Creator', duration: '', achievements: ''
    });
  };

  const handleEditProject = (idx: number) => {
    setEditingProjectIndex(idx);
    setProjectForm(projectPortfolio[idx]);
  };

  const handleDeleteProject = (idx: number) => {
    setProjectPortfolio(projectPortfolio.filter((_, i) => i !== idx));
    showToast('Project removed. Remember to Save Changes.');
  };

  // Work History Add/Edit/Delete
  const handleWorkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workForm.companyName.trim()) return;

    if (editingWorkIndex !== null) {
      const updated = [...workHistory];
      updated[editingWorkIndex] = workForm;
      setWorkHistory(updated);
      setEditingWorkIndex(null);
      showToast('Work history entry updated. Remember to Save Changes.');
    } else {
      setWorkHistory([...workHistory, workForm]);
      showToast('Work history entry added. Remember to Save Changes.');
    }
    setWorkForm({
      companyName: '', role: '', duration: '', description: '', techStack: ''
    });
  };

  const handleEditWork = (idx: number) => {
    setEditingWorkIndex(idx);
    setWorkForm(workHistory[idx]);
  };

  const handleDeleteWork = (idx: number) => {
    setWorkHistory(workHistory.filter((_, i) => i !== idx));
    showToast('Work history removed. Remember to Save Changes.');
  };

  // Education Add/Edit/Delete
  const handleEduSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eduForm.degree.trim()) return;

    if (editingEducationIndex !== null) {
      const updated = [...education];
      updated[editingEducationIndex] = eduForm;
      setEducation(updated);
      setEditingEducationIndex(null);
      showToast('Education entry updated. Remember to Save Changes.');
    } else {
      setEducation([...education, eduForm]);
      showToast('Education entry added. Remember to Save Changes.');
    }
    setEduForm({ degree: '', institution: '', year: '' });
  };

  const handleDeleteEdu = (idx: number) => {
    setEducation(education.filter((_, i) => i !== idx));
    showToast('Education removed. Remember to Save Changes.');
  };

  // Certifications Add/Edit/Delete
  const handleCertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certForm.name.trim()) return;

    if (editingCertIndex !== null) {
      const updated = [...certifications];
      updated[editingCertIndex] = certForm;
      setCertifications(updated);
      setEditingCertIndex(null);
      showToast('Certification updated. Remember to Save Changes.');
    } else {
      setCertifications([...certifications, certForm]);
      showToast('Certification added. Remember to Save Changes.');
    }
    setCertForm({ name: '', issuer: '', year: '', link: '' });
  };

  const handleDeleteCert = (idx: number) => {
    setCertifications(certifications.filter((_, i) => i !== idx));
    showToast('Certification removed. Remember to Save Changes.');
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '32px', minHeight: '600px', animation: 'fadeIn 0.5s ease-out' }}>
      
      {/* Toast Notification Container */}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 99999, display: 'grid', gap: '10px' }}>
        {toasts.map(toast => (
          <div 
            key={toast.id} 
            className="glass-card" 
            style={{ 
              padding: '16px 24px', 
              borderLeft: `4px solid ${toast.type === 'success' ? '#10b981' : '#ef4444'}`,
              background: '#0e1422',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              minWidth: '320px',
              animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {toast.type === 'success' ? (
              <Check size={20} color="#10b981" />
            ) : (
              <AlertCircle size={20} color="#ef4444" />
            )}
            <div style={{ flex: 1, fontSize: '13px', color: '#cbd5e1', fontWeight: 500 }}>{toast.text}</div>
            <button 
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Left Sidebar Sections Navigation */}
      <div className="glass-card" style={{ padding: '20px', height: 'fit-content', display: 'grid', gap: '6px' }}>
        <h3 style={{ fontSize: '14px', textTransform: 'uppercase', color: '#64748b', marginBottom: '12px', paddingLeft: '12px', fontWeight: 700 }}>Settings Node</h3>
        
        <button
          onClick={() => setActiveTab('basic')}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '8px', border: 'none',
            background: activeTab === 'basic' ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
            color: activeTab === 'basic' ? '#60a5fa' : '#94a3b8',
            textAlign: 'left', cursor: 'pointer', fontSize: '13px', fontWeight: 600, transition: 'var(--transition-smooth)'
          }}
        >
          <User size={16} /> Basic & Availability
        </button>

        <button
          onClick={() => setActiveTab('skills')}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '8px', border: 'none',
            background: activeTab === 'skills' ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
            color: activeTab === 'skills' ? '#34d399' : '#94a3b8',
            textAlign: 'left', cursor: 'pointer', fontSize: '13px', fontWeight: 600, transition: 'var(--transition-smooth)'
          }}
        >
          <Activity size={16} /> Skills / Tech Stack
        </button>

        <button
          onClick={() => setActiveTab('portfolio')}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '8px', border: 'none',
            background: activeTab === 'portfolio' ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
            color: activeTab === 'portfolio' ? '#a78bfa' : '#94a3b8',
            textAlign: 'left', cursor: 'pointer', fontSize: '13px', fontWeight: 600, transition: 'var(--transition-smooth)'
          }}
        >
          <Globe size={16} /> Project Portfolio
        </button>

        <button
          onClick={() => setActiveTab('work')}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '8px', border: 'none',
            background: activeTab === 'work' ? 'rgba(249, 115, 22, 0.1)' : 'transparent',
            color: activeTab === 'work' ? '#f97316' : '#94a3b8',
            textAlign: 'left', cursor: 'pointer', fontSize: '13px', fontWeight: 600, transition: 'var(--transition-smooth)'
          }}
        >
          <Briefcase size={16} /> Work History
        </button>

        <button
          onClick={() => setActiveTab('education')}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '8px', border: 'none',
            background: activeTab === 'education' ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
            color: activeTab === 'education' ? '#34d399' : '#94a3b8',
            textAlign: 'left', cursor: 'pointer', fontSize: '13px', fontWeight: 600, transition: 'var(--transition-smooth)'
          }}
        >
          <GraduationCap size={16} /> Education & Certs
        </button>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '16px', paddingTop: '16px' }}>
          <button 
            onClick={() => handleSaveProfile(false)}
            disabled={isSaving}
            className="btn-glow-blue"
            style={{
              width: '100%', padding: '10px', borderRadius: '8px', border: 'none',
              background: '#3b82f6', color: '#fff', fontWeight: 600, fontSize: '12px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
            }}
          >
            {isSaving ? <Loader2 size={13} className="spin" /> : <Save size={13} />}
            Save All Changes
          </button>
        </div>
      </div>

      {/* Right Form Editor */}
      <div className="glass-card" style={{ padding: '32px' }}>
        
        {/* TAB 1: BASIC INFORMATION */}
        {activeTab === 'basic' && (
          <div style={{ display: 'grid', gap: '24px' }}>
            <div>
              <h3 style={{ fontSize: '18px', marginBottom: '4px' }}>Basic Info & Availability</h3>
              <p style={{ color: '#64748b', fontSize: '12px' }}>General registry identifiers and active work status details.</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>Full Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>Professional Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>Short Biography</label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} style={{ ...inputStyle, fontFamily: 'inherit', resize: 'vertical' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>Avatar Image URL</label>
                <input type="text" value={avatar} onChange={(e) => setAvatar(e.target.value)} style={inputStyle} />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>Location (City, Country)</label>
                <input type="text" value={location} placeholder="e.g. Austin, TX" onChange={(e) => setLocation(e.target.value)} style={inputStyle} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>Niche Focus Area</label>
                <input type="text" value={niche} placeholder="e.g. WebRTC & SaaS Infrastructure" onChange={(e) => setNiche(e.target.value)} style={inputStyle} />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>GitHub Username</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '10px', color: '#64748b' }}><Github size={16} /></span>
                  <input 
                    type="text" 
                    value={gitHubUsername} 
                    onChange={(e) => setGitHubUsername(e.target.value.trim())} 
                    style={{ ...inputStyle, paddingLeft: '36px' }} 
                    placeholder="Username only (fetches real public data)"
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>Hourly Billing Rate ($hr/USD)</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '10px', color: '#64748b' }}><DollarSign size={16} /></span>
                  <input 
                    type="number" 
                    value={hourlyRate} 
                    onChange={(e) => setHourlyRate(Number(e.target.value))} 
                    style={{ ...inputStyle, paddingLeft: '36px' }} 
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>Availability State</label>
                <select 
                  value={availability} 
                  onChange={(e) => setAvailability(e.target.value)} 
                  style={inputStyle}
                >
                  <option value="Available Now">Available Now</option>
                  <option value="In 1 Week">In 1 Week</option>
                  <option value="In 2 Weeks">In 2 Weeks</option>
                  <option value="Unavailable">Unavailable / Busy</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
              <button onClick={() => handleSaveProfile()} disabled={isSaving} className="btn-glow-blue" style={btnSaveStyle}>
                {isSaving ? 'Syncing...' : 'Save General changes'}
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: TECH STACK / SKILLS */}
        {activeTab === 'skills' && (
          <div style={{ display: 'grid', gap: '24px' }}>
            <div>
              <h3 style={{ fontSize: '18px', marginBottom: '4px' }}>Tech Stack & Core Skills</h3>
              <p style={{ color: '#64748b', fontSize: '12px' }}>Define technical tag indices visible in the public search registry.</p>
            </div>

            {/* Input tag */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <input 
                type="text" 
                value={newSkill} 
                onChange={(e) => setNewSkill(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                placeholder="Add technology (e.g. Next.js, Rust)" 
                style={inputStyle} 
              />
              <button 
                onClick={handleAddSkill} 
                style={{
                  background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16,185,129,0.2)',
                  color: '#34d399', padding: '0 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600
                }}
              >
                Add
              </button>
            </div>

            {/* Grid tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', minHeight: '120px', background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)' }}>
              {skills.length === 0 ? (
                <div style={{ color: '#64748b', fontSize: '12px', margin: 'auto' }}>No tech tags listed. Type above to add.</div>
              ) : (
                skills.map(skill => (
                  <div 
                    key={skill} 
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: '6px', 
                      background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59,130,246,0.15)',
                      padding: '6px 12px', borderRadius: '20px', color: '#90cdf4', fontSize: '12px', fontWeight: 500
                    }}
                  >
                    <span>{skill}</span>
                    <button 
                      onClick={() => handleRemoveSkill(skill)}
                      style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', display: 'flex', padding: 0 }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
              <button onClick={() => handleSaveProfile()} disabled={isSaving} className="btn-glow-blue" style={btnSaveStyle}>
                {isSaving ? 'Syncing...' : 'Save Skills list'}
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: PROJECT PORTFOLIO */}
        {activeTab === 'portfolio' && (
          <div style={{ display: 'grid', gap: '24px' }}>
            <div>
              <h3 style={{ fontSize: '18px', marginBottom: '4px' }}>Manual Project Portfolio</h3>
              <p style={{ color: '#64748b', fontSize: '12px' }}>List specific custom showcase projects you completed (separate from public GitHub repositories).</p>
            </div>

            {/* List existing */}
            <div style={{ display: 'grid', gap: '12px' }}>
              {projectPortfolio.map((proj, idx) => (
                <div key={idx} className="glass-card" style={{ padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '14px', color: '#f8fafc' }}>{proj.projectName}</h4>
                    <span style={{ fontSize: '11px', color: '#a78bfa' }}>{proj.role} • {proj.duration}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleEditProject(idx)} style={btnListIconStyle}><Edit3 size={12} /></button>
                    <button onClick={() => handleDeleteProject(idx)} style={btnListIconStyle}><Trash2 size={12} /></button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add/Edit project form */}
            <form onSubmit={handleProjectSubmit} className="glass-card" style={{ padding: '20px', display: 'grid', gap: '16px', background: 'rgba(0,0,0,0.15)' }}>
              <h4 style={{ fontSize: '14px', color: '#60a5fa' }}>{editingProjectIndex !== null ? 'Edit Project' : 'Add Project'}</h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelFormStyle}>Project Name</label>
                  <input 
                    type="text" 
                    value={projectForm.projectName} 
                    onChange={e => setProjectForm({...projectForm, projectName: e.target.value})} 
                    style={inputStyle} 
                    required 
                  />
                </div>
                <div>
                  <label style={labelFormStyle}>Technologies Used (comma separated)</label>
                  <input 
                    type="text" 
                    value={projectForm.techStack} 
                    onChange={e => setProjectForm({...projectForm, techStack: e.target.value})} 
                    style={inputStyle} 
                    placeholder="e.g. React, WebRTC, Node.js"
                  />
                </div>
              </div>

              <div>
                <label style={labelFormStyle}>Description</label>
                <textarea 
                  value={projectForm.description} 
                  onChange={e => setProjectForm({...projectForm, description: e.target.value})} 
                  style={{...inputStyle, resize: 'vertical'}} 
                  rows={2} 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelFormStyle}>Live URL</label>
                  <input 
                    type="text" 
                    value={projectForm.liveUrl} 
                    onChange={e => setProjectForm({...projectForm, liveUrl: e.target.value})} 
                    style={inputStyle} 
                    placeholder="https://..." 
                  />
                </div>
                <div>
                  <label style={labelFormStyle}>GitHub Repository Link</label>
                  <input 
                    type="text" 
                    value={projectForm.repoUrl} 
                    onChange={e => setProjectForm({...projectForm, repoUrl: e.target.value})} 
                    style={inputStyle} 
                    placeholder="https://github.com/..." 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelFormStyle}>Role Played</label>
                  <select 
                    value={projectForm.role} 
                    onChange={e => setProjectForm({...projectForm, role: e.target.value})} 
                    style={inputStyle}
                  >
                    <option value="Solo Creator">Solo Creator</option>
                    <option value="Team Lead">Team Lead</option>
                    <option value="Contributor">Contributor</option>
                  </select>
                </div>
                <div>
                  <label style={labelFormStyle}>Duration (start → end date)</label>
                  <input 
                    type="text" 
                    value={projectForm.duration} 
                    onChange={e => setProjectForm({...projectForm, duration: e.target.value})} 
                    style={inputStyle} 
                    placeholder="e.g. Jan 2024 - Apr 2024" 
                  />
                </div>
              </div>

              <div>
                <label style={labelFormStyle}>Key Achievements / Core Metrics</label>
                <input 
                  type="text" 
                  value={projectForm.achievements} 
                  onChange={e => setProjectForm({...projectForm, achievements: e.target.value})} 
                  style={inputStyle} 
                  placeholder="e.g. Optimized bitrates; decreased latency by 20%." 
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                {editingProjectIndex !== null && (
                  <button 
                    type="button" 
                    onClick={() => {
                      setEditingProjectIndex(null);
                      setProjectForm({projectName:'',description:'',techStack:'',liveUrl:'',repoUrl:'',role:'Solo Creator',duration:'',achievements:''});
                    }}
                    style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                  >
                    Cancel
                  </button>
                )}
                <button 
                  type="submit" 
                  style={{ background: '#10b981', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '12px' }}
                >
                  {editingProjectIndex !== null ? 'Update Item' : 'Add Item'}
                </button>
              </div>
            </form>

            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
              <button onClick={() => handleSaveProfile()} disabled={isSaving} className="btn-glow-blue" style={btnSaveStyle}>
                {isSaving ? 'Syncing...' : 'Save Portfolio items'}
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: WORK HISTORY */}
        {activeTab === 'work' && (
          <div style={{ display: 'grid', gap: '24px' }}>
            <div>
              <h3 style={{ fontSize: '18px', marginBottom: '4px' }}>Work History & Experience</h3>
              <p style={{ color: '#64748b', fontSize: '12px' }}>List past roles, corporate contracts, and technical accomplishments.</p>
            </div>

            {/* List existing */}
            <div style={{ display: 'grid', gap: '12px' }}>
              {workHistory.map((work, idx) => (
                <div key={idx} className="glass-card" style={{ padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '14px', color: '#f8fafc' }}>{work.companyName}</h4>
                    <span style={{ fontSize: '11px', color: '#f97316' }}>{work.role} • {work.duration}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleEditWork(idx)} style={btnListIconStyle}><Edit3 size={12} /></button>
                    <button onClick={() => handleDeleteWork(idx)} style={btnListIconStyle}><Trash2 size={12} /></button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add work form */}
            <form onSubmit={handleWorkSubmit} className="glass-card" style={{ padding: '20px', display: 'grid', gap: '16px', background: 'rgba(0,0,0,0.15)' }}>
              <h4 style={{ fontSize: '14px', color: '#f97316' }}>{editingWorkIndex !== null ? 'Edit Experience' : 'Add Experience'}</h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelFormStyle}>Company Name</label>
                  <input 
                    type="text" 
                    value={workForm.companyName} 
                    onChange={e => setWorkForm({...workForm, companyName: e.target.value})} 
                    style={inputStyle} 
                    required 
                  />
                </div>
                <div>
                  <label style={labelFormStyle}>Role / Title</label>
                  <input 
                    type="text" 
                    value={workForm.role} 
                    onChange={e => setWorkForm({...workForm, role: e.target.value})} 
                    style={inputStyle} 
                    required 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelFormStyle}>Duration (e.g. 2021 - Present)</label>
                  <input 
                    type="text" 
                    value={workForm.duration} 
                    onChange={e => setWorkForm({...workForm, duration: e.target.value})} 
                    style={inputStyle} 
                    required 
                  />
                </div>
                <div>
                  <label style={labelFormStyle}>Tech Stack Used in Role</label>
                  <input 
                    type="text" 
                    value={workForm.techStack} 
                    onChange={e => setWorkForm({...workForm, techStack: e.target.value})} 
                    style={inputStyle} 
                    placeholder="e.g. React, Node.js, Go"
                  />
                </div>
              </div>

              <div>
                <label style={labelFormStyle}>Responsibilities & Achievements</label>
                <textarea 
                  value={workForm.description} 
                  onChange={e => setWorkForm({...workForm, description: e.target.value})} 
                  style={{...inputStyle, resize: 'vertical'}} 
                  rows={3} 
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                {editingWorkIndex !== null && (
                  <button 
                    type="button" 
                    onClick={() => {
                      setEditingWorkIndex(null);
                      setWorkForm({companyName:'',role:'',duration:'',description:'',techStack:''});
                    }}
                    style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                  >
                    Cancel
                  </button>
                )}
                <button 
                  type="submit" 
                  style={{ background: '#f97316', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '12px' }}
                >
                  {editingWorkIndex !== null ? 'Update Experience' : 'Add Experience'}
                </button>
              </div>
            </form>

            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
              <button onClick={() => handleSaveProfile()} disabled={isSaving} className="btn-glow-blue" style={btnSaveStyle}>
                {isSaving ? 'Syncing...' : 'Save Work experience'}
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: EDUCATION & CERTIFICATIONS */}
        {activeTab === 'education' && (
          <div style={{ display: 'grid', gap: '32px' }}>
            
            {/* 5A. Education sub-section */}
            <div style={{ display: 'grid', gap: '20px' }}>
              <div>
                <h3 style={{ fontSize: '16px', marginBottom: '4px' }}>Education</h3>
                <p style={{ color: '#64748b', fontSize: '11px' }}>Institutions attended and qualifications achieved.</p>
              </div>

              <div style={{ display: 'grid', gap: '8px' }}>
                {education.map((edu, idx) => (
                  <div key={idx} style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '12px' }}>
                      <strong style={{ color: '#fff' }}>{edu.degree}</strong> at {edu.institution} ({edu.year})
                    </div>
                    <button onClick={() => handleDeleteEdu(idx)} style={btnListIconStyle}><Trash2 size={11} /></button>
                  </div>
                ))}
              </div>

              <form onSubmit={handleEduSubmit} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr auto', gap: '10px', alignItems: 'end' }}>
                <div>
                  <label style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Degree / Program</label>
                  <input type="text" value={eduForm.degree} onChange={e => setEduForm({...eduForm, degree: e.target.value})} placeholder="B.S. Computer Science" style={inputMiniStyle} required />
                </div>
                <div>
                  <label style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Institution</label>
                  <input type="text" value={eduForm.institution} onChange={e => setEduForm({...eduForm, institution: e.target.value})} placeholder="Stanford" style={inputMiniStyle} required />
                </div>
                <div>
                  <label style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Year</label>
                  <input type="text" value={eduForm.year} onChange={e => setEduForm({...eduForm, year: e.target.value})} placeholder="2020" style={inputMiniStyle} required />
                </div>
                <button type="submit" style={{ background: '#10b981', border: 'none', color: '#000', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, fontSize: '11px' }}>Add</button>
              </form>
            </div>

            {/* 5B. Certifications sub-section */}
            <div style={{ display: 'grid', gap: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
              <div>
                <h3 style={{ fontSize: '16px', marginBottom: '4px' }}>Certifications</h3>
                <p style={{ color: '#64748b', fontSize: '11px' }}>Professional licenses, courses, and digital verification links.</p>
              </div>

              <div style={{ display: 'grid', gap: '8px' }}>
                {certifications.map((cert, idx) => (
                  <div key={idx} style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '12px' }}>
                      <strong style={{ color: '#fff' }}>{cert.name}</strong> • {cert.issuer} ({cert.year})
                    </div>
                    <button onClick={() => handleDeleteCert(idx)} style={btnListIconStyle}><Trash2 size={11} /></button>
                  </div>
                ))}
              </div>

              <form onSubmit={handleCertSubmit} style={{ display: 'grid', gap: '10px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Cert Name</label>
                    <input type="text" value={certForm.name} onChange={e => setFormOrField(certForm, setCertForm, 'name', e.target.value)} placeholder="CISSP" style={inputMiniStyle} required />
                  </div>
                  <div>
                    <label style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Issuer</label>
                    <input type="text" value={certForm.issuer} onChange={e => setFormOrField(certForm, setCertForm, 'issuer', e.target.value)} placeholder="ISC2" style={inputMiniStyle} required />
                  </div>
                  <div>
                    <label style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Year</label>
                    <input type="text" value={certForm.year} onChange={e => setFormOrField(certForm, setCertForm, 'year', e.target.value)} placeholder="2022" style={inputMiniStyle} required />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'end' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Verification Link (URL)</label>
                    <input type="text" value={certForm.link} onChange={e => setFormOrField(certForm, setCertForm, 'link', e.target.value)} placeholder="https://..." style={inputMiniStyle} />
                  </div>
                  <button type="submit" style={{ background: '#10b981', border: 'none', color: '#000', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, fontSize: '11px', height: '32px' }}>Add Certification</button>
                </div>
              </form>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
              <button onClick={() => handleSaveProfile()} disabled={isSaving} className="btn-glow-blue" style={btnSaveStyle}>
                {isSaving ? 'Syncing...' : 'Save Education & Certs'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

// Form utilities
const setFormOrField = (form: any, setter: any, field: string, val: any) => {
  setter({ ...form, [field]: val });
};

// Shared Styles
const inputStyle = {
  width: '100%',
  background: '#080c14',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  padding: '10px 14px',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '13px',
  outline: 'none',
  transition: 'var(--transition-smooth)'
};

const inputMiniStyle = {
  ...inputStyle,
  padding: '6px 10px',
  fontSize: '12px'
};

const labelFormStyle = {
  display: 'block',
  fontSize: '11px',
  color: '#94a3b8',
  marginBottom: '6px',
  fontWeight: 600
};

const btnSaveStyle = {
  background: '#3b82f6',
  border: 'none',
  color: '#fff',
  padding: '10px 24px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: '12px',
  transition: 'var(--transition-smooth)'
};

const btnListIconStyle = {
  background: 'rgba(255,255,255,0.05)',
  border: 'none',
  borderRadius: '4px',
  width: '24px',
  height: '24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: '#cbd5e1',
  transition: 'var(--transition-smooth)'
};
