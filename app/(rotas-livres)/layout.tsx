import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";

export default async function RotasLivres({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session) redirect("/");
  return <>{children}</>;
}
