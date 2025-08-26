import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="text-sm text-muted-foreground">Access your account to create and vote on polls.</p>
      </div>
      <form className="space-y-4">
        <div className="grid gap-2">
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <Input id="email" type="email" placeholder="you@example.com" />
        </div>
        <div className="grid gap-2">
          <label htmlFor="password" className="text-sm font-medium">Password</label>
          <Input id="password" type="password" placeholder="••••••••" />
        </div>
        <Button type="submit">Sign in</Button>
      </form>
      <p className="text-sm text-center text-muted-foreground">
        Don&apos;t have an account? <Link href="/sign-up" className="underline">Sign up</Link>
      </p>
    </div>
  );
} 