'use client';

import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import { ClipboardCheck, Heading, LayoutPanelTop, NotebookPen, Plus, Trash2 } from 'lucide-react';
import { nanoid } from 'nanoid';

type CardType = 'task' | 'note' | 'heading';
type LayoutOption = 'default' | 'wide';

type BoardItem = {
  id: string;
  type: CardType;
  title: string;
  body?: string;
  progress?: number;
  layout: LayoutOption;
};

const STORAGE_KEY = 'current-tasks-items';
const OWNER_KEY = 'current-tasks-owner';
const ACCESS_CODE = process.env.NEXT_PUBLIC_OWNER_ACCESS_CODE ?? '';

const defaultItems: BoardItem[] = [
  {
    id: 'heading-focus',
    type: 'heading',
    title: 'Focused work',
    layout: 'default',
  },
  {
    id: 'task-portfolio',
    type: 'task',
    title: 'Refine portfolio layout',
    body: 'Tighten spacing, simplify copy, and keep the visuals consistent on every page.',
    progress: 70,
    layout: 'default',
  },
  {
    id: 'task-ai-tooling',
    type: 'task',
    title: 'Prototype AI helper scripts',
    body: 'Experiment with lightweight models for faster content suggestions inside current projects.',
    progress: 35,
    layout: 'default',
  },
  {
    id: 'note-ideas',
    type: 'note',
    title: 'Notebook',
    body: '• Gather feedback about this tasks board\n• Test evaluation metrics for the ML capstone refresh',
    layout: 'wide',
  },
];

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
    if (typeof window === 'undefined') {
      return;
    }
    const stored = window.localStorage.getItem(OWNER_KEY);
    if (stored === 'true') {
      setIsOwner(true);
    }
  }, []);

  const login = (code: string) => {
    if (!ACCESS_CODE) {
      setError('NEXT_PUBLIC_OWNER_ACCESS_CODE is not set.');
      return;
    }
    if (code.trim() === ACCESS_CODE) {
      setIsOwner(true);
      window.localStorage.setItem(OWNER_KEY, 'true');
      setError(null);
    } else {
      setError('Access code not recognised. Please try again.');
    }
  };

  const logout = () => {
    setIsOwner(false);
    setError(null);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(OWNER_KEY);
    }
  };

  return { isOwner, error, login, logout };
};

const useBoardItems = (initial: BoardItem[], canPersist: boolean) => {
  const [items, setItems] = useState<BoardItem[]>(initial);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as BoardItem[];
        setItems(parsed);
      } catch (error) {
        console.error('Failed to parse stored board items', error);
      }
    }
  }, []);

  useEffect(() => {
    if (!canPersist || typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, canPersist]);

  return { items, setItems };
};

const iconByType: Record<CardType, React.ElementType> = {
  task: ClipboardCheck,
  note: NotebookPen,
  heading: Heading,
};

