"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DoctorDashboard from "./../components/doctor-dashboard";
import { getStoredUser } from "@/hooks/useAuth";

export default function DoctorDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const user = getStoredUser();
    if (!user) {
      router.push("/");
      return;
    }

    const isProvider =
      Boolean((user as unknown as { isProvider?: boolean })?.isProvider) ||
      user.role === "provider";

    if (!isProvider) {
      router.push("/dashboard");
    }
  }, [router]);

  const user = getStoredUser();
  const isProvider =
    Boolean((user as unknown as { isProvider?: boolean })?.isProvider) ||
    user?.role === "provider";

  if (!user || !isProvider) return null;

  const providerServices: string[] = Array.isArray(
    (user as unknown as { providerServices?: unknown }).providerServices
  )
    ? ((user as unknown as { providerServices?: unknown }).providerServices as string[])
    : [];


  return (
    <DoctorDashboard
      userId={user.id ? String(user.id) : ""}
      providerServices={providerServices}
    />
  );
}

