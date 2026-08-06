/** @format */

import { ModeToggle } from "@/components/toggle-theme";
import { IntranetSearch } from "../search/intranet-search";
import { NotificationsButton } from "../notifications/notifications-button";
import { UserSummary } from "./user-summary";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function IntranetHeader() {
  return (
    <div className="flex items-center gap-3 w-full">
      <header className="flex-1 flex items-center gap-3">
        <div className="flex items-center gap-3">
          <div />
          <div>
            <p>SMUL Intranet</p>
            <p>Urbanismo e Licenciamento</p>
          </div>
        </div>

        <IntranetSearch />

        <div className="flex items-center gap-3">
          <NotificationsButton />
          <ModeToggle />
          <UserSummary />
        </div>
      </header>

      <Button size="sm">
        <Link href="/">CAF</Link>
      </Button>
    </div>
  );
}
