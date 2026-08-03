/** @format */

import { ComponentProps, ReactNode } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ContentCardProps extends ComponentProps<typeof Card> {
  title?: string;
  description?: string;
  children: ReactNode;
}

export function ContentCard({
  title,
  description,
  children,
  ...props
}: ContentCardProps) {
  return (
    <Card {...props}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
    </Card>
  );
}
