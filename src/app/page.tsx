import { redirect } from "next/navigation"
import { getCookies } from "@/lib/utils"

export default async function Home() {
  const token = getCookies("x-auth-token");

  if (token) {
    // Optional: Validate token with API
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })

    if (res.ok) {
      redirect("/dashboard")
    }
  }

  redirect("/login")
}
