/** @format */

"use client";

import { Search } from "lucide-react";
import { ComponentProps } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface IntranetSearchProps extends ComponentProps<typeof Input> {
  wrapperClassName?: string;
}

export function IntranetSearch({
  className,
  wrapperClassName,
  placeholder = "Buscar pessoas, comunicados, posts...",
  ...props
}: IntranetSearchProps) {
  return (
    <div className={cn("relative w-full", wrapperClassName)}>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        className={cn("h-10 rounded-full bg-muted pl-9", className)}
        placeholder={placeholder}
        type="search"
        {...props}
      />
    </div>
  );
}
