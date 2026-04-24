import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface ActionButtonProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

export function ActionButton({ title, description, href, icon: Icon }: ActionButtonProps) {
  return (
    <Link href={href}>
      <div className="border border-border rounded-lg mb-4 p-6 max-w-md w-full flex items-start gap-4 cursor-pointer hover:bg-muted/50 transition-colors">
        <div className="flex h-full items-center justify-center">
          <div className="flex items-center justify-center h-8 w-8 rounded-full border-2 border-border">
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </div>
    </Link>
  );
}
