"use client";

import NextLink, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { SidebarMenuButton } from "./ui/sidebar";

export default function Link({
  className,
  ...props
}: LinkProps & React.HTMLAttributes<HTMLAnchorElement>) {
  const pathname = usePathname();
  const isCurrentPath = pathname === props.href;
  return (
    <SidebarMenuButton
      asChild
      className={`transition-all ease-linear duration-200 active:shadow-lg ${
        isCurrentPath
          ? "bg-primary hover:bg-primary/90 text-primary-foreground hover:text-primary-foreground active:bg-primary/90 active:primary-foreground active:text-primary-foreground"
          : "bg-transparent"
      } ${className ?? ""}`}
    >
      <NextLink {...props} />
    </SidebarMenuButton>
  );
}
