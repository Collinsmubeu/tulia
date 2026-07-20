"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  id?: string;
  name: string;
  email: string;
  role: string;

  // Provider-related fields are optional because localStorage may
  // contain older user shapes.
  isProvider?: boolean;
  providerBio?: string;
  providerServices?: string[];
  profileImage?: string;

  // Profile fields
  location?: string;
  phone?: string;
  experience?: string;
  hourlyRate?: string;
  availability?: string;
}


export function useAuthGuard(requiredRole?: string) {
  const router = useRouter();

  useEffect(() => {
    const authData = localStorage.getItem("tulia_auth");
    if (!authData) {
      router.push("/");
      return;
    }

    try {
      const user = JSON.parse(authData) as User;
      if (requiredRole && user.role !== requiredRole) {
        router.push("/dashboard");
      }
    } catch {
      router.push("/");
    }
  }, [router, requiredRole]);
}

export function useLogout() {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("tulia_auth");
    router.push("/");
  };

  return logout;
}

export function getStoredUser(): (User & Record<string, unknown>) | null {
  if (typeof window === "undefined") return null;
  const authData = localStorage.getItem("tulia_auth");
  if (!authData) return null;
  try {
    return JSON.parse(authData) as User & Record<string, unknown>;
  } catch {
    return null;
  }
}

export type Perspective = "user" | "admin" | "provider";

export function getPerspectiveFromStoredUser(storedUser: (User & Record<string, unknown>) | null): Perspective {
  if (!storedUser) return "user";

  // Admin is always determined by role
  if (storedUser.role === "admin") return "admin";

  // Provider can be expressed either via role or via `isProvider` boolean.
  // We support both because different parts of the codebase use different shapes.
  const isProvider = Boolean(storedUser["isProvider"]);

  if (isProvider || storedUser.role === "provider") return "provider";

  return "user";
}

