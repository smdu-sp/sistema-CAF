/** @format */

import { IntranetHeader } from "./_components/layout/intranet-header";
import { IntranetSideBirthday } from "./_components/layout/intranet-side-birthdays";
import { IntranetSidebar } from "./_components/layout/intranet-sidebar";

export default function IntranetRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-muted/40 dark:bg-background">
      <div className="w-full border-b bg-background">
        <div className="mx-auto w-full max-w-7xl px-4 py-3 md:px-6 [&_header]:flex [&_header]:h-16 [&_header]:min-w-0 [&_header]:items-center [&_header]:gap-3 [&_header]:rounded-lg [&_header]:border [&_header]:bg-background [&_header]:px-4 [&_header]:shadow-sm [&_header]:md:px-6 [&_header>div:first-child]:flex [&_header>div:first-child]:min-w-0 [&_header>div:first-child]:items-center [&_header>div:first-child]:gap-3 [&_header>div:first-child]:px-2 [&_header>div:first-child]:py-2 [&_header>div:first-child>div:first-child]:size-9 [&_header>div:first-child>div:first-child]:shrink-0 [&_header>div:first-child>div:first-child]:rounded-md [&_header>div:first-child>div:first-child]:bg-primary [&_header>div:first-child>div:first-child]:text-primary-foreground [&_header>div:first-child>div:last-child]:min-w-0 [&_header_p]:truncate [&_header_p:first-child]:text-sm [&_header_p:first-child]:font-bold [&_header_p:first-child]:text-primary [&_header_p:last-child]:text-xs [&_header_p:last-child]:text-muted-foreground [&_header>div:last-child]:ml-auto [&_header>div:last-child]:flex [&_header>div:last-child]:shrink-0 [&_header>div:last-child]:items-center [&_header>div:last-child]:gap-2">
          <IntranetHeader />
        </div>
      </div>

      <div className="grid w-full grid-cols-[minmax(1rem,1fr)_minmax(0,1440px)_minmax(1rem,1fr)]">
        <div aria-hidden="true" />
        <div className="grid min-w-0 gap-8 py-6 md:grid-cols-[260px_minmax(0,1fr)_260px] xl:grid-cols-[280px_minmax(0,1fr)_280px]">
          <aside className="hidden md:block [&>div]:rounded-lg [&>div]:border [&>div]:bg-background [&>div]:shadow-sm">
            <IntranetSidebar />
          </aside>

          <section className="min-w-0">{children}</section>
          <aside className="hidden md:block [&>div]:rounded-lg [&>div]:border [&>div]:bg-background [&>div]:shadow-sm">
            <IntranetSideBirthday />
          </aside>
        </div>
        <div aria-hidden="true" />
      </div>
    </div>
  );
}
