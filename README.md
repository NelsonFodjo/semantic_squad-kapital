# Kapital — Build and Connect

> **Where Mauritius builds.**  
> Kapital connects Mauritian university students with employers offering internships, industry challenges, and open-source work — so what you build here becomes a portfolio, not just a line on a CV.

🌐 **Live Website**: [https://semantic-squad-kapital.vercel.app/](https://semantic-squad-kapital.vercel.app/)

---

## 🌟 Overview

**Kapital** is a modern web platform designed to bridge the gap between higher education and tech industry careers in Mauritius. Instead of relying on traditional resume screening or who-you-know networks, Kapital provides a merit-based ecosystem where students prove their skills through real-world projects, verified internships, and public case studies.

### Core Value Propositions
- **For Students**: Find verified paid internships, tackle real industry challenges, collaborate on open-source projects, and build a public portfolio.
- **For Employers**: Post opportunities, discover top talent through actual proof of work, and evaluate candidates based on their problem-solving ability.

---

## ✨ Key Features

- **💼 Verified Internships & Jobs**: Transparent opportunities across Mauritius with stipends clearly listed upfront.
- **🎯 Industry Challenges**: Real-world business problems posted by companies, allowing students to skip resume screening through sheer work quality.
- **🌐 Collaborative Open Source**: Hands-on teamwork on open software projects to build production-level code experience.
- **🌟 Public Student Portfolios**: Shareable case studies highlighting problem framing, architectural decisions, and shipped products.
- **🎨 Luminous Glassmorphic Design**: A custom design system featuring responsive glassmorphic UI, route-specific dynamic space mesh backdrops, 3D magnetic tilt cards, SVG wireframe illustrations, and smooth Framer Motion animations.
- **🔐 Secure Authentication**: Integrated Supabase SSR authentication supporting student and employer onboarding flows.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Live URL** | [semantic-squad-kapital.vercel.app](https://semantic-squad-kapital.vercel.app/) |
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **UI & Styling** | CSS Modules, Glassmorphism design system, Vanilla CSS variables |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Database & Auth** | [Supabase](https://supabase.com/) (`@supabase/ssr`, `@supabase/supabase-js`) |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 📁 Project Structure

```text
semantic_squad-kapital/
├── public/
│   └── images/               # Vector illustrations (bg-*.svg, challenges.svg, etc.)
├── src/
│   ├── app/                  # Next.js App Router routes & pages
│   │   ├── (auth)/           # Login and Registration routes
│   │   ├── about/            # About Kapital page
│   │   ├── challenges/       # Industry challenges & open-source projects directory
│   │   ├── contact/          # Contact form & support
│   │   ├── dashboard/        # User & employer dashboard
│   │   ├── employers/        # Employer landing & posting portal
│   │   ├── onboarding/       # Student & employer profile setup
│   │   ├── opportunities/    # Internship & job listings directory
│   │   ├── showcase/         # Student portfolio case studies
│   │   ├── students/         # Student resources page
│   │   ├── layout.tsx        # Global app layout & metadata configuration
│   │   └── page.tsx          # Homepage with Video Hero & Services
│   ├── components/           # Reusable UI components
│   │   ├── hero/             # Video Hero & Search filters
│   │   ├── layout/           # Navbar, Footer, PageBackground system
│   │   ├── motion/           # SpotlightCard, Reveal, Counter animations
│   │   └── sections/         # Interactive homepage sections
│   ├── data/                 # Static mock data & constants
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility functions & Supabase client setup
│   ├── styles/               # Design tokens, variables & glassmorphism utilities
│   ├── types/                # TypeScript type definitions
│   └── validation/           # Form validation schemas
├── supabase/                 # Supabase configuration & migrations
├── next.config.ts            # Next.js configuration & SVG image settings
├── package.json              # Project dependencies & scripts
└── tsconfig.json             # TypeScript configuration
```

---

## 🚀 Getting Started

### Live Deployment
Access the live site at: **[https://semantic-squad-kapital.vercel.app/](https://semantic-squad-kapital.vercel.app/)**

### Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/NelsonFodjo/semantic_squad-kapital.git
   cd semantic_squad-kapital
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Start the Development Server**:
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **Open in Browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) to view the app locally.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to open an issue or submit a pull request to help build the future of tech talent in Mauritius.

## 👥 Authors & Team

This project is developed and maintained by **Semantic Squad**:
- **Chrys Elisee Gnagne**
- **Nelson Fodjo Kamdoum**
- **Abdulkadir Abduljabar Oshoke**
- **Nkusi Teta Lovella**
- **Sampson Ofotsu Foli**

---

## 📄 License

This project is maintained by **Semantic Squad**.  
Copyright © 2026 Kapital. All rights reserved.