const KanbanBoard = () => {
  const { isOwner, login, logout, error } = useOwnerAccess();
  const { items, setItems } = useBoardItems(defaultItems, isOwner);
  const [loginCode, setLoginCode] = useState('');

  const [formType, setFormType] = useState<CardType>('task');
  const [formTitle, setFormTitle] = useState('');
  const [formBody, setFormBody] = useState('');
  const [formProgress, setFormProgress] = useState(50);
  const [formLayout, setFormLayout] = useState<LayoutOption>('default');

  const orderedItems = useMemo(() => items, [items]);

  const updateItem = (id: string, updates: Partial<BoardItem>) => {
    if (!isOwner) return;
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const deleteItem = (id: string) => {
    if (!isOwner) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleLayout = (id: string) => {
    if (!isOwner) return;
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, layout: item.layout === 'default' ? 'wide' : 'default' } : item
      )
    );
  };

  const addItem = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isOwner) return;

    const trimmedTitle = formTitle.trim();
    const trimmedBody = formBody.trim();

    if (formType === 'task' && (!trimmedTitle || !trimmedBody)) {
      return;
    }
    if (formType === 'note' && !trimmedBody) {
      return;
    }
    if (formType === 'heading' && !trimmedTitle) {
      return;
    }

    const newItem: BoardItem = {
      id: `item-${nanoid(6)}`,
      type: formType,
      title:
        trimmedTitle ||
        (formType === 'note' ? 'Note' : formType === 'heading' ? 'Heading' : 'New task'),
      body: trimmedBody || undefined,
      progress: formType === 'task' ? formProgress : undefined,
      layout: formLayout,
    };

    setItems((prev) => [newItem, ...prev]);
    setFormTitle('');
    setFormBody('');
    setFormProgress(50);
    setFormLayout('default');
  };

  const addQuickNote = () => {
    if (!isOwner) return;
    const quickNote: BoardItem = {
      id: `note-${nanoid(5)}`,
      type: 'note',
      title: 'Quick note',
      body: '',
      layout: 'default',
    };
    setItems((prev) => [quickNote, ...prev]);
  };

  return (
    <div className="space-y-10">
      <div className="frosted-card flex flex-col gap-4 rounded-3xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-sm uppercase tracking-[0.4em] text-secondary-soft">Owner access</h2>
            <p className="mt-2 text-sm text-foreground-muted">
              Visitors can read these cards. Editing is limited to the owner login.
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
        {error && <p className="text-sm text-[#c0392b]">{error}</p>}
      </div>

      {isOwner && (
        <div className="frosted-card rounded-3xl p-6 text-sm text-foreground-muted">
          <form onSubmit={addItem} className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-[11px] uppercase tracking-[0.35em] text-secondary-soft">Card type</span>
              <select
                value={formType}
                onChange={(event) => setFormType(event.target.value as CardType)}
                className="rounded-2xl border border-soft bg-surface-soft px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
              >
                <option value="task">Task with progress</option>
                <option value="note">Note</option>
                <option value="heading">Heading</option>
              </select>
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-[11px] uppercase tracking-[0.35em] text-secondary-soft">Layout</span>
              <select
                value={formLayout}
                onChange={(event) => setFormLayout(event.target.value as LayoutOption)}
                className="rounded-2xl border border-soft bg-surface-soft px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
              >
                <option value="default">Standard width</option>
                <option value="wide">Wide</option>
              </select>
            </label>

            <label className="flex flex-col gap-2 md:col-span-2">
              <span className="text-[11px] uppercase tracking-[0.35em] text-secondary-soft">
                Title {formType === 'note' ? '(optional)' : ''}
              </span>
              <input
                value={formTitle}
                onChange={(event) => setFormTitle(event.target.value)}
                className="rounded-2xl border border-soft bg-surface-soft px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
                placeholder={
                  formType === 'heading'
                    ? 'Heading text'
                    : formType === 'task'
                    ? 'Task title'
                    : 'Note title'
                }
                required={formType !== 'note'}
              />
            </label>

            {formType !== 'heading' && (
              <label className="flex flex-col gap-2 md:col-span-2">
                <span className="text-[11px] uppercase tracking-[0.35em] text-secondary-soft">
                  {formType === 'note' ? 'Note' : 'Task details'}
                </span>
                <textarea
                  value={formBody}
                  onChange={(event) => setFormBody(event.target.value)}
                  rows={formType === 'note' ? 4 : 3}
                  className="rounded-2xl border border-soft bg-surface-soft px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
                  placeholder={formType === 'note' ? 'Write your note…' : 'What needs to happen?'}
                  required
                />
              </label>
            )}

            {formType === 'task' && (
              <div className="md:col-span-2">
                <span className="text-[11px] uppercase tracking-[0.35em] text-secondary-soft">Progress</span>
                <div className="mt-3 flex items-center gap-4">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={formProgress}
                    onChange={(event) => setFormProgress(Number(event.target.value))}
                    className="w-full"
                    style={{ accentColor: '#f3a572' }}
                  />
                  <span className="text-sm text-foreground">{formProgress}%</span>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3 md:col-span-2 md:justify-between">
              <button
                type="submit"
                className="rounded-full border border-primary bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-primary-strong"
              >
                Add card
              </button>
              <button
                type="button"
                onClick={addQuickNote}
                className="rounded-full border border-soft px-5 py-3 text-xs uppercase tracking-[0.3em] text-foreground-muted transition hover:border-primary hover:text-primary"
              >
                Add quick note
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {orderedItems.map((item) => {
          const Icon = iconByType[item.type];
          const spanClass = item.layout === 'wide' ? 'md:col-span-2' : 'md:col-span-1';

          return (
            <article key={item.id} className={`frosted-card flex flex-col gap-4 rounded-3xl p-6 ${spanClass}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 text-foreground">
                  <Icon size={18} className="text-primary" />
                  <p className="text-xs uppercase tracking-[0.3em] text-secondary-subtle">
                    {item.type === 'task' ? 'Task' : item.type === 'note' ? 'Note' : 'Heading'}
                  </p>
                </div>
                {isOwner && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleLayout(item.id)}
                      className="rounded-full border border-soft p-2 text-foreground-muted transition hover:border-primary hover:text-primary"
                      aria-label="Toggle width"
                    >
                      <LayoutPanelTop size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteItem(item.id)}
                      className="rounded-full border border-soft p-2 text-foreground-muted transition hover:border-primary hover:text-primary"
                      aria-label="Delete card"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>

              {item.type === 'heading' ? (
                isOwner ? (
                  <input
                    value={item.title}
                    onChange={(event) => updateItem(item.id, { title: event.target.value })}
                    className="w-full rounded-2xl border border-soft bg-surface-soft px-4 py-3 text-2xl text-foreground outline-none transition focus:border-primary"
                  />
                ) : (
                  <h2 className="text-2xl text-foreground">{item.title}</h2>
                )
              ) : (
                <>
                  {isOwner ? (
                    <input
                      value={item.title}
                      onChange={(event) => updateItem(item.id, { title: event.target.value })}
                      className="w-full rounded-2xl border border-soft bg-surface-soft px-4 py-3 text-lg text-foreground outline-none transition focus:border-primary"
                      placeholder={item.type === 'task' ? 'Task title' : 'Note title'}
                    />
                  ) : (
                    item.title && <h3 className="text-lg text-foreground">{item.title}</h3>
                  )}
                  {isOwner ? (
                    <textarea
                      value={item.body ?? ''}
                      onChange={(event) => updateItem(item.id, { body: event.target.value })}
                      rows={item.type === 'note' ? 4 : 3}
                      className="w-full rounded-2xl border border-soft bg-surface-soft px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
                      placeholder={item.type === 'note' ? 'Write your note…' : 'Add details'}
                    />
                  ) : (
                    item.body && (
                      <p className="whitespace-pre-line text-sm text-foreground-muted">{item.body}</p>
                    )
                  )}
                </>
              )}

              {item.type === 'task' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-foreground-muted">
                    <span>Progress</span>
                    <span>{item.progress ?? 0}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-surface-soft">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${item.progress ?? 0}%` }}
                    />
                  </div>
                  {isOwner && (
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={item.progress ?? 0}
                      onChange={(event) => updateItem(item.id, { progress: Number(event.target.value) })}
                      className="w-full"
                      style={{ accentColor: '#f3a572' }}
                    />
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default KanbanBoard;


