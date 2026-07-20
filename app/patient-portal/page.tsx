"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import PatientPortal from "./../components/Patient-Portal";
import { getStoredUser } from "@/hooks/useAuth";

export default function PatientPortalPage() {
  const router = useRouter();

  useEffect(() => {
    const user = getStoredUser();
    if (!user) router.push("/");
  }, [router]);

  return <PatientPortal />;
}

