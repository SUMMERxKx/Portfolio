import Image from 'next/image';

import { experienceData } from '@/data/experience';

type ExperienceTimelineProps = {
  className?: string;
};

const ExperienceTimeline = ({ className }: ExperienceTimelineProps) => {
  const rootClass = ['relative', className].filter(Boolean).join(' ');

  return (
    <div className={rootClass}>
      <div className="timeline-beam pointer-events-none absolute left-[28px] top-0 h-full w-px md:left-1/2 md:w-[2px] md:-translate-x-1/2" />
      <div className="space-y-10 sm:space-y-14 lg:space-y-20">
        {experienceData.map((entry, index) => {
          const isLeft = index % 2 === 0;

          return (
            <div
              key={`${entry.company}-${entry.title}-${index}`}
              className="relative pl-[48px] sm:pl-16 md:grid md:grid-cols-2 md:gap-14 md:pl-0 lg:gap-20"
            >
              <span
                className="timeline-node absolute left-[28px] top-6 h-3.5 w-3.5 -translate-x-1/2 rounded-full sm:top-8 md:left-1/2 md:-translate-x-1/2"
                aria-hidden="true"
              />
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
        className="timeline-item group relative overflow-hidden rounded-[24px] border border-white/[0.06] bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.18),rgba(18,25,42,0.65))] p-6 shadow-[0_22px_70px_rgba(8,10,15,0.42)] transition-transform duration-500 hover:-translate-y-1.5 sm:rounded-[26px] sm:p-7 md:rounded-[28px] md:p-9 lg:p-10"
        style={{ animationDelay: `${index * 0.08}s` }}
      >
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="absolute -left-16 top-1/2 h-44 w-44 -translate-y-1/2 rounded-full bg-primary/12 blur-[60px] sm:-left-24 sm:h-56 sm:w-56 sm:bg-primary/15 sm:blur-[72px]" />
          <div className="absolute -right-14 top-0 h-24 w-24 rounded-full bg-accent/10 blur-[44px] sm:-right-20 sm:h-32 sm:w-32 sm:bg-accent/15 sm:blur-[60px]" />
        </div>

        <div className="relative z-10 flex flex-col gap-5 sm:gap-6">
          <header className="flex flex-wrap items-center gap-4 sm:gap-5">
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-white/[0.08] bg-white/10 backdrop-blur sm:h-16 sm:w-16">
              <Image
                src={entry.logo}
                alt={`${entry.company} logo`}
                width={72}
                height={72}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <h3 className="text-xl text-foreground sm:text-[1.4rem] md:text-[1.6rem]">{entry.title}</h3>
              <p className="text-[11px] uppercase tracking-[0.3em] text-secondary-soft sm:text-xs sm:tracking-[0.35em]">
                {entry.company}
              </p>
            </div>
          </header>

          <div className="relative overflow-hidden rounded-[18px] border border-white/[0.06] bg-white/[0.03] p-[0.5px] sm:rounded-[20px]">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(125,211,252,0.22),rgba(165,180,252,0.1))] opacity-80 blur-[6px]" />
            <div className="relative flex flex-wrap items-center justify-between gap-2 rounded-[17px] bg-[rgba(8,11,17,0.7)] px-3 py-2.5 sm:gap-3 sm:rounded-[19px] sm:px-4 sm:py-3">
              <span className="text-[9px] uppercase tracking-[0.28em] text-secondary-muted sm:text-[10px] sm:tracking-[0.32em]">
                Duration
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground sm:text-xs sm:tracking-[0.24em]">
                {entry.duration}
              </span>
            </div>
          </div>

          <ul className="space-y-2.5 text-sm leading-relaxed text-foreground-soft sm:space-y-3">
            {entry.highlights.map((highlight) => (
              <li key={highlight} className="flex items-start gap-3">
                <span aria-hidden="true" className="mt-1.5 inline-flex h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_rgba(125,211,252,0.6)] sm:mt-2" />
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


