/** @format */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { intranetNavigationItems } from "./navigation-items";

function isNavigationItemActive(
  pathname: string,
  href: string,
  exact = false,
) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function IntranetNavigation() {
  const pathname = usePathname();

  return (
    <nav aria-label="Navegacao principal da intranet">
      <ul className="flex flex-col gap-1">
        {intranetNavigationItems.map((item) => {
          const active = isNavigationItemActive(
            pathname,
            item.href,
            item.exact,
          );
          const Icon = item.icon;

          return (
            <li key={item.href}>
              <Button
                asChild
                variant={active ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  active && "text-primary",
                )}
              >
                <Link href={item.href} aria-current={active ? "page" : undefined}>
                  <Icon className="size-4" aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              </Button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
