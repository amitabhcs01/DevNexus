import React, { useState, useEffect } from 'react';
import { Users, Search, Star, Award, ShieldCheck, GitFork, ArrowRight, X, Cpu, Code, GraduationCap, Briefcase, MapPin, Loader2 } from 'lucide-react';
import { mockDevelopers } from '../data/mockData';
import type { Developer } from '../types';
import { supabase, isSupabaseConfigured } from '../supabaseClient';

interface MarketplaceProps {
  initialFilters?: { skills: string[]; budget: number } | null;
  onOpenDealRoom: (developerName: string) => void;
  developersList?: Developer[];
  onRefetchDevelopers?: () => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({ 
  initialFilters, 
  onOpenDealRoom,
  developersList: sharedDevelopers,
  onRefetchDevelopers
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [maxRate, setMaxRate] = useState(160);
  const [availability, setAvailability] = useState<string>('All');
  const [selectedDeveloper, setSelectedDeveloper] = useState<Developer | null>(null);
  
  // AI Matching States
  const [showMatchingPortal, setShowMatchingPortal] = useState(false);
  const [matchingStack, setMatchingStack] = useState<string[]>([]);
  const [matchingBudget, setMatchingBudget] = useState(130);
  const [isMatching, setIsMatching] = useState(false);
  const [matchedResults, setMatchedResults] = useState<{ developer: Developer; score: number; details: any }[]>([]);
  
  const [developersList, setDevelopersList] = useState<Developer[]>([]);

  // Live GitHub Stats States
  const [githubStats, setGithubStats] = useState<{
    profile: any;
    repos: any[];
    languages: { name: string; pct: number; color: string }[];
    totalStars: number;
    totalForks: number;
    prCount: number;
    issueCount: number;
    rateLimitHit: boolean;
  } | null>(null);
  const [loadingGithub, setLoadingGithub] = useState(false);

  // Sync with shared developers list prop
  useEffect(() => {
    if (sharedDevelopers && sharedDevelopers.length > 0) {
      setDevelopersList(sharedDevelopers);
    }
  }, [sharedDevelopers]);

  // Fetch developers from Supabase DB on mount if shared developers list is empty
  useEffect(() => {
    if (sharedDevelopers && sharedDevelopers.length > 0) {
      return;
    }
    const fetchDevelopers = async () => {
      try {
        if (!isSupabaseConfigured) {
          const mappedMock = mockDevelopers.map(dev => ({
            ...dev,
            techStack: dev.skills
          }));
          setDevelopersList(mappedMock);
          return;
        }

        // Fetch registered developer profiles
        const { data: dbProfiles, error: profileErr } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'developer');

        // Fetch developer details registry
        const { data: dbDevs, error: devErr } = await supabase
          .from('developers')
          .select('*');

        if (profileErr) throw profileErr;
        if (devErr) {
          console.warn('Developer table warning:', devErr.message);
        }

        // Total developers in database
        const totalDevsCount = (dbProfiles?.length || 0) + (dbDevs?.filter(d => !dbProfiles?.some(p => p.id === d.id || p.full_name?.toLowerCase() === d.name.toLowerCase())).length || 0);
        console.log("Total developers in DB:", totalDevsCount);

        const mergedDevs: Developer[] = [];

        // 1. Process all registered profiles
        dbProfiles?.forEach(p => {
          const matchedDev = dbDevs?.find(d => d.id === p.id || d.name.toLowerCase() === p.full_name?.toLowerCase());
          const skillsList = p.key_skills
            ? p.key_skills.split(',').map((s: string) => s.trim()).filter(Boolean)
            : [];

          if (matchedDev) {
            mergedDevs.push({
              id: matchedDev.id,
              name: matchedDev.name,
              title: matchedDev.title,
              avatar: matchedDev.avatar,
              bio: matchedDev.bio,
              skills: matchedDev.skills || skillsList,
              hourlyRate: matchedDev.hourly_rate,
              availability: matchedDev.availability as any,
              rating: Number(matchedDev.rating),
              reviewsCount: matchedDev.reviews_count,
              reviews: [],
              gitHubUsername: matchedDev.git_username || '',
              githubRepos: [],
              projectHistory: [],
              verified: matchedDev.verified,
              niche: matchedDev.niche,
              techStack: matchedDev.skills || skillsList
            });
          } else {
            mergedDevs.push({
              id: p.id,
              name: p.full_name || 'Anonymous Developer',
              title: p.experience_level === 'senior' ? 'Senior Full Stack Developer' : 'Full Stack Developer',
              avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80`,
              bio: 'Registered developer on DevNexus network.',
              skills: skillsList,
              hourlyRate: 100,
              availability: 'Available Now',
              rating: 5.0,
              reviewsCount: 0,
              reviews: [],
              gitHubUsername: p.portfolio_link ? p.portfolio_link.split('/').pop() || '' : '',
              githubRepos: [],
              projectHistory: [],
              verified: true,
              niche: 'SaaS Software Development',
              techStack: skillsList
            });
          }
        });

        // 2. Include any pre-seeded developers not in profiles
        dbDevs?.forEach(d => {
          const alreadyIncluded = mergedDevs.some(c => c.id === d.id || c.name.toLowerCase() === d.name.toLowerCase());
          if (!alreadyIncluded) {
            mergedDevs.push({
              id: d.id,
              name: d.name,
              title: d.title,
              avatar: d.avatar,
              bio: d.bio,
              skills: d.skills || [],
              hourlyRate: d.hourly_rate,
              availability: d.availability as any,
              rating: Number(d.rating),
              reviewsCount: d.reviews_count,
              reviews: [],
              gitHubUsername: d.git_username || '',
              githubRepos: [],
              projectHistory: [],
              verified: d.verified,
              niche: d.niche,
              techStack: d.skills || []
            });
          }
        });

        if (mergedDevs.length > 0) {
          setDevelopersList(mergedDevs);
        } else {
          const mappedMock = mockDevelopers.map(dev => ({
            ...dev,
            techStack: dev.skills
          }));
          setDevelopersList(mappedMock);
        }
      } catch (err) {
        console.error('Error fetching developers from DB, falling back to mock data:', err);
        const mappedMock = mockDevelopers.map(dev => ({
          ...dev,
          techStack: dev.skills
        }));
        setDevelopersList(mappedMock);
      }
    };

    fetchDevelopers();
  }, []);

  // Skill Graph Node Coordinates
  const skillNodes = [
    { id: 'React', x: 200, y: 100, color: '#3b82f6' },
    { id: 'TypeScript', x: 300, y: 80, color: '#2563eb' },
    { id: 'Node.js', x: 120, y: 180, color: '#10b981' },
    { id: 'WebRTC', x: 280, y: 190, color: '#8b5cf6' },
    { id: 'Cryptography', x: 380, y: 170, color: '#a78bfa' },
    { id: 'Supabase', x: 200, y: 260, color: '#059669' },
    { id: 'Python', x: 450, y: 90, color: '#3b82f6' },
    { id: 'Pinecone', x: 500, y: 180, color: '#fb923c' },
    { id: 'PostgreSQL', x: 100, y: 290, color: '#0284c7' },
    { id: 'Go', x: 80, y: 90, color: '#06b6d4' }
  ];

  const skillLinks = [
    { source: 'React', target: 'TypeScript' },
    { source: 'React', target: 'Node.js' },
    { source: 'React', target: 'WebRTC' },
    { source: 'Node.js', target: 'Supabase' },
    { source: 'Node.js', target: 'PostgreSQL' },
    { source: 'WebRTC', target: 'Cryptography' },
    { source: 'Python', target: 'Pinecone' },
    { source: 'Node.js', target: 'Go' },
    { source: 'TypeScript', target: 'Cryptography' }
  ];

  // Live GitHub Data Fetching Hook
  useEffect(() => {
    if (!selectedDeveloper) {
      setGithubStats(null);
      return;
    }

    const username = selectedDeveloper.gitHubUsername;
    if (!username) {
      setGithubStats(null);
      return;
    }

    const fetchGithubData = async () => {
      setLoadingGithub(true);
      try {
        const userRes = await fetch(`https://api.github.com/users/${username}`);
        if (userRes.status === 403) {
          setGithubStats({
            profile: null,
            repos: [],
            languages: [],
            totalStars: 0,
            totalForks: 0,
            prCount: 0,
            issueCount: 0,
            rateLimitHit: true
          });
          return;
        }
        if (!userRes.ok) throw new Error('Failed to fetch user');
        const profile = await userRes.json();

        const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
        if (reposRes.status === 403) {
          setGithubStats({
            profile,
            repos: [],
            languages: [],
            totalStars: 0,
            totalForks: 0,
            prCount: 0,
            issueCount: 0,
            rateLimitHit: true
          });
          return;
        }
        if (!reposRes.ok) throw new Error('Failed to fetch repos');
        const repos = await reposRes.json();

        // Calculate stars, forks and languages
        let totalStars = 0;
        let totalForks = 0;
        const langCounts: Record<string, number> = {};

        repos.forEach((r: any) => {
          totalStars += r.stargazers_count || 0;
          totalForks += r.forks_count || 0;
          if (r.language) {
            langCounts[r.language] = (langCounts[r.language] || 0) + 1;
          }
        });

        const totalLangs = Object.values(langCounts).reduce((a, b) => a + b, 0);
        const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f97316', '#ec4899', '#facc15'];
        const languages = Object.entries(langCounts)
          .map(([name, count], idx) => ({
            name,
            pct: Math.round((count / totalLangs) * 100),
            color: colors[idx % colors.length]
          }))
          .sort((a, b) => b.pct - a.pct);

        let prCount = 0;
        let issueCount = 0;
        try {
          const prRes = await fetch(`https://api.github.com/search/issues?q=author:${username}+type:pr+is:merged`);
          if (prRes.ok) {
            const prData = await prRes.json();
            prCount = prData.total_count || 0;
          }
          const issueRes = await fetch(`https://api.github.com/search/issues?q=author:${username}+type:issue+is:closed`);
          if (issueRes.ok) {
            const issueData = await issueRes.json();
            issueCount = issueData.total_count || 0;
          }
        } catch (e) {
          console.warn('GitHub search API rate limit or error:', e);
        }

        setGithubStats({
          profile,
          repos: repos.sort((a: any, b: any) => (b.stargazers_count || 0) - (a.stargazers_count || 0)).slice(0, 5),
          languages,
          totalStars,
          totalForks,
          prCount,
          issueCount,
          rateLimitHit: false
        });
      } catch (err) {
        console.error('Github API fetch error:', err);
        setGithubStats(null);
      } finally {
        setLoadingGithub(false);
      }
    };

    fetchGithubData();
  }, [selectedDeveloper]);

  // Load Advisory Filters if passed
  useEffect(() => {
    if (initialFilters) {
      setSelectedSkills(initialFilters.skills);
      setMatchingStack(initialFilters.skills);
      setShowMatchingPortal(true);
    }
  }, [initialFilters]);

  // Skill Toggle
  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  // Filter developers
  const filteredDevelopers = developersList.filter(dev => {
    const matchesSearch = dev.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          dev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          dev.bio.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRate = dev.hourlyRate <= maxRate;
    
    const matchesAvailability = availability === 'All' || dev.availability === availability;
    
    const devSkills = dev.skills || dev.techStack || [];
    const matchesSkills = selectedSkills.length === 0 || 
                          selectedSkills.every(skill => devSkills.some(s => s.toLowerCase() === skill.toLowerCase()));

    return matchesSearch && matchesRate && matchesAvailability && matchesSkills;
  });

  // Calculate Matching Score Algorithm
  const runMatchingEngine = () => {
    if (matchingStack.length === 0) {
      alert('Please select at least one skill for the matching engine.');
      return;
    }
    setIsMatching(true);
    setMatchedResults([]);

    setTimeout(() => {
      // Log developers entering the scoring pipeline to satisfy Step 4 instruction
      developersList.forEach(dev => {
        dev.techStack = dev.techStack || dev.skills || [];
        console.log(`Scoring: ${dev.name} | Skills: ${dev.techStack}`);
      });

      const results = developersList.map(dev => {
        const devSkills = dev.skills || dev.techStack || [];

        // 1. Skills score (40%) - Case-insensitive match using s.some
        const matchedSkills = matchingStack.filter(reqSkill => 
          devSkills.some(s => s.toLowerCase() === reqSkill.toLowerCase())
        );
        const skillScore = matchingStack.length > 0 ? (matchedSkills.length / matchingStack.length) * 100 : 0;

        // 2. Rating score (25%)
        const ratingScore = (dev.rating / 5.0) * 100;

        // 3. Availability score (20%)
        let availabilityScore = 0;
        if (dev.availability === 'Available Now') availabilityScore = 100;
        else if (dev.availability === 'In 1 Week') availabilityScore = 80;
        else if (dev.availability === 'In 2 Weeks') availabilityScore = 50;

        // 4. Budget score (15%)
        let budgetScore = 100;
        if (dev.hourlyRate > matchingBudget) {
          budgetScore = Math.max(0, 100 - ((dev.hourlyRate - matchingBudget) / matchingBudget) * 100);
        }

        // Weighted total
        const finalScore = Math.round(
          (skillScore * 0.40) + 
          (ratingScore * 0.25) + 
          (availabilityScore * 0.20) + 
          (budgetScore * 0.15)
        );

        return {
          developer: dev,
          score: finalScore,
          details: {
            skills: Math.round(skillScore),
            rating: Math.round(ratingScore),
            availability: Math.round(availabilityScore),
            budget: Math.round(budgetScore)
          }
        };
      });

      // Sort by score descending
      results.sort((a, b) => b.score - a.score);
      setMatchedResults(results.slice(0, 3));
      setIsMatching(false);
    }, 2000);
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <Users size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '28px', marginBottom: '4px' }}>Developer Network</h1>
            <p style={{ color: '#94a3b8', fontSize: '14px' }}>Explore vetted developer profiles, analyze skill graph node relations, and match via AI.</p>
          </div>
        </div>
        <button
          onClick={() => {
            setShowMatchingPortal(!showMatchingPortal);
            if (selectedSkills.length > 0 && matchingStack.length === 0) {
              setMatchingStack(selectedSkills);
            }
          }}
          className="btn-glow-blue"
          style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            color: '#60a5fa',
            padding: '10px 20px',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Cpu size={16} /> {showMatchingPortal ? 'Hide AI Smart Matcher' : 'Open AI Smart Matcher'}
        </button>
      </div>

      {/* AI Smart Matcher Panel */}
      {showMatchingPortal && (
        <div className="glass-card" style={{ padding: '32px', borderLeft: '4px solid #3b82f6', marginBottom: '32px', animation: 'fadeIn 0.4s ease-out' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu color="#3b82f6" size={18} /> AI Smart Matching Engine (Scoring Algorithm v1)
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '24px' }}>
            Matches candidates against your project requirements using a weighted scoring calculation: 
            <strong> 40% Skills + 25% Rating + 20% Availability + 15% Budget Fit.</strong>
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '24px' }}>
            {/* Skills selection */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: '#cbd5e1' }}>Required Skills</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxHeight: '120px', overflowY: 'auto' }} className="custom-scroll">
                {skillNodes.map(node => (
                  <button
                    key={node.id}
                    onClick={() => {
                      if (matchingStack.includes(node.id)) {
                        setMatchingStack(matchingStack.filter(s => s !== node.id));
                      } else {
                        setMatchingStack([...matchingStack, node.id]);
                      }
                    }}
                    style={{
                      background: matchingStack.includes(node.id) ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.02)',
                      border: matchingStack.includes(node.id) ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.1)',
                      color: matchingStack.includes(node.id) ? '#60a5fa' : '#94a3b8',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: 'pointer'
                    }}
                  >
                    {node.id}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: '#cbd5e1' }}>
                Target Budget Limit: <span style={{ color: '#10b981' }}>${matchingBudget}/hr</span>
              </label>
              <input
                type="range"
                min="80"
                max="160"
                value={matchingBudget}
                onChange={(e) => setMatchingBudget(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#10b981', background: '#0e1422' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                <span>$80/hr</span>
                <span>$160/hr</span>
              </div>
            </div>

            {/* Match trigger */}
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button
                onClick={runMatchingEngine}
                disabled={isMatching}
                className="btn-glow-blue"
                style={{
                  background: '#3b82f6',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '14px',
                  width: '100%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {isMatching ? 'Calculating weights...' : 'Calculate AI Matches'}
              </button>
            </div>
          </div>

          {/* AI Match Results */}
          {isMatching && (
            <div style={{ padding: '24px', textAlign: 'center', background: 'rgba(0,0,0,0.1)', borderRadius: '12px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                border: '2px solid rgba(59, 130, 246, 0.1)',
                borderTopColor: '#3b82f6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 12px auto'
              }} />
              <p style={{ color: '#94a3b8', fontSize: '13px' }}>Matching skill matrix matrices, verifying ratings, and sorting budget parameters...</p>
            </div>
          )}

          {matchedResults.length > 0 && !isMatching && (
            <div style={{ marginTop: '24px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px' }}>
              <h3 style={{ fontSize: '14px', marginBottom: '16px', color: '#94a3b8' }}>AI Score Top Matches Surfaced:</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {matchedResults.map((result, idx) => (
                  <div
                    key={result.developer.id}
                    className="glass-card"
                    style={{
                      padding: '20px',
                      borderLeft: idx === 0 ? '4px solid #10b981' : '1px solid rgba(255,255,255,0.05)',
                      background: 'rgba(255, 255, 255, 0.01)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <img
                          src={result.developer.avatar}
                          alt={result.developer.name}
                          style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <h4 style={{ fontSize: '14px' }}>{result.developer.name}</h4>
                          <span style={{ fontSize: '12px', color: '#94a3b8' }}>{result.developer.title}</span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{
                          background: result.score >= 90 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                          color: result.score >= 90 ? '#34d399' : '#60a5fa',
                          fontSize: '14px',
                          fontWeight: 700,
                          padding: '4px 8px',
                          borderRadius: '6px'
                        }}>
                          {result.score}% Match
                        </div>
                      </div>
                    </div>

                    {/* Weight Breakdown */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '11px', color: '#64748b', marginBottom: '16px' }}>
                      <div>Skills Match: <span style={{ color: '#cbd5e1' }}>{result.details.skills}%</span></div>
                      <div>Rating Score: <span style={{ color: '#cbd5e1' }}>{result.details.rating}%</span></div>
                      <div>Availability: <span style={{ color: '#cbd5e1' }}>{result.details.availability}%</span></div>
                      <div>Budget Fit: <span style={{ color: '#cbd5e1' }}>{result.details.budget}%</span></div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#10b981' }}>${result.developer.hourlyRate}/hr</span>
                      <button
                        onClick={() => onOpenDealRoom(result.developer.name)}
                        className="btn-glow-green"
                        style={{
                          background: '#10b981',
                          border: 'none',
                          color: '#fff',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        Secure Deal Room <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Workspace Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '32px', alignItems: 'start' }}>
        
        {/* Left Filters Panel */}
        <div style={{ display: 'grid', gap: '20px' }}>
          
          {/* Skill Graph Engine Card */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '15px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Cpu size={16} color="#3b82f6" /> Skill Graph Navigator
            </h3>
            
            {/* SVG Visualizer */}
            <div style={{ background: '#080c14', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
              <svg width="100%" height="240" viewBox="0 0 540 320">
                {/* Connections */}
                {skillLinks.map((link, idx) => {
                  const sourceNode = skillNodes.find(n => n.id === link.source);
                  const targetNode = skillNodes.find(n => n.id === link.target);
                  if (!sourceNode || !targetNode) return null;
                  
                  const isHighlighted = selectedSkills.includes(link.source) || selectedSkills.includes(link.target);
                  
                  return (
                    <line
                      key={idx}
                      x1={sourceNode.x}
                      y1={sourceNode.y}
                      x2={targetNode.x}
                      y2={targetNode.y}
                      stroke={isHighlighted ? '#3b82f6' : 'rgba(255,255,255,0.05)'}
                      strokeWidth={isHighlighted ? 1.5 : 1}
                      className="node-link"
                    />
                  );
                })}

                {/* Nodes */}
                {skillNodes.map(node => {
                  const isSelected = selectedSkills.includes(node.id);
                  return (
                    <g key={node.id} onClick={() => toggleSkill(node.id)} className="node-circle" style={{ color: node.color }}>
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={isSelected ? 10 : 7}
                        fill={isSelected ? node.color : '#0e1422'}
                        stroke={node.color}
                        strokeWidth={1.5}
                      />
                      <text
                        x={node.x}
                        y={node.y - 12}
                        textAnchor="middle"
                        fill={isSelected ? '#fff' : '#64748b'}
                        fontSize="10"
                        fontWeight={isSelected ? 'bold' : 'normal'}
                      >
                        {node.id}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
            
            <p style={{ color: '#64748b', fontSize: '11px', textAlign: 'center', marginTop: '10px' }}>
              Click nodes to toggle skills, filter registry.
            </p>
          </div>

          {/* Standard Filters */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '15px', marginBottom: '16px' }}>Registry Filters</h3>
            
            {/* Search */}
            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={16} />
              <input
                type="text"
                placeholder="Search registry..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  background: '#080c14',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  padding: '10px 12px 10px 38px',
                  color: '#fff',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>

            {/* Rate Slider */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                <span>Max Hourly Rate</span>
                <span style={{ color: '#10b981', fontWeight: 600 }}>${maxRate}/hr</span>
              </div>
              <input
                type="range"
                min="90"
                max="160"
                value={maxRate}
                onChange={(e) => setMaxRate(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#10b981', background: '#0e1422' }}
              />
            </div>

            {/* Availability */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', marginBottom: '8px' }}>Availability</label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                style={{
                  width: '100%',
                  background: '#080c14',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  padding: '10px',
                  color: '#fff',
                  fontSize: '13px',
                  outline: 'none'
                }}
              >
                <option value="All">All Availabilities</option>
                <option value="Available Now">Available Now</option>
                <option value="In 1 Week">In 1 Week</option>
                <option value="In 2 Weeks">In 2 Weeks</option>
              </select>
            </div>

            {/* Clear Filters */}
            {(selectedSkills.length > 0 || searchTerm !== '' || maxRate < 160 || availability !== 'All') && (
              <button
                onClick={() => {
                  setSelectedSkills([]);
                  setSearchTerm('');
                  setMaxRate(160);
                  setAvailability('All');
                }}
                style={{
                  width: '100%',
                  background: 'rgba(255, 68, 68, 0.1)',
                  border: '1px solid rgba(255, 68, 68, 0.2)',
                  color: '#f87171',
                  padding: '8px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Right Developers Grid */}
        <div style={{ display: 'grid', gap: '20px' }}>
          <h3 style={{ fontSize: '16px', color: '#cbd5e1' }}>
            Vetted Profiles ({filteredDevelopers.length})
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
            {filteredDevelopers.map(dev => (
              <div key={dev.id} className="glass-card" style={{ padding: '24px', display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'start' }}>
                <img
                  src={dev.avatar}
                  alt={dev.name}
                  style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.1)' }}
                />
                <div style={{ flex: 1, minWidth: '240px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <h4 style={{ fontSize: '18px' }}>{dev.name}</h4>
                    {dev.verified && (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                        color: '#34d399',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 600
                      }}>
                        <ShieldCheck size={11} /> Verified
                      </span>
                    )}
                  </div>
                  <p style={{ color: '#cbd5e1', fontSize: '14px', marginBottom: '8px' }}>{dev.title}</p>
                  <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: 1.5, marginBottom: '16px' }}>{dev.bio}</p>
                  
                  {/* Skill tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                    {dev.skills.map(skill => (
                      <span
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        style={{
                          background: selectedSkills.includes(skill) ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.03)',
                          border: selectedSkills.includes(skill) ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.05)',
                          color: selectedSkills.includes(skill) ? '#60a5fa' : '#94a3b8',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 500,
                          cursor: 'pointer'
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Rates & Call to Action side */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                  height: '100%',
                  minWidth: '150px',
                  textAlign: 'right'
                }}>
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: '#10b981', marginBottom: '4px' }}>
                      ${dev.hourlyRate}/hr
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end', fontSize: '13px', color: '#cbd5e1', marginBottom: '6px' }}>
                      <Star size={14} fill="#f59e0b" color="#f59e0b" /> {dev.rating}
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: dev.availability === 'Available Now' ? '#34d399' : '#fb923c',
                      fontWeight: 600,
                      textTransform: 'uppercase'
                    }}>
                      {dev.availability}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', marginTop: '24px' }}>
                    <button
                      onClick={() => setSelectedDeveloper(dev)}
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#fff',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        width: '100%'
                      }}
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => onOpenDealRoom(dev.name)}
                      className="btn-glow-green"
                      style={{
                        background: '#10b981',
                        border: 'none',
                        color: '#fff',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        width: '100%'
                      }}
                    >
                      Open Deal Room
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Developer Detail Modal */}
      {selectedDeveloper && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
        }}>
          <div
            className="glass-card custom-scroll"
            style={{
              width: '100%',
              maxWidth: '800px',
              maxHeight: '90vh',
              background: '#0e1422',
              padding: '32px',
              position: 'relative',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              overflowY: 'auto'
            }}
          >
            <button
              onClick={() => setSelectedDeveloper(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer'
              }}
            >
              <X size={24} />
            </button>

            {/* Profile Info */}
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '32px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '24px' }}>
              <img
                src={selectedDeveloper.avatar}
                alt={selectedDeveloper.name}
                style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 style={{ fontSize: '24px' }}>{selectedDeveloper.name}</h2>
                  {selectedDeveloper.verified && (
                    <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#34d399', fontSize: '11px', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>Verified</span>
                  )}
                </div>
                <p style={{ color: '#cbd5e1', fontSize: '15px', marginBottom: '6px' }}>{selectedDeveloper.title}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '13px', color: '#94a3b8' }}>
                  {((selectedDeveloper as any).location) && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={13} color="#ef4444" /> {(selectedDeveloper as any).location}
                    </span>
                  )}
                  <span>Niche: <strong style={{ color: '#fff' }}>{selectedDeveloper.niche}</strong></span>
                  <span>Rate: <strong style={{ color: '#10b981' }}>${selectedDeveloper.hourlyRate}/hr</strong></span>
                  <span>Rating: <strong style={{ color: '#fff' }}>{selectedDeveloper.rating} ★</strong></span>
                </div>
              </div>
            </div>

            {/* GitHub integration (Real Data Only) */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Code size={18} color="#60a5fa" /> Live GitHub Contributions
              </h3>
              
              {!selectedDeveloper.gitHubUsername ? (
                <div className="glass-card" style={{ padding: '24px', textAlign: 'center', background: 'rgba(255,255,255,0.01)', border: '1px dashed rgba(255,255,255,0.1)' }}>
                  <Github size={32} style={{ color: '#64748b', margin: '0 auto 12px auto', display: 'block' }} />
                  <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '12px' }}>No GitHub profile connected.</p>
                  <button 
                    disabled 
                    style={{ background: 'rgba(59, 130, 246, 0.2)', border: 'none', color: '#90cdf4', padding: '6px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}
                  >
                    Connect GitHub Profile
                  </button>
                </div>
              ) : loadingGithub ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px', gap: '8px', color: '#94a3b8', fontSize: '13px' }}>
                  <Loader2 size={18} className="spin" color="#3b82f6" />
                  <span>Fetching real-time profile metrics from api.github.com...</span>
                </div>
              ) : githubStats?.rateLimitHit ? (
                <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #f59e0b', background: 'rgba(245,158,11,0.03)' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <AlertCircle size={20} color="#f59e0b" style={{ flexShrink: 0 }} />
                    <div>
                      <h4 style={{ fontSize: '13px', color: '#f8fafc', marginBottom: '4px', fontWeight: 600 }}>API Rate Limit Exceeded</h4>
                      <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.4 }}>
                        Public GitHub API limits have been reached for this IP. Contribution metrics are temporarily unavailable. Never loading simulated profiles — showing status active.
                      </p>
                    </div>
                  </div>
                </div>
              ) : githubStats && githubStats.profile ? (
                <div style={{ display: 'grid', gap: '20px' }}>
                  {/* Stats Cards Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '12px' }}>
                    <div style={gitCardStyle}>
                      <span style={gitLabelStyle}>Repos</span>
                      <strong style={gitValStyle}>{githubStats.profile.public_repos}</strong>
                    </div>
                    <div style={gitCardStyle}>
                      <span style={gitLabelStyle}>Stars</span>
                      <strong style={gitValStyle}>{githubStats.totalStars}</strong>
                    </div>
                    <div style={gitCardStyle}>
                      <span style={gitLabelStyle}>Forks</span>
                      <strong style={gitValStyle}>{githubStats.totalForks}</strong>
                    </div>
                    <div style={gitCardStyle}>
                      <span style={gitLabelStyle}>Followers</span>
                      <strong style={gitValStyle}>{githubStats.profile.followers}</strong>
                    </div>
                    <div style={gitCardStyle}>
                      <span style={gitLabelStyle}>PRs Merged</span>
                      <strong style={{ ...gitValStyle, color: '#a78bfa' }}>{githubStats.prCount}</strong>
                    </div>
                    <div style={gitCardStyle}>
                      <span style={gitLabelStyle}>Closed Issues</span>
                      <strong style={{ ...gitValStyle, color: '#f97316' }}>{githubStats.issueCount}</strong>
                    </div>
                  </div>

                  {/* Languages and Repos lists */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginTop: '8px' }}>
                    {/* Language pie/bar representation */}
                    <div className="glass-card" style={{ padding: '20px', background: 'rgba(0,0,0,0.1)' }}>
                      <h4 style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '16px', fontWeight: 600 }}>Top Programming Languages</h4>
                      {githubStats.languages.length === 0 ? (
                        <div style={{ fontSize: '12px', color: '#64748b', textAlign: 'center', padding: '16px' }}>No language details indexable.</div>
                      ) : (
                        <div style={{ display: 'grid', gap: '12px' }}>
                          {githubStats.languages.slice(0, 4).map(lang => (
                            <div key={lang.name}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>
                                <span>{lang.name}</span>
                                <span style={{ fontWeight: 600, color: '#fff' }}>{lang.pct}%</span>
                              </div>
                              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{ width: `${lang.pct}%`, height: '100%', background: lang.color, borderRadius: '3px' }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Top 5 Repos list */}
                    <div>
                      <h4 style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '12px', fontWeight: 600 }}>Top Repositories</h4>
                      <div style={{ display: 'grid', gap: '8px' }}>
                        {githubStats.repos.map(repo => (
                          <div key={repo.name} style={{ background: 'rgba(255,255,255,0.01)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ minWidth: 0 }}>
                              <h5 style={{ fontSize: '12px', color: '#60a5fa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{repo.name}</h5>
                              <span style={{ fontSize: '10px', color: '#34d399', background: 'rgba(16,185,129,0.1)', padding: '2px 6px', borderRadius: '4px', display: 'inline-block', marginTop: '4px' }}>{repo.language || 'Code'}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', fontSize: '11px', color: '#64748b', flexShrink: 0 }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><Star size={11} /> {repo.stargazers_count}</span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><GitFork size={11} /> {repo.forks_count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: '12px', color: '#64748b', textAlign: 'center', padding: '16px' }}>Failed to load GitHub data.</div>
              )}
            </div>

            {/* Project Portfolio (manual) */}
            {(selectedDeveloper as any).projectPortfolio && (selectedDeveloper as any).projectPortfolio.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={16} color="#8b5cf6" /> Portfolio Projects
                </h3>
                <div style={{ display: 'grid', gap: '16px' }}>
                  {(selectedDeveloper as any).projectPortfolio.map((proj: any, idx: number) => (
                    <div key={idx} style={{ background: 'rgba(255,255,255,0.01)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                        <h4 style={{ fontSize: '15px', color: '#fff' }}>{proj.projectName}</h4>
                        <span style={{ fontSize: '12px', color: '#8b5cf6', fontWeight: 600 }}>{proj.duration}</span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#34d399', fontWeight: 600, marginBottom: '10px' }}>Role: {proj.role}</div>
                      <p style={{ color: '#cbd5e1', fontSize: '13px', lineHeight: 1.5, marginBottom: '12px' }}>{proj.description}</p>
                      {proj.achievements && (
                        <div style={{ fontSize: '12px', color: '#94a3b8', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '6px', marginBottom: '12px' }}>
                          <strong>Achievements:</strong> {proj.achievements}
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', fontSize: '12px' }}>
                        <span style={{ color: '#64748b' }}>Tech: <strong style={{ color: '#cbd5e1' }}>{proj.techStack}</strong></span>
                        <div style={{ display: 'flex', gap: '12px' }}>
                          {proj.liveUrl && <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa', textDecoration: 'none' }}>Live Demo →</a>}
                          {proj.repoUrl && <a href={proj.repoUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa', textDecoration: 'none' }}>GitHub Repo →</a>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Work History */}
            {(selectedDeveloper as any).workHistory && (selectedDeveloper as any).workHistory.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Briefcase size={16} color="#8b5cf6" /> Past Work Experiences
                </h3>
                <div style={{ display: 'grid', gap: '16px' }}>
                  {(selectedDeveloper as any).workHistory.map((work: any, idx: number) => (
                    <div key={idx} style={{ background: 'rgba(255,255,255,0.01)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                        <h4 style={{ fontSize: '15px', color: '#fff' }}>{work.companyName}</h4>
                        <span style={{ fontSize: '12px', color: '#f97316', fontWeight: 600 }}>{work.duration}</span>
                      </div>
                      <div style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: 500, marginBottom: '10px' }}>{work.role}</div>
                      <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: 1.5, marginBottom: '10px' }}>{work.description}</p>
                      {work.techStack && (
                        <div style={{ fontSize: '11px', color: '#64748b' }}>
                          Tech: <strong style={{ color: '#cbd5e1' }}>{work.techStack}</strong>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education & Certifications Row */}
            {(((selectedDeveloper as any).education && (selectedDeveloper as any).education.length > 0) || ((selectedDeveloper as any).certifications && (selectedDeveloper as any).certifications.length > 0)) && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                {(selectedDeveloper as any).education && (selectedDeveloper as any).education.length > 0 && (
                  <div>
                    <h3 style={{ fontSize: '16px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <GraduationCap size={16} color="#8b5cf6" /> Education
                    </h3>
                    <div style={{ display: 'grid', gap: '12px' }}>
                      {(selectedDeveloper as any).education.map((edu: any, idx: number) => (
                        <div key={idx} style={{ background: 'rgba(255,255,255,0.01)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)' }}>
                          <h4 style={{ fontSize: '13px', color: '#fff' }}>{edu.degree}</h4>
                          <div style={{ fontSize: '12px', color: '#94a3b8' }}>{edu.institution}</div>
                          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Graduated {edu.year}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(selectedDeveloper as any).certifications && (selectedDeveloper as any).certifications.length > 0 && (
                  <div>
                    <h3 style={{ fontSize: '16px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Award size={16} color="#8b5cf6" /> Certifications
                    </h3>
                    <div style={{ display: 'grid', gap: '12px' }}>
                      {(selectedDeveloper as any).certifications.map((cert: any, idx: number) => (
                        <div key={idx} style={{ background: 'rgba(255,255,255,0.01)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)' }}>
                          <h4 style={{ fontSize: '13px', color: '#fff' }}>{cert.name}</h4>
                          <div style={{ fontSize: '12px', color: '#94a3b8' }}>{cert.issuer} ({cert.year})</div>
                          {cert.link && (
                            <a href={cert.link} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', fontSize: '11px', color: '#60a5fa', textDecoration: 'none', marginTop: '6px' }}>
                              Verify Certificate →
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Legacy Project History Fallback if needed */}
            {(!selectedDeveloper.workHistory || selectedDeveloper.workHistory.length === 0) && selectedDeveloper.projectHistory && selectedDeveloper.projectHistory.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Award size={16} /> Verified Project History (Client Feed)
                </h3>
                <div style={{ display: 'grid', gap: '16px' }}>
                  {selectedDeveloper.projectHistory.map((proj, idx) => (
                    <div key={idx} style={{ background: 'rgba(255,255,255,0.01)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <h4 style={{ fontSize: '14px', color: '#cbd5e1' }}>{proj.projectName}</h4>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>{proj.duration}</span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#8b5cf6', fontWeight: 600, marginBottom: '8px' }}>Client: {proj.client}</div>
                      <p style={{ color: '#94a3b8', fontSize: '13px', fontStyle: 'italic', lineHeight: 1.4 }}>"{proj.feedback}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Client Reviews ({selectedDeveloper.reviewsCount})</h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                {selectedDeveloper.reviews.map((rev, idx) => (
                  <div key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 600 }}>{rev.reviewer}</span>
                      <span style={{ color: '#64748b' }}>{rev.date}</span>
                    </div>
                    <p style={{ color: '#cbd5e1', fontSize: '13px', lineHeight: 1.4 }}>{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
              <button
                onClick={() => setSelectedDeveloper(null)}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: 'none',
                  color: '#fff',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedDeveloper(null);
                  onOpenDealRoom(selectedDeveloper.name);
                }}
                className="btn-glow-green"
                style={{
                  background: '#10b981',
                  border: 'none',
                  color: '#fff',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Initialize Deal Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const gitCardStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.02)',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  borderRadius: '8px',
  padding: '12px 8px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center'
};

const gitLabelStyle: React.CSSProperties = {
  fontSize: '10px',
  color: '#64748b',
  textTransform: 'uppercase',
  fontWeight: 600,
  marginBottom: '4px'
};

const gitValStyle: React.CSSProperties = {
  fontSize: '18px',
  color: '#3b82f6',
  fontWeight: 'bold'
};

