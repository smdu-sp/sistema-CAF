/** @format */

import { PageHeader } from "../../_components/shared/page-header";
import { mockProfile } from "../../_mock";
import { ProfileHeader } from "./profile-header";
import { RecentActivity } from "./recent-activity";

export function PerfilContent() {
  return (
    <section className="space-y-6">
      <PageHeader
        title="Perfil"
        description="Informacoes do usuario e atividades recentes."
      />

      <ProfileHeader profile={mockProfile} />
      <RecentActivity />
    </section>
  );
}
