# Kapital — Build and Connect

> **Where Mauritius builds.**  
> Kapital connects Mauritian university students with employers offering internships, industry challenges, and open-source work — so what you build here becomes a portfolio, not just a line on a CV.

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
- **🎨 Luminous Glassmorphic Design**: A custom design system featuring responsive glassmorphic UI, route-specific dynamic space mesh backdrops, SVG wireframe illustrations, and smooth Framer Motion animations.
- **🔐 Secure Authentication**: Integrated Supabase SSR authentication supporting student and employer onboarding flows.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **UI & Styling** | CSS Modules, Glassmorphism design system, Vanilla CSS variables |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Database & Auth** | [Supabase](https://supabase.com/) (`@supabase/ssr`, `@supabase/supabase-js`) |
| **Package Manager** | `pnpm` / `npm` |

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
│   │   ├── layout.tsx        # Global app layout & theme provider
│   │   └── page.tsx          # Homepage with Video Hero & Services
│   ├── components/           # Reusable UI components
│   │   ├── hero/             # Video Hero & Search filters
│   │   ├── layout/           # Navbar, Footer, PageBackground system
│   │   └── sections/         # Homepage & feature showcase sections
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

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v20.0.0` or higher
- **Package Manager**: `pnpm` (recommended) or `npm`

### Installation

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

## 📜 Available Scripts

In the project directory, you can run:

- `npm run dev` / `pnpm dev`: Runs the app in development mode with HMR.
- `npm run build` / `pnpm build`: Builds the application for production.
- `npm run start` / `pnpm start`: Starts the production server after building.
- `npm run lint` / `pnpm lint`: Runs ESLint to check for code quality issues.

---

## 🗺️ Key Routes

- **`/`**: Homepage featuring the main video hero, quick filters, and services overview.
- **`/opportunities`**: Directory of internships and graduate job opportunities.
- **`/challenges`**: Live business challenges and open-source projects.
- **`/showcase`**: Public showcase of student portfolios and completed case studies.
- **`/about`**: Our mission, story, and operational principles.
- **`/contact`**: Direct communication channel for students and prospective employer partners.
- **`/login` & `/register`**: Authentication entry points for students and employers.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to open an issue or submit a pull request to help build the future of tech talent in Mauritius.

---

## 📄 License

This project is maintained by **Semantic Squad**.  
Copyright © 2026 Kapital. All rights reserved.
