"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getStoredUser } from "@/hooks/useAuth";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const user = getStoredUser();
    if (!user) {
      router.push("/");
    }
  }, [router]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">Welcome to your Tulia dashboard</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-600">Total Users</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">2</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-600">Active Users</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">1</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-600">Services</p>
          <p className="mt-2 text-3xl font-bold text-blue-600">12</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
        <p className="mt-2 text-sm text-slate-600">Access your services and manage your account from the sidebar.</p>
      </div>
    </div>
  );
}
