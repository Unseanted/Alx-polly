export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {children}
      </div>
    </section>
  );
} 