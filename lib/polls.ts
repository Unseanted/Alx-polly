import type { Poll } from "@/types/poll";

export async function listPolls(): Promise<Poll[]> {
  return [];
}

export async function getPollById(id: string): Promise<Poll | null> {
  return { id, question: "Coming soon", options: ["A", "B"], createdAt: new Date().toISOString() };
}

export async function createPoll(_poll: Omit<Poll, "id" | "createdAt">): Promise<Poll> {
  return { id: "temp", question: _poll.question, options: _poll.options, createdAt: new Date().toISOString() };
}
