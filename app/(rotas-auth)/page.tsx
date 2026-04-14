import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";

export default async function HomeAuth() {
  console.log(require('crypto').randomBytes(32).toString('base64'))
  const session = await auth();
  if (!session) redirect("/login");
  const permissao = (session as any).usuario?.permissao;
  if (permissao === "ADM") redirect("/dashboard/admin");
  redirect("/dashboard");
}
