import Image from 'next/image';
import Link from 'next/link';

const quickLinks = [
  {
    title: 'Experience',
    description: 'See the timeline of co-ops, contracts, and roles shaping my craft.',
    href: '/experience',
    cta: 'View experience',
  },
  {
    title: 'Projects',
    description: 'Browse my latest work, pulled directly from GitHub.',
    href: '/projects',
    cta: 'View projects',
  },
  {
    title: 'Skills',
    description: 'See the tools and languages I rely on every day.',
    href: '/skills',
    cta: 'View skills',
  },
];

const focusAreas = [
  {
    title: 'AI-first products',
    copy: 'Shipping features that pair machine learning with clean product thinking.',
  },
  {
    title: 'Reliable full-stack delivery',
    copy: 'From API design to polished interfaces, I enjoy seeing work through end to end.',
  },
  {
    title: 'Helpful teamwork',
    copy: 'Clear communication, thoughtful documentation, and friendly collaboration matter most.',
  },
];

const Home = () => {
  return (
    <div className="space-y-20 pb-24">
      <section className="mx-auto grid max-w-5xl gap-12 px-6 pt-28 md:grid-cols-[1.1fr,0.9fr] md:items-center">
        <div className="space-y-6 text-left">
          <span className="text-xs uppercase tracking-[0.45em] text-secondary-soft">Hello</span>
          <h1 className="text-4xl font-semibold text-foreground md:text-5xl">I’m Samar Khajuria.</h1>
          <p className="text-base leading-relaxed text-foreground-soft md:text-lg">
          I love building full-stack products, experimenting with AI, and continuously learning about cloud and machine learning technologies.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/projects"
              className="rounded-full border border-primary bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-[0.28em] text-white shadow-[0_18px_35px_rgba(243,165,114,0.28)] transition hover:bg-primary-strong"
            >
              View projects
            </Link>
          </div>
        </div>
        <div className="flex justify-center md:justify-end">
          <div className="overflow-hidden rounded-3xl border border-soft">
            <Image
              src="/me.jpeg"
              alt="Samar Khajuria"
              width={320}
              height={400}
              className="h-[360px] w-[320px] object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {quickLinks.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="frosted-card flex h-full flex-col justify-between rounded-3xl p-8 transition hover:-translate-y-1"
            >
              <div>
                <h2 className="text-xl text-foreground">{item.title}</h2>
                <p className="mt-4 text-sm text-foreground-muted">{item.description}</p>
              </div>
              <span className="mt-6 inline-flex items-center text-[11px] uppercase tracking-[0.4em] text-primary">
                {item.cta}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6">
        <div className="frosted-card rounded-3xl p-8 md:p-10">
          <h2 className="text-3xl text-foreground md:text-4xl">What you can expect</h2>
          <p className="mt-4 text-base leading-relaxed text-foreground-soft md:text-lg">
            I’m hands-on with code, comfortable with product discussions, and always curious about how AI can make work
            easier. Here are a few areas I focus on every week.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {focusAreas.map((area) => (
              <div key={area.title} className="rounded-2xl border border-soft bg-surface-soft p-6">
                <h3 className="text-lg text-foreground">{area.title}</h3>
                <p className="mt-2 text-sm text-foreground-muted">{area.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
