export async function fetchRepoData(owner: string, repo: string) {
  const token = process.env.GITHUB_TOKEN;
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers,
    next: { revalidate: 3600 }
  });

  if (!res.ok) {
    if (res.status === 404) throw new Error('Repository not found');
    throw new Error('Failed to fetch repo data');
  }

  return res.json();
}

export async function fetchRecentStargazers(owner: string, repo: string, limit = 100) {
  const token = process.env.GITHUB_TOKEN;
  const headers = {
    Accept: 'application/vnd.github.v3.star+json',
    ...(token && { Authorization: `Bearer ${token}` })
  };

  // Fetching the most recent stargazers (last page if possible, but GitHub API requires pagination)
  // For MVP, we just fetch a page of stargazers. To get latest, we can fetch per_page=100.
  // Real implementation would use GraphQL for better data fetching.
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/stargazers?per_page=${limit}`, {
    headers,
    next: { revalidate: 3600 }
  });

  if (!res.ok) {
    return [];
  }

  return res.json();
}
