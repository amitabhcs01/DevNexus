import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { getAdvisoryArchetype } from './advisoryArchetypes.js';
import { getDevelopers, saveDevelopers, getDealrooms, saveDealrooms } from './dbStore.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH']
  }
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Initialize Anthropic Client
let anthropicClient = null;
if (process.env.ANTHROPIC_API_KEY) {
  try {
    anthropicClient = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
    console.log('Anthropic Claude Client initialized successfully.');
  } catch (err) {
    console.error('Failed to initialize Anthropic client:', err.message);
  }
} else {
  console.log('No ANTHROPIC_API_KEY found. Running in high-fidelity simulated backend mode.');
}

// ----------------------------------------------------
// REST API ENDPOINTS
// ----------------------------------------------------

// 0. API Health Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 1. Analyze Project Brief via Claude (v2)
app.post('/api/analyze', async (req, res) => {
  const { description } = req.body;
  if (!description) {
    return res.status(400).json({ error: 'Description is required' });
  }

  if (anthropicClient) {
    try {
      console.log('Sending project brief description to Claude API...');
      const response = await anthropicClient.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1500,
        temperature: 0.2,
        system: `You are the DevNexus Lead AI Software Architect. Your job is to analyze plain English software requests and return a comprehensive 360° technical and strategic analysis brief as a valid JSON object matching this TypeScript interface:
        interface ProjectBrief {
          id: string;
          title: string;
          description: string;
          techStack: string[];
          estimatedCost: string;
          estimatedTimeline: string;
          overview: string;
          pros: string[];
          cons: string[];
          crossIdeas: { title: string; explanation: string }[];
          implementationPlan: {
            phase1: { title: string; features: string[]; techStack: string[] };
            phase2: { title: string; features: string[]; techStack: string[] };
            phase3: { title: string; features: string[]; techStack: string[] };
          };
          implementationRoadmap: {
            stages: { stage: string; timeframe: string; deliverable: string; owner: string }[];
            criticalPath: string;
            riskFlags: string[];
            recommendedTeamSize: string;
          };
          functionalRequirements: string[];
          nonFunctionalRequirements: {
            performance: string;
            security: string;
            scalability: string;
            availability: string;
            compliance: string;
          };
          spinoff: {
            name: string;
            description: string;
            useCase: string;
            uniqueness: string;
          };
        }
        Be direct, technical, insightful, and act like a YC-level advisor. Do not add markdown formatting, do not write 'Here is your JSON', return ONLY the raw JSON string.`,
        messages: [{ role: 'user', content: `Please analyze this software request and generate all sections specifically tailored to this idea: "${description}"` }]
      });

      const rawJson = response.content[0].text;
      const parsedData = JSON.parse(rawJson.trim());
      parsedData.id = `brief-${Math.floor(Math.random() * 1000)}`;
      return res.json(parsedData);
    } catch (apiErr) {
      console.error('Claude API call failed. Falling back to local analysis compiler.', apiErr.message);
    }
  }

  const brief = getAdvisoryArchetype(description);
  return res.json(brief);
});

// 2. Draft NDA Agreement
app.post('/api/nda/generate', async (req, res) => {
  const { partyA, partyB, ndaType, ipClauses, duration, jurisdiction } = req.body;
  
  if (anthropicClient) {
    try {
      console.log('Calling Claude to generate customized NDA text...');
      const response = await anthropicClient.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1500,
        temperature: 0.3,
        messages: [{
          role: 'user',
          content: `Write a customized, legal-grade Non-Disclosure Agreement (NDA) with the following parameters:
          - Client Disclosing Party: ${partyA}
          - Builder Receiving Party: ${partyB}
          - Business Purpose: ${ndaType}
          - Intellectual Property terms: ${ipClauses}
          - Confidentiality period: ${duration}
          - Governing jurisdiction: ${jurisdiction}
          Return only the legal text document. Use clean paragraph layouts.`
        }]
      });
      return res.json({ documentText: response.content[0].text });
    } catch (apiErr) {
      console.error('Claude API NDA generation failed. Using default template.', apiErr.message);
    }
  }

  const defaultText = `
MUTUAL NON-DISCLOSURE & PROPRIETARY INFORMATION AGREEMENT

This Agreement is entered into on this Effective Date by and between Client Party: ${partyA} and Builder Party: ${partyB}.

1. BUSINESS PURPOSE. The parties wish to explore opportunities regarding ${ndaType}.
2. INTELLECTUAL PROPERTY. Custom source code transfers under the clause: ${ipClauses}.
3. CONFIDENTIALITY. All shared credentials, specifications, and files must be held in strict confidence for a duration of ${duration} following room closure.
4. GOVERNING LAW. This agreement is governed by the laws of the jurisdiction of ${jurisdiction}.
  `.trim();

  return res.json({ documentText: defaultText });
});

