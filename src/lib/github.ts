export interface RepoStats {
  stars: number;
  forks: number;
  pushedAt: string;
  latestRelease?: { tagName: string; url: string };
}

function parseRepo(fullName: string): { owner: string; repo: string } | null {
  const parts = fullName.split("/");
  if (parts.length !== 2) return null;
  return { owner: parts[0], repo: parts[1] };
}

export async function getRepoStats(fullName: string): Promise<RepoStats | null> {
  const parsed = parseRepo(fullName);
  if (!parsed) return null;
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
    };
    const token = process.env.GITHUB_TOKEN;
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(
      `https://api.github.com/repos/${parsed.owner}/${parsed.repo}`,
      {
        next: { revalidate: 3600 },
        headers,
      },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      stargazers_count?: number;
      forks_count?: number;
      pushed_at?: string;
    };
    let latestRelease: RepoStats["latestRelease"] | undefined;
    try {
      const relRes = await fetch(
        `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/releases/latest`,
        { next: { revalidate: 3600 }, headers },
      );
      if (relRes.ok) {
        const rel = (await relRes.json()) as { tag_name?: string; html_url?: string };
        if (rel.tag_name) {
          latestRelease = { tagName: rel.tag_name, url: rel.html_url ?? `https://github.com/${fullName}/releases/latest` };
        }
      }
    } catch {
      // ignore
    }
    return {
      stars: typeof data.stargazers_count === "number" ? data.stargazers_count : 0,
      forks: typeof data.forks_count === "number" ? data.forks_count : 0,
      pushedAt: typeof data.pushed_at === "string" ? data.pushed_at : "",
      latestRelease,
    };
  } catch {
    return null;
  }
}
