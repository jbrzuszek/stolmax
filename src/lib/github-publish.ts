type GithubFile = {
  path: string;
  content: Buffer | string;
  encoding?: "utf-8" | "base64";
};

function getGithubConfig() {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER ?? "jbrzuszek";
  const repo = process.env.GITHUB_REPO ?? "stolmax";
  const branch = process.env.GITHUB_BRANCH ?? "main";

  if (!token) {
    return null;
  }

  return { token, owner, repo, branch };
}

async function githubFetch(path: string, init?: RequestInit) {
  const config = getGithubConfig();
  if (!config) {
    throw new Error("Brak GITHUB_TOKEN w zmiennych środowiskowych.");
  }

  const response = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${config.token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub API ${response.status}: ${body.slice(0, 300)}`);
  }

  return response.json();
}

export function isGithubPublishConfigured() {
  return Boolean(getGithubConfig()?.token);
}

export async function publishFilesToGithub({
  files,
  message,
}: {
  files: GithubFile[];
  message: string;
}) {
  const config = getGithubConfig();
  if (!config) {
    throw new Error(
      "Brak GITHUB_TOKEN. Dodaj token w .env.local, aby publikować realizacje na stronę.",
    );
  }

  const { owner, repo, branch } = config;
  const ref = await githubFetch(`/repos/${owner}/${repo}/git/ref/heads/${branch}`);
  const latestCommitSha = ref.object.sha as string;
  const latestCommit = await githubFetch(
    `/repos/${owner}/${repo}/git/commits/${latestCommitSha}`,
  );
  const baseTreeSha = latestCommit.tree.sha as string;

  const treeItems = [];

  for (const file of files) {
    const encoding = file.encoding ?? (Buffer.isBuffer(file.content) ? "base64" : "utf-8");
    const content =
      encoding === "base64"
        ? Buffer.isBuffer(file.content)
          ? file.content.toString("base64")
          : file.content
        : typeof file.content === "string"
          ? file.content
          : file.content.toString("utf-8");

    const blob = await githubFetch(`/repos/${owner}/${repo}/git/blobs`, {
      method: "POST",
      body: JSON.stringify({ content, encoding }),
    });

    treeItems.push({
      path: file.path,
      mode: "100644",
      type: "blob",
      sha: blob.sha as string,
    });
  }

  const tree = await githubFetch(`/repos/${owner}/${repo}/git/trees`, {
    method: "POST",
    body: JSON.stringify({
      base_tree: baseTreeSha,
      tree: treeItems,
    }),
  });

  const commit = await githubFetch(`/repos/${owner}/${repo}/git/commits`, {
    method: "POST",
    body: JSON.stringify({
      message,
      tree: tree.sha,
      parents: [latestCommitSha],
    }),
  });

  await githubFetch(`/repos/${owner}/${repo}/git/refs/heads/${branch}`, {
    method: "PATCH",
    body: JSON.stringify({ sha: commit.sha }),
  });

  return { commitSha: commit.sha as string };
}
