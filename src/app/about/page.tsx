const highlights = [
  {
    title: 'AI and ML projects',
    description:
      'I gravitate toward problems where machine learning can surface better decisions, smarter workflows, or a more personal product experience.',
  },
  {
    title: 'Tools that stay out of the way',
    description:
      'Clear UX, dependable infrastructure, and thoughtful automation help teams move quickly without sacrificing quality.',
  },
  {
    title: 'Collaborative delivery',
    description:
      'I value open dialogue, quick feedback loops, and pairing with designers, product teams, and fellow engineers.',
  },
];

const AboutPage = () => {
  return (
    <div className="mx-auto max-w-4xl space-y-12 px-6 pb-24 pt-28">
      <header className="space-y-4 text-center md:text-left">
        <h1 className="text-4xl text-foreground md:text-5xl">About me</h1>
        <p className="text-base leading-relaxed text-foreground-soft md:text-lg">
          I’m Samar Khajuria, a full-stack developer who enjoys building AI-powered products. Most of my recent work
          centers on machine learning projects, prompt tooling, and frontend experiences that make advanced tech feel
          simple and friendly.
        </p>
        <p className="text-base leading-relaxed text-foreground-soft md:text-lg">
          I’m always happy to collaborate on AI and ML initiatives. If you have a product idea, research project, or
          tooling challenge, I’d love to learn more and help bring it to life.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        {highlights.map((item) => (
          <div key={item.title} className="frosted-card rounded-3xl p-8">
            <h2 className="text-lg text-foreground">{item.title}</h2>
            <p className="mt-3 text-sm text-foreground-muted">{item.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default AboutPage;


