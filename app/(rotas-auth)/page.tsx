import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";

export default async function HomeAuth() {
  const session = await auth();
  if (!session) redirect("/login");
  const permissao = (session as any).usuario?.permissao;
  if (permissao === "ADM") redirect("/reserva-salas/admin");
  redirect("/home");
}
