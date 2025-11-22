import DailyTasks from '@/components/daily/DailyTasks';

const DailyPage = () => {
  return (
    <div className="mx-auto max-w-6xl space-y-12 px-6 pb-24 pt-24">
      <header className="text-center md:text-left">
        <span className="text-xs uppercase tracking-[0.5em] text-secondary-soft">Daily tasks</span>
        <h1 className="mt-4 text-4xl text-foreground md:text-5xl">Your daily progress</h1>
        <p className="mt-6 text-sm leading-relaxed text-foreground-soft md:text-base">
          Track your daily tasks, build streaks, and watch your progress grow. Complete tasks to unlock achievements
          and maintain your momentum.
        </p>
      </header>
      <DailyTasks />
    </div>
  );
};

export default DailyPage;

