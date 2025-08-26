import Link from "next/link";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-semibold">ALX Polly</Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/polls" className="hover:underline">Polls</Link>
            <Link href="/polls/new" className="hover:underline">New Poll</Link>
            <Link href="/sign-in" className="hover:underline">Sign in</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        {children}
      </main>
    </div>
  );
} 