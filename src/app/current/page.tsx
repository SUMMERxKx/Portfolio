import KanbanBoard from '@/components/current/KanbanBoard';

const CurrentPage = () => {
  return (
    <div className="mx-auto max-w-6xl space-y-12 px-6 pb-24 pt-24">
      <header className="text-center md:text-left">
        <span className="text-xs uppercase tracking-[0.5em] text-secondary-soft">Current tasks</span>
        <h1 className="mt-4 text-4xl text-foreground md:text-5xl">Work in progress</h1>
        <p className="mt-6 text-sm leading-relaxed text-foreground-soft md:text-base">
          This board shows what I&apos;m actively improving, researching, or planning next. Progress bars update as work
          moves forward. Editing is owner-only; everything else is open for you to follow along.
        </p>
      </header>
      <KanbanBoard />
    </div>
  );
};

export default CurrentPage;


