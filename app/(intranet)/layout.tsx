/** @format */

export default function IntranetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-muted/40 dark:bg-background">
      {children}
    </main>
  );
}
