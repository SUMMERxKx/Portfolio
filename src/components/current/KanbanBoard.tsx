'use client';

import React, {
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';
import {
  ClipboardCheck,
  Heading,
  LayoutPanelTop,
  NotebookPen,
  PencilLine,
  Plus,
  Trash2,
  X,
} from 'lucide-react';

import { supabase } from '@/lib/supabaseClient';

type CardType = 'task' | 'note' | 'heading';
type LayoutOption = 'default' | 'wide';

type BoardItem = {
  id: string;
  type: CardType;
  title: string;
  body: string | null;
  progress: number | null;
  layout: LayoutOption;
};

type BoardItemRow = {
  id: string;
  type: CardType;
  title: string;
  body: string | null;
  progress: number | null;
  layout: LayoutOption | null;
};

const ACCESS_CODE = process.env.NEXT_PUBLIC_OWNER_ACCESS_CODE ?? '';
const TABLE_NAME = 'kanban_items';
const CHANNEL_NAME = 'realtime:kanban_items';

const defaultSeed: BoardItem[] = [
  {
    id: 'seed-heading',
    type: 'heading',
    title: 'Focused work',
    body: null,
    progress: null,
    layout: 'default',
  },
  {
    id: 'seed-task-1',
    type: 'task',
    title: 'Refine portfolio layout',
    body: 'Tighten spacing, simplify copy, and keep visuals consistent across pages.',
    progress: 70,
    layout: 'default',
  },
  {
    id: 'seed-task-2',
    type: 'task',
    title: 'Prototype AI helper scripts',
    body: 'Experiment with lightweight models for faster content suggestions in the UI.',
    progress: 35,
    layout: 'default',
  },
  {
    id: 'seed-note',
    type: 'note',
    title: 'Notebook',
    body: '• Collect feedback about the board\n• Evaluate ML experiments\n• Share updates weekly',
    progress: null,
    layout: 'wide',
  },
];

const generateId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `item-${Math.random().toString(36).slice(2, 10)}`;
};

const iconByType: Record<CardType, React.ElementType> = {
  task: ClipboardCheck,
  note: NotebookPen,
  heading: Heading,
};

const mapRowToItem = (row: BoardItemRow): BoardItem => ({
  id: row.id,
  type: row.type,
  title: row.title,
  body: row.body,
  progress: row.progress,
  layout: row.layout ?? 'default',
});

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

