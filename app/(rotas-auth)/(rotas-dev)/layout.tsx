import { auth } from "@/lib/auth";
import { verificarDesenvolvedor } from "@/services/permissoes";
import { redirect } from "next/navigation";

export default async function RotasAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const desenvolvedor = await verificarDesenvolvedor();
  if (!desenvolvedor) redirect("/");
  return children;
}