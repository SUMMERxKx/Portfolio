import { Code2, Database, Network, ShieldCheck, Sparkles, Workflow } from 'lucide-react';

const skillSets = [
  {
    title: 'Frontend',
    description:
      'Modern web apps with Next.js, React, and TypeScript. I keep accessibility, performance, and polish in mind throughout the build.',
    items: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Storybook'],
    icon: Code2,
  },
  {
    title: 'Backend',
    description:
      'APIs and services that stay reliable under pressure, using Node.js, Express, Java, and clean database design.',
    items: ['Node.js', 'Express', 'Java', 'PHP', 'REST APIs', 'GraphQL'],
    icon: ShieldCheck,
  },
  {
    title: 'Data & ML',
    description:
      'Building and iterating on machine learning workflows, from data prep to evaluation and deployment.',
    items: ['Python', 'Pandas', 'scikit-learn', 'MongoDB', 'PostgreSQL', 'MySQL'],
    icon: Database,
  },
  {
    title: 'DevOps',
    description:
      'Deployments, observability, and automation that make releasing features straightforward.',
    items: ['GitHub Actions', 'Docker', 'AWS', 'Vercel', 'Railway', 'Linux'],
    icon: Workflow,
  },
  {
    title: 'Product & UX',
    description:
      'Working with designers and stakeholders to translate user needs into clear interfaces and content.',
    items: ['Figma', 'Design systems', 'Content strategy', 'Accessibility', 'User research'],
    icon: Sparkles,
  },
  {
    title: 'Collaboration',
    description:
      'Comfortable pairing, reviewing code, writing docs, and keeping teams aligned.',
    items: ['Agile', 'Code reviews', 'Pairing', 'Technical writing', 'Mentorship'],
    icon: Network,
  },
];

const SkillsPage = () => {
  return (
    <div className="mx-auto max-w-5xl space-y-12 px-6 pb-24 pt-28">
      <header className="text-center md:text-left">
        <span className="text-xs uppercase tracking-[0.5em] text-secondary-soft">Skills</span>
        <h1 className="mt-4 text-4xl text-foreground md:text-5xl">What I work with</h1>
        <p className="mt-4 text-sm leading-relaxed text-foreground-soft md:text-base">
          These are the tools and practices I rely on to ship AI-focused products and dependable web experiences.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-2">
        {skillSets.map(({ title, description, items, icon: Icon }) => (
          <article
            key={title}
            className="frosted-card rounded-3xl p-8 transition hover:-translate-y-1"
          >
            <div className="flex items-center gap-4">
              <span className="rounded-full border border-soft p-3 text-primary">
                <Icon size={26} />
              </span>
              <h2 className="text-xl text-foreground">{title}</h2>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-foreground-soft">{description}</p>
            <ul className="mt-6 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.2em] text-secondary-soft">
              {items.map((item) => (
                <li key={item} className="rounded-full border border-soft px-3 py-1">
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
};

export default SkillsPage;