// 3. Expose Developers Registry
app.get('/api/developers', (req, res) => {
  const developers = getDevelopers();
  res.json({ success: true, developers });
});

// 4. Update Developer Profile
app.post('/api/profile/update', (req, res) => {
  const { id, developer } = req.body;
  if (!id || !developer) {
    return res.status(400).json({ error: 'Developer ID and updated data are required' });
  }

  const developers = getDevelopers();
  const index = developers.findIndex(d => d.id === id);

  if (index === -1) {
    // Create new profile record if not found
    developers.push({ ...developer, id });
  } else {
    // Merge updates
    developers[index] = { ...developers[index], ...developer };
  }

  saveDevelopers(developers);
  res.json({ success: true, developer: developers[index === -1 ? developers.length - 1 : index] });
});

// ----------------------------------------------------
// B2B DEAL ROOM REST API ENDPOINTS
// ----------------------------------------------------

// 5. Create a new deal room
app.post('/api/dealroom/create', (req, res) => {
  const { id, title, createdBy, parties, dealTerms } = req.body;
  
  if (!id) {
    return res.status(400).json({ error: 'Deal Room Access Code / ID is required' });
  }

  const dealrooms = getDealrooms();
  
  if (dealrooms[id]) {
    return res.json({ success: true, dealroom: dealrooms[id], message: 'Existing dealroom loaded.' });
  }

  const newRoom = {
    id,
    title: title || 'Strategic Business Agreement',
    createdBy: createdBy || 'anonymous',
    parties: parties || [],
    status: 'active',
    messages: [],
    ndaStatus: 'not_sent',
    files: [],
    dealTerms: dealTerms || { value: 0, currency: 'USD', deadline: '', conditions: '' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  dealrooms[id] = newRoom;
  saveDealrooms(dealrooms);

  console.log(`B2B Deal Room created: ${id}`);
  res.json({ success: true, dealroom: newRoom });
});

// 6. Fetch deal room details
app.get('/api/dealroom/:id', (req, res) => {
  const { id } = req.params;
  const dealrooms = getDealrooms();
  const room = dealrooms[id];

  if (!room) {
    return res.status(404).json({ error: 'Deal Room not found' });
  }

  res.json({ success: true, dealroom: room });
});

// 7. Invite another party to deal room
app.post('/api/dealroom/:id/invite', (req, res) => {
  const { id } = req.params;
  const { userId, companyName, role } = req.body;

  if (!companyName) {
    return res.status(400).json({ error: 'Company Name is required for invitation' });
  }

  const dealrooms = getDealrooms();
  const room = dealrooms[id];

  if (!room) {
    return res.status(404).json({ error: 'Deal Room not found' });
  }

  const existing = room.parties.find(p => p.companyName.toLowerCase() === companyName.toLowerCase());
  if (!existing) {
    room.parties.push({
      userId: userId || `user-${Math.floor(Math.random() * 1000)}`,
      companyName,
      role: role || 'PartyB'
    });
    room.updatedAt = new Date().toISOString();
    saveDealrooms(dealrooms);
    
    // Notify room via socket
    io.to(id).emit('peer:invited', { companyName, role });
  }

  res.json({ success: true, dealroom: room });
});

// 8. Send a message in deal room
app.post('/api/dealroom/:id/message', (req, res) => {
  const { id } = req.params;
  const { senderId, senderName, content, attachments } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Message content is required' });
  }

  const dealrooms = getDealrooms();
  const room = dealrooms[id];

  if (!room) {
    return res.status(404).json({ error: 'Deal Room not found' });
  }

  const newMsg = {
    id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    senderId: senderId || 'system',
    senderName: senderName || 'Anonymous',
    content,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    attachments: attachments || []
  };

  room.messages.push(newMsg);
  room.updatedAt = new Date().toISOString();
  saveDealrooms(dealrooms);

  // Emit websocket events for realtime syncing
  io.to(id).emit('message:new', newMsg);
  
  // Backwards compatibility event
  io.to(id).emit('chat-message-receive', {
    id: newMsg.id,
    sender: senderId === room.createdBy ? 'PartyA' : 'PartyB',
    senderName: newMsg.senderName,
    text: newMsg.content,
    timestamp: newMsg.timestamp,
    isEncrypted: true
  });

  res.json({ success: true, message: newMsg });
});

// 9. Fetch message history
app.get('/api/dealroom/:id/messages', (req, res) => {
  const { id } = req.params;
  const dealrooms = getDealrooms();
  const room = dealrooms[id];

  if (!room) {
    return res.status(404).json({ error: 'Deal Room not found' });
  }

  res.json({ success: true, messages: room.messages });
});

// 10. Sign / Update NDA
app.post('/api/dealroom/:id/nda', (req, res) => {
  const { id } = req.params;
  const { status, representative, party } = req.body; // status: 'pending' | 'signed'

  const dealrooms = getDealrooms();
  const room = dealrooms[id];

  if (!room) {
    return res.status(404).json({ error: 'Deal Room not found' });
  }

  room.ndaStatus = status || 'signed';
  room.updatedAt = new Date().toISOString();
  saveDealrooms(dealrooms);

  // Emit to socket
  io.to(id).emit('nda:signed', { status: room.ndaStatus, representative, party });

  res.json({ success: true, dealroom: room });
});

// 11. Attach file/document
app.post('/api/dealroom/:id/files', (req, res) => {
  const { id } = req.params;
  const { name, size, type, contentMock, uploadedBy } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'File name is required' });
  }

  const dealrooms = getDealrooms();
  const room = dealrooms[id];

  if (!room) {
    return res.status(404).json({ error: 'Deal Room not found' });
  }

  const newFile = {
    name,
    size: size || 'unknown size',
    type: type || 'application/octet-stream',
    contentMock: contentMock || '',
    uploadedBy: uploadedBy || 'Anonymous',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  room.files.push(newFile);
  room.updatedAt = new Date().toISOString();
  saveDealrooms(dealrooms);

  // Emit to socket
  io.to(id).emit('file:uploaded', newFile);
  
  // Backwards compatibility event
  io.to(id).emit('file-upload-receive', newFile);

  res.json({ success: true, file: newFile });
});

