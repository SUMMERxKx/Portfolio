'use client';

import React, { FormEvent, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { Check, Plus, Trash2, X, Trophy, Flame } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const ACCESS_CODE = process.env.NEXT_PUBLIC_OWNER_ACCESS_CODE ?? '';
const TABLE_NAME = 'daily_tasks';
const CHANNEL_NAME = 'realtime:daily_tasks';

type DailyTask = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  is_completed: boolean;
  date: string;
  created_at: string;
};

type DailyActivity = {
  date: string;
  tasks_completed: number;
};

type OwnerState = {
  isOwner: boolean;
  error: string | null;
  login: (code: string) => void;
  logout: () => void;
};

const useOwnerAccess = (): OwnerState => {
  const [isOwner, setIsOwner] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.localStorage.getItem('current-tasks-owner') === 'true') {
      setIsOwner(true);
    }
  }, []);

  const login = (code: string) => {
    if (!ACCESS_CODE) {
      setError('NEXT_PUBLIC_OWNER_ACCESS_CODE is not set.');
      return;
    }
    if (code.trim() === ACCESS_CODE) {
      window.localStorage.setItem('current-tasks-owner', 'true');
      setIsOwner(true);
      setError(null);
    } else {
      setError('Access code not recognised. Please try again.');
    }
  };

  const logout = () => {
    window.localStorage.removeItem('current-tasks-owner');
    setIsOwner(false);
    setError(null);
  };

  return { isOwner, error, login, logout };
};

const generateId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `task-${Math.random().toString(36).slice(2, 10)}`;
};

const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const getToday = (): string => {
  return formatDate(new Date());
};

