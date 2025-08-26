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
