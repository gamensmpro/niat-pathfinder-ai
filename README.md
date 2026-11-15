
# 🚀 PathFinder AI
### AI-Powered Career Discovery & Student Lead Generation Platform

PathFinder AI is an AI-powered career discovery platform designed to help Class 12 students explore technology careers, identify their interests, discover relevant skills, and create personalized 90-day learning roadmaps.

The platform transforms career curiosity into meaningful student engagement and helps education institutions generate qualified, consent-based enquiries.

---

## 🎯 The Problem

Students completing Class 12 often face questions such as:

- Which technology career should I choose?
- Is Artificial Intelligence right for me?
- What skills should I learn?
- Where should I start if I have no coding experience?
- What should I build to understand the technology industry?
- Which undergraduate learning pathway should I explore?

Traditional education marketing often asks students to submit an enquiry before providing meaningful value.

PathFinder AI reverses this experience.

It provides personalized career insights first and offers an optional opportunity to connect with an education counsellor.

---

## 💡 The Solution

PathFinder AI creates a personalized career discovery experience using AI.

Students provide information about:

- Class 12 academic stream
- Technology interests
- Previous programming experience
- Favourite subject
- Career aspirations
- Preferred language

The AI generates a personalized report containing:

1. Recommended technology career paths.
2. Skills to develop.
3. A beginner-friendly technology project.
4. A personalized 90-day roadmap.
5. A realistic perspective on career development.

Students can also share their reports with parents and optionally request information about NIAT.

---

## ✨ Features

### 1. AI Career Discovery
Uses an AI model to interpret student interests and recommend relevant technology career pathways.

### 2. Personalized Learning Roadmap
Generates a 90-day roadmap with learning milestones and beginner projects.

### 3. Multiple Career Categories
Supports exploration of:

- Artificial Intelligence
- Software Development
- Data Science
- Robotics
- Cybersecurity
- Entrepreneurship
- Web Development
- Gaming

### 4. Multilingual Experience
Designed to support:

- English
- Telugu
- Hindi
- Tamil
- Kannada
- Malayalam

### 5. Parent Report Sharing
Students can share their personalized career reports with parents.

### 6. Lead Generation
Interested students can voluntarily submit their contact details and request information.

### 7. Growth Analytics
The backend can be extended to track:

- Assessment completions
- Career interests
- Qualified enquiries
- Preferred languages
- Counselling requests
- Lead conversion rates

---

## 🏗️ Technology Stack

| Technology | Purpose |
|---|---|
| Next.js | Frontend and API routes |
| React | User interface |
| TypeScript | Type safety |
| Tailwind CSS | Responsive styling |
| OpenAI API | AI career report generation |
| Supabase | Database and lead management |
| n8n | Workflow automation |
| WhatsApp Cloud API | Lead communication |
| Vercel | Deployment |
| GitHub | Source code management |

---

## 🔄 System Architecture

```text
                 STUDENT
                    |
                    v
           PATHFINDER AI WEBSITE
                    |
                    v
            CAREER ASSESSMENT
                    |
                    v
             OPENAI API
                    |
                    v
          PERSONALIZED REPORT
                    |
          +---------+---------+
          |                   |
          v                   v
     PARENT SHARING      90-DAY ROADMAP
          |
          v
     STUDENT CONSENT
          |
          v
       LEAD API
          |
          v
       SUPABASE
          |
          v
         n8n
          |
          v
    WHATSAPP FOLLOW-UP
          |
          v
    COUNSELLOR HANDOFF
```

---

## 📁 Project Structure

```text
niat-pathfinder-ai/
│
├── app/
│   ├── api/
│   │   ├── generate/
│   │   │   └── route.ts
│   │   └── leads/
│   │       └── route.ts
│   │
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
│
├── lib/
│   ├── openai.ts
│   └── supabase.ts
│
├── public/
│
├── .env.local
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

---

## ⚙️ Installation

### Prerequisites

Install:

- Node.js (LTS)
- npm
- Git
- OpenAI API account

### 1. Clone the repository

```bash
git clone https://github.com/gamensmpro/niat-pathfinder-ai.git

cd niat-pathfinder-ai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root.

```env
OPENAI_API_KEY=your_openai_api_key

NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url

NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

N8N_WEBHOOK_URL=your_n8n_webhook_url
```

Never expose secret API keys in frontend code or commit them to GitHub.

### 4. Run the development server

```bash
npm run dev
```

Open:

http://localhost:3000

### 5. Build for production

```bash
npm run build
```

---

## 🤖 AI Integration

The OpenAI API generates career recommendations based on the student's assessment.

The AI system is instructed to:

- Personalize recommendations using student inputs.
- Suggest realistic beginner projects.
- Generate structured learning milestones.
- Avoid unrealistic employment or salary promises.
- Distinguish between learning opportunities and guaranteed career outcomes.

AI-generated career recommendations are exploratory and should not be treated as professional career guarantees.

---

## 📊 Growth Experiment

### Target Audience

Class 12 students and their parents, initially focusing on Telangana and Andhra Pradesh.

### Initial Pilot

Proposed experiment duration: 14 days.

| Metric | Target |
|---|---:|
| Relevant visitors | 1,000 |
| Assessment completions | 450 |
| Qualified consented leads | 225 |
| Parent report shares | 110 |
| Counselling requests | 45 |

These are experimental targets, not verified historical performance figures.

### Primary Success Metric

Cost per qualified, consented lead.

The objective is to determine whether personalized AI-powered career discovery can generate higher-intent enquiries than conventional lead capture.

---

## 🔐 Privacy & Responsible AI

PathFinder AI follows these design principles:

- Collect only information necessary for the experience.
- Make contact submission optional.
- Obtain consent before follow-up communication.
- Handle student information responsibly.
- Avoid guaranteeing admissions, salaries or placements.
- Clearly distinguish AI-generated suggestions from verified institutional information.

For underage students, appropriate parent or guardian consent should be obtained where required.

---

## 🚀 Deployment

The application is designed for deployment on Vercel.

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Configure environment variables.
4. Deploy the application.
5. Test the complete assessment and lead-generation journey.

Deployment URL:

`https://niat-pathfinder-ai.vercel.app/`
ADMIN_ACCESS_KEY = 3b38f2d15a36b337cbaa196d7d39d088ccf6a653ebca60803193d40819675627

---

## 🎯 Project Objective

The larger vision is to transform traditional education lead generation into an AI-native discovery experience.

Instead of asking students to register interest in an institution, PathFinder AI first helps them understand their interests, explore possible careers, and discover what they could build.

The goal is to create meaningful student engagement that can eventually translate into qualified admissions conversations.

---

## 👨‍💻 Built For

**NIAT AI-Native Growth System Challenge**

Track A – Top-of-Funnel Acquisition

Project: PathFinder AI

---

## 📌 Disclaimer

PathFinder AI is an independent prototype created for the NIAT growth challenge. It is not an official NIAT admissions tool or an official career assessment.

All career recommendations are exploratory. Admission, degree, internship, employment and placement outcomes are not guaranteed.

---

**Think. Discover. Build.**
