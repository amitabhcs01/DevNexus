# DevNexus — Live Staging & QA Tester Manual

Welcome to the testing phase of **DevNexus**—the secure intelligence layer connecting founders and vetted developers. This manual will guide you step-by-step through testing the platform's core workflows, authentication mechanics, and serverless WebRTC deal rooms.

---

## 📋 Staging Test Checklist

Please execute the following 5 phases to verify the entire platform features.

---

## 🔒 Phase 1: Authentication & Role Setup

1. **Open the App**: Navigate to your deployed live URL (e.g., `https://your-project.vercel.app`).
2. **Access Sign Up**: Click **Create Account** at the bottom of the card.
3. **Register as a Client**:
   * Click **Client / Founder**.
   * Enter a test email and password.
   * Fill in **Company Name** (e.g. *Acme Corp*), **Corporate Title** (e.g. *CEO*), and **Estimated Budget** (e.g. *25000*).
   * Click **Create Secured Account**.
   * *Verify that you are redirected to the Dashboard and your email is logged in.*
4. **Test Logout**: Click **Sign Out Session** at the bottom left.
5. **Register as a Developer (Optional)**:
   * Click **Create Account** again.
   * Click **Vetted Developer**.
   * Enter a different email and fill in **Full Name**, **Key Skills** (e.g., *React, Node.js, WebRTC*), **Experience Level**, and **Portfolio URL**.
   * Click **Create Secured Account**.

---

## 💡 Phase 2: AI Requirement Vetting (Advisory Hub)

1. Log in to your **Client** account.
2. Select **AI Advisory Hub** from the left navigation menu.
3. In the text area, describe a project requirement (e.g., *"We need a secure client portal with direct document signature capabilities and real-time state alerts."*).
4. Click on skill tags to require them (e.g. select **React**, **TypeScript**, **WebRTC**).
5. Click **Submit to AI Vetting Engine**.
6. **Verify the Results**:
   * Inspect the dynamically generated solution brief.
   * Confirm it contains the **Architecture Stack**, **Estimated Project Budget**, **12-week Roadmap**, and **Risk Mitigations**.

---

## 🔍 Phase 3: Developer Vetting & Registry

1. Select **Developer Registry** from the navigation menu.
2. Click on the skill filters (e.g., *WebRTC*, *Python*, or *Rust*) to see the interactive SVG Skill Graph narrow down the developer profile directory.
3. Click on a developer card (e.g., *Alex Rivers*).
4. Inspect their profile details, reviews, and linked GitHub repositories.
5. Click **Open Secure Deal Room** on their profile card.

---

## ✍️ Phase 4: Secure NDA Vetting & Signing

1. You will land in the **Setup Phase** of the B2B Private Deal Room.
2. Customize the agreement parameters:
   * **NDA Vetting Type** (e.g., *Software Design & Development Agreement*)
   * **Signing Jurisdiction** (e.g., *Delaware Corporate Law*)
3. Note the generated **One-Time Access Key** (e.g., `NEX-A7B8-9F12`). You will need this to join as the other party.
4. Scroll down to the **Signature Drawing Pad**.
5. Use your mouse, trackpad, or mobile touchscreen to draw your digital signature on the canvas.
6. Click **Confirm & Secure Signature**.
   * *The room will wait for the developer to sign (simulated within 1 second in staging).*
   * *The room will transition automatically into the **Active Session** workspace.*

---

## 💬 Phase 5: Real-Time Peer-to-Peer Communication

To test the real-time serverless synchronization:

1. **Open a Second Window**: Open an Incognito/Private browser window or use another device (like your phone).
2. **Access the Room**:
   * Navigate to the same live URL.
   * Log in to any account.
   * Select **Private Deal Room** in the navigation menu.
   * Paste the **One-Time Access Key** you generated in Phase 4.
   * Click **Join Session**.
3. **Verify Synchronization**:
   * **Chat Sync**: Type a message in Window 1. Verify it appears instantly in Window 2 without reloading.
   * **File Locker**: Drag and drop or upload a test file in Window 1. Verify it updates instantly in Window 2's locker.

---

## 🧹 Phase 6: Session Destruction & Cryptographic Audit

1. In either window, click **Close & Wipe Session**.
2. **Verify Cryptographic Scrubbing**:
   * Confirm that the UI immediately freezes and triggers the matrix-style binary sweeping data-scrubbing animation.
   * Verify that all active chats and file lockers are completely purged from browser memory.
3. **Inspect Audit Log**:
   * Inspect the final generated **Cryptographic Audit Proof** receipt.
   * Verify it contains the **SHA-256 Cryptographic Hash** showing proof of session closure.
