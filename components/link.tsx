"use client";

import NextLink, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { SidebarMenuButton } from "./ui/sidebar";

export default function Link({
  className,
  ...props
}: LinkProps & React.HTMLAttributes<HTMLAnchorElement>) {
  const pathname = usePathname();
  const isCurrentPath = pathname === props.href.toString();
  return (
    <SidebarMenuButton
      asChild
      className={`transition-all ease-linear duration-200 ${
        isCurrentPath
          ? "!bg-white/15 font-semibold"
          : ""
      } ${className ?? ""}`}
    >
      <NextLink {...props} />
    </SidebarMenuButton>
  );
}
