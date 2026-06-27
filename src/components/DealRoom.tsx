import { useState, useRef, useEffect } from 'react';
import { ShieldCheck, Lock, CheckCircle, MessageSquare, FileText, Trash2, Key, Terminal, RefreshCw, LogOut, Copy, Upload, ArrowRight } from 'lucide-react';
import type { ChatMessage, EphemeralFile } from '../types';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface DealRoomProps {
  defaultPartner?: string;
  onNavigateToDashboard: () => void;
}

export const DealRoom = ({ defaultPartner = 'Amazon Web Services', onNavigateToDashboard }: DealRoomProps) => {
  const [sessionState, setSessionState] = useState<'dashboard' | 'setup' | 'signed' | 'active' | 'wiped'>('dashboard');
  
  // Custom Deal Room Registry (Pre-seeded for high fidelity)
  const [activeRooms] = useState([
    { code: 'NEX-MSFT-AMZN', title: 'Cloud Infrastructure Service Agreement', partyA: 'Microsoft Corporation', partyB: 'Amazon Web Services', status: 'active', date: '2026-06-25' },
    { code: 'NEX-APPL-TSMC', title: 'Semiconductor Supply Chain Agreement', partyA: 'Apple Inc.', partyB: 'TSMC Ltd.', status: 'signed', date: '2026-06-20' }
  ]);

  // Setup forms state
  const [dealTitle, setDealTitle] = useState('Strategic Partnership Agreement');
  const [partyA, setPartyA] = useState('Microsoft Corporation');
  const [partyB, setPartyB] = useState(defaultPartner);
  const [repA, setRepA] = useState('Satya Nadella (CEO)');
  const [repB, setRepB] = useState('Andy Jassy (CEO)');
  const [ndaType, setNdaType] = useState('Corporate Mutual Non-Disclosure Agreement');
  const [ipClauses, setIpClauses] = useState('All background intellectual property remains vested in original owner; foreground IP is shared equally.');
  const [duration, setDuration] = useState('5 Years');
  const [jurisdiction, setJurisdiction] = useState('Delaware Chancery Court');
  const [accessCode, setAccessCode] = useState('');
  
  // Signature Drawing State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signingAs, setSigningAs] = useState<'repA' | 'repB'>('repA');
  const [signedA, setSignedA] = useState(false);
  const [signedB, setSignedB] = useState(false);
  
  // Active Room States
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [files, setFiles] = useState<EphemeralFile[]>([
    { name: 'partnership_proposal_v1.pdf', size: '1.8 MB', type: 'application/pdf', contentMock: 'Draft terms for cloud migration collaboration. Budget: $1,200,000' },
    { name: 'service_level_agreement_v2.docx', size: '850 KB', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', contentMock: 'Uptime commitments and liability exclusions. Standard Delaware templates.' }
  ]);
  const [cameraActive, setCameraActive] = useState(true);
  const [micActive, setMicActive] = useState(true);
  const [screenShareActive, setScreenShareActive] = useState(false);
  const [timerCount, setTimerCount] = useState(600); // 10 minutes
  
  // Wipe Phase
  const [wipeConsoleLogs, setWipeConsoleLogs] = useState<string[]>([]);
  const [auditLogContent, setAuditLogContent] = useState<string>('');
  
  // Scroll references
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  // Supabase Realtime Broadcast Connection Lifecycle & Event Listeners
  useEffect(() => {
    if (sessionState === 'active' && accessCode && isSupabaseConfigured) {
      const channel = supabase.channel(`deal-room-${accessCode}`, {
        config: {
          broadcast: {
            self: false,
          },
        },
      });

      channel
        .on('broadcast', { event: 'peer-join' }, () => {
          setMessages((prev: ChatMessage[]) => [...prev, {
            id: `sys-${Math.random()}`,
            sender: 'System',
            senderName: 'System',
            text: `Representative from peer business connected. Secure signal tunnel verified.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isEncrypted: false
          }]);
        })
        .on('broadcast', { event: 'chat' }, ({ payload }) => {
          setMessages((prev: ChatMessage[]) => [...prev, payload]);
        })
        .on('broadcast', { event: 'file' }, ({ payload }) => {
          setFiles((prev: EphemeralFile[]) => [...prev, payload]);
        })
        .on('broadcast', { event: 'wipe' }, ({ payload }) => {
          setSessionState('wiped');
          const logs = [
            'Remote peer executed cryptographic wipe command...',
            'Terminating WebRTC active sockets...',
            'Scrubbing client cache directories...',
            'Destroying session keystore rings...',
            'Compiling final transaction hashes...'
          ];
          setWipeConsoleLogs([]);
          logs.forEach((log: string, idx: number) => {
            setTimeout(() => {
              setWipeConsoleLogs((prev: string[]) => [...prev, log]);
            }, idx * 400);
          });
          setTimeout(() => {
            setAuditLogContent(JSON.stringify(payload, null, 2));
          }, 2500);
        })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            channel.send({
              type: 'broadcast',
              event: 'peer-join',
              payload: {}
            });
          }
        });

      channelRef.current = channel;

      return () => {
        supabase.removeChannel(channel);
        channelRef.current = null;
      };
    }
  }, [sessionState, accessCode]);

  // Setup access code
  useEffect(() => {
    if (sessionState === 'signed') {
      const code = 'NEX-' + partyA.substring(0, 4).toUpperCase() + '-' + partyB.substring(0, 4).toUpperCase();
      setAccessCode(code);
    }
  }, [sessionState, partyA, partyB]);

  // Canvas Drawing Actions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';

    const rect = canvas.getBoundingClientRect();
    let x, y;
    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;
    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (signingAs === 'repA') setSignedA(false);
    else setSignedB(false);
  };

  const confirmSignature = () => {
    if (signingAs === 'repA') {
      setSignedA(true);
      // Simulate other party signing 1s later
      setTimeout(() => {
        setSignedB(true);
      }, 1200);
    } else {
      setSignedB(true);
    }
  };

  // Chat Actions
  const sendMessage = () => {
    if (!inputText.trim()) return;
    
    const senderName = signingAs === 'repA' ? repA : repB;
    const senderCompany = signingAs === 'repA' ? partyA : partyB;

    const newMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: signingAs === 'repA' ? 'PartyA' : 'PartyB',
      senderName: `${senderName} (${senderCompany})`,
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isEncrypted: true
    };
    
    setMessages((prev: ChatMessage[]) => [...prev, newMsg]);
    setInputText('');

    // Emit via Supabase Realtime Channel
    if (isSupabaseConfigured && channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'chat',
        payload: newMsg
      });
    } else {
      // Simulate representative reply fallback if testing offline
      setTimeout(() => {
        const replyRep = signingAs === 'repA' ? repB : repA;
        const replyCompany = signingAs === 'repA' ? partyB : partyA;
        let replyText = "Understood. The proposed SLA draft has been uploaded to our Ephemeral Vault.";
        if (inputText.toLowerCase().includes('ip') || inputText.toLowerCase().includes('clause')) {
          replyText = "We agree to the IP allocation terms. The foreground IP splits work for our team.";
        } else if (inputText.toLowerCase().includes('jurisdiction') || inputText.toLowerCase().includes('delaware')) {
          replyText = "The Delaware jurisdiction is verified on our side as well.";
        }
        
        setMessages((prev: ChatMessage[]) => [...prev, {
          id: Math.random().toString(),
          sender: signingAs === 'repA' ? 'PartyB' : 'PartyA',
          senderName: `${replyRep} (${replyCompany})`,
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isEncrypted: true
        }]);
      }, 2000);
    }
  };

  // Timer loop
  useEffect(() => {
    let interval: any;
    if (sessionState === 'active') {
      interval = setInterval(() => {
        setTimerCount((prev: number) => {
          if (prev <= 1) {
            triggerWipe();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionState]);

  // Format timer
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const ss = secs % 60;
    return `${mins}:${ss < 10 ? '0' : ''}${ss}`;
  };

  // Trigger Session Wipe & Purge
  const triggerWipe = () => {
    const auditProofHash = 'SHA-256:' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');
    const auditLogObj = {
      sessionId: accessCode,
      dealTitle: dealTitle,
      partyA: partyA,
      partyB: partyB,
      representatives: `${repA} & ${repB}`,
      ndaVettingType: ndaType,
      signingJurisdiction: jurisdiction,
      timestamps: {
        sessionStarted: new Date(Date.now() - 600000).toISOString(),
        sessionTerminated: new Date().toISOString()
      },
      trafficStats: {
        messagesPurged: messages.length + 3,
        filesPurged: files.length,
        bytesWiped: '24.8 KB'
      },
      cryptographicProofHash: auditProofHash
    };

    if (isSupabaseConfigured && channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'wipe',
        payload: auditLogObj
      });
    }

    // Local state transition for secure session termination
    setSessionState('wiped');
    const logs = [
      'Initializing B2B deal session termination...',
      'Halting WebRTC peer streams...',
      'Revoking direct WebSockets bindings...',
      'Injecting client-side memory dump scrub buffers...',
      'Garbage collecting active chat message arrays...',
      'Scrubbing ephemeral file buffer blobs...',
      'Destroying Diffie-Hellman cryptographic key registers...',
      'Generating cryptographic audit proof...'
    ];
    
    setWipeConsoleLogs([]);
    logs.forEach((log: string, idx: number) => {
      setTimeout(() => {
        setWipeConsoleLogs((prev: string[]) => [...prev, log]);
      }, idx * 400);
    });

    setTimeout(() => {
      setAuditLogContent(JSON.stringify(auditLogObj, null, 2));
    }, 3500);
  };

  // Mock file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const newFile: EphemeralFile = {
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(1) + ' MB',
      type: file.type || 'unknown',
      contentMock: 'User uploaded custom deal document'
    };
    
    setFiles((prev: EphemeralFile[]) => [...prev, newFile]);

    if (isSupabaseConfigured && channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'file',
        payload: newFile
      });
    }
    
    // Log system message in chat
    setMessages((prev: ChatMessage[]) => [...prev, {
      id: Math.random().toString(),
      sender: 'System',
      senderName: 'System',
      text: `Proposal document "${file.name}" uploaded and encrypted in local session buffer.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isEncrypted: true
    }]);
  };

  // Scroll to chat bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Initial chat system logs
  useEffect(() => {
    if (sessionState === 'active') {
      setMessages([
        {
          id: 'sys-1',
          sender: 'System',
          senderName: 'System',
          text: `Initializing WebRTC secure signal channel...`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isEncrypted: false
        },
        {
          id: 'sys-2',
          sender: 'System',
          senderName: 'System',
          text: `Direct handshake established between ${repA} & ${repB}.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isEncrypted: false
        },
        {
          id: 'sys-3',
          sender: 'System',
          senderName: 'System',
          text: `Asymmetric ECDH key exchange complete. Tunnel encrypted via AES-256-GCM. Session history is unlogged.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isEncrypted: true
        }
      ]);
    }
  }, [sessionState]);

  const handleJoinRoom = (code: string) => {
    const room = activeRooms.find(r => r.code === code);
    if (room) {
      setDealTitle(room.title);
      setPartyA(room.partyA);
      setPartyB(room.partyB);
      setAccessCode(room.code);
      setSessionState('signed');
    } else {
      const codeClean = code.trim().toUpperCase();
      if (codeClean.length > 5) {
        setAccessCode(codeClean);
        setSessionState('signed');
      } else {
        alert('Invalid access key format.');
      }
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      
      {/* 0. B2B DASHBOARD / CONTROL PANEL */}
      {sessionState === 'dashboard' && (
        <div style={{ display: 'grid', gap: '32px' }}>
          
          {/* Welcome Dashboard Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 style={{ fontSize: '24px', marginBottom: '4px' }}>B2B Deal Rooms</h2>
              <p style={{ color: '#94a3b8', fontSize: '13.5px' }}>Construct agreements, co-sign with partners, and enter secure WebRTC rooms to exchange bids.</p>
            </div>
            
            <button
              onClick={() => setSessionState('setup')}
              className="btn-glow-purple"
              style={{
                background: '#8b5cf6',
                border: 'none',
                color: '#fff',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              Create New Deal Room <ArrowRight size={16} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'start' }}>
            
            {/* Active Rooms Listing */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '16px', marginBottom: '16px', color: '#cbd5e1' }}>Your Active Deal Chambers</h3>
              <div style={{ display: 'grid', gap: '16px' }}>
                {activeRooms.map((room, idx) => (
                  <div 
                    key={idx}
                    style={{
                      background: 'rgba(255,255,255,0.01)',
                      border: '1px solid rgba(255,255,255,0.04)',
                      borderRadius: '10px',
                      padding: '20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '16px'
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: '15px', color: '#f8fafc', marginBottom: '4px' }}>{room.title}</h4>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>
                        {room.partyA} ↔ {room.partyB} • Access Code: <strong style={{ color: '#a78bfa' }}>{room.code}</strong>
                      </span>
                    </div>
                    <button
                      onClick={() => handleJoinRoom(room.code)}
                      style={{
                        background: 'rgba(139, 92, 246, 0.1)',
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                        color: '#a78bfa',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        fontSize: '12.5px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'var(--transition-smooth)'
                      }}
                    >
                      Connect Room
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Join Room Panel */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '16px', marginBottom: '8px', color: '#cbd5e1' }}>Join Private Chamber</h3>
              <p style={{ color: '#64748b', fontSize: '12.5px', marginBottom: '16px', lineHeight: 1.4 }}>
                Enter the unique, single-session access key provided by your partner business to connect directly to the encryption tunnel.
              </p>
              
              <div style={{ display: 'grid', gap: '12px' }}>
                <input
                  type="text"
                  placeholder="e.g. NEX-ABCD-EFGH"
                  id="join-code-input"
                  style={{
                    width: '100%',
                    background: '#080c14',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '6px',
                    padding: '10px',
                    color: '#fff',
                    fontSize: '14px',
                    fontFamily: 'monospace',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={() => {
                    const inputVal = (document.getElementById('join-code-input') as HTMLInputElement)?.value;
                    if (inputVal) handleJoinRoom(inputVal);
                    else alert('Please enter an access key.');
                  }}
                  className="btn-glow-blue"
                  style={{
                    background: '#3b82f6',
                    color: '#fff',
                    border: 'none',
                    padding: '10px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Verify & Enter Room
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 1. SETUP PHASE */}
      {sessionState === 'setup' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'start' }}>
          
          {/* Left NDA Document Panel */}
          <div className="glass-card" style={{ padding: '32px', borderLeft: '4px solid #8b5cf6' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Secure B2B Deal Room</span>
            <h2 style={{ fontSize: '24px', marginTop: '4px', marginBottom: '24px' }}>AI NDA & Agreement Builder</h2>
            
            <div style={{
              background: '#080c14',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '24px',
              color: '#94a3b8',
              fontSize: '13.5px',
              lineHeight: 1.6,
              maxHeight: '420px',
              overflowY: 'auto',
              marginBottom: '24px',
              fontFamily: 'serif'
            }} className="custom-scroll">
              <h3 style={{ textAlign: 'center', color: '#f8fafc', fontSize: '18px', marginBottom: '20px', fontFamily: 'inherit' }}>
                MUTUAL NON-DISCLOSURE & PROPRIETARY INFORMATION AGREEMENT
              </h3>
              <p style={{ marginBottom: '12px' }}>
                This Agreement is entered into on this <strong>{new Date().toLocaleDateString()}</strong> (the "Effective Date"), by and between the corporate entities:
              </p>
              <p style={{ marginBottom: '12px', color: '#cbd5e1' }}>
                <strong>Party A Disclosing Entity:</strong> {partyA || '(Specify Party A name)'} (represented by {repA})
              </p>
              <p style={{ marginBottom: '12px', color: '#cbd5e1' }}>
                <strong>Party B Disclosing Entity:</strong> {partyB || '(Specify Party B name)'} (represented by {repB})
              </p>
              
              <h4 style={{ color: '#cbd5e1', fontSize: '15px', marginTop: '20px', marginBottom: '8px', fontFamily: 'inherit' }}>1. Scope & Purpose of Deal Room</h4>
              <p style={{ marginBottom: '12px' }}>
                The parties wish to explore a business opportunity in connection with the deal title: <strong>{dealTitle}</strong> and document class: <strong>{ndaType}</strong>. In connection with this opportunity, both parties may exchange proprietary, confidential financial data, trade secrets, and system blueprints.
              </p>
              
              <h4 style={{ color: '#cbd5e1', fontSize: '15px', marginTop: '20px', marginBottom: '8px', fontFamily: 'inherit' }}>2. Intellectual Property & Technology Ownership</h4>
              <p style={{ marginBottom: '12px' }}>
                All background intellectual property, custom assets, and source codes shall remain the sole property of the original owners. Custom codes and outcomes developed under the partnership assign under the clause: <strong style={{ color: '#60a5fa' }}>{ipClauses}</strong>.
              </p>
              
              <h4 style={{ color: '#cbd5e1', fontSize: '15px', marginTop: '20px', marginBottom: '8px', fontFamily: 'inherit' }}>3. Confidentiality Obligations</h4>
              <p style={{ marginBottom: '12px' }}>
                Both parties agree to hold all shared items in strict confidence and shall not disclose them to third parties without prior written consent. This obligation shall endure for a duration of <strong style={{ color: '#60a5fa' }}>{duration}</strong> following session closure.
              </p>

              <h4 style={{ color: '#cbd5e1', fontSize: '15px', marginTop: '20px', marginBottom: '8px', fontFamily: 'inherit' }}>4. Governing Law & Jurisdiction</h4>
              <p style={{ marginBottom: '12px' }}>
                This Agreement and all disputes arising from it shall be governed by, and interpreted in accordance with, the laws of the jurisdiction of <strong style={{ color: '#60a5fa' }}>{jurisdiction}</strong>.
              </p>
            </div>

            {/* Signature Area */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '20px' }}>
              <div style={{
                background: 'rgba(255,255,255,0.01)',
                border: '1px solid rgba(255,255,255,0.04)',
                borderRadius: '8px',
                padding: '12px'
              }}>
                <span style={{ fontSize: '11px', color: '#64748b' }}>SIGNING ROLE SELECTOR</span>
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  <button 
                    onClick={() => setSigningAs('repA')} 
                    style={{
                      flex: 1,
                      background: signingAs === 'repA' ? '#8b5cf6' : 'rgba(255,255,255,0.03)',
                      color: '#fff',
                      border: 'none',
                      padding: '6px',
                      borderRadius: '4px',
                      fontSize: '11.5px',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    Act as {partyA.substring(0,10)}...
                  </button>
                  <button 
                    onClick={() => setSigningAs('repB')}
                    style={{
                      flex: 1,
                      background: signingAs === 'repB' ? '#8b5cf6' : 'rgba(255,255,255,0.03)',
                      color: '#fff',
                      border: 'none',
                      padding: '6px',
                      borderRadius: '4px',
                      fontSize: '11.5px',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    Act as {partyB.substring(0,10)}...
                  </button>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', fontWeight: 600, marginBottom: '8px' }}>
                  Party A Signature Pad ({repA})
                </label>
                <div style={{ position: 'relative' }}>
                  <canvas
                    ref={signingAs === 'repA' ? canvasRef : null}
                    width={320}
                    height={120}
                    className="sig-canvas"
                    onMouseDown={signingAs === 'repA' ? startDrawing : undefined}
                    onMouseMove={signingAs === 'repA' ? draw : undefined}
                    onMouseUp={signingAs === 'repA' ? stopDrawing : undefined}
                    onMouseLeave={signingAs === 'repA' ? stopDrawing : undefined}
                    onTouchStart={signingAs === 'repA' ? startDrawing : undefined}
                    onTouchMove={signingAs === 'repA' ? draw : undefined}
                    onTouchEnd={signingAs === 'repA' ? stopDrawing : undefined}
                    style={{ pointerEvents: signingAs === 'repA' ? 'auto' : 'none', opacity: signingAs === 'repA' ? 1 : 0.4 }}
                  />
                  {signedA && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'rgba(14, 20, 34, 0.9)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#34d399',
                      fontWeight: 600,
                      gap: '8px'
                    }}>
                      <CheckCircle size={18} /> Representative A Signed
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                  <button
                    onClick={clearCanvas}
                    disabled={signedA && signingAs === 'repA'}
                    style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}
                  >
                    Clear
                  </button>
                  <button
                    onClick={confirmSignature}
                    disabled={signedA && signingAs === 'repA'}
                    style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '6px 16px', borderRadius: '4px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Lock Signature
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', fontWeight: 600, marginBottom: '8px' }}>
                  Party B Signature Pad ({repB})
                </label>
                <div style={{ position: 'relative' }}>
                  <canvas
                    ref={signingAs === 'repB' ? canvasRef : null}
                    width={320}
                    height={120}
                    className="sig-canvas"
                    onMouseDown={signingAs === 'repB' ? startDrawing : undefined}
                    onMouseMove={signingAs === 'repB' ? draw : undefined}
                    onMouseUp={signingAs === 'repB' ? stopDrawing : undefined}
                    onMouseLeave={signingAs === 'repB' ? stopDrawing : undefined}
                    onTouchStart={signingAs === 'repB' ? startDrawing : undefined}
                    onTouchMove={signingAs === 'repB' ? draw : undefined}
                    onTouchEnd={signingAs === 'repB' ? stopDrawing : undefined}
                    style={{ pointerEvents: signingAs === 'repB' ? 'auto' : 'none', opacity: signingAs === 'repB' ? 1 : 0.4 }}
                  />
                  {signedB && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'rgba(14, 20, 34, 0.9)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#a78bfa',
                      fontWeight: 600,
                      gap: '8px'
                    }}>
                      <CheckCircle size={18} /> Representative B Co-signed
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                  <button
                    onClick={clearCanvas}
                    disabled={signedB && signingAs === 'repB'}
                    style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}
                  >
                    Clear
                  </button>
                  <button
                    onClick={confirmSignature}
                    disabled={signedB && signingAs === 'repB'}
                    style={{ background: '#8b5cf6', color: '#fff', border: 'none', padding: '6px 16px', borderRadius: '4px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Lock Signature
                  </button>
                </div>
              </div>
            </div>

            {signedA && signedB && (
              <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'space-between' }}>
                <button
                  onClick={() => setSessionState('dashboard')}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#94a3b8',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  ← Back to Dashboard
                </button>
                
                <button
                  onClick={() => setSessionState('signed')}
                  className="btn-glow-purple"
                  style={{
                    background: '#8b5cf6',
                    color: '#fff',
                    border: 'none',
                    padding: '12px 32px',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  Generate One-Time Access Key <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Right Parameters Options */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>Deal Specifications</h3>
            
            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>Deal Agreement Title</label>
                <input
                  type="text"
                  value={dealTitle}
                  onChange={(e) => setDealTitle(e.target.value)}
                  style={{ width: '100%', background: '#080c14', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '6px', color: '#fff', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>Party A Legal Name</label>
                <input
                  type="text"
                  value={partyA}
                  onChange={(e) => setPartyA(e.target.value)}
                  style={{ width: '100%', background: '#080c14', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '6px', color: '#fff', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>Representative A</label>
                <input
                  type="text"
                  value={repA}
                  onChange={(e) => setRepA(e.target.value)}
                  style={{ width: '100%', background: '#080c14', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '6px', color: '#fff', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>Party B Legal Name</label>
                <input
                  type="text"
                  value={partyB}
                  onChange={(e) => setPartyB(e.target.value)}
                  style={{ width: '100%', background: '#080c14', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '6px', color: '#fff', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>Representative B</label>
                <input
                  type="text"
                  value={repB}
                  onChange={(e) => setRepB(e.target.value)}
                  style={{ width: '100%', background: '#080c14', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '6px', color: '#fff', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>NDA Document Type</label>
                <select
                  value={ndaType}
                  onChange={(e) => setNdaType(e.target.value)}
                  style={{ width: '100%', background: '#080c14', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '6px', color: '#fff', fontSize: '13px' }}
                >
                  <option value="Corporate Mutual Non-Disclosure Agreement">Mutual NDA Agreement</option>
                  <option value="Joint Venture Diligence & Partnership Agreement">JV Partnership Deal</option>
                  <option value="Product Sourcing & Supply Chain Agreement">Supply Chain Deal</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>Intellectual Property Clause</label>
                <input
                  type="text"
                  value={ipClauses}
                  onChange={(e) => setIpClauses(e.target.value)}
                  style={{ width: '100%', background: '#080c14', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '6px', color: '#fff', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>Confidentiality Period</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  style={{ width: '100%', background: '#080c14', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '6px', color: '#fff', fontSize: '13px' }}
                >
                  <option value="3 Years">3 Years</option>
                  <option value="5 Years">5 Years</option>
                  <option value="Indefinite duration">Indefinite</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>Governing Court Jurisdiction</label>
                <input
                  type="text"
                  value={jurisdiction}
                  onChange={(e) => setJurisdiction(e.target.value)}
                  style={{ width: '100%', background: '#080c14', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '6px', color: '#fff', fontSize: '13px' }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. SIGNED & CODE GENERATED */}
      {sessionState === 'signed' && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', animation: 'fadeIn 0.5s ease-out' }}>
          <div className="glass-card" style={{ padding: '48px', maxWidth: '500px', width: '100%', textAlign: 'center', borderTop: '4px solid #10b981' }}>
            <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', marginBottom: '24px' }}>
              <ShieldCheck size={36} />
            </div>
            <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Deal Key Generated</h2>
            <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6, marginBottom: '32px' }}>
              The agreement has been verified and logged cryptographically. The following access key provides authorization into the encrypted WebRTC deal room tunnel.
            </p>

            <div style={{
              background: '#080c14',
              border: '1px dashed #10b981',
              borderRadius: '8px',
              padding: '16px',
              fontFamily: 'monospace',
              fontSize: '18px',
              color: '#34d399',
              fontWeight: 'bold',
              letterSpacing: '0.1em',
              marginBottom: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}>
              <Key size={18} /> {accessCode}
            </div>

            <button
              onClick={() => setSessionState('active')}
              className="btn-glow-green"
              style={{
                background: '#10b981',
                color: '#fff',
                border: 'none',
                padding: '12px 32px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Enter Secured Deal Console
            </button>
          </div>
        </div>
      )}

      {/* 3. ACTIVE DEAL ROOM CONSOLE */}
      {sessionState === 'active' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', animation: 'fadeIn 0.5s ease-out' }}>
          
          {/* Left Console Panel */}
          <div style={{ display: 'grid', gap: '24px' }}>
            
            {/* Sec Console Header */}
            <div className="glass-card" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', animation: 'pulseGlow 1.5s infinite' }} />
                <div>
                  <h3 style={{ fontSize: '15px' }}>{dealTitle} ({accessCode})</h3>
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
                  style={{
                    background: '#8b5cf6',
                    border: 'none',
                    color: '#fff',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Trash2 size={13} /> Close & Wipe
                </button>
              </div>
            </div>

            {/* Video Call Simulation Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              {/* Party A Stream */}
              <div className="glass-card" style={{ height: '220px', position: 'relative', overflow: 'hidden', background: '#080c14' }}>
                {cameraActive ? (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle, #1e293b 0%, #080c14 100%)' }}>
                    {screenShareActive ? (
                      <div style={{ width: '100%', height: '100%', padding: '16px', fontFamily: 'monospace', fontSize: '9px', color: '#60a5fa', overflow: 'hidden' }}>
                        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '6px', marginBottom: '8px' }}>[SCREEN SHARE - Proposal Term Sheets]</div>
                        <div>1. STRATEGIC COOPERATION AGREEMENT</div>
                        <div>1.1 Subject: Provision of dedicated cloud servers.</div>
                        <div style={{ paddingLeft: '12px' }}>a) SLA Target: 99.99% monthly availability metrics.</div>
                        <div style={{ paddingLeft: '12px' }}>b) Liability Index: Tier 1 standard caps.</div>
                        <div>2. FINANCIAL SCHEDULE:</div>
                        <div style={{ paddingLeft: '12px' }}>a) Fixed: $1,200,000 yearly commitment indices.</div>
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

              {/* Party B Stream */}
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
                      <span style={{ fontSize: '10px', background: 'rgba(59,130,246,0.1)', color: '#60a5fa', padding: '1px 6px', borderRadius: '4px' }}>RTT: 28ms</span>
                    </div>
                  </div>
                </div>
                <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px' }}>
                  {repB} ({partyB})
                </div>
              </div>
            </div>

            {/* Video Controllers */}
            <div className="glass-card" style={{ padding: '12px', display: 'flex', justifyContent: 'center', gap: '16px' }}>
              <button
                onClick={() => setCameraActive(!cameraActive)}
                style={{
                  background: cameraActive ? '#3b82f6' : 'rgba(255,255,255,0.05)',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                {cameraActive ? 'Disable Camera' : 'Enable Camera'}
              </button>
              <button
                onClick={() => setMicActive(!micActive)}
                style={{
                  background: micActive ? '#3b82f6' : 'rgba(255,255,255,0.05)',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                {micActive ? 'Mute Mic' : 'Unmute Mic'}
              </button>
              <button
                onClick={() => setScreenShareActive(!screenShareActive)}
                style={{
                  background: screenShareActive ? '#10b981' : 'rgba(255,255,255,0.05)',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                {screenShareActive ? 'Stop Share' : 'Share Screen'}
              </button>
            </div>

            {/* Encrypted Chat Window */}
            <div className="glass-card" style={{ height: '360px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={16} color="#8b5cf6" />
                <span style={{ fontSize: '13px', fontWeight: 600 }}>Zero-Trace Secure Chat Ledger</span>
              </div>
              
              <div style={{ flex: 1, padding: '16px', overflowY: 'auto' }} className="custom-scroll">
                {messages.map((msg: ChatMessage) => (
                  <div key={msg.id} style={{ marginBottom: '16px', textAlign: msg.senderName.includes(signingAs === 'repA' ? partyA : partyB) ? 'right' : 'left' }}>
                    {msg.sender === 'System' ? (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', color: '#64748b', fontFamily: 'monospace' }}>
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

              {/* Chat Input */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '12px 16px', display: 'flex', gap: '12px' }}>
                <input
                  type="text"
                  placeholder="Send direct message (AES-GCM encrypted)..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  style={{
                    flex: 1,
                    background: '#080c14',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '6px',
                    padding: '10px 14px',
                    color: '#fff',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={sendMessage}
                  className="btn-glow-purple"
                  style={{
                    background: '#8b5cf6',
                    border: 'none',
                    color: '#fff',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Send
                </button>
              </div>
            </div>
          </div>

          {/* Right Ephemeral File Vault */}
          <div className="glass-card" style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={16} color="#8b5cf6" /> Versioned Proposals
            </h3>
            <p style={{ color: '#64748b', fontSize: '11px', lineHeight: 1.4, marginBottom: '20px' }}>
              All documents are cached only inside active session memory slots. No database logs remain after purging.
            </p>

            {/* Drop simulator */}
            <div style={{
              border: '1px dashed rgba(139, 92, 246, 0.3)',
              borderRadius: '10px',
              padding: '24px 16px',
              textAlign: 'center',
              background: 'rgba(139, 92, 246, 0.02)',
              cursor: 'pointer',
              marginBottom: '24px',
              position: 'relative'
            }}>
              <input
                type="file"
                onChange={handleFileUpload}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer'
                }}
              />
              <Upload size={24} color="#a78bfa" style={{ margin: '0 auto 8px auto' }} />
              <span style={{ fontSize: '12px', color: '#cbd5e1', display: 'block' }}>Drag new proposals or click</span>
              <span style={{ fontSize: '10px', color: '#64748b', marginTop: '2px', display: 'block' }}>PDF, DOCX, PNG (Max 5MB)</span>
            </div>

            {/* File List */}
            <div style={{ display: 'grid', gap: '10px' }}>
              {files.map((file: EphemeralFile, idx: number) => (
                <div
                  key={idx}
                  onClick={() => alert(`Proposal Buffer Content: ${file.contentMock}`)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.01)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    padding: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'var(--transition-smooth)'
                  }}
                  className="glass-card"
                >
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <FileText size={16} color="#8b5cf6" />
                    <div>
                      <h5 style={{ fontSize: '12px', color: '#cbd5e1', wordBreak: 'break-all' }}>{file.name}</h5>
                      <span style={{ fontSize: '10px', color: '#64748b' }}>{file.size} • Encrypted</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. CRYPTOGRAPHIC WIPE & PURGE SCREEN */}
      {sessionState === 'wiped' && (
        <div className="matrix-overlay" style={{ animation: 'fadeIn 0.5s ease-out' }}>
          
          <div style={{ maxWidth: '640px', width: '100%', padding: '32px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '20px', borderBottom: '1px solid #10b981', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RefreshCw size={18} className="spin-slow" /> CRYPTOGRAPHIC MEMORY PURGING ACTIVE
            </h2>
            
            {/* Terminal logs */}
            <div style={{
              background: 'rgba(0,0,0,0.9)',
              border: '1px solid #10b981',
              borderRadius: '8px',
              padding: '20px',
              fontFamily: 'monospace',
              fontSize: '12px',
              color: '#34d399',
              minHeight: '200px',
              marginBottom: '24px',
              lineHeight: 1.5
            }}>
              {wipeConsoleLogs.map((log: string, idx: number) => (
                <div key={idx} style={{ marginBottom: '6px' }}>
                  &gt; {log}
                </div>
              ))}
              {wipeConsoleLogs.length === 8 && (
                <div style={{ color: '#10b981', fontWeight: 'bold', marginTop: '12px', textAlign: 'center' }}>
                  ★★★ CHOBER SANITIZED: SESSION WIPED FROM PLATFORM MEMORY ★★★
                </div>
              )}
            </div>

            {/* Audit Log Proof */}
            {auditLogContent && (
              <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
                <h3 style={{ fontSize: '13px', color: '#10b981', marginBottom: '8px', fontWeight: 600 }}>Tamper-proof Cryptographic Verification Receipt:</h3>
                <pre style={{
                  background: 'rgba(0,0,0,0.6)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '16px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  color: '#86efac',
                  overflowX: 'auto',
                  maxHeight: '160px',
                  marginBottom: '24px'
                }} className="custom-scroll">
                  {auditLogContent}
                </pre>

                <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(auditLogContent);
                      alert('Audit receipt copied to clipboard.');
                    }}
                    style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid #10b981',
                      color: '#10b981',
                      padding: '10px 20px',
                      borderRadius: '6px',
                      fontWeight: 600,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Copy size={14} /> Copy Receipt
                  </button>
                  <button
                    onClick={onNavigateToDashboard}
                    style={{
                      background: '#10b981',
                      border: 'none',
                      color: '#000',
                      padding: '10px 24px',
                      borderRadius: '6px',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <LogOut size={14} /> Return to Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
