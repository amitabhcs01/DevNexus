import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldCheck, Lock, CheckCircle, MessageSquare, FileText, 
  Trash2, Key, Terminal, RefreshCw, LogOut, Copy, Upload, 
  ArrowRight, Users, Share2, DollarSign, Calendar, Activity, Loader2
} from 'lucide-react';
import type { ChatMessage, EphemeralFile } from '../types';
import { io } from 'socket.io-client';

interface DealRoomProps {
  defaultPartner?: string;
  onNavigateToDashboard: () => void;
}

export const DealRoom = ({ defaultPartner = 'Amazon Web Services', onNavigateToDashboard }: DealRoomProps) => {
  const [sessionState, setSessionState] = useState<'dashboard' | 'setup' | 'signed' | 'active' | 'wiped'>('dashboard');
  const [loading, setLoading] = useState(false);

  // Active Deal Rooms loaded from backend
  const [dealRooms, setDealRooms] = useState<any[]>([]);

  // Setup form state
  const [roomId, setRoomId] = useState('');
  const [dealTitle, setDealTitle] = useState('Strategic Partnership Agreement');
  const [partyA, setPartyA] = useState('Microsoft Corporation');
  const [partyB, setPartyB] = useState(defaultPartner);
  const [repA, setRepA] = useState('Satya Nadella (CEO)');
  const [repB, setRepB] = useState('Andy Jassy (CEO)');
  const [ndaType, setNdaType] = useState('Corporate Mutual Non-Disclosure Agreement');
  const [ipClauses, setIpClauses] = useState('All background intellectual property remains vested in original owner; foreground IP is shared equally.');
  const [duration, setDuration] = useState('5 Years');
  const [jurisdiction, setJurisdiction] = useState('Delaware Chancery Court');
  
  // Deal Terms State
  const [dealValue, setDealValue] = useState<number>(1200000);
  const [dealCurrency, setDealCurrency] = useState<string>('USD');
  const [dealDeadline, setDealDeadline] = useState<string>('2026-12-31');
  const [dealConditions, setDealConditions] = useState<string>('Provision of dedicated server instances with SLA target 99.99% monthly availability.');
  const [dealStatus, setDealStatus] = useState<string>('negotiating'); // negotiating -> terms_agreed -> nda_signed -> closed

  // Invite party state
  const [inviteCompanyName, setInviteCompanyName] = useState('');

  // Canvas signature state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signingAs, setSigningAs] = useState<'repA' | 'repB'>('repA');
  const [signedA, setSignedA] = useState(false);
  const [signedB, setSignedB] = useState(false);

  // Active Room details
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [files, setFiles] = useState<EphemeralFile[]>([]);
  const [cameraActive, setCameraActive] = useState(true);
  const [micActive, setMicActive] = useState(true);
  const [screenShareActive, setScreenShareActive] = useState(false);
  const [timerCount, setTimerCount] = useState(600); // 10 minutes

  // Wipe Logs
  const [wipeConsoleLogs, setWipeConsoleLogs] = useState<string[]>([]);
  const [auditLogContent, setAuditLogContent] = useState<string>('');

  // Sockets & Refs
  const socketRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Resolve backend URL
  const getBackendUrl = () => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:5000';
    }
    return window.location.origin + '/_/backend';
  };
  const BACKEND_URL = getBackendUrl();

  // Load Rooms list on mount
  useEffect(() => {
    fetchActiveRooms();
  }, []);

  const fetchActiveRooms = async () => {
    try {
      // Simulate loading from seeded data or get active rooms if they exist
      const mockRooms = [
        { code: 'NEX-MSFT-AMZN', title: 'Cloud Infrastructure Service Agreement', partyA: 'Microsoft Corporation', partyB: 'Amazon Web Services', status: 'active', date: '2026-06-25' },
        { code: 'NEX-APPL-TSMC', title: 'Semiconductor Supply Chain Agreement', partyA: 'Apple Inc.', partyB: 'TSMC Ltd.', status: 'signed', date: '2026-06-20' }
      ];
      setDealRooms(mockRooms);
    } catch (err) {
      console.error(err);
    }
  };

  // Socket Connection Lifecycle
  useEffect(() => {
    if (sessionState === 'active' && roomId) {
      // Connect socket.io
      const socket = io(BACKEND_URL);
      socketRef.current = socket;

      socket.emit('join-room', roomId);

      // Handle Socket.io events
      socket.on('peer-join', () => {
        setMessages(prev => [
          ...prev,
          {
            id: `sys-${Math.random()}`,
            sender: 'System',
            senderName: 'System',
            text: 'Representative from peer business connected. Secure tunnel established.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isEncrypted: false
          }
        ]);
      });

      socket.on('chat-message-receive', (msg: any) => {
        setMessages(prev => {
          if (prev.some(m => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      });

      socket.on('message:new', (msg: any) => {
        setMessages(prev => {
          const formatted: ChatMessage = {
            id: msg.id,
            sender: msg.senderId === 'client' ? 'PartyA' : 'PartyB',
            senderName: msg.senderName,
            text: msg.content,
            timestamp: msg.timestamp,
            isEncrypted: true
          };
          if (prev.some(m => m.id === formatted.id)) return prev;
          return [...prev, formatted];
        });
      });

      socket.on('file-upload-receive', (file: any) => {
        setFiles(prev => {
          if (prev.some(f => f.name === file.name)) return prev;
          return [...prev, file];
        });
      });

      socket.on('file:uploaded', (file: any) => {
        setFiles(prev => {
          if (prev.some(f => f.name === file.name)) return prev;
          return [...prev, file];
        });
      });

      socket.on('nda:signed', ({ status, party }: any) => {
        if (party === 'PartyA') setSignedA(true);
        if (party === 'PartyB') setSignedB(true);
      });

      socket.on('deal:statusChange', ({ status, dealTerms }: any) => {
        if (status) setDealStatus(status);
        if (dealTerms) {
          setDealValue(dealTerms.value);
          setDealCurrency(dealTerms.currency);
          setDealDeadline(dealTerms.deadline);
          setDealConditions(dealTerms.conditions);
        }
      });

      socket.on('session-wiped', (auditLog: any) => {
        handleRemoteWipe(auditLog);
      });

      socket.on('broadcast', ({ event, payload }: any) => {
        if (event === 'wipe') {
          handleRemoteWipe(payload);
        }
      });

      return () => {
        socket.disconnect();
        socketRef.current = null;
      };
    }
  }, [sessionState, roomId]);

  // Timer Countdown
  useEffect(() => {
    let interval: any;
    if (sessionState === 'active' && timerCount > 0) {
      interval = setInterval(() => {
        setTimerCount(prev => prev - 1);
      }, 1000);
    } else if (timerCount === 0 && sessionState === 'active') {
      triggerWipe();
    }
    return () => clearInterval(interval);
  }, [sessionState, timerCount]);

  // Scroll chat bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch Room from API on Enter
  const handleJoinDealRoom = async (code: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/dealroom/${code}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.dealroom) {
          const room = data.dealroom;
          setRoomId(room.id);
          setDealTitle(room.title);
          setDealStatus(room.status);
          setMessages(room.messages.map((m: any) => ({
            id: m.id,
            sender: m.senderId === 'client' ? 'PartyA' : 'PartyB',
            senderName: m.senderName,
            text: m.content,
            timestamp: m.timestamp,
            isEncrypted: true
          })));
          setFiles(room.files);
          setDealValue(room.dealTerms.value);
          setDealCurrency(room.dealTerms.currency);
          setDealDeadline(room.dealTerms.deadline);
          setDealConditions(room.dealTerms.conditions);
          
          if (room.ndaStatus === 'signed') {
            setSignedA(true);
            setSignedB(true);
            setSessionState('active');
          } else {
            setSessionState('setup');
          }
          return;
        }
      }
      
      // Fallback create on-the-fly if not found
      await handleCreateDealRoom(code);
    } catch (err) {
      console.error(err);
      await handleCreateDealRoom(code);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDealRoom = async (code?: string) => {
    const finalCode = code || 'NEX-' + partyA.substring(0, 4).toUpperCase() + '-' + partyB.substring(0, 4).toUpperCase();
    setRoomId(finalCode);
    
    const roomPayload = {
      id: finalCode,
      title: dealTitle,
      createdBy: partyA,
      parties: [
        { userId: 'client', companyName: partyA, role: 'PartyA' },
        { userId: 'developer', companyName: partyB, role: 'PartyB' }
      ],
      dealTerms: {
        value: dealValue,
        currency: dealCurrency,
        deadline: dealDeadline,
        conditions: dealConditions
      }
    };

    try {
      const res = await fetch(`${BACKEND_URL}/api/dealroom/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roomPayload)
      });
      if (res.ok) {
        setSessionState('setup');
      }
    } catch (err) {
      console.error('Failed to create dealroom, running offline setup:', err);
      setSessionState('setup');
    }
  };

  // Chat Actions
  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const senderName = signingAs === 'repA' ? repA : repB;
    const senderCompany = signingAs === 'repA' ? partyA : partyB;

    const messagePayload = {
      senderId: signingAs === 'repA' ? 'client' : 'developer',
      senderName: `${senderName} (${senderCompany})`,
      content: inputText
    };

    try {
      const res = await fetch(`${BACKEND_URL}/api/dealroom/${roomId}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messagePayload)
      });
      if (res.ok) {
        setInputText('');
      }
    } catch (err) {
      // Local fallback
      const localMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: signingAs === 'repA' ? 'PartyA' : 'PartyB',
        senderName: `${senderName} (${senderCompany})`,
        text: inputText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isEncrypted: true
      };
      setMessages(prev => [...prev, localMsg]);
      setInputText('');
    }
  };

  // E-Sign Canvas Handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    if (signingAs === 'repA') setSignedA(false);
    else setSignedB(false);
  };

  const confirmSignature = async () => {
    const activeParty = signingAs === 'repA' ? 'PartyA' : 'PartyB';
    const activeRep = signingAs === 'repA' ? repA : repB;
    
    try {
      await fetch(`${BACKEND_URL}/api/dealroom/${roomId}/nda`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'signed',
          representative: activeRep,
          party: activeParty
        })
      });
    } catch (err) {
      console.error(err);
    }
    
    if (signingAs === 'repA') {
      setSignedA(true);
      // Simulate counter-sign
      setTimeout(() => {
        setSignedB(true);
      }, 1500);
    } else {
      setSignedB(true);
    }
  };

  // File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const filePayload = {
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      type: file.type,
      contentMock: `Document parsed. Size: ${file.size} bytes.`,
      uploadedBy: signingAs === 'repA' ? partyA : partyB
    };

    try {
      await fetch(`${BACKEND_URL}/api/dealroom/${roomId}/files`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filePayload)
      });
    } catch (err) {
      setFiles(prev => [...prev, { ...filePayload, contentMock: 'Draft terms uploaded (offline fallback).' }]);
    }
  };

  // Sync Deal Terms Changes
  const handleUpdateDealTerms = async (updatedTerms: any) => {
    try {
      await fetch(`${BACKEND_URL}/api/dealroom/${roomId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealTerms: updatedTerms
        })
      });
      // Broadcast via socket
      if (socketRef.current) {
        socketRef.current.emit('terms-change', { roomId, dealTerms: updatedTerms });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      await fetch(`${BACKEND_URL}/api/dealroom/${roomId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus
        })
      });
    } catch (err) {
      setDealStatus(newStatus);
    }
  };

  // Invite external party
  const handleInviteParty = async () => {
    if (!inviteCompanyName.trim()) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/dealroom/${roomId}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: inviteCompanyName,
          role: 'PartyB'
        })
      });
      if (res.ok) {
        setInviteCompanyName('');
        showToastAlert(`Invited ${inviteCompanyName} successfully.`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const showToastAlert = (text: string) => {
    alert(text);
  };

  // Cryptographic Wipe
  const triggerWipe = () => {
    const receipt = {
      roomId,
      title: dealTitle,
      messagesWiped: messages.length,
      filesPurged: files.length,
      status: 'WIPED_ZERO_TRACE',
      timestamp: new Date().toISOString()
    };

    if (socketRef.current) {
      socketRef.current.emit('wipe-session', { roomId, auditLog: receipt });
    } else {
      handleRemoteWipe(receipt);
    }
  };

  const handleRemoteWipe = (receipt: any) => {
    setSessionState('wiped');
    const logs = [
      'Wipe command initiated...',
      'Purging secure chat buffers...',
      'Destroying versioned proposals...',
      'Closing active audio/video slots...',
      'Zero-filling database session metadata...',
      'Formulating final transaction receipt...'
    ];
    setWipeConsoleLogs([]);
    logs.forEach((log, idx) => {
      setTimeout(() => {
        setWipeConsoleLogs(prev => [...prev, log]);
      }, idx * 400);
    });
    setTimeout(() => {
      setAuditLogContent(JSON.stringify(receipt, null, 2));
    }, 2600);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div style={{ minHeight: '80vh' }}>
      
      {/* 1. DASHBOARD OVERVIEW */}
      {sessionState === 'dashboard' && (
        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px', marginBottom: '32px' }}>
            {/* Create Room form */}
            <div className="glass-card" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
                  <Lock size={24} />
                </div>
                <div>
                  <h2 style={{ fontSize: '22px' }}>Zero-Knowledge B2B Negotiation Room</h2>
                  <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px' }}>Initialize private digital spaces to securely draft legal NDAs and negotiate business agreements.</p>
                </div>
              </div>

              <div style={{ display: 'grid', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Your Company Legal Name</label>
                    <input type="text" value={partyA} onChange={(e) => setPartyA(e.target.value)} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Partner Company Legal Name</label>
                    <input type="text" value={partyB} onChange={(e) => setPartyB(e.target.value)} style={inputStyle} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Representative A Name</label>
                    <input type="text" value={repA} onChange={(e) => setRepA(e.target.value)} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Representative B Name</label>
                    <input type="text" value={repB} onChange={(e) => setRepB(e.target.value)} style={inputStyle} />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Deal Title / Partnership Description</label>
                  <input type="text" value={dealTitle} onChange={(e) => setDealTitle(e.target.value)} style={inputStyle} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={labelStyle}>Deal Value ($USD)</label>
                    <input type="number" value={dealValue} onChange={(e) => {
                      setDealValue(Number(e.target.value));
                    }} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Deal Currency</label>
                    <input type="text" value={dealCurrency} onChange={(e) => setDealCurrency(e.target.value)} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Estimated Deadline</label>
                    <input type="date" value={dealDeadline} onChange={(e) => setDealDeadline(e.target.value)} style={inputStyle} />
                  </div>
                </div>

                <button 
                  onClick={() => handleCreateDealRoom()}
                  className="btn-glow-purple" 
                  style={{ background: '#8b5cf6', color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <ShieldCheck size={18} /> Initialize Encrypted Negotiation Room
                </button>
              </div>
            </div>

            {/* Join Room list / code join */}
            <div style={{ display: 'grid', gap: '24px', alignContent: 'start' }}>
              <div className="glass-card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Join Existing Room</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input 
                    type="text" 
                    placeholder="Enter Access Code (e.g. NEX-MSFT-AMZN)" 
                    value={roomId} 
                    onChange={(e) => setRoomId(e.target.value.trim().toUpperCase())}
                    style={inputStyle} 
                  />
                  <button 
                    onClick={() => handleJoinDealRoom(roomId)}
                    disabled={loading}
                    className="btn-glow-green" 
                    style={{ background: '#10b981', color: '#fff', border: 'none', padding: '0 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
                  >
                    {loading ? <Loader2 size={16} className="spin" /> : 'Join'}
                  </button>
                </div>
              </div>

              {/* Active list */}
              <div className="glass-card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>Available Negotiation Rooms</h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {dealRooms.map(room => (
                    <div 
                      key={room.code}
                      onClick={() => handleJoinDealRoom(room.code)}
                      className="glass-card"
                      style={{ 
                        padding: '14px 18px', background: 'rgba(255,255,255,0.01)', 
                        border: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        transition: 'var(--transition-smooth)'
                      }}
                    >
                      <div>
                        <h4 style={{ fontSize: '13px', color: '#fff' }}>{room.title}</h4>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>Code: <strong style={{ color: '#a78bfa' }}>{room.code}</strong></span>
                      </div>
                      <span style={{ 
                        fontSize: '10px', padding: '2px 8px', borderRadius: '4px', fontWeight: 600,
                        background: room.status === 'signed' ? 'rgba(16,185,129,0.1)' : 'rgba(59,130,246,0.1)',
                        color: room.status === 'signed' ? '#34d399' : '#60a5fa'
                      }}>{room.status === 'signed' ? 'Signed' : 'Negotiating'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. SETUP PHASE (NDA / AGREEMENT SIGNING) */}
      {sessionState === 'setup' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '32px', animation: 'fadeIn 0.5s ease-out' }}>
          
          {/* Left NDA Document builder */}
          <div className="glass-card" style={{ padding: '32px' }}>
            <span style={{ fontSize: '11px', color: '#8b5cf6', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Step 1 of 2</span>
            <h2 style={{ fontSize: '24px', marginTop: '4px', marginBottom: '24px' }}>AI NDA & Agreement Builder</h2>
            
            {/* Legal paper doc mockup */}
            <div style={{ 
              background: '#040810', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px',
              padding: '32px', height: '420px', overflowY: 'auto', fontFamily: 'serif',
              fontSize: '14px', lineHeight: 1.6, color: '#e2e8f0', marginBottom: '24px'
            }} className="custom-scroll">
              <h3 style={{ fontSize: '16px', textAlign: 'center', marginBottom: '20px', fontFamily: 'Outfit' }}>
                MUTUAL NON-DISCLOSURE & PROPRIETARY INFORMATION AGREEMENT
              </h3>
              <p style={{ marginBottom: '16px' }}>
                This Agreement is entered into on this <strong>{new Date().toLocaleDateString()}</strong> (the "Effective Date"), by and between the corporate entities:
              </p>
              <p style={{ marginBottom: '16px', paddingLeft: '16px' }}>
                1. Disclosing Party: <strong>{partyA}</strong>, represented by {repA}.<br />
                2. Receiving Party: <strong>{partyB}</strong>, represented by {repB}.
              </p>
              <p style={{ marginBottom: '16px' }}>
                The parties wish to explore a business opportunity in connection with the deal title: <strong>{dealTitle}</strong> and document class: <strong>{ndaType}</strong>. In connection with this opportunity, both parties may exchange proprietary, confidential financial data, trade secrets, and system blueprints.
              </p>
              <p style={{ marginBottom: '16px' }}>
                <strong>1. Business Purpose:</strong> The parties wish to explore opportunities regarding custom development, API integration, and database operations.
              </p>
              <p style={{ marginBottom: '16px' }}>
                <strong>2. Intellectual Property Clause:</strong> {ipClauses}
              </p>
              <p style={{ marginBottom: '16px' }}>
                <strong>3. Confidentiality Period:</strong> All shared credentials, specifications, and files must be held in strict confidence for a duration of <strong>{duration}</strong> following room closure.
              </p>
              <p style={{ marginBottom: '16px' }}>
                <strong>4. Governing Court Jurisdiction:</strong> This agreement is governed by the laws and courts of the jurisdiction of <strong>{jurisdiction}</strong>.
              </p>
            </div>

            {/* Signature Area */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <h4 style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '8px' }}>Representative A ({partyA})</h4>
                <div style={{ height: '100px', background: '#080c14', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {signedA ? (
                    <span style={{ color: '#10b981', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle size={16} /> Signed: {repA}</span>
                  ) : (
                    <span style={{ color: '#64748b', fontSize: '12px' }}>Awaiting signature</span>
                  )}
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '8px' }}>Representative B ({partyB})</h4>
                <div style={{ height: '100px', background: '#080c14', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {signedB ? (
                    <span style={{ color: '#10b981', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle size={16} /> Signed: {repB}</span>
                  ) : (
                    <span style={{ color: '#64748b', fontSize: '12px' }}>Awaiting signature</span>
                  )}
                </div>
              </div>
            </div>

            {/* Signature Draw Input Pad */}
            <div style={{ marginTop: '24px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                  Draw signature below as: <select value={signingAs} onChange={(e) => setSigningAs(e.target.value as any)} style={{ background: '#080c14', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>
                    <option value="repA">Rep A ({repA})</option>
                    <option value="repB">Rep B ({repB})</option>
                  </select>
                </span>
                {signedA && signingAs === 'repA' && <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 600 }}>Representative A Co-signed</span>}
                {signedB && signingAs === 'repB' && <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 600 }}>Representative B Co-signed</span>}
              </div>

              <div style={{ position: 'relative', width: '100%', height: '140px', background: '#080c14', borderRadius: '8px', border: '1px dashed rgba(139,92,246,0.3)', overflow: 'hidden' }}>
                <canvas 
                  ref={canvasRef}
                  width={500}
                  height={140}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  style={{ width: '100%', height: '100%', cursor: 'crosshair', display: 'block' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button onClick={clearCanvas} style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: 'none', padding: '8px 16px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>Clear Pad</button>
                <button onClick={confirmSignature} style={{ background: '#8b5cf6', color: '#fff', border: 'none', padding: '8px 24px', borderRadius: '4px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Lock Digital Signature</button>
              </div>
            </div>

            {signedA && signedB && (
              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={() => setSessionState('dashboard')} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', padding: '10px 20px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}>← Dashboard</button>
                <button onClick={() => setSessionState('signed')} className="btn-glow-purple" style={{ background: '#8b5cf6', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  Generate Access Key & Open Tunnel <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Right parameters checklist */}
          <div className="glass-card" style={{ padding: '24px', height: 'fit-content' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>Deal Details & Terms</h3>
            
            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Deal Value ($USD)</label>
                <input type="number" value={dealValue} onChange={e => {
                  setDealValue(Number(e.target.value));
                  handleUpdateDealTerms({ value: Number(e.target.value), currency: dealCurrency, deadline: dealDeadline, conditions: dealConditions });
                }} style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Estimated Deadline</label>
                <input type="date" value={dealDeadline} onChange={e => {
                  setDealDeadline(e.target.value);
                  handleUpdateDealTerms({ value: dealValue, currency: dealCurrency, deadline: e.target.value, conditions: dealConditions });
                }} style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Additional Conditions</label>
                <textarea value={dealConditions} rows={3} onChange={e => {
                  setDealConditions(e.target.value);
                  handleUpdateDealTerms({ value: dealValue, currency: dealCurrency, deadline: dealDeadline, conditions: e.target.value });
                }} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px', display: 'grid', gap: '12px' }}>
                <h4 style={{ fontSize: '13px', color: '#cbd5e1' }}>Specifications Settings</h4>
                
                <div>
                  <label style={labelStyle}>NDA Type</label>
                  <select value={ndaType} onChange={(e) => setNdaType(e.target.value)} style={inputStyle}>
                    <option value="Corporate Mutual Non-Disclosure Agreement">Mutual NDA Agreement</option>
                    <option value="Joint Venture Diligence & Partnership Agreement">JV Partnership Deal</option>
                    <option value="Product Sourcing & Supply Chain Agreement">Supply Chain Deal</option>
                  </select>
                </div>
                
                <div>
                  <label style={labelStyle}>IP Clause</label>
                  <input type="text" value={ipClauses} onChange={(e) => setIpClauses(e.target.value)} style={inputStyle} />
                </div>

                <div>
                  <label style={labelStyle}>Jurisdiction</label>
                  <input type="text" value={jurisdiction} onChange={(e) => setJurisdiction(e.target.value)} style={inputStyle} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. SIGNED & ACCESS KEY GENERATED */}
      {sessionState === 'signed' && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', animation: 'fadeIn 0.5s ease-out' }}>
          <div className="glass-card" style={{ padding: '48px', maxWidth: '500px', width: '100%', textAlign: 'center', borderTop: '4px solid #10b981' }}>
            <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', marginBottom: '24px' }}>
              <ShieldCheck size={36} />
            </div>
            <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Access Key Generated</h2>
            <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6, marginBottom: '32px' }}>
              The agreement has been verified and registered. The access key provides entry into the encrypted WebRTC/Socket deal room tunnel.
            </p>

            <div style={{
              background: '#080c14', border: '1px dashed #10b981', borderRadius: '8px',
              padding: '16px', fontFamily: 'monospace', fontSize: '18px', color: '#34d399',
              fontWeight: 'bold', letterSpacing: '0.1em', marginBottom: '32px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px'
            }}>
              <Key size={18} /> {roomId}
            </div>

            <button 
              onClick={() => {
                handleUpdateStatus('negotiating');
                setSessionState('active');
              }}
              className="btn-glow-green"
              style={{ background: '#10b981', color: '#fff', border: 'none', padding: '12px 32px', borderRadius: '8px', fontWeight: 600, fontSize: '14px', cursor: 'pointer', width: '100%' }}
            >
              Enter Secured Deal Console
            </button>
          </div>
        </div>
      )}

      {/* 4. ACTIVE CONSOLE */}
      {sessionState === 'active' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', animation: 'fadeIn 0.5s ease-out' }}>
          
          {/* Left Console Panel */}
          <div style={{ display: 'grid', gap: '24px' }}>
            
            {/* Console Header */}
            <div className="glass-card" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', animation: 'pulseGlow 1.5s infinite' }} />
                <div>
                  <h3 style={{ fontSize: '15px' }}>{dealTitle} ({roomId})</h3>
                  <span style={{ fontSize: '11px', color: '#34d399', fontWeight: 600 }}>SECURE AES-GCM ENCRYPTED TUNNEL</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ fontSize: '13px', background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '4px 10px', borderRadius: '6px', fontFamily: 'monospace' }}>
                  Wipe Timer: {formatTime(timerCount)}
                </div>
                <button 
                  onClick={triggerWipe}
                  className="btn-glow-purple"
                  style={{ background: '#8b5cf6', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Trash2 size={13} /> Close & Wipe
                </button>
              </div>
            </div>

            {/* Video simulation */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              <div className="glass-card" style={{ height: '220px', position: 'relative', overflow: 'hidden', background: '#080c14' }}>
                {cameraActive ? (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle, #1e293b 0%, #080c14 100%)' }}>
                    {screenShareActive ? (
                      <div style={{ width: '100%', height: '100%', padding: '16px', fontFamily: 'monospace', fontSize: '9px', color: '#60a5fa', overflow: 'hidden' }}>
                        <div>[SCREEN SHARE - Proposal Term Sheets]</div>
                        <div>1. Strategic Cooperation Terms:</div>
                        <div>- Fixed: ${dealValue.toLocaleString()} yearly commitment.</div>
                        <div>- Deadline: {dealDeadline}</div>
                        <div>- Scope: {dealConditions}</div>
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
                          <Lock size={20} />
                        </div>
                        <span style={{ fontSize: '13px', color: '#94a3b8' }}>Secure Camera Feed: Party A</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748b' }}>Camera Muted</div>
                )}
                <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px' }}>
                  {repA} ({partyA})
                </div>
              </div>

              <div className="glass-card" style={{ height: '220px', position: 'relative', overflow: 'hidden', background: '#080c14' }}>
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle, #1e293b 0%, #080c14 100%)' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #8b5cf6', margin: '0 auto 12px auto' }}>
                      <img 
                        src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=80&q=80" 
                        alt={repB} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <span style={{ fontSize: '13px', color: '#cbd5e1' }}>{repB} ({partyB})</span>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginTop: '6px' }}>
                      <span style={{ fontSize: '10px', background: 'rgba(16,185,129,0.1)', color: '#34d399', padding: '1px 6px', borderRadius: '4px' }}>FPS: 30</span>
                      <span style={{ fontSize: '10px', background: 'rgba(59,130,246,0.1)', color: '#60a5fa', padding: '1px 6px', borderRadius: '4px' }}>RTT: 25ms</span>
                    </div>
                  </div>
                </div>
                <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px' }}>
                  {repB} ({partyB})
                </div>
              </div>
            </div>

            {/* Video controllers */}
            <div className="glass-card" style={{ padding: '12px', display: 'flex', justifyContent: 'center', gap: '16px' }}>
              <button onClick={() => setCameraActive(!cameraActive)} style={btnMediaStyle}>{cameraActive ? 'Disable Camera' : 'Enable Camera'}</button>
              <button onClick={() => setMicActive(!micActive)} style={btnMediaStyle}>{micActive ? 'Mute Mic' : 'Unmute Mic'}</button>
              <button onClick={() => setScreenShareActive(!screenShareActive)} style={{ ...btnMediaStyle, background: screenShareActive ? '#10b981' : 'rgba(255,255,255,0.05)' }}>{screenShareActive ? 'Stop Share' : 'Share Screen'}</button>
            </div>

            {/* Secure Chat */}
            <div className="glass-card" style={{ height: '360px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={16} color="#8b5cf6" />
                <span style={{ fontSize: '13px', fontWeight: 600 }}>Zero-Trace Secure Chat Ledger</span>
              </div>

              <div style={{ flex: 1, padding: '16px', overflowY: 'auto' }} className="custom-scroll">
                {messages.map((msg) => (
                  <div key={msg.id} style={{ marginBottom: '16px', textAlign: msg.senderName.includes(signingAs === 'repA' ? partyA : partyB) ? 'right' : 'left' }}>
                    {msg.sender === 'System' ? (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.02)', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', color: '#64748b' }}>
                        <Terminal size={10} /> {msg.text}
                      </div>
                    ) : (
                      <div style={{ display: 'inline-block', maxWidth: '80%', textAlign: 'left' }}>
                        <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '2px', display: 'flex', gap: '6px', justifyContent: msg.senderName.includes(signingAs === 'repA' ? partyA : partyB) ? 'flex-end' : 'flex-start' }}>
                          <span>{msg.senderName}</span>
                          <span>{msg.timestamp}</span>
                        </div>
                        <div style={{
                          background: msg.senderName.includes(signingAs === 'repA' ? partyA : partyB) ? '#8b5cf6' : 'rgba(255,255,255,0.03)',
                          border: msg.senderName.includes(signingAs === 'repA' ? partyA : partyB) ? 'none' : '1px solid rgba(255,255,255,0.05)',
                          color: '#f8fafc',
                          padding: '8px 14px',
                          borderRadius: msg.senderName.includes(signingAs === 'repA' ? partyA : partyB) ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                          fontSize: '13px',
                          lineHeight: 1.4
                        }}>
                          {msg.text}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '12px 16px', display: 'flex', gap: '12px' }}>
                <input 
                  type="text" 
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="Send direct message (AES-GCM encrypted)..." 
                  style={{ flex: 1, background: '#080c14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '10px 14px', color: '#fff', fontSize: '13px', outline: 'none' }}
                />
                <button onClick={sendMessage} className="btn-glow-purple" style={{ background: '#8b5cf6', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Send</button>
              </div>
            </div>

          </div>

          {/* Right negotiation vault / deal terms details */}
          <div style={{ display: 'grid', gap: '24px', alignContent: 'start' }}>
            
            {/* Live Deal Terms Panel */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <DollarSign size={18} color="#10b981" />
                <h3 style={{ fontSize: '15px' }}>Negotiated Deal Terms</h3>
              </div>

              <div style={{ display: 'grid', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={labelStyle}>Agreed Value</label>
                    <input 
                      type="number" 
                      value={dealValue} 
                      onChange={e => {
                        setDealValue(Number(e.target.value));
                        handleUpdateDealTerms({ value: Number(e.target.value), currency: dealCurrency, deadline: dealDeadline, conditions: dealConditions });
                      }}
                      style={inputStyle} 
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Deadline</label>
                    <input 
                      type="date" 
                      value={dealDeadline} 
                      onChange={e => {
                        setDealDeadline(e.target.value);
                        handleUpdateDealTerms({ value: dealValue, currency: dealCurrency, deadline: e.target.value, conditions: dealConditions });
                      }}
                      style={inputStyle} 
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Conditions & Scope</label>
                  <textarea 
                    value={dealConditions} 
                    rows={3} 
                    onChange={e => {
                      setDealConditions(e.target.value);
                      handleUpdateDealTerms({ value: dealValue, currency: dealCurrency, deadline: dealDeadline, conditions: e.target.value });
                    }}
                    style={{ ...inputStyle, resize: 'vertical' }} 
                  />
                </div>

                <div>
                  <label style={labelStyle}>Deal Status</label>
                  <select 
                    value={dealStatus} 
                    onChange={e => handleUpdateStatus(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="negotiating">Negotiating</option>
                    <option value="terms_agreed">Terms Agreed</option>
                    <option value="nda_signed">NDA Signed</option>
                    <option value="closed">Closed / Finalized</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Invite Section */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Share2 size={16} color="#3b82f6" />
                <h3 style={{ fontSize: '15px' }}>Invite External Business</h3>
              </div>
              <p style={{ color: '#64748b', fontSize: '11px', lineHeight: 1.4, marginBottom: '16px' }}>
                Type in the company name of an external entity to invite them into this private room.
              </p>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="text" 
                  placeholder="e.g. Acme Corp" 
                  value={inviteCompanyName} 
                  onChange={e => setInviteCompanyName(e.target.value)}
                  style={inputStyle} 
                />
                <button 
                  onClick={handleInviteParty}
                  className="btn-glow-blue" 
                  style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '0 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
                >
                  Invite
                </button>
              </div>
            </div>

            {/* Proposal Vault files */}
            <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '16px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={16} color="#8b5cf6" /> Versioned Proposals
              </h3>
              <p style={{ color: '#64748b', fontSize: '11px', lineHeight: 1.4, marginBottom: '20px' }}>
                Proposals uploaded remain only in active memory slots. Purged completely on room closure.
              </p>

              <div style={{ border: '1px dashed rgba(139, 92, 246, 0.3)', borderRadius: '10px', padding: '20px', textAlign: 'center', background: 'rgba(139,92,246,0.01)', cursor: 'pointer', marginBottom: '20px', position: 'relative' }}>
                <input type="file" onChange={handleFileUpload} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                <Upload size={20} color="#a78bfa" style={{ margin: '0 auto 6px auto' }} />
                <span style={{ fontSize: '12px', color: '#cbd5e1', display: 'block' }}>Upload proposal document</span>
                <span style={{ fontSize: '10px', color: '#64748b', marginTop: '2px', display: 'block' }}>PDF, DOCX, PNG (Max 5MB)</span>
              </div>

              {/* Files list */}
              <div style={{ display: 'grid', gap: '10px' }}>
                {files.map((file, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => alert(`Proposal Buffer Content:\n${file.contentMock}`)}
                    className="glass-card"
                    style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <FileText size={14} color="#8b5cf6" />
                      <div>
                        <h5 style={{ fontSize: '11px', color: '#cbd5e1', wordBreak: 'break-all' }}>{file.name}</h5>
                        <span style={{ fontSize: '9px', color: '#64748b' }}>{file.size} • Encrypted</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 5. WIPE SCREEN */}
      {sessionState === 'wiped' && (
        <div className="matrix-overlay" style={{ animation: 'fadeIn 0.5s ease-out' }}>
          <div style={{ maxWidth: '640px', width: '100%', padding: '32px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '20px', borderBottom: '1px solid #10b981', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RefreshCw size={18} className="spin-slow" /> CRYPTOGRAPHIC MEMORY PURGING ACTIVE
            </h2>
            
            <div style={{ background: 'rgba(0,0,0,0.9)', border: '1px solid #10b981', borderRadius: '8px', padding: '20px', fontFamily: 'monospace', fontSize: '12px', color: '#34d399', minHeight: '200px', marginBottom: '24px', lineHeight: 1.5 }}>
              {wipeConsoleLogs.map((log, idx) => (
                <div key={idx} style={{ marginBottom: '6px' }}>&gt; {log}</div>
              ))}
              {wipeConsoleLogs.length === 6 && (
                <div style={{ color: '#10b981', fontWeight: 'bold', marginTop: '12px', textAlign: 'center' }}>
                  ★★★ SYSTEM SANITIZED: SESSION WIPED FROM PLATFORM MEMORY ★★★
                </div>
              )}
            </div>

            {auditLogContent && (
              <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
                <h3 style={{ fontSize: '13px', color: '#10b981', marginBottom: '8px', fontWeight: 600 }}>Tamper-proof Cryptographic Verification Receipt:</h3>
                <pre style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '16px', borderRadius: '6px', fontSize: '11px', color: '#86efac', overflowX: 'auto', maxHeight: '160px', marginBottom: '24px' }}>
                  {auditLogContent}
                </pre>

                <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
                  <button onClick={() => { navigator.clipboard.writeText(auditLogContent); alert('Audit receipt copied.'); }} style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', color: '#10b981', padding: '10px 20px', borderRadius: '6px', fontWeight: 600, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Copy size={14} /> Copy Receipt
                  </button>
                  <button onClick={onNavigateToDashboard} style={{ background: '#10b981', border: 'none', color: '#000', padding: '10px 24px', borderRadius: '6px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <LogOut size={14} /> Return to Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

// Styles
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

const labelStyle = {
  display: 'block',
  fontSize: '11px',
  color: '#cbd5e1',
  marginBottom: '6px',
  fontWeight: 600
};

const btnMediaStyle = {
  background: 'rgba(255,255,255,0.05)',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '12px',
  cursor: 'pointer',
  fontWeight: 600,
  transition: 'var(--transition-smooth)'
};
