import ExperienceTimeline from '@/components/experience/ExperienceTimeline';

const ExperiencePage = () => {
  return (
    <div className="space-y-20 pb-28 pt-28">
      <section className="mx-auto max-w-4xl space-y-6 px-6 text-center md:text-left">
        <span className="text-xs uppercase tracking-[0.5em] text-secondary-soft">Experience</span>
        <h1 className="text-4xl text-foreground md:text-5xl">Professional timeline</h1>
        <p className="text-base leading-relaxed text-foreground-soft md:text-lg">
          Highlights from co-op terms, part-time roles, and contracts where I learned to think critically, support teams,
          and craft thoughtful experiences.
        </p>
      </section>

      <ExperienceTimeline className="mx-auto max-w-5xl px-6" />
    </div>
  );
};

export default ExperiencePage;