const KanbanBoard = () => {
  const { isOwner, error: ownerError, login, logout } = useOwnerAccess();
  const [items, setItems] = useState<BoardItem[]>([]);
  const [isInitialising, setIsInitialising] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [loginCode, setLoginCode] = useState('');

  const pendingIds = useRef(new Set<string>());
  const seedApplied = useRef(false);

  const [formType, setFormType] = useState<CardType>('task');
  const [formTitle, setFormTitle] = useState('');
  const [formBody, setFormBody] = useState('');
  const [formProgress, setFormProgress] = useState(50);
  const [formLayout, setFormLayout] = useState<LayoutOption>('default');

  const orderedItems = useMemo(() => items, [items]);

  const fetchItems = React.useCallback(async () => {
    setIsInitialising(true);
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('inserted_at', { ascending: false });

    console.log('Fetched Supabase items:', data);
    console.log('Error fetching:', error);

    if (error) {
      console.error('Failed to fetch kanban items:', error);
      if (!seedApplied.current) {
        setItems(defaultSeed);
        seedApplied.current = true;
      }
      setIsInitialising(false);
      return;
    }

    if (data && data.length > 0) {
      seedApplied.current = true;
      setItems(data.map((row) => mapRowToItem(row as BoardItemRow)));
    } else if (!seedApplied.current) {
      setItems(defaultSeed);
      seedApplied.current = true;
    } else {
      setItems([]);
    }

    setIsInitialising(false);
  }, []);

  useEffect(() => {
    let active = true;

    const initialise = async () => {
      await fetchItems();
      if (!active) return;
    };

    initialise();

    const channel = supabase
      .channel(CHANNEL_NAME)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: TABLE_NAME },
        (payload) => {
          console.log('Realtime event:', payload);
          const newRow = payload.new as BoardItemRow | undefined;
          const oldRow = payload.old as BoardItemRow | undefined;
          const targetId = newRow?.id ?? oldRow?.id;

          if (targetId && pendingIds.current.has(targetId)) {
            pendingIds.current.delete(targetId);
            if (payload.eventType === 'UPDATE' && newRow) {
              setItems((prev) =>
                prev.map((item) => (item.id === newRow.id ? mapRowToItem(newRow) : item))
              );
            }
            return;
          }

          setItems((prev) => {
            switch (payload.eventType) {
              case 'INSERT': {
                if (!newRow) return prev;
                const mapped = mapRowToItem(newRow);
                if (prev.some((item) => item.id === mapped.id)) {
                  return prev;
                }
                return [mapped, ...prev];
              }
              case 'UPDATE': {
                if (!newRow) return prev;
                return prev.map((item) => (item.id === newRow.id ? mapRowToItem(newRow) : item));
              }
              case 'DELETE': {
                if (!oldRow) return prev;
                return prev.filter((item) => item.id !== oldRow.id);
              }
              default:
                return prev;
            }
          });
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [fetchItems]);

  const handleUpdateItem = async (id: string, updates: Partial<BoardItem>) => {
    if (!isOwner) return;

    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));

    pendingIds.current.add(id);
    const { error } = await supabase
      .from(TABLE_NAME)
      .update({
        ...('type' in updates && { type: updates.type }),
        ...('title' in updates && { title: updates.title }),
        ...('body' in updates && { body: updates.body ?? null }),
        ...('progress' in updates && { progress: updates.progress ?? null }),
        ...('layout' in updates && { layout: updates.layout ?? 'default' }),
      })
      .eq('id', id);

    if (error) {
      pendingIds.current.delete(id);
      console.error('Failed to update board item:', error);
      await fetchItems();
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!isOwner) return;

    setItems((prev) => prev.filter((item) => item.id !== id));
    pendingIds.current.add(id);

    const { error } = await supabase.from(TABLE_NAME).delete().eq('id', id);

    if (error) {
      pendingIds.current.delete(id);
      console.error('Failed to delete board item:', error);
      await fetchItems();
    }
  };

  const handleToggleLayout = (id: string) => {
    if (!isOwner) return;
    const current = items.find((item) => item.id === id);
    if (!current) return;
    const nextLayout: LayoutOption = current.layout === 'default' ? 'wide' : 'default';
    handleUpdateItem(id, { layout: nextLayout });
  };

  const handleAddItem = async (event: FormEvent<HTMLFormElement>) => {
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

    const id = generateId();
    const optimistic: BoardItem = {
      id,
      type: formType,
      title:
        trimmedTitle ||
        (formType === 'note' ? 'Note' : formType === 'heading' ? 'Heading' : 'New task'),
      body: trimmedBody || null,
      progress: formType === 'task' ? formProgress : null,
      layout: formLayout,
    };

    setItems((prev) => [optimistic, ...prev]);
    pendingIds.current.add(id);

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert({
        id,
        type: optimistic.type,
        title: optimistic.title,
        body: optimistic.body,
        progress: optimistic.progress,
        layout: optimistic.layout,
      })
      .select('*')
      .single();

    if (error) {
      pendingIds.current.delete(id);
      console.error('Insert failed:', error.message);
      setItems((prev) => prev.filter((item) => item.id !== id));
      return;
    }

    pendingIds.current.delete(id);
    if (data) {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? mapRowToItem(data as BoardItemRow) : item))
      );
    }

    setFormTitle('');
    setFormBody('');
    setFormProgress(50);
    setFormLayout('default');
  };

  const handleAddQuickNote = async () => {
    if (!isOwner) return;

    const id = generateId();
    const optimistic: BoardItem = {
      id,
      type: 'note',
      title: 'Quick note',
      body: '',
      progress: null,
      layout: 'default',
    };

    startTransition(() => {
      setItems((prev) => [optimistic, ...prev]);
    });
    pendingIds.current.add(id);

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert({
        id,
        type: optimistic.type,
        title: optimistic.title,
        body: optimistic.body,
        progress: null,
        layout: optimistic.layout,
      })
      .select('*')
      .single();

    if (error) {
      pendingIds.current.delete(id);
      console.error('Insert failed:', error.message);
      setItems((prev) => prev.filter((item) => item.id !== id));
      return;
    }

    pendingIds.current.delete(id);
    if (data) {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? mapRowToItem(data as BoardItemRow) : item))
      );
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
    <div className="space-y-10">
      <div className="frosted-card flex flex-col gap-4 rounded-3xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 md:flex-nowrap">
          <div>
            <h2 className="text-sm uppercase tracking-[0.4em] text-secondary-soft">Owner access</h2>
            <p className="mt-2 text-sm text-foreground-muted">
              Add or edit cards with your access code. Visitors can follow along in real time.
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

      {isOwner && (
        <div className="frosted-card rounded-3xl p-6 text-sm text-foreground-muted">
          <form onSubmit={handleAddItem} className="grid gap-4 md:grid-cols-2">
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
                disabled={isPending}
              >
                Add card
              </button>
              <button
                type="button"
                onClick={handleAddQuickNote}
                className="rounded-full border border-soft px-5 py-3 text-xs uppercase tracking-[0.3em] text-foreground-muted transition hover:border-primary hover:text-primary"
                disabled={isPending}
              >
                Add quick note
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {orderedItems.map((item) => (
          <BoardItemCard
            key={item.id}
            item={item}
            isOwner={isOwner}
            onDelete={handleDeleteItem}
            onToggleLayout={handleToggleLayout}
            onUpdate={handleUpdateItem}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;


type BoardItemCardProps = {
  item: BoardItem;
  isOwner: boolean;
  onUpdate: (id: string, updates: Partial<BoardItem>) => Promise<void>;
  onDelete: (id: string) => Promise<void> | void;
  onToggleLayout: (id: string) => void;
};

const BoardItemCard = ({ item, isOwner, onUpdate, onDelete, onToggleLayout }: BoardItemCardProps) => {
  const Icon = iconByType[item.type];
  const spanClass = item.layout === 'wide' ? 'md:col-span-2' : 'md:col-span-1';

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(item.title ?? '');
  const [editedBody, setEditedBody] = useState(item.body ?? '');
  const [editedProgress, setEditedProgress] = useState(item.progress ?? 0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      setEditedTitle(item.title ?? '');
      setEditedBody(item.body ?? '');
      setEditedProgress(item.progress ?? 0);
    }
  }, [item.title, item.body, item.progress, isEditing]);

  const handleStartEditing = () => {
    if (!isOwner) return;
    setEditedTitle(item.title ?? '');
    setEditedBody(item.body ?? '');
    setEditedProgress(item.progress ?? 0);
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    setEditedTitle(item.title ?? '');
    setEditedBody(item.body ?? '');
    setEditedProgress(item.progress ?? 0);
  };

  const handleSaveEdit = async () => {
    if (!isOwner) return;

    const trimmedTitle = editedTitle.trim();
    const trimmedBody = editedBody.trim();

    const updates: Partial<BoardItem> = {};

    if (item.type === 'heading') {
      if (trimmedTitle !== (item.title ?? '')) {
        updates.title = trimmedTitle || 'Untitled heading';
      }
    } else {
      if (trimmedTitle !== (item.title ?? '')) {
        updates.title =
          trimmedTitle || (item.type === 'note' ? 'Note' : item.type === 'task' ? 'Task' : item.title ?? '');
      }
      if (trimmedBody !== (item.body ?? '')) {
        updates.body = trimmedBody || null;
      }
      if (item.type === 'task' && editedProgress !== (item.progress ?? 0)) {
        updates.progress = editedProgress;
      }
    }

    if (Object.keys(updates).length === 0) {
      setIsEditing(false);
      return;
    }

    try {
      setIsSaving(true);
      await onUpdate(item.id, updates);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <article className={`frosted-card flex flex-col gap-4 rounded-3xl p-6 ${spanClass}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-foreground">
          <Icon size={18} className="text-primary" />
          <p className="text-xs uppercase tracking-[0.3em] text-secondary-subtle">
            {item.type === 'task' ? 'Task' : item.type === 'note' ? 'Note' : 'Heading'}
          </p>
        </div>
        {isOwner && (
          <div className="flex items-center gap-2">
            {!isEditing && (
              <button
                type="button"
                onClick={() => onToggleLayout(item.id)}
                className="rounded-full border border-soft p-2 text-foreground-muted transition hover:border-primary hover:text-primary"
                aria-label="Toggle width"
              >
                <LayoutPanelTop size={16} />
              </button>
            )}
            {!isEditing ? (
              <button
                type="button"
                onClick={handleStartEditing}
                className="rounded-full border border-soft p-2 text-foreground-muted transition hover:border-primary hover:text-primary"
                aria-label="Edit card"
              >
                <PencilLine size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCancelEditing}
                className="rounded-full border border-soft p-2 text-foreground-muted transition hover:border-primary hover:text-primary"
                aria-label="Cancel editing"
              >
                <X size={16} />
              </button>
            )}
            <button
              type="button"
              onClick={() => onDelete(item.id)}
              className="rounded-full border border-soft p-2 text-foreground-muted transition hover:border-primary hover:text-primary"
              aria-label="Delete card"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <>
          {item.type === 'heading' ? (
            <input
              value={editedTitle}
              onChange={(event) => setEditedTitle(event.target.value)}
              className="w-full rounded-2xl border border-soft bg-surface-soft px-4 py-3 text-2xl text-foreground outline-none transition focus:border-primary"
              placeholder="Heading text"
            />
          ) : (
            <>
              <input
                value={editedTitle}
                onChange={(event) => setEditedTitle(event.target.value)}
                className="w-full rounded-2xl border border-soft bg-surface-soft px-4 py-3 text-lg text-foreground outline-none transition focus:border-primary"
                placeholder={item.type === 'task' ? 'Task title' : 'Note title'}
              />
              <textarea
                value={editedBody}
                onChange={(event) => setEditedBody(event.target.value)}
                rows={item.type === 'note' ? 4 : 3}
                className="w-full rounded-2xl border border-soft bg-surface-soft px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
                placeholder={item.type === 'note' ? 'Write your note…' : 'Add details'}
              />
            </>
          )}

          {item.type === 'task' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-foreground-muted">
                <span>Progress</span>
                <span>{editedProgress}%</span>
              </div>
              <div className="h-2 rounded-full bg-surface-soft">
                <div className="h-2 rounded-full bg-primary" style={{ width: `${editedProgress}%` }} />
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={editedProgress}
                onChange={(event) => setEditedProgress(Number(event.target.value))}
                className="w-full"
                style={{ accentColor: '#f3a572' }}
              />
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={handleSaveEdit}
              disabled={isSaving}
              className="rounded-full border border-primary bg-primary px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-primary-strong disabled:cursor-not-allowed disabled:border-soft disabled:bg-surface-soft disabled:text-foreground-muted"
            >
              {isSaving ? 'Saving…' : 'Save edit'}
            </button>
            <button
              type="button"
              onClick={handleCancelEditing}
              disabled={isSaving}
              className="rounded-full border border-soft px-5 py-2 text-xs uppercase tracking-[0.3em] text-foreground-muted transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          {item.type === 'heading' ? (
            <h2 className="text-2xl text-foreground">{item.title}</h2>
          ) : (
            <>
              {item.title && <h3 className="text-lg text-foreground">{item.title}</h3>}
              {item.body && <p className="whitespace-pre-line text-sm text-foreground-muted">{item.body}</p>}
            </>
          )}

          {item.type === 'task' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-foreground-muted">
                <span>Progress</span>
                <span>{item.progress ?? 0}%</span>
              </div>
              <div className="h-2 rounded-full bg-surface-soft">
                <div className="h-2 rounded-full bg-primary" style={{ width: `${item.progress ?? 0}%` }} />
              </div>
            </div>
          )}
        </>
      )}
    </article>
  );
};