const DailyTasks = () => {
  const { isOwner, error: ownerError, login, logout } = useOwnerAccess();
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [activities, setActivities] = useState<DailyActivity[]>([]);
  const [isInitialising, setIsInitialising] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [loginCode, setLoginCode] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>(getToday());
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [completedTaskId, setCompletedTaskId] = useState<string | null>(null);
  const [achievement, setAchievement] = useState<string | null>(null);
  const [addError, setAddError] = useState<string | null>(null);

  const pendingIds = useRef(new Set<string>());
  const updateQueue = useRef<Map<string, Partial<DailyTask>>>(new Map());

  // Filter tasks for selected date
  const todayTasks = useMemo(
    () => tasks.filter((task) => task.date === selectedDate),
    [tasks, selectedDate]
  );

  const completedCount = useMemo(
    () => todayTasks.filter((task) => task.is_completed).length,
    [todayTasks]
  );

  const totalCount = useMemo(() => todayTasks.length, [todayTasks]);

  // Calculate streak
  const streak = useMemo(() => {
    if (activities.length === 0) return 0;
    const sortedDates = [...activities]
      .filter((a) => a.tasks_completed > 0)
      .map((a) => a.date)
      .sort()
      .reverse();

    if (sortedDates.length === 0) return 0;

    let currentStreak = 0;
    const today = getToday();
    let checkDate = new Date(today);

    for (const dateStr of sortedDates) {
      const date = new Date(dateStr);
      const diffDays = Math.floor((checkDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === currentStreak) {
        currentStreak++;
        checkDate = new Date(date);
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return currentStreak;
  }, [activities]);

  // Fetch tasks and activities
  const fetchData = React.useCallback(async () => {
    setIsInitialising(true);

    // Fetch tasks
    const { data: tasksData, error: tasksError } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false });

    if (tasksError) {
      console.error('Failed to fetch tasks:', tasksError);
    } else if (tasksData) {
      setTasks(tasksData as DailyTask[]);
    }

    // Fetch or compute activities
    const { data: activityData, error: activityError } = await supabase
      .from('daily_activity')
      .select('*')
      .order('date', { ascending: false });

    if (activityError) {
      console.error('Failed to fetch activities:', activityError);
      // Compute from tasks if table doesn't exist
      if (tasksData) {
        const computed: Record<string, number> = {};
        tasksData.forEach((task: DailyTask) => {
          if (task.is_completed) {
            computed[task.date] = (computed[task.date] || 0) + 1;
          }
        });
        setActivities(
          Object.entries(computed).map(([date, tasks_completed]) => ({
            date,
            tasks_completed,
          }))
        );
      }
    } else if (activityData) {
      setActivities(activityData as DailyActivity[]);
    }

    setIsInitialising(false);
  }, []);

  useEffect(() => {
    let active = true;

    const initialise = async () => {
      await fetchData();
      if (!active) return;
    };

    initialise();

    // Set up realtime subscription
    const channel = supabase
      .channel(CHANNEL_NAME)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: TABLE_NAME },
        (payload) => {
          const newRow = payload.new as DailyTask | undefined;
          const oldRow = payload.old as DailyTask | undefined;
          const targetId = newRow?.id ?? oldRow?.id;

          if (targetId && pendingIds.current.has(targetId)) {
            pendingIds.current.delete(targetId);
            if (payload.eventType === 'UPDATE' && newRow) {
              setTasks((prev) => prev.map((task) => (task.id === newRow.id ? newRow : task)));
            }
            return;
          }

          setTasks((prev) => {
            switch (payload.eventType) {
              case 'INSERT':
                if (!newRow) return prev;
                if (prev.some((task) => task.id === newRow.id)) return prev;
                return [newRow, ...prev];
              case 'UPDATE':
                if (!newRow) return prev;
                return prev.map((task) => (task.id === newRow.id ? newRow : task));
              case 'DELETE':
                if (!oldRow) return prev;
                return prev.filter((task) => task.id !== oldRow.id);
              default:
                return prev;
            }
          });
        }
      )
      .subscribe();

    // Batch update on beforeunload
    const handleBeforeUnload = () => {
      if (updateQueue.current.size > 0) {
        const updates = Array.from(updateQueue.current.entries());
        updates.forEach(([id, updates]) => {
          supabase.from(TABLE_NAME).update(updates).eq('id', id);
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      active = false;
      supabase.removeChannel(channel);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      handleBeforeUnload();
    };
  }, [fetchData]);

  // Process update queue periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (updateQueue.current.size > 0 && isOwner) {
        const updates = Array.from(updateQueue.current.entries());
        updateQueue.current.clear();

        updates.forEach(async ([id, updateData]) => {
          const { error } = await supabase.from(TABLE_NAME).update(updateData).eq('id', id);
          if (error) {
            console.error('Failed to batch update task:', error);
            updateQueue.current.set(id, updateData);
          }
        });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isOwner]);

  const handleToggleComplete = async (id: string, currentState: boolean) => {
    if (!isOwner) return;

    const newState = !currentState;
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, is_completed: newState } : task)));

    if (newState) {
      setCompletedTaskId(id);
      setTimeout(() => setCompletedTaskId(null), 2000);

      // Check for achievements
      const newCompletedCount = todayTasks.filter((t) => t.is_completed || t.id === id).length + 1;
      if (newCompletedCount === 5) {
        setAchievement('Completed 5 tasks in one day!');
        setTimeout(() => setAchievement(null), 3000);
      }
      if (streak + 1 === 3) {
        setAchievement('3-day streak!');
        setTimeout(() => setAchievement(null), 3000);
      }
    }

    pendingIds.current.add(id);
    updateQueue.current.set(id, { is_completed: newState });

    // Also update activity - compute from tasks
    const task = tasks.find((t) => t.id === id);
    if (task) {
      // Recompute activity for the date
      const updatedTasks = tasks.map((t) => (t.id === id ? { ...t, is_completed: newState } : t));
      const completedToday = updatedTasks.filter((t) => t.date === task.date && t.is_completed).length;
      
      // Try to update activity table, but don't fail if it doesn't exist
      const { error: activityError } = await supabase
        .from('daily_activity')
        .upsert(
          {
            user_id: task.user_id,
            date: task.date,
            tasks_completed: completedToday,
          },
          { onConflict: 'user_id,date' }
        );

      // If table doesn't exist, that's okay - we'll compute from tasks
      if (activityError && !activityError.message.includes('does not exist')) {
        console.error('Failed to update activity:', activityError);
      }

      // Update local activity state
      setActivities((prev) => {
        const existing = prev.find((a) => a.date === task.date);
        if (existing) {
          return prev.map((a) => (a.date === task.date ? { ...a, tasks_completed: completedToday } : a));
        }
        return [...prev, { date: task.date, tasks_completed: completedToday }];
      });
    }

    // Immediate update for better UX
    const { error } = await supabase.from(TABLE_NAME).update({ is_completed: newState }).eq('id', id);
    if (error) {
      console.error('Failed to update task:', error);
      pendingIds.current.delete(id);
      await fetchData();
    } else {
      pendingIds.current.delete(id);
      updateQueue.current.delete(id);
    }
  };

  const handleAddTask = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAddError(null);

    if (!isOwner) {
      setAddError('Please log in with your access code to add tasks.');
      return;
    }

    const trimmedTitle = formTitle.trim();
    if (!trimmedTitle) {
      setAddError('Please enter a task title.');
      return;
    }

    const id = generateId();
    const newTask: DailyTask = {
      id,
      user_id: 'default-user',
      title: trimmedTitle,
      description: formDescription.trim() || null,
      is_completed: false,
      date: selectedDate,
      created_at: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);
    pendingIds.current.add(id);

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert({
        id,
        user_id: 'default-user',
        title: trimmedTitle,
        description: formDescription.trim() || null,
        is_completed: false,
        date: selectedDate,
      })
      .select('*')
      .single();

    if (error) {
      pendingIds.current.delete(id);
      console.error('Insert failed:', error.message);
      setTasks((prev) => prev.filter((task) => task.id !== id));
      setAddError(`Failed to add task: ${error.message}. Make sure the Supabase table exists.`);
      return;
    }

    pendingIds.current.delete(id);
    if (data) {
      setTasks((prev) => prev.map((task) => (task.id === id ? (data as DailyTask) : task)));
    }

    setFormTitle('');
    setFormDescription('');
  };

  const handleDeleteTask = async (id: string) => {
    if (!isOwner) return;

    setTasks((prev) => prev.filter((task) => task.id !== id));
    pendingIds.current.add(id);

    const { error } = await supabase.from(TABLE_NAME).delete().eq('id', id);
    if (error) {
      pendingIds.current.delete(id);
      console.error('Failed to delete task:', error);
      await fetchData();
    }
  };

  if (isInitialising) {
    return (
      <div className="frosted-card rounded-3xl p-6 text-center text-sm text-foreground-muted">
        Loading tasks…
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Owner Access */}
      <div className="frosted-card flex flex-col gap-4 rounded-3xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 md:flex-nowrap">
          <div>
            <h2 className="text-sm uppercase tracking-[0.4em] text-secondary-soft">Owner access</h2>
            <p className="mt-2 text-sm text-foreground-muted">
              Add or complete tasks with your access code. Track your progress and build streaks.
            </p>
          </div>
          {isOwner ? (
            <button
              type="button"
              className="rounded-full border border-soft px-4 py-2 text-xs uppercase tracking-[0.3em] text-foreground-muted transition hover:border-primary hover:text-primary"
              onClick={logout}
            >
              Sign out
            </button>
          ) : (
            <form
              className="flex items-center gap-3 rounded-full border border-soft bg-surface-soft px-4 py-2 text-sm"
              onSubmit={(event) => {
                event.preventDefault();
                login(loginCode);
              }}
            >
              <input
                value={loginCode}
                onChange={(event) => setLoginCode(event.target.value)}
                placeholder="Access code"
                className="w-40 bg-transparent text-sm text-foreground outline-none placeholder:text-subtle"
                type="password"
              />
              <button
                type="submit"
                className="rounded-full bg-primary px-4 py-2 text-xs uppercase tracking-[0.3em] text-white transition hover:bg-primary-strong"
              >
                Unlock
              </button>
            </form>
          )}
        </div>
        {!ACCESS_CODE && (
          <p className="text-sm text-[#c0392b]">
            Set <code className="rounded bg-surface-soft px-2 py-1 text-xs">NEXT_PUBLIC_OWNER_ACCESS_CODE</code> to allow
            editing.
          </p>
        )}
        {ownerError && <p className="text-sm text-[#c0392b]">{ownerError}</p>}
      </div>

      {/* Stats and Streak */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="frosted-card rounded-3xl p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary-soft p-3">
              <Check className="text-primary" size={20} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-secondary-soft">Today</p>
              <p className="text-2xl font-semibold text-foreground">
                {completedCount} / {totalCount}
              </p>
            </div>
          </div>
        </div>
        <div className="frosted-card rounded-3xl p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary-soft p-3">
              <Flame className="text-primary" size={20} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-secondary-soft">Streak</p>
              <p className="text-2xl font-semibold text-foreground">{streak} days</p>
            </div>
          </div>
        </div>
        <div className="frosted-card rounded-3xl p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary-soft p-3">
              <Trophy className="text-primary" size={20} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-secondary-soft">Total</p>
              <p className="text-2xl font-semibold text-foreground">{tasks.filter((t) => t.is_completed).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contribution Grid */}
      <ContributionGrid activities={activities} selectedDate={selectedDate} onDateSelect={setSelectedDate} />

      {/* Achievement Notification */}
      {achievement && (
        <div className="fixed left-1/2 top-20 z-50 -translate-x-1/2 animate-bounce rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg">
          🎉 {achievement}
        </div>
      )}

      {/* Add Task Form */}
      <div className="frosted-card rounded-3xl p-6">
        {!isOwner && (
          <div className="mb-4 rounded-2xl border border-soft bg-surface-soft p-4 text-sm text-foreground-muted">
            <p>Please log in with your access code above to add tasks.</p>
          </div>
        )}
        <form onSubmit={handleAddTask} className="space-y-4">
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.35em] text-secondary-soft">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                className="w-full rounded-2xl border border-soft bg-surface-soft px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.35em] text-secondary-soft">Task Title</label>
              <input
                value={formTitle}
                onChange={(event) => setFormTitle(event.target.value)}
                className="w-full rounded-2xl border border-soft bg-surface-soft px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
                placeholder="What needs to be done?"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.35em] text-secondary-soft">
                Description (optional)
              </label>
              <textarea
                value={formDescription}
                onChange={(event) => setFormDescription(event.target.value)}
                rows={2}
                className="w-full rounded-2xl border border-soft bg-surface-soft px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
                placeholder="Add details..."
              />
            </div>
            {addError && (
              <div className="rounded-2xl border border-[#c0392b] bg-[#c0392b]/10 p-3 text-sm text-[#c0392b]">
                {addError}
              </div>
            )}
            <button
              type="submit"
              className="rounded-full border border-primary bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-primary-strong disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isPending || !isOwner}
            >
              <Plus size={16} className="mr-2 inline" />
              Add Task
            </button>
          </form>
        </div>

      {/* Task List */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">
          Tasks for {new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </h3>
        {todayTasks.length === 0 ? (
          <div className="frosted-card rounded-3xl p-8 text-center text-sm text-foreground-muted">
            No tasks for this day. Add one above to get started!
          </div>
        ) : (
          <div className="space-y-3">
            {todayTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                isOwner={isOwner}
                isCompleting={completedTaskId === task.id}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

type TaskItemProps = {
  task: DailyTask;
  isOwner: boolean;
  isCompleting: boolean;
  onToggleComplete: (id: string, currentState: boolean) => void;
  onDelete: (id: string) => void;
};

const TaskItem = ({ task, isOwner, isCompleting, onToggleComplete, onDelete }: TaskItemProps) => {
  const [showConfetti, setShowConfetti] = useState(false);

  const handleClick = () => {
    if (!isOwner) return;
    if (!task.is_completed) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1000);
    }
    onToggleComplete(task.id, task.is_completed);
  };

  return (
    <div className="frosted-card relative rounded-3xl p-4 md:p-6">
      {showConfetti && <ConfettiAnimation />}
      <div className="flex items-start gap-4">
        <button
          type="button"
          onClick={handleClick}
          disabled={!isOwner}
          className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all touch-manipulation md:h-12 md:w-12 ${
            task.is_completed
              ? 'border-primary bg-primary'
              : 'border-soft bg-surface-soft hover:border-primary active:scale-95'
          } ${isCompleting ? 'scale-110 animate-pulse' : ''} ${!isOwner ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
          aria-label={task.is_completed ? 'Mark incomplete' : 'Mark complete'}
        >
          {task.is_completed && (
            <Check className="text-white" size={isCompleting ? 28 : 24} strokeWidth={3} />
          )}
        </button>
        <div className="flex-1">
          <h4
            className={`text-base font-medium md:text-lg ${
              task.is_completed ? 'text-foreground-muted line-through' : 'text-foreground'
            }`}
          >
            {task.title}
          </h4>
          {task.description && (
            <p
              className={`mt-1 text-sm ${
                task.is_completed ? 'text-foreground-subtle line-through' : 'text-foreground-muted'
              }`}
            >
              {task.description}
            </p>
          )}
        </div>
        {isOwner && (
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            className="rounded-full border border-soft p-2.5 text-foreground-muted transition hover:border-primary hover:text-primary active:scale-95 touch-manipulation md:p-2"
            aria-label="Delete task"
          >
            <Trash2 size={18} className="md:w-4 md:h-4" />
          </button>
        )}
      </div>
      {isCompleting && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">Good job! 🎉</div>
        </div>
      )}
    </div>
  );
};

const ConfettiAnimation = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: `${0.5 + Math.random() * 0.5}s`,
          }}
        >
          <div
            className="h-2 w-2 rounded-full"
            style={{
              backgroundColor: ['#f3a572', '#93b4f6', '#e58b4e', '#f2f5f9'][Math.floor(Math.random() * 4)],
            }}
          />
        </div>
      ))}
    </div>
  );
};

