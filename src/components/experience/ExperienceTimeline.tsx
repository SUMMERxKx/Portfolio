import Image from 'next/image';

import { experienceData } from '@/data/experience';

type ExperienceTimelineProps = {
  className?: string;
};

const ExperienceTimeline = ({ className }: ExperienceTimelineProps) => {
  const rootClass = ['relative', className].filter(Boolean).join(' ');

  return (
    <div className={rootClass}>
      <div className="timeline-beam pointer-events-none absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2" />
      <div className="space-y-12">
        {experienceData.map((entry, index) => {
          const isLeft = index % 2 === 0;

          return (
            <div key={`${entry.company}-${entry.title}-${index}`} className="relative md:grid md:grid-cols-2 md:gap-14 lg:gap-20">
              <span className="timeline-node absolute left-1/2 top-8 h-3.5 w-3.5 -translate-x-1/2 rounded-full" aria-hidden="true" />
              <div
                className={[
                  'timeline-arm hidden md:absolute md:top-8 md:block md:h-px md:w-16 md:bg-gradient-to-r md:from-primary/70 md:to-transparent',
                  isLeft ? 'md:-right-16 md:translate-x-full' : 'md:-left-16 md:-translate-x-full md:rotate-180',
                ].join(' ')}
                aria-hidden="true"
              />
              {isLeft ? (
                <>
                  <TimelineArticle entry={entry} index={index} position="left" />
                  <div className="hidden md:block" aria-hidden="true" />
                </>
              ) : (
                <>
                  <div className="hidden md:block" aria-hidden="true" />
                  <TimelineArticle entry={entry} index={index} position="right" />
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

type TimelineArticleProps = {
  entry: (typeof experienceData)[number];
  index: number;
  position: 'left' | 'right';
};

const TimelineArticle = ({ entry, index, position }: TimelineArticleProps) => {
  const positionClass = position === 'left' ? 'md:pr-12' : 'md:pl-12';

  return (
    <div className={['relative', positionClass].join(' ')}>
      <article
        className="timeline-item group relative overflow-hidden rounded-[28px] border border-white/[0.06] bg-[radial-gradient(circle_at_top,rgba(243,165,114,0.18),rgba(18,22,30,0.65))] p-8 shadow-[0_25px_80px_rgba(8,10,15,0.42)] transition-transform duration-500 hover:-translate-y-1.5 md:p-10"
        style={{ animationDelay: `${index * 0.08}s` }}
      >
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="absolute -left-24 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-primary/15 blur-[72px]" />
          <div className="absolute -right-20 top-0 h-32 w-32 rounded-full bg-accent/15 blur-[60px]" />
        </div>

        <div className="relative z-10 flex flex-col gap-6">
          <header className="flex flex-wrap items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-white/[0.08] bg-white/8 backdrop-blur">
              <Image
                src={entry.logo}
                alt={`${entry.company} logo`}
                width={72}
                height={72}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl text-foreground md:text-[1.6rem]">{entry.title}</h3>
              <p className="text-sm uppercase tracking-[0.35em] text-secondary-soft">{entry.company}</p>
            </div>
          </header>

          <div className="relative overflow-hidden rounded-[20px] border border-white/[0.06] bg-white/[0.02] p-[0.5px]">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(243,165,114,0.22),rgba(147,180,246,0.1))] opacity-80 blur-sm" />
            <div className="relative flex flex-wrap items-center justify-between gap-3 rounded-[19px] bg-[rgba(8,11,17,0.68)] px-4 py-3">
              <span className="text-[10px] uppercase tracking-[0.32em] text-secondary-muted">Duration</span>
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-foreground">
                {entry.duration}
              </span>
            </div>
          </div>

          <ul className="space-y-3 text-sm leading-relaxed text-foreground-soft">
            {entry.highlights.map((highlight) => (
              <li key={highlight} className="flex items-start gap-3">
                <span aria-hidden="true" className="mt-2 inline-flex h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_rgba(243,165,114,0.6)]" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      </article>
    </div>
  );
};

export default ExperienceTimeline;


