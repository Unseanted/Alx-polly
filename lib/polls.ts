import type { Poll } from "@/types/poll";

export type PollPage = {
  items: Poll[];
  total: number;
  skip: number;
  limit: number;
};

export type PollResults = {
  id: string;
  question: string;
  options: string[];
  counts: number[];
  total: number;
  createdAt?: string;
};

export async function listPolls(skip = 0, limit = 10): Promise<Poll[]> {
  const page = await listPaginatedPolls(skip, limit);
  return page.items;
}

export async function listPaginatedPolls(skip = 0, limit = 10): Promise<PollPage> {
  const url = `/polls?skip=${encodeURIComponent(String(skip))}&limit=${encodeURIComponent(String(limit))}`;
  const response = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch polls: ${response.status} ${response.statusText}`);
  }

  const raw = await response.json();
  return parsePollPage(raw, skip, limit);
}

export async function getPollById(id: string): Promise<Poll | null> {
  const response = await fetch(`/Poll/${encodeURIComponent(id)}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Failed to fetch poll ${id}: ${response.status} ${response.statusText}`);
  }

  const raw = await response.json();
  return parsePoll(raw);
}

export async function createPoll(_poll: Omit<Poll, "id" | "createdAt">): Promise<Poll> {
  return { id: "temp", question: _poll.question, options: _poll.options, createdAt: new Date().toISOString() };
}

export async function castVote(pollId: string, optionIndex: number): Promise<Poll> {
  if (!Number.isInteger(optionIndex) || optionIndex < 0) {
    throw new Error("optionIndex must be a non-negative integer");
  }

  const response = await fetch(`/Poll/${encodeURIComponent(pollId)}/vote`, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ optionIndex }),
    cache: "no-store",
  });

  if (response.status === 404) {
    throw new Error(`Poll not found: ${pollId}`);
  }
  if (!response.ok) {
    throw new Error(`Failed to cast vote: ${response.status} ${response.statusText}`);
  }

  const raw = await response.json();
  return parsePoll(raw);
}

export async function getPollResults(pollId: string): Promise<PollResults> {
  const response = await fetch(`/Poll/${encodeURIComponent(pollId)}/results`, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (response.status === 404) {
    throw new Error(`Poll not found: ${pollId}`);
  }
  if (!response.ok) {
    throw new Error(`Failed to fetch poll results: ${response.status} ${response.statusText}`);
  }

  const raw = await response.json();
  return parsePollResults(raw);
}

function parsePoll(data: unknown): Poll {
  const obj = data as Record<string, unknown>;

  const id = typeof obj.id === "string" ? obj.id : undefined;
  const question = typeof obj.question === "string" ? obj.question : undefined;
  const options = Array.isArray(obj.options) && obj.options.every((o) => typeof o === "string")
    ? (obj.options as string[])
    : undefined;
  const createdAt = typeof obj.createdAt === "string" ? obj.createdAt : undefined;

  if (!id || !question || !options || !createdAt) {
    throw new Error("Invalid poll response shape");
  }

  return { id, question, options, createdAt };
}

function parsePollPage(data: unknown, defaultSkip: number, defaultLimit: number): PollPage {
  // Support two common shapes:
  // 1) { items: Poll[], total: number, skip: number, limit: number }
  // 2) { data: Poll[], total: number, skip?: number, limit?: number }
  // 3) Poll[] (fallback with unknown total)
  if (Array.isArray(data)) {
    const items = data.map(parsePoll);
    return { items, total: items.length, skip: defaultSkip, limit: defaultLimit };
  }

  const obj = data as Record<string, unknown>;
  const possibleItems = (obj.items ?? obj.data) as unknown;

  if (!Array.isArray(possibleItems)) {
    throw new Error("Invalid polls page response: missing items array");
  }

  const items = possibleItems.map(parsePoll);
  const totalRaw = obj.total;
  const skipRaw = obj.skip;
  const limitRaw = obj.limit;

  const total = typeof totalRaw === "number" ? totalRaw : items.length;
  const skip = typeof skipRaw === "number" ? skipRaw : defaultSkip;
  const limit = typeof limitRaw === "number" ? limitRaw : defaultLimit;

  return { items, total, skip, limit };
}

function parsePollResults(data: unknown): PollResults {
  const obj = data as Record<string, unknown>;

  // Try common shapes
  // Shape A: { id, question, options, counts, total, createdAt? }
  const maybeCounts = (obj.counts as number[]) || (obj.results as number[]);
  const maybeVotesArray = obj.votes as Array<{ optionIndex: number; count: number }> | undefined;

  const id = typeof obj.id === "string" ? obj.id : "";
  const question = typeof obj.question === "string" ? obj.question : "";
  const options = Array.isArray(obj.options) && obj.options.every((o) => typeof o === "string")
    ? (obj.options as string[])
    : [];

  let counts: number[] = [];
  if (Array.isArray(maybeCounts) && maybeCounts.every((n) => typeof n === "number")) {
    counts = maybeCounts;
  } else if (Array.isArray(maybeVotesArray)) {
    const maxIndex = maybeVotesArray.reduce((m, v) => Math.max(m, v.optionIndex), -1);
    counts = Array.from({ length: Math.max(maxIndex + 1, options.length) }, () => 0);
    for (const v of maybeVotesArray) {
      if (Number.isInteger(v.optionIndex) && v.optionIndex >= 0 && typeof v.count === "number") {
        counts[v.optionIndex] = v.count;
      }
    }
  }

  const createdAt = typeof obj.createdAt === "string" ? obj.createdAt : undefined;
  const total = typeof obj.total === "number" ? obj.total : counts.reduce((a, b) => a + b, 0);

  if (!id || !question || options.length === 0 || counts.length === 0) {
    throw new Error("Invalid poll results response shape");
  }

  // If counts shorter than options, pad with zeros
  if (counts.length < options.length) {
    counts = counts.concat(Array.from({ length: options.length - counts.length }, () => 0));
  }

  return { id, question, options, counts, total, createdAt };
}
