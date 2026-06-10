
<br />
      <img src="https://github.com/The-Coder-Dev/TruScan-AI-hackathon/blob/main/public/readme/project_banner.webp">
<br />

# TruScan AI

![Next.js](https://img.shields.io/badge/NEXT.JS-black?style=for-the-badge&logo=next.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/TAILWIND-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TYPESCRIPT-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Powered By Groq](https://img.shields.io/badge/POWERED%20BY-GROQ-F97316?style=for-the-badge)
![Llama](https://img.shields.io/badge/LLAMA-black?style=for-the-badge)

## 📋 <a name="table">Table of Contents</a>

1. ✨ [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋  [Features](#features)
4. 🤸 [Quick Start](#quick-start)


## <a name="introduction">✨ Introduction</a>

**TruScan AI** is an AI-powered fraud detection platform built to protect users from modern digital scams like fake SMS alerts, phishing attempts, scam calls, and deepfake voice fraud.

With the rise of AI-generated scams, traditional spam detection is no longer enough. TruScan AI helps users detect suspicious messages and fraudulent calls in real time using advanced AI models for text analysis, speech transcription, and deepfake voice detection.

The platform supports multilingual detection, including:

- English
- Hindi
- Hinglish
- Roman Hindi

This makes it highly effective for real-world fraud detection, especially for Indian users, where mixed-language scam communication is common.

---

## <a name="tech-stack">⚙️ Tech Stack</a>

` Frontend`

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion

` Backend`

- Next.js API Routes
- Supabase (Authentication + Database)
- Secure server-side API handling

`AI & Detection Models`

- Groq API
- Llama 3.1 8B Instant
- Whisper Large V3 Turbo
- Reality Defender API

`Deployment`

- Vercel

---

`AI Models Used`

### Llama 3.1 8B Instant

Used for:

- SMS fraud detection
- Scam intent analysis
- Fraud risk scoring
- Detecting phishing, fake bank alerts, OTP scams, urgency pressure, and impersonation attempts

This model helps analyze SMS content and call transcripts with fast and reliable reasoning.

### Whisper Large V3 Turbo

Used for:

- Audio transcription
- Converting uploaded call recordings into text

It supports multilingual speech recognition and works effectively for:

- Hindi
- English
- Hinglish
- Mixed scam calls

### Reality Defender API

Used for:

- Deepfake voice detection
- Synthetic voice identification
- Authenticity verification of uploaded call recordings

This helps identify whether a scam call is AI-generated or a real human voice.

---

## <a name="features">🔋 Features</a>

### SMS Fraud Detection

Users can paste suspicious SMS messages and instantly receive:

- Fraud score
- Risk level
- AI summary
- Recommended action

### Audio Scam Detection

Users can upload suspicious call recordings and get:

- Full transcript
- Fraud score
- Deepfake score
- Risk level
- AI-generated safety recommendation

### Deepfake Voice Detection

The platform checks whether uploaded audio contains:

- AI-generated voice cloning
- Synthetic speech
- Deepfake impersonation attempts

### Secure Authentication

Includes:

- Google Sign-In
- Email Sign-In / Sign-Up
- Protected dashboard routes
- Secure Supabase authentication

### Scan History

Users can track their past:

- SMS scans
- Audio scans
- Fraud reports
- Risk analysis history

### Credit-Based Plans

The platform supports:

- Free Plan
- Pro Plan
- Enterprise Plan

Each plan includes different scan limits using a credit system.

---

## Quick Start

### 1. Clone the Repository

```bash
git clone your-repository-link
cd truscan-ai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create:

```env
.env.local
```

Add:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

GROQ_API_KEY=
REALITY_DEFENDER_API_KEY=
```

> Do not expose secret keys using `NEXT_PUBLIC`.

### 4. Run Development Server

```bash
npm run dev
```

### 5. Open in Browser

```text
http://localhost:3000
```

### 6. Start Scanning

- Paste suspicious SMS messages
- Upload suspicious call recordings
- View fraud analysis instantly

---

