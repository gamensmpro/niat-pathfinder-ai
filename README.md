
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
🗄️ Supabase Setup & Example Data Insertion

PathFinder AI uses Supabase as its backend database to store student assessments, career pathways, project examples, and lead information.

This section explains how to configure Supabase and insert sample data for testing the application.

1. Create a Supabase Project
Visit https://supabase.com/
Sign in or create an account.
Click New Project.
Enter the project name: niat-pathfinder-ai.
Set a secure database password.
Select a region close to your target audience.
Click Create New Project.
2. Get Supabase API Credentials

Open your Supabase project.

Navigate to:

Project Settings → API

Copy the following credentials:

Project URL
Publishable/anon key
Secret/service-role key (only if required by your server-side implementation)

Add them to your project's .env.local file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url

NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

Never expose the service-role key in frontend code or commit it to GitHub.

3. Create Database Tables

Open:

Supabase Dashboard → SQL Editor → New Query

Paste and execute:

```sql
CREATE TABLE IF NOT EXISTS student_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_name TEXT NOT NULL,
    academic_stream TEXT,
    interest TEXT,
    experience_level TEXT,
    favourite_subject TEXT,
    career_goal TEXT,
    preferred_language TEXT DEFAULT 'English',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS career_pathways (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    career_name TEXT NOT NULL,
    description TEXT,
    required_skills TEXT[],
    beginner_project TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS student_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_title TEXT NOT NULL,
    interest_area TEXT,
    description TEXT,
    skills_used TEXT[],
    difficulty_level TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS student_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_name TEXT NOT NULL,
    phone TEXT,
    city TEXT,
    interest TEXT,
    preferred_language TEXT,
    consent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

4. Insert Example Student Data

Run the following SQL query to add sample student assessments.

```sql
INSERT INTO student_assessments
(student_name, academic_stream, interest, experience_level,
 favourite_subject, career_goal, preferred_language)
VALUES
(
    'Rahul',
    'MPC',
    'Artificial Intelligence',
    'Beginner',
    'Mathematics',
    'AI Engineer',
    'English'
),
(
    'Priya',
    'MPC',
    'Robotics',
    'Intermediate',
    'Physics',
    'Robotics Engineer',
    'Telugu'
),
(
    'Arjun',
    'Commerce',
    'Data Science',
    'Beginner',
    'Mathematics',
    'Data Analyst',
    'Hindi'
),
(
    'Sneha',
    'BiPC',
    'Software Development',
    'Beginner',
    'Biology',
    'Software Developer',
    'English'
);
```

5. Insert Example Career Pathways
```sql
INSERT INTO career_pathways
(career_name, description, required_skills, beginner_project)
VALUES
(
    'AI Engineer',
    'Explore artificial intelligence and machine learning.',
    ARRAY['Python', 'Mathematics', 'Machine Learning', 'APIs'],
    'Build an AI-powered question answering application.'
),
(
    'Software Developer',
    'Learn to design and develop software applications.',
    ARRAY['HTML', 'CSS', 'JavaScript', 'React'],
    'Build a personal portfolio website.'
),
(
    'Data Analyst',
    'Learn to analyze data and generate insights.',
    ARRAY['Python', 'SQL', 'Statistics', 'Visualization'],
    'Build a student performance dashboard.'
),
(
    'Robotics Engineer',
    'Explore robotics, electronics and automation.',
    ARRAY['Python', 'Electronics', 'Sensors', 'Programming'],
    'Build an obstacle detection simulation.'
),
(
    'Cybersecurity Analyst',
    'Explore defensive cybersecurity and network security.',
    ARRAY['Networking', 'Linux', 'Python', 'Security'],
    'Build a basic password strength checker.'
);
```

6. Insert Example Student Projects

The following are fictional demonstration projects, not verified NIAT student achievements.

```sql
INSERT INTO student_projects
(project_title, interest_area, description, skills_used, difficulty_level)
VALUES
(
    'AI Study Assistant',
    'Artificial Intelligence',
    'An AI-powered study assistant that generates practice questions.',
    ARRAY['Python', 'AI APIs', 'Prompt Engineering'],
    'Beginner'
),
(
    'Personal Portfolio Website',
    'Software Development',
    'A responsive website to showcase projects and technical skills.',
    ARRAY['HTML', 'CSS', 'JavaScript'],
    'Beginner'
),
(
    'Student Performance Dashboard',
    'Data Science',
    'A dashboard displaying student performance using sample data.',
    ARRAY['Python', 'SQL', 'Data Visualization'],
    'Intermediate'
),
(
    'Smart Obstacle Detection',
    'Robotics',
    'A simulated robotic system that detects obstacles.',
    ARRAY['Python', 'Sensors', 'Robotics Simulation'],
    'Intermediate'
);
```

7. Verify Data in Supabase

Execute these queries:

```sql
SELECT * FROM student_assessments;

SELECT * FROM career_pathways;

SELECT * FROM student_projects;

SELECT * FROM student_leads;
```


You can also verify the number of inserted records:

```sql
SELECT
    (SELECT COUNT(*) FROM student_assessments) AS students,
    (SELECT COUNT(*) FROM career_pathways) AS careers,
    (SELECT COUNT(*) FROM student_projects) AS projects,
    (SELECT COUNT(*) FROM student_leads) AS leads;
```

Expected initial results:

```
Table	Example records
student_assessments	4
career_pathways	5
student_projects	4
student_leads	0
```

8. Connect Supabase to Next.js

Install the Supabase JavaScript client:

```bash
npm install @supabase/supabase-js


Create lib/supabase.ts:

typescript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL!;

const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);
```


Use the Supabase client from server-side API routes to retrieve career pathways:

```typescript
import { supabase } from "@/lib/supabase";

export async function getCareerPathways() {
  const { data, error } = await supabase
    .from("career_pathways")
    .select("*");

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
```

For production, configure Row Level Security (RLS), appropriate access policies, and server-side authorization before enabling database operations. Do not expose secret credentials in browser-accessible code.

9. Connect Example Data to AI Recommendations

The application can retrieve matching career pathways and project examples based on the student's selected interest.

Example:

```typescript
const { data: careers } = await supabase
  .from("career_pathways")
  .select("*")
  .ilike("career_name", "%AI%");

const { data: projects } = await supabase
  .from("student_projects")
  .select("*")
  .ilike("interest_area", "%Artificial Intelligence%");
```

Pass the retrieved records into your OpenAI API request as reference context.

This allows the AI to generate recommendations using available database information instead of relying entirely on generic model knowledge.

10. Supabase Dashboard

After inserting the example data, visit:

Supabase Dashboard → Table Editor

You should be able to view:

Student assessment records
Career pathway records
Student project examples
Student lead records

Final Result: Supabase is configured as the data layer for PathFinder AI, with sample student profiles, career recommendations, and project examples available for development and testing.
---

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
