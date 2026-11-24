import { GithubInfo } from "fumadocs-ui/components/github-info";

const fetchOptions = { cache: "force-cache" } as const;

/** Stars and forks of the editor repository. The count is read once at build time; when GitHub
 * can't be reached (rate limits on shared build machines), a plain link takes its place so the
 * build never depends on the API. */
export async function RepoInfo({
  owner,
  repo,
}: {
  owner: string;
  repo: string;
}) {
  const headers: HeadersInit = process.env.GITHUB_TOKEN
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {};
  const reachable = await fetch(
    `https://api.github.com/repos/${owner}/${repo}`,
    {
      ...fetchOptions,
      headers,
    },
  )
    .then((response) => response.ok)
    .catch(() => false);
  if (!reachable) {
    return (
      <a
        href={`https://github.com/${owner}/${repo}`}
        rel="noreferrer noopener"
        target="_blank"
        className="flex p-2 rounded-lg text-sm text-fd-muted-foreground hover:text-fd-accent-foreground hover:bg-fd-accent"
      >
        {owner}/{repo}
      </a>
    );
  }
  return (
    <GithubInfo
      owner={owner}
      repo={repo}
      token={process.env.GITHUB_TOKEN}
      fetchOptions={{ ...fetchOptions, headers }}
    />
  );
}
