"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getStoredUser } from "@/hooks/useAuth";

export default function PatientDashboardPage() {
  const router = useRouter();
  const user = useMemo(() => getStoredUser(), []);

  useEffect(() => {
    if (!getStoredUser()) router.push("/");
  }, [router]);

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Patient Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">Welcome, {user.name}.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">Next steps</h2>
        <ul className="list-disc pl-5 text-sm text-slate-600 space-y-2">
          <li>Browse medical services in <span className="font-medium">Services</span>.</li>
          <li>Select a provider and book / register as needed.</li>
        </ul>

        <div className="mt-4 flex gap-3 flex-wrap">
          <button
            onClick={() => router.push("/services")}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
          >
            Go to Services
          </button>
          <button
            onClick={() => router.push("/patient-portal")}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            Update Registration
          </button>
        </div>
      </div>
    </div>
  );
}

