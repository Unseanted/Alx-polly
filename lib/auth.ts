export type Session = {
  userId: string;
  email: string;
} | null;

export async function getSession(): Promise<Session> {
  return null;
}

export async function signIn(_email: string, _password: string): Promise<boolean> {
  return true;
}

export async function signOut(): Promise<void> {
  return;
}

/**
 * Returns a safe display name for the current user.
 *
 * If a provided name is empty, undefined, or null, this function returns
 * the fallback string "Guest". This matters because UI surfaces such as
 * headers, greetings, and activity messages should never render blank
 * or "undefined" names, which would be confusing and degrade UX. Using
 * a deterministic fallback keeps the interface consistent across the app.
 *
 * Used in client components that display the current user's name
 * (e.g., header nav, welcome banners) and anywhere we need a readable
 * label when a profile is incomplete.
 */
export function getDisplayName(name?: string | null): string {
  const trimmed = typeof name === "string" ? name.trim() : "";
  return trimmed.length > 0 ? trimmed : "Guest";
}