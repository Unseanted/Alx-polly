import type { Poll } from "@/types/poll";

export async function listPolls(): Promise<Poll[]> {
  return [];
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
