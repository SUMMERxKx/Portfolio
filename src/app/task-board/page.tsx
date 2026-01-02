import { ExternalLink } from 'lucide-react';

const TaskBoardPage = () => {
  return (
    <div className="mx-auto max-w-4xl space-y-12 px-6 pb-24 pt-28">
      <header className="text-center space-y-4">
        <span className="text-xs uppercase tracking-[0.5em] text-foreground-muted">Task Board</span>
        <h1 className="text-4xl text-foreground md:text-5xl">Task Board</h1>
      </header>

      <div className="frosted-card rounded-3xl p-8 space-y-6 text-center">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-primary">Task Board has been moved</h2>
          <p className="text-base md:text-lg text-foreground-soft leading-relaxed">
            The task board has been moved to a private instance. You can access it using the link below.
          </p>
        </div>

        <div className="pt-4">
          <a
            href="https://taskboard-seven-lake.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-background transition hover:bg-primary-strong"
          >
            Open Task Board
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default TaskBoardPage;

