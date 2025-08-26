export default function PollsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Polls</h1>
        <a href="/polls/new" className="inline-flex h-9 items-center justify-center rounded-md bg-foreground px-3 text-sm font-medium text-background hover:opacity-90">New Poll</a>
      </div>
      <div className="grid gap-4">
        <div className="rounded-lg border p-4">
          <div className="font-medium">No polls yet</div>
          <div className="text-sm text-muted-foreground">Create your first poll to get started.</div>
        </div>
      </div>
    </div>
  );
} 