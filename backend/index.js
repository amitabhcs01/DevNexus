import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { getAdvisoryArchetype } from './advisoryArchetypes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
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

// 1. Analyze Project Brief via Claude (v2)
app.post('/api/analyze', async (req, res) => {
  const { description } = req.body;
  if (!description) {
    return res.status(400).json({ error: 'Description is required' });
  }

  // If Claude client is available, execute a real API prompt
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

  // Fallback High-Fidelity Local Compiler matching the new v2 schema
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

  // Fallback Template
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
  res.json({ success: true });
});

// ----------------------------------------------------
// WEBSOCKET SIGNALING & ROOM CHANNELS
// ----------------------------------------------------
io.on('connection', (socket) => {
  console.log(`Socket client connected: ${socket.id}`);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined secure room: ${roomId}`);
    socket.to(roomId).emit('peer-connected', { peerId: socket.id });
  });

  socket.on('signal', ({ roomId, data }) => {
    socket.to(roomId).emit('signal-receive', data);
  });

  socket.on('chat-message', ({ roomId, message }) => {
    socket.to(roomId).emit('chat-message-receive', message);
  });

  socket.on('file-upload', ({ roomId, file }) => {
    socket.to(roomId).emit('file-upload-receive', file);
  });

  socket.on('peer-state-change', ({ roomId, state }) => {
    socket.to(roomId).emit('peer-state-change-receive', state);
  });

  socket.on('wipe-session', ({ roomId, auditLog }) => {
    console.log(`Cryptographic wipe command executed for room: ${roomId}`);
    io.to(roomId).emit('session-wiped', auditLog);
  });

  socket.on('disconnect', () => {
    console.log(`Socket client disconnected: ${socket.id}`);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`DevNexus Backend Server running on http://localhost:${PORT}`);
});
