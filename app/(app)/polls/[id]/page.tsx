interface PageProps { params: { id: string } }

export default function PollDetailPage({ params }: PageProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Poll #{params.id}</h1>
      <div className="rounded-lg border p-4 space-y-4">
        <div>
          <div className="font-medium">Question</div>
          <p className="text-sm text-muted-foreground">Coming soon...</p>
        </div>
        <div>
          <div className="font-medium">Options</div>
          <ul className="list-disc list-inside text-sm text-muted-foreground">
            <li>Option A</li>
            <li>Option B</li>
          </ul>
        </div>
        <button className="inline-flex h-9 items-center justify-center rounded-md bg-foreground px-3 text-sm font-medium text-background hover:opacity-90">Vote</button>
      </div>
    </div>
  );
}
