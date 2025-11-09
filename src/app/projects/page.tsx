import ProjectGallery, { Repo } from '@/components/projects/ProjectGallery';

export const revalidate = 1800; // Revalidate every 30 minutes

const username = 'SUMMERxKx';

async function getRepos(): Promise<Repo[]> {
  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, {
      headers: {
        'User-Agent': 'portfolio-site',
        Accept: 'application/vnd.github+json',
      },
      next: { revalidate },
    });

    if (!response.ok) {
      console.error(`GitHub API error: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = (await response.json()) as any[];

    return data
      .filter((repo) => !repo.fork)
      .map((repo) => ({
        id: repo.id,
        name: repo.name,
        html_url: repo.html_url,
        description: repo.description,
        language: repo.language,
        homepage: repo.homepage,
        topics: repo.topics ?? [],
        stargazers_count: repo.stargazers_count,
        updated_at: repo.updated_at,
      }));
  } catch (error) {
    console.error('Failed to fetch repositories:', error);
    return [];
  }
}

const ProjectsPage = async () => {
  const repos = await getRepos();

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-6 pb-24 pt-24">
      <header className="space-y-4 text-center md:space-y-5">
        <span className="text-xs uppercase tracking-[0.5em] text-secondary-soft">Projects</span>
        <h1 className="text-4xl text-foreground md:text-5xl">Recent work</h1>
        <p className="text-sm leading-relaxed text-foreground-soft md:text-base">
          Every project shown here loads straight from GitHub. Search, filter, and jump into the repos or demos whenever
          you like.
        </p>
      </header>
      <ProjectGallery repos={repos} />
    </div>
  );
};

export default ProjectsPage;


