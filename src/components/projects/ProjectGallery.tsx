'use client';

import Link from 'next/link';
import React, { useMemo, useState } from 'react';
import { ExternalLink, Github, Search } from 'lucide-react';

export type Repo = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  homepage: string | null;
  topics: string[];
  stargazers_count: number;
  updated_at: string;
};

type ProjectGalleryProps = {
  repos: Repo[];
};

const ProjectGallery = ({ repos }: ProjectGalleryProps) => {
  const [search, setSearch] = useState('');
  const [language, setLanguage] = useState('All');

  const languages = useMemo(() => {
    const set = new Set<string>();
    repos.forEach((repo) => {
      if (repo.language) {
        set.add(repo.language);
      }
    });
    return ['All', ...Array.from(set).sort()];
  }, [repos]);

  const filtered = useMemo(() => {
    return repos.filter((repo) => {
      const matchesLanguage = language === 'All' || repo.language === language;
      const term = search.trim().toLowerCase();
      const matchesSearch =
        term.length === 0 ||
        repo.name.toLowerCase().includes(term) ||
        (repo.description ?? '').toLowerCase().includes(term) ||
        repo.topics.some((topic) => topic.toLowerCase().includes(term));

      return matchesLanguage && matchesSearch;
    });
  }, [language, repos, search]);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-[1fr,200px] md:items-center">
        <label className="flex items-center gap-3 rounded-full border border-soft bg-surface-soft px-5 py-3 text-sm text-foreground-soft focus-within:border-primary">
          <Search size={18} className="text-primary" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search projects..."
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-subtle"
            aria-label="Search projects"
          />
        </label>
        <select
          value={language}
          onChange={(event) => setLanguage(event.target.value)}
          className="rounded-full border border-soft bg-surface-soft px-4 py-3 text-sm text-foreground-soft outline-none transition focus:border-primary"
          aria-label="Filter projects by language"
        >
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {filtered.map((repo) => (
          <article
            key={repo.id}
            className="group flex flex-col rounded-3xl border border-soft bg-surface-soft p-8 transition hover:-translate-y-1 hover:border-primary hover:bg-surface"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg text-foreground">{repo.name.replace(/-/g, ' ')}</h2>
              <span className="rounded-full border border-soft px-3 py-1 text-xs uppercase tracking-[0.3em] text-secondary">
                {repo.language ?? 'Mixed'}
              </span>
            </div>
            {repo.description && <p className="mt-4 text-sm leading-relaxed text-foreground-soft">{repo.description}</p>}
            {repo.topics.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.2em] text-secondary">
                {repo.topics.map((topic) => (
                  <li key={topic} className="rounded-full border border-soft px-3 py-1">
                    {topic}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-6 flex items-center gap-3">
              <Link
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border border-soft px-4 py-2 text-xs uppercase tracking-[0.3em] text-foreground-soft transition hover:border-primary hover:text-primary"
              >
                <Github size={16} />
                GitHub
              </Link>
              {repo.homepage && (
                <Link
                  href={repo.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full border border-soft px-4 py-2 text-xs uppercase tracking-[0.3em] text-foreground-soft transition hover:border-primary hover:text-primary"
                >
                  <ExternalLink size={16} />
                  Demo
                </Link>
              )}
            </div>
            <p className="mt-4 text-xs text-foreground-subtle">
              Updated {new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(repo.updated_at))}
            </p>
          </article>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full rounded-3xl border border-soft bg-surface-soft p-12 text-center text-sm text-foreground-muted">
            No projects match this search. Try another keyword or remove filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectGallery;


