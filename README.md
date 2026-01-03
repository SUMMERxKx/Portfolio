# Portfolio Website

A modern, responsive portfolio website built with Next.js, React, and TypeScript. This site showcases projects, experience, skills, and professional work.

## 🚀 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom CSS variables
- **Icons**: Lucide React
- **3D Graphics**: React Three Fiber, Drei
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel

## 📁 Project Structure

```
portfolio-website/
├── public/                    # Static assets (images, fonts, etc.)
│   └── assets/
│       └── companies/        # Company logos and images
│
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── about/           # About page
│   │   ├── contact/         # Contact page
│   │   ├── coop-final-project/  # Co-op reflection blog post
│   │   ├── experience/      # Professional experience timeline
│   │   ├── projects/        # GitHub projects gallery
│   │   ├── skills/          # Technical skills showcase
│   │   ├── task-board/      # Task board redirect page
│   │   ├── layout.tsx       # Root layout with NavBar and Footer
│   │   ├── page.tsx         # Homepage
│   │   └── globals.css      # Global styles and CSS variables
│   │
│   ├── components/          # Reusable React components
│   │   ├── layout/         # Layout components (Footer)
│   │   ├── navigation/     # Navigation components (NavBar)
│   │   ├── experience/     # Experience-specific components
│   │   ├── projects/       # Project-specific components
│   │   └── daily/          # Daily tasks components (legacy)
│   │
│   ├── data/               # Static data files
│   │   └── experience.ts   # Experience entries data
│   │
│   └── lib/                # Utility libraries
│       └── supabaseClient.ts  # Supabase client configuration
│
├── supabase_migration.sql   # Database migration scripts
├── SUPABASE_SETUP.md        # Supabase setup documentation
└── README.md                # This file
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- (Optional) Supabase account if using database features

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SUMMERxKx/Portfolio.git
   cd portfolio-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables** (if using Supabase)
   ```bash
   cp .env.example .env.local
   ```
   Add your Supabase URL and anon key to `.env.local`

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 Key Features

### Pages

- **Home** (`/`) - Introduction and quick links
- **About** (`/about`) - Personal background and interests
- **Experience** (`/experience`) - Professional timeline
- **Projects** (`/projects`) - GitHub projects gallery
- **Skills** (`/skills`) - Technical skills organized by category
- **Co-op Final Project** (`/coop-final-project`) - Co-op reflection blog post
- **Task Board** (`/task-board`) - Redirect to external task board
- **Contact** (`/contact`) - Contact information and social links

### Design System

The site uses a custom design system with CSS variables defined in `globals.css`:

- **Colors**: Custom color palette with primary (orange), accent (blue), and semantic colors
- **Typography**: Inter (body) and Playfair Display (headings)
- **Components**: Reusable frosted-glass cards, buttons, and layouts
- **Responsive**: Mobile-first design with breakpoints

### Components

- **NavBar** - Responsive navigation with mobile menu
- **SiteFooter** - Site footer component
- **ExperienceTimeline** - Timeline visualization for work experience
- **ProjectGallery** - GitHub projects display component

## 🔧 Configuration

### Supabase Setup

See `SUPABASE_SETUP.md` for detailed instructions on setting up Supabase integration.

### Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📦 Dependencies

Key dependencies include:
- `next` - React framework
- `react` & `react-dom` - UI library
- `@supabase/supabase-js` - Database client
- `lucide-react` - Icon library
- `tailwindcss` - CSS framework
- `@react-three/fiber` & `@react-three/drei` - 3D graphics

See `package.json` for the complete list.

## 🚀 Deployment

The site is configured for deployment on Vercel:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables if needed
4. Deploy

## 📄 License

This project is private and personal.

## 👤 Author

**Samar Khajuria**
- Portfolio: [Your Portfolio URL]
- GitHub: [@SUMMERxKx](https://github.com/SUMMERxKx)

---

Built with ❤️ using Next.js and TypeScript
