// app/(protected)/layout.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LayoutClient from "../layoutClient";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("x-auth-token")?.value;

  if (!token) {
    redirect("/login");
  }

  return <LayoutClient>{children}</LayoutClient>;
}