// 12. Update deal status
app.patch('/api/dealroom/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, dealTerms } = req.body; // negotiating -> terms_agreed -> nda_signed -> closed

  const dealrooms = getDealrooms();
  const room = dealrooms[id];

  if (!room) {
    return res.status(404).json({ error: 'Deal Room not found' });
  }

  if (status) room.status = status;
  if (dealTerms) room.dealTerms = { ...room.dealTerms, ...dealTerms };
  
  room.updatedAt = new Date().toISOString();
  saveDealrooms(dealrooms);

  // Emit to socket
  io.to(id).emit('deal:statusChange', { status: room.status, dealTerms: room.dealTerms });

  res.json({ success: true, dealroom: room });
});

// ----------------------------------------------------
// WEBSOCKET SIGNALING & ROOM CHANNELS
// ----------------------------------------------------
io.on('connection', (socket) => {
  console.log(`Socket client connected: ${socket.id}`);

  // Handle client joining a secure deal room channel
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined secure room: ${roomId}`);
    socket.to(roomId).emit('peer-connected', { peerId: socket.id });
    
    // Broadcast generic peer connected alert
    socket.to(roomId).emit('peer-join', { peerId: socket.id });
  });

  // Relay WebRTC handshake signaling packets
  socket.on('signal', ({ roomId, data }) => {
    socket.to(roomId).emit('signal-receive', data);
  });

  // Legacy messaging events (fallback)
  socket.on('chat-message', ({ roomId, message }) => {
    socket.to(roomId).emit('chat-message-receive', message);
  });

  socket.on('file-upload', ({ roomId, file }) => {
    socket.to(roomId).emit('file-upload-receive', file);
  });

  socket.on('peer-state-change', ({ roomId, state }) => {
    socket.to(roomId).emit('peer-state-change-receive', state);
  });

  // Realtime Deal Terms synced event
  socket.on('terms-change', ({ roomId, dealTerms }) => {
    const dealrooms = getDealrooms();
    const room = dealrooms[roomId];
    if (room) {
      room.dealTerms = dealTerms;
      room.updatedAt = new Date().toISOString();
      saveDealrooms(dealrooms);
      socket.to(roomId).emit('deal:statusChange', { status: room.status, dealTerms });
    }
  });

  // Session destruction wipe event
  socket.on('wipe-session', ({ roomId, auditLog }) => {
    console.log(`Cryptographic wipe command executed for room: ${roomId}`);
    
    const dealrooms = getDealrooms();
    if (dealrooms[roomId]) {
      delete dealrooms[roomId];
      saveDealrooms(dealrooms);
    }
    
    io.to(roomId).emit('session-wiped', auditLog);
    io.to(roomId).emit('broadcast', { event: 'wipe', payload: auditLog });
  });

  socket.on('disconnect', () => {
    console.log(`Socket client disconnected: ${socket.id}`);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`DevNexus Backend Server running on http://localhost:${PORT}`);
});
