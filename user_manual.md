# DevNexus — Complete Operations & Deployment Manual

Welcome to **DevNexus**, a highly secured, production-grade B2B SaaS platform that connects founders (AI Advisory Hub), vetted developers (Registry & Skill Graph), and secure negotiation spaces (B2B Private Deal Room).

This manual provides all details necessary to configure, run, secure, and deploy the entire software stack for free.

---

## 1. System Architecture

DevNexus utilizes a serverless, database-secured frontend architecture:
1. **Frontend**: Vite + React + TypeScript + Tailwind-equivalent premium custom CSS styling.
2. **Backend Services (Serverless)**: 
   - **Authentication**: Supabase Auth (JWT email/password credentials).
   - **Database**: Supabase PostgreSQL persistence for AI brief generation logs and developer directories.
   - **Realtime Channels**: Supabase Realtime Broadcast network for end-to-end peer WebRTC signaling, live chat messages, ephemeral document locks, and remote cryptographic wiping. No Node.js backend hosting is required!
3. **Local/Sandbox Sandbox Fallback**: If Supabase credentials are not provided, DevNexus automatically falls back to an insulated Local Guest sandbox, allowing immediate demo testing offline.

---

## 2. Supabase Cloud Configuration (Database & Security Setup)

To run the application in fully persistent mode, configure a free database instance:

### Step 1: Create a Free Project
1. Go to [Supabase](https://supabase.com) and sign in/up.
2. Click **New Project** and select the free tier.
3. Note your **Project URL** and **API Anon Key** (from Settings -> API).

### Step 2: Set Up Database Schema & Security Policies
1. Navigate to the **SQL Editor** in the Supabase Dashboard.
2. Open the file [supabase_schema.sql](file:///c:/Users/HP/OneDrive/Desktop/DevNexus/supabase_schema.sql) in your local code directory.
3. Copy the entire SQL content and paste it into the Supabase SQL editor window.
4. Click **Run** to execute. This script will:
   - Create tables: `developers`, `reviews`, `briefs`, `rooms`.
   - Seed the initial vetted developers.
   - **Enable Row-Level Security (RLS)** on all tables.
   - Enforce policies so users can only read/write their own AI briefs (`auth.uid() = user_id`) and read developer registry info securely.

---

## 3. Environment Configurations

Create a `.env` file in the root folder of your project to connect your local app build to the cloud:

```bash
# c:/Users/HP/OneDrive/Desktop/DevNexus/.env

VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

*Note: If these environment variables are absent, the console will print a warning and DevNexus will gracefully toggle into Local Guest Sandbox mode. In this mode, mock users, simulated AI completions, and local chat state functions are fully operational.*

---

## 3.5 Pre-Created Test Accounts

For ease of testing both in Local/Guest Sandbox mode and Cloud Mode, the following credentials can be used:

1. **Admin Workspace**:
   - **Email**: `admin@devnexus.local`
   - **Password**: `AdminPasswordSecure123!`
2. **Client Workspace**:
   - **Email**: `client@devnexus.local`
   - **Password**: `ClientPasswordSecure123!`
3. **Developer Workspace**:
   - **Email**: `developer@devnexus.local`
   - **Password**: `DeveloperPasswordSecure123!`

*Note: In local sandbox mode, you can auto-fill these credentials directly from the login/signup screen using the built-in **Auto-Fill** helpers!*

---

## 4. Local Development

To run the application locally on your computer:

```bash
# Install package dependencies
npm install

# Run the local development server
npm run dev
```

The app will compile and host locally (usually at `http://localhost:5173`). Open the browser to interact.

---

## 5. Security & Anti-Hack Vetting

DevNexus has been hardened with the following security measures:
1. **Row Level Security (RLS)**: PostgreSQL enforces database locks. An attacker cannot query briefs or rooms belonging to other user accounts even if they acquire the anonymous API key.
2. **Ephemeral Signaling**: Communication within the Deal Room is transmitted directly peer-to-peer using Supabase Broadcast. Messages and file uploads are processed entirely in browser memory and are **never logged** or stored in any persistent database table.
3. **Session Wiping**: When either party triggers a "Wipe Session" command, a cryptographic audit log is compiled and a broadcast signal triggers a complete memory purge. The active memory arrays, file blobs, and state engines are scrubbed on both peer clients.

---

## 6. One-Click Free Deployment

You can deploy the DevNexus frontend to production for free in less than 2 minutes using Vercel or Netlify.

### Option A: Vercel (Recommended)
1. Install the Vercel CLI (`npm install -g vercel`) or sign up at [Vercel](https://vercel.com).
2. Connect your GitHub repository, or deploy via command line:
   ```bash
   vercel
   ```
3. When prompted, add the following environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Vercel will build and deploy the application, returning a production-ready `.vercel.app` URL.

### Option B: Netlify
1. Sign in to [Netlify](https://netlify.com) and select **Import from Git**.
2. Select your repository.
3. In **Build Settings**, set the Build command to `npm run build` and publish directory to `dist`.
4. Under **Environment variables**, paste your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
5. Click **Deploy Site**.

---

## 7. How to Verify & Test

1. **Sign Up**: Load the live app, enter your email, and sign up.
2. **Submit a Brief**: Go to the **AI Advisory Hub**, describe a project, and click **Submit Brief**. Check the Supabase database to verify the entry is logged under your secure user ID.
3. **Test Deal Room Broadcast**: 
   - Enter the **B2B Private Deal Room**.
   - Create a session key.
   - Open a separate browser window (or private window) and sign in.
   - Enter the same session key in the Deal Room panel to join.
   - Send chat messages, drag and drop files, and verify the realtime peer synchronization.
   - Click **Trigger Wipe & Audit** and witness the secure connection shutdown and audit receipt generation.
