/** @format */

import { ModeToggle } from "@/components/toggle-theme";
import { IntranetSearch } from "../search/intranet-search";
import { NotificationsButton } from "../notifications/notifications-button";
import { UserSummary } from "./user-summary";

export function IntranetHeader() {
  return (
    <header>
      <div>
        <div />
        <div>
          <p>SMUL Intranet</p>
          <p>Urbanismo e Licenciamento</p>
        </div>
      </div>

      <IntranetSearch />

      <div>
        <NotificationsButton />
        <ModeToggle />
        <UserSummary />
      </div>
    </header>
  );
}