type ContributionGridProps = {
  activities: DailyActivity[];
  selectedDate: string;
  onDateSelect: (date: string) => void;
};

const ContributionGrid = ({ activities, selectedDate, onDateSelect }: ContributionGridProps) => {
  const [weeks, setWeeks] = useState<Array<Array<{ date: string; count: number }>>>([]);

  useEffect(() => {
    const activityMap = new Map<string, number>();
    activities.forEach((activity) => {
      activityMap.set(activity.date, activity.tasks_completed);
    });

    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 364); // 52 weeks

    const weeksData: Array<Array<{ date: string; count: number }>> = [];
    let currentWeek: Array<{ date: string; count: number }> = [];

    for (let i = 0; i < 365; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = formatDate(date);
      const dayOfWeek = date.getDay();

      currentWeek.push({
        date: dateStr,
        count: activityMap.get(dateStr) || 0,
      });

      if (dayOfWeek === 6 || i === 364) {
        weeksData.push(currentWeek);
        currentWeek = [];
      }
    }

    setWeeks(weeksData);
  }, [activities]);

  const getIntensity = (count: number): string => {
    if (count === 0) return 'bg-surface-soft';
    if (count === 1) return 'bg-primary opacity-40';
    if (count <= 3) return 'bg-primary opacity-60';
    if (count <= 5) return 'bg-primary opacity-80';
    return 'bg-primary';
  };

  return (
    <div className="frosted-card rounded-3xl p-6">
      <h3 className="mb-4 text-sm uppercase tracking-[0.4em] text-secondary-soft">Activity</h3>
      <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
        <div className="flex gap-1 pb-2" style={{ minWidth: 'max-content' }}>
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => {
                const isSelected = day.date === selectedDate;
                return (
                  <button
                    key={`${weekIndex}-${dayIndex}`}
                    type="button"
                    onClick={() => onDateSelect(day.date)}
                    className={`h-3 w-3 rounded-sm transition-all hover:scale-110 active:scale-95 touch-manipulation md:h-4 md:w-4 ${
                      isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''
                    } ${getIntensity(day.count)}`}
                    title={`${day.date}: ${day.count} tasks`}
                    aria-label={`${day.date}: ${day.count} tasks completed`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2 text-xs text-foreground-muted sm:flex-row sm:items-center sm:justify-between">
        <span className="text-center sm:text-left">Less</span>
        <div className="flex items-center justify-center gap-1">
          <div className="h-3 w-3 rounded-sm bg-surface-soft" />
          <div className="h-3 w-3 rounded-sm bg-primary opacity-40" />
          <div className="h-3 w-3 rounded-sm bg-primary opacity-60" />
          <div className="h-3 w-3 rounded-sm bg-primary opacity-80" />
          <div className="h-3 w-3 rounded-sm bg-primary" />
        </div>
        <span className="text-center sm:text-right">More</span>
      </div>
    </div>
  );
};

export default DailyTasks;

