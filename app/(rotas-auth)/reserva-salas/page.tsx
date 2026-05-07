import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { ReservasContent } from "./_components/reservas-content";

export default async function ReservasPage() {
  const session = await auth();
  if (!session) redirect("/login");
  const usuario = (session as any).usuario;
  return <ReservasContent usuario={usuario} />;
}
