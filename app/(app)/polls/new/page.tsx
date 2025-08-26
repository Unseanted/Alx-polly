import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function NewPollPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-semibold">Create a new poll</h1>
      <form className="space-y-4">
        <div className="grid gap-2">
          <label htmlFor="question" className="text-sm font-medium">Question</label>
          <Input id="question" placeholder="What should we ...?" />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium">Options</label>
          <div className="grid gap-2">
            <Input placeholder="Option 1" />
            <Input placeholder="Option 2" />
          </div>
        </div>
        <Button type="submit">Create poll</Button>
      </form>
    </div>
  );
}
